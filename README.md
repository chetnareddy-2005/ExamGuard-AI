# 🛡️ ExamGuard AI — AI-Based Exam Malpractice Detection System

<p align="center">
  <strong>AI-Powered Object Detection for Examination Video Analysis</strong>
  <br />
  Detect potential mobile phone usage, visualize evidence, and support examination incident review using computer vision.

---

## 📌 Overview

**ExamGuard AI** is a computer vision-based application designed to assist in identifying potential examination malpractice through video analysis.

The system uses a trained **YOLO11n object detection model** to identify supported object classes, including mobile phones and heads. A Python FastAPI backend processes requests and provides analysis results, while a Next.js web interface allows users to interact with the application.

ExamGuard AI aims to make examination video review more structured by combining object detection, annotated video output, and incident-reporting functionality.

> ⚠️ **Important:** Detecting a mobile phone does not automatically prove examination malpractice. Detection results must be reviewed by an authorized human before any disciplinary decision is made.

---

## 🎯 Project Objectives

- 🤖 Apply deep learning and computer vision to examination video analysis.
- 📱 Detect mobile phones using a trained object detection model.
- 🎥 Analyze video frames and visualize detected objects.
- 🚨 Support incident reporting and evidence review.
- 🌐 Provide a browser-based interface for interacting with the backend.
- 📊 Evaluate model performance using labelled test data and measured inference statistics.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🤖 AI Object Detection | Uses a trained YOLO11n model with `phone` and `head` classes. |
| 🎥 Video Analysis | Processes video frames and produces detection results. |
| 🖼️ Annotated Video | Generates visual output with detected objects and bounding boxes for supported workflows. |
| 🚨 Incident Reporting | Provides backend functionality for incident-report generation. |
| 📂 Evidence Output | Organizes generated analysis evidence in the project output structure. |
| 🌐 Web Dashboard | Uses Next.js and React for the browser interface. |
| ⚡ REST API | Uses FastAPI to expose analysis and reporting endpoints. |
| 📊 Model Evaluation | Includes labelled test-set metrics and video-level inference statistics. |
| 🔍 Human Review | Supports review of detections rather than automatically declaring a violation. |

Feature availability depends on the selected workflow, configured model, and local runtime environment.

---
</p>

<p align="center">
  <img width="1520" height="726" alt="image" src="https://github.com/user-attachments/assets/67d3c96f-aed8-4778-9cf1-91bb71c4ab0a" />
  <img width="1522" height="727" alt="image" src="https://github.com/user-attachments/assets/20bdcf0b-79ed-4039-a0a1-e43db91fca31" />
  <img width="1521" height="730" alt="image" src="https://github.com/user-attachments/assets/0dd9913e-6b71-4b23-a8b7-0950ad76538e" />
  <img width="1523" height="732" alt="image" src="https://github.com/user-attachments/assets/88ffd7d6-2bc7-4f8b-b26e-fd1399484aa3" />
  <img width="1518" height="722" alt="image" src="https://github.com/user-attachments/assets/42b0b574-b099-4a95-bfed-6c478ec6f5e8" />
  <img width="1522" height="726" alt="image" src="https://github.com/user-attachments/assets/39861c54-01cd-4890-bbbe-79167d13dae2" />

</p>
---


## 🏗️ System Architecture

ExamGuard AI follows a frontend–backend architecture with an AI inference component.

```text
                 ┌──────────────────────┐
                 │  Examination Video   │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │   Next.js Frontend   │
                 │   React Dashboard    │
                 └──────────┬───────────┘
                            │ HTTP API
                            ▼
                 ┌──────────────────────┐
                 │    FastAPI Backend   │
                 │   Python Processing  │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │  Trained YOLO11n     │
                 │  Object Detection    │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │ Detection Results    │
                 │ Annotated Video      │
                 │ Incident Evidence    │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │ Human Review        │
                 └──────────────────────┘
```

### 🔄 How the System Works

1. **Video input:** An examination video is provided through a supported analysis workflow.
2. **API request:** The frontend communicates with the FastAPI backend.
3. **Frame processing:** The backend reads and processes video frames.
4. **Object detection:** The trained YOLO model predicts objects belonging to its configured classes.
5. **Result generation:** Detection outputs are used to generate the supported analysis results and visual evidence.
6. **Incident review:** Available results can be examined through the application and reporting workflow.
7. **Human verification:** A reviewer determines whether the evidence actually indicates a violation.

---

## 📊 Model Evaluation and Performance Metrics

The model was evaluated using a labelled test dataset and separately tested on an examination video. These evaluations measure different aspects of performance and must not be confused.

### 1. Labelled Test Dataset Results

The trained checkpoint `best.pt` was evaluated on a held-out test split containing **2,349 images**.

| Metric | Measured Result |
|---|---:|
| Precision | **91.46%** |
| Recall | **85.27%** |
| F1-score | **88.26%** |
| mAP@0.50 | **91.25%** |
| mAP@0.50:0.95 | **59.22%** |

**Metric definitions**

- **Precision:** The proportion of predicted detections that are correct.
- **Recall:** The proportion of ground-truth objects successfully detected.
- **F1-score:** The harmonic mean of precision and recall.
- **mAP@0.50:** Mean Average Precision at an Intersection over Union (IoU) threshold of 0.50.
- **mAP@0.50:0.95:** Mean Average Precision averaged over IoU thresholds from 0.50 to 0.95.

The F1-score is calculated from the reported precision and recall. It is not a separate incident-classification accuracy measurement.

### 2. Per-Class Performance

| Object Class | AP@0.50 | AP@0.50:0.95 |
|---|---:|---:|
| 📱 Phone | 86.78% | 60.08% |
| 👤 Head | 95.72% | 58.36% |

These results measure object detection on labelled test images. They do not measure whether a person actually committed malpractice.

### 3. Examination Video Inference Results

The model was run on the available sample video using CPU inference.

| Measurement | Observed Result |
|---|---:|
| Input video | `exam.mp4` |
| Resolution | 1920 × 1080 |
| Source frame rate | 29.97 FPS |
| Duration | Approximately 7.71 seconds |
| Frames decoded | 231 |
| Frames processed | 231 |
| Frames skipped or undecodable | 0 |
| Total detection boxes | 771 |
| Phone detection boxes | 26 |
| Head detection boxes | 745 |
| Frames containing at least one detection | 231 / 231 |
| Mean model-predict time per frame | Approximately 245.7 ms |
| Total annotation-inclusive processing time | Approximately 75.44 seconds |
| Effective end-to-end processing speed | Approximately 3.06 FPS |

The annotated video was reopened and verified to contain all 231 frames.

**Timing methodology:** Model-predict time includes YOLO preprocessing, inference, and postprocessing. Total processing time additionally includes video decoding, annotation rendering, and output writing.

These are results from one CPU-based video run, not guaranteed performance for other videos or hardware.

### 4. Previously Recorded Training Validation Results

The existing training log recorded its highest validation mAP@0.50:0.95 at epoch 29.

| Metric | Recorded Result |
|---|---:|
| Epoch | 29 |
| Precision | 71.98% |
| Recall | 84.23% |
| mAP@0.50 | 71.12% |
| mAP@0.50:0.95 | 48.22% |

These values come from the existing training log and are separate from the held-out test-set evaluation and sample-video inference.

### 5. Evaluation Limitations

- Video-level precision, recall, F1-score, and mAP were not measured because independent ground-truth annotations for the sample video were unavailable.
- Detection boxes are not equivalent to unique physical objects or confirmed malpractice incidents.
- False-positive rate, false-negative rate, and incident-level accuracy have not been established for the sample video.
- Live-detection streaming was not verified during the bounded integration test because a video frame was not received.
- Performance can vary with lighting, camera angle, occlusion, image resolution, confidence threshold, and hardware.

The detailed evaluation artifacts are stored in the local audit directory. They are not automatically included in this public repository.

---

## 🧰 Technology Stack

| Component | Technology | Purpose |
|---|---|---|
| AI Model | YOLO11n | Object detection |
| Backend | Python | Application and analysis logic |
| API Framework | FastAPI | HTTP endpoints and backend integration |
| Computer Vision | OpenCV | Video and frame processing where used |
| Deep Learning | PyTorch, Ultralytics | Model execution |
| Frontend | Next.js | Web application |
| UI Library | React | Interactive interface |
| Language | TypeScript | Frontend development |
| Configuration | YAML | Model and dataset configuration |
| Reports | CSV, TXT | Analysis and reporting outputs |

---

## 📂 Project Structure

```text
ExamGuard-AI/
│
├── README.md
├── .gitignore
├── data.yaml
│
├── backend/
│   └── main.py
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── favicon.ico
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   └── next.config.ts
│
├── rules/
│   └── exam_rules.txt
│
└── reports/
    ├── incident_report.txt
    ├── llm_incident_explanation.txt
    └── phone_alerts.csv
```

### 📦 Files Not Included in the Public Repository

The following assets are maintained separately from the published source code:

- Trained model weights, including `best.pt`.
- Training and evaluation datasets.
- Examination sample videos.
- Generated annotated videos and evidence.
- Local experiment outputs and model-run artifacts.

These files may be required for full local execution, training, or evaluation. They must be obtained or configured separately.

---

## ⚙️ Installation and Setup

### ✅ Prerequisites

Install or prepare:

- Git
- Python and a compatible environment
- Node.js and npm
- The required Python packages
- The trained YOLO model weights
- Any required local video or dataset files

### Step 1: Clone the Repository

```bash
git clone https://github.com/chetnareddy-2005/ExamGuard-AI.git
cd ExamGuard-AI
```

### Step 2: Configure the Backend Environment

Open a terminal in the project root:

```powershell
conda activate exam-ai
```

This command assumes the `exam-ai` Conda environment already exists on your machine and contains the required dependencies.

If you use a different environment, activate that environment instead.

### Step 3: Configure the Trained Model

The backend expects the trained weights at:

```text
runs/phone_head_v1/weights/best.pt
```

The weights are not included in this public repository. Obtain the appropriate model file separately and place it at the expected location, or update the model configuration to point to its actual location.

The dataset configuration in `data.yaml` may also need adjustment because local dataset paths are machine-specific.

### Step 4: Start the Backend

From the project root:

```powershell
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8002
```

Alternatively, if running from inside the `backend` directory:

```powershell
python -m uvicorn main:app --host 127.0.0.1 --port 8002
```

Keep the backend terminal open.

Check the health endpoint:

```text
http://127.0.0.1:8002/health
```

Interactive API documentation is generally available at:

```text
http://127.0.0.1:8002/docs
```

### Step 5: Install Frontend Dependencies

Open a second terminal from the repository root:

```powershell
cd frontend
npm install
```

Ensure the frontend API base URL points to the running backend:

```text
http://127.0.0.1:8002
```

### Step 6: Start the Frontend

```powershell
npm run dev
```

Open the local URL printed by Next.js, typically:

```text
http://localhost:3000
```

Keep both backend and frontend processes running while using the application.

> 💡 **Note:** A fresh clone is not a complete, ready-to-run deployment until the Python dependencies, model weights, and required configuration have been provided. Follow the actual environment requirements when setting up another machine.

---

## 🔌 Backend API Endpoints

The current backend exposes the following routes.

| Endpoint | Purpose |
|---|---|
| `GET /health` | Checks backend health |
| `/analyze` | Processes a supported video-analysis request |
| `/incident-report` | Provides incident-reporting functionality |
| `/live-detect` | Exposes the implemented live-detection workflow |

The precise HTTP methods, request parameters, response schemas, and supported inputs should be checked in `backend/main.py` or the running API documentation at `/docs`.

The existence of an endpoint does not guarantee that every input or live-capture configuration works in every environment.

---

## 🧪 Testing and Validation

Recommended checks when setting up or modifying the project:

1. Confirm that the backend health endpoint responds successfully.
2. Confirm that `best.pt` exists and loads.
3. Verify the model's class names and dataset configuration.
4. Run inference on a known sample video.
5. Inspect predicted classes, confidence scores, and annotated output.
6. Verify that incident reports are generated correctly.
7. Check that the frontend reaches the correct backend API URL.
8. Evaluate model performance against labelled validation or test data.
9. Inspect false positives and false negatives before operational use.

Keep training, validation, test-set, and video-inference results separate when reporting performance.

---

## ⚠️ Limitations and Responsible Use

- **Human review is required:** A detected object is not proof of a rule violation.
- **Model limitations:** The model can detect only the classes and patterns it has learned.
- **Environmental conditions:** Poor lighting, occlusion, distance, and camera placement can affect predictions.
- **Evidence integrity:** Annotated footage should be reviewed alongside the original video.
- **Privacy:** Examination footage must be handled according to institutional policies and applicable privacy requirements.
- **Performance:** Real-time capability depends on hardware and the complete video-processing pipeline.
- **Reproducibility:** Model weights, dependencies, dataset configuration, and input files must match the evaluated setup.

ExamGuard AI is intended to support monitoring and evidence review, not to replace human judgment, institutional procedures, or due process.

---

## 🚀 Future Enhancements

Potential future improvements include:

- 📈 Expanding labelled training and evaluation data.
- 🎯 Improving detection quality under varied examination conditions.
- 🎞️ Adding validated temporal analysis to reduce repeated or isolated detections.
- ⚙️ Providing configurable confidence thresholds.
- 📋 Improving incident-report organization and export.
- ⚡ Optimizing video processing for supported hardware.
- 🔐 Adding authentication and role-based access controls.
- 🧪 Expanding automated backend and frontend tests.
- 📊 Tracking false positives and false negatives using independently labelled video data.

These are potential enhancements, not claims about features already implemented.

---

## 🎓 Applications

- Examination video review.
- AI-assisted identification of potential mobile phone usage.
- Computer vision and object detection research.
- Incident evidence organization.
- Educational demonstrations of deep learning and video inference.

---

## 🗣️ Project Summary

**ExamGuard AI** is an AI-assisted examination video analysis system that combines YOLO-based object detection, a FastAPI backend, and a Next.js frontend. It detects configured object classes, generates visual analysis results, and supports incident evidence review.

The model's reported labelled test-set performance is Precision 91.46%, Recall 85.27%, F1-score 88.26%, and mAP@0.50 91.25%. In a separate CPU video test, all 231 frames were processed, with an annotation-inclusive throughput of approximately 3.06 FPS.

These results describe the tested model and environment. They do not establish incident-level malpractice accuracy or guarantee performance on unseen examination footage.

---

## 🔗 Repository

**GitHub:** [ExamGuard-AI](https://github.com/chetnareddy-2005/ExamGuard-AI)

**Project focus:** AI-based object detection and video analysis to support examination incident review.

---

## 📌 Current Project Status

**Status: Source code published; model evaluation completed on a labelled test split and a sample video. Full fresh-machine reproducibility and live-stream operation require additional verification.**

The public repository contains the core source code, frontend, configuration, rules, and sample report files. Model weights, datasets, videos, and generated evidence must be configured separately.

The system should be used as a decision-support tool, with human verification of all potential incidents.
