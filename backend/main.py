from unittest import result

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import tempfile
from ultralytics import YOLO
from fastapi import UploadFile, File, HTTPException
from pathlib import Path
from fastapi import HTTPException
import requests
import cv2
from fastapi.staticfiles import StaticFiles
from uuid import uuid4
from fastapi.responses import StreamingResponse
import asyncio
app = FastAPI(title="ExamGuard AI API")
BASE_DIR = Path(__file__).resolve().parent.parent

EVIDENCE_DIR = BASE_DIR / "evidence"
EVIDENCE_DIR.mkdir(parents=True, exist_ok=True)


app.mount(
    "/evidence",
    StaticFiles(directory=str(EVIDENCE_DIR)),
    name="evidence",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "ExamGuard AI backend is running",
        "status": "ready"
    }

@app.get("/health")
def health():
    return {"status": "healthy"}
MODEL_PATH = (
    BASE_DIR / "runs" / "phone_head_v1" / "weights" / "best.pt"
)

def group_phone_detections(detections, gap_seconds=2.0):
    """
    Group detections close together in time into incidents.
    Preserve individual detections for evidence and debugging.
    """
    if not detections:
        return []

    ordered = sorted(detections, key=lambda item: item["timestamp"])
    incidents = []
    current = {
        "start_timestamp": ordered[0]["timestamp"],
        "end_timestamp": ordered[0]["timestamp"],
        "peak_confidence": ordered[0]["confidence"],
        "detections": [ordered[0]],
    }

    for detection in ordered[1:]:
        if detection["timestamp"] - current["end_timestamp"] <= gap_seconds:
            current["end_timestamp"] = detection["timestamp"]
            current["peak_confidence"] = max(
                current["peak_confidence"],
                detection["confidence"],
            )
            current["detections"].append(detection)
        else:
            incidents.append(current)
            current = {
                "start_timestamp": detection["timestamp"],
                "end_timestamp": detection["timestamp"],
                "peak_confidence": detection["confidence"],
                "detections": [detection],
            }

    incidents.append(current)

    for index, incident in enumerate(incidents, start=1):
        incident["incident_id"] = index
        incident["detection_count"] = len(incident["detections"])
        incident["alert"] = "Possible phone usage - human review required"

    return incidents


@app.post("/analyze")
async def analyze_video(file: UploadFile = File(...)):
    if not file.filename.lower().endswith((".mp4", ".avi", ".mov", ".mkv")):
        raise HTTPException(400, "Unsupported video format")

    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(
            delete=False, suffix=os.path.splitext(file.filename)[1]
        ) as temp:
            temp_path = temp.name
            while chunk := await file.read(1024 * 1024):
                temp.write(chunk)

        model = YOLO(MODEL_PATH)
        detections = []
        analysis_id = uuid4().hex[:12]

        evidence_dir = (
            BASE_DIR
            / "evidence"
            / f"analysis_{analysis_id}"
        )
        evidence_dir.mkdir(parents=True, exist_ok=True)
        evidence_frames = []
        annotated_video_name = "annotated_video.mp4"
        annotated_video_path = evidence_dir / annotated_video_name

        video_writer = None

        import cv2
        cap = cv2.VideoCapture(temp_path)
        fps = cap.get(cv2.CAP_PROP_FPS) or 25
        cap.release()


        for frame_no, result in enumerate(
            model.predict(
                source=temp_path,
                stream=True,
                conf=0.35,
                imgsz=640,
                device="cpu",
                vid_stride=2,
                verbose=False,
            ),
            start=1,
        ):
            # Plot all model detections on the current frame.
            annotated_frame = result.plot()

            # Initialize the video writer from the first processed frame.
            if video_writer is None:
                height, width = annotated_frame.shape[:2]
                output_fps = max(fps / 2, 1)

                video_writer = cv2.VideoWriter(
                    str(annotated_video_path),
                    cv2.VideoWriter_fourcc(*"avc1"),
                    output_fps,
                    (width, height),
                )

                if not video_writer.isOpened():
                    video_writer.release()
                    video_writer = None
                    raise HTTPException(
                        status_code=500,
                        detail="Could not create the annotated video.",
                    )

            video_writer.write(annotated_frame)

            for box in result.boxes:
                class_id = int(box.cls[0])

                if model.names[class_id] == "phone":
                    timestamp = round((frame_no - 1) * 2 / fps, 2)
                    confidence = round(float(box.conf[0]), 3)

                    detections.append({
                        "timestamp": timestamp,
                        "confidence": confidence,
                        "alert": "Phone detected - review required",
                    })

                    image_name = f"phone_{timestamp:.2f}s.jpg"
                    image_path = evidence_dir / image_name

                    if cv2.imwrite(str(image_path), annotated_frame):
                        evidence_frames.append({
                            "timestamp": timestamp,
                            "confidence": confidence,
                            "image": image_name,
                            "image_url": (
                                f"/evidence/analysis_{analysis_id}/{image_name}"
                            ),
                        })



        incidents = group_phone_detections(detections)
        if video_writer is not None:
            video_writer.release()
        incident_report = generate_incident_report(incidents)

        return {
        "filename": file.filename,
        "phone_detections": len(detections),
        "incident_count": len(incidents),
        "detections": detections,
        "incidents": incidents,
        "evidence_frames": evidence_frames,
        "message": "Analysis complete; human review required.",
        "incident_report": incident_report,
        "analysis_id": analysis_id,
        "annotated_video_url": (
            f"/evidence/analysis_{analysis_id}/{annotated_video_name}"
        ),
        }

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)
        await file.close()


REPORT_PATH = BASE_DIR / "reports" / "llm_incident_explanation.txt"

@app.get("/incident-report")
def get_incident_report():
    if not REPORT_PATH.exists():
        raise HTTPException(
            status_code=404,
            detail="Incident report not found. Analyze a video first."
        )

    return {
        "report": REPORT_PATH.read_text(encoding="utf-8")
    }


def generate_incident_report(incidents):
    total_frames = sum(
        item["detection_count"] for item in incidents
    )

    lines = [
        "EXAMGUARD - INCIDENT ANALYSIS REPORT",
        "=" * 42,
        f"Grouped incidents: {len(incidents)}",
        f"Phone detection frames: {total_frames}",
        "",
        "OBSERVED EVIDENCE",
        "-" * 20,
    ]

    if not incidents:
        lines.append("No phone detections were returned by the model.")
    else:
        for item in incidents:
            lines.extend([
                f"Incident #{item['incident_id']}",
                f"  Time range: {item['start_timestamp']:.2f}s"
                f" - {item['end_timestamp']:.2f}s",
                f"  Frame detections: {item['detection_count']}",
                f"  Peak confidence: "
                f"{item['peak_confidence']:.1%}",
                "  Status: Pending human review",
                "",
            ])

    lines.extend([
        "ASSESSMENT",
        "-" * 20,
        "The model identified potential phone detections in the "
        "processed footage. Multiple frame detections have been "
        "grouped by time; they do not necessarily represent "
        "separate incidents.",
        "",
        "RECOMMENDED ACTION",
        "-" * 20,
        "An authorized invigilator should inspect the original "
        "video and annotated evidence frames at the listed "
        "timestamps and compare them with the official examination "
        "rules before making any decision.",
        "",
        "LIMITATIONS",
        "-" * 20,
        "Object detection confidence is not the probability of "
        "cheating. A phone detection alone does not prove "
        "misconduct. This report is an automated screening aid, "
        "not a disciplinary finding.",
    ])

    report = "\n".join(lines)

    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text(report, encoding="utf-8")

    return report




@app.get("/live-detect")
async def live_detect():
    async def generate_frames():
        camera = cv2.VideoCapture(0)

        if not camera.isOpened():
            camera.release()
            return

        try:
            live_model = YOLO(MODEL_PATH)
            while True:
                success, frame = camera.read()
                if not success:
                    break
                frame = cv2.flip(frame, 1)
                results = live_model.predict(
                    source=frame,
                    conf=0.35,
                    imgsz=640,
                    device="cpu",
                    verbose=False,
                )

                annotated_frame = results[0].plot()
                encoded, buffer = cv2.imencode(".jpg", annotated_frame)

                if encoded:
                    yield (
                        b"--frame\r\n"
                        b"Content-Type: image/jpeg\r\n\r\n"
                        + buffer.tobytes()
                        + b"\r\n"
                    )

                await asyncio.sleep(0.03)
        finally:
            camera.release()

    return StreamingResponse(
        generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame",
    )