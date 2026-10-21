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
## ⚙️ Installation and Setup (Windows)

Follow these steps to run ExamGuard AI on a Windows laptop. You will use two separate terminals:

- **Terminal 1:** Backend (Python + FastAPI)
- **Terminal 2:** Frontend (Next.js)

### Prerequisites

Install the following software:

- [Git for Windows](https://git-scm.com/download/win)
- [Anaconda Distribution](https://www.anaconda.com/download)
- [Node.js LTS](https://nodejs.org/en/download)

After installation, follow the steps below in order.

### Step 1: Clone the Repository

Open **PowerShell** and run:

```powershell
cd "$HOME\OneDrive\Desktop"
git clone https://github.com/chetnareddy-2005/ExamGuard-AI.git
cd .\ExamGuard-AI
```

If you want to save the project in a different location, change the path accordingly.

If you have already cloned the repository, do not clone it again. Open PowerShell and navigate to your existing project folder.

Verify the project files:

```powershell
Get-ChildItem
```

You should see folders such as `backend` and `frontend`, along with `README.md`.

### Step 2: Initialize Conda for PowerShell

This step is required if you want to run Conda commands directly in PowerShell.

1. Open **Anaconda Prompt** from the Windows Start menu.
2. Run:

```bash
conda init powershell
```

3. Close all open PowerShell windows.
4. Open a new PowerShell window.
5. Verify that Conda is available:

```powershell
conda --version
```

If a Conda version appears, continue.

**Alternative:** You can skip this initialization step and run all Conda and backend commands in Anaconda Prompt instead.

### Step 3: Create and Activate the Backend Environment

Open PowerShell and navigate to the cloned project directory. For example:

```powershell
cd "$HOME\OneDrive\Desktop\ExamGuard-AI"
```

Create the Conda environment. Run this command only once:

```powershell
conda create -n exam-ai python=3.12 -y
```

If the environment already exists, skip the creation command.

Activate the environment:

```powershell
conda activate exam-ai
```

The terminal should show `(exam-ai)` in the prompt.

### Step 4: Install Backend Dependencies

Make sure the terminal is in the project root and the `exam-ai` environment is active.

Upgrade pip:

```powershell
python -m pip install --upgrade pip
```

Install the required packages:

```powershell
python -m pip install ultralytics fastapi "uvicorn[standard]" opencv-python python-multipart requests
```

Wait until the installation finishes.

### Step 5: Configure the Trained AI Model

The backend expects the trained model at:

```text
runs/phone_head_v1/weights/best.pt
```

**Important:** The trained `best.pt` file is not included in this public GitHub repository.

From the project root, check whether the model file exists:

```powershell
Test-Path ".\runs\phone_head_v1\weights\best.pt"
```

- If the result is `True`, continue to Step 6.
- If the result is `False`, obtain the correct trained model checkpoint from a trusted project source and place it at the expected path.

The model must support the project's `phone` and `head` classes. Do not substitute an unrelated YOLO model.

Without the correct trained weights, the backend health endpoint may work, but video analysis will not work as expected.

If you plan to train or evaluate the model, check whether the dataset paths in `data.yaml` need to be updated for your machine.

### Step 6: Start the Backend (Terminal 1)

Keep the `exam-ai` Conda environment active.

From the project root, run:

```powershell
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8002
```

Keep this terminal open while using the application.

Verify the backend in your browser:

- **Health check:** http://127.0.0.1:8002/health
- **API documentation:** http://127.0.0.1:8002/docs

The health endpoint should return:

```json
{"status":"healthy"}
```

A successful health check confirms that the backend is responding. It does not confirm that the model weights are installed or that video analysis works.

### Step 7: Install Frontend Dependencies (Terminal 2)

Open a **second, separate PowerShell window**. Do not close Terminal 1.

Navigate to the frontend folder:

```powershell
cd "$HOME\OneDrive\Desktop\ExamGuard-AI\frontend"
```

If your project is stored elsewhere, update the path.

Install the frontend dependencies:

```powershell
npm install
```

Wait until the installation finishes.

### Step 8: Start the Frontend

In the same second PowerShell window, run:

```powershell
npm run dev
```

Keep this terminal open.

Open the application in your browser:

http://localhost:3000

Keep both the backend and frontend terminals running while using the application.

### Step 9: Troubleshooting

| Problem | Solution |
|---|---|
| `conda` is not recognized in PowerShell | Run `conda init powershell` in Anaconda Prompt, restart PowerShell, or use Anaconda Prompt for backend commands. |
| `backend.main` cannot be imported | Navigate to the project root, not the `backend` directory. |
| Port 8002 is already in use | Stop the existing backend process before restarting it. |
| Frontend shows Offline | Check that `http://127.0.0.1:8002/health` responds and verify the frontend API URL. |
| `best.pt` is missing | Obtain the correct trained model weights separately. |
| `npm` is not recognized | Install Node.js LTS, reopen PowerShell, and verify `node --version` and `npm --version`. |

### Important Notes

- Backend URL: `http://127.0.0.1:8002`
- Frontend URL: `http://localhost:3000`
- Use separate terminals for the backend and frontend.
- Keep both terminals open while using the application.
- The public repository does not include the trained model weights, training dataset, sample videos, or generated evidence files.
- A detected phone does not automatically prove examination malpractice. All potential incidents require human review.

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
