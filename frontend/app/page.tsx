"use client";

import { useEffect, useRef, useState } from "react";

type Detection = {
  timestamp: number;
  confidence: number;
  alert: string;
};

type EvidenceFrame = {
  timestamp: number;
  confidence: number;
  image: string;
  image_url?: string;
};
const API = "http://127.0.0.1:8002";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Overview");

const [isAuthenticated, setIsAuthenticated] = useState(false);
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [loginError, setLoginError] = useState("");

  const [liveDetection, setLiveDetection] = useState(false);

  const [phoneAlert, setPhoneAlert] = useState(false);
  const previousPhoneDetection = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  function playBeep() {
    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & {
        webkitAudioContext?: typeof AudioContext;
      }).webkitAudioContext;

    if (!AudioContextClass) return;

    const context =
      audioContextRef.current ?? new AudioContextClass();

    audioContextRef.current = context;

    if (context.state === "suspended") {
      void context.resume();
    }

    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 1000;
    gain.gain.value = 0.15;

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.2);
  }

  const [backendStatus, setBackendStatus] = useState("Checking");
  const [video, setVideo] = useState<File | null>(null);
  const [analyzedVideoUrl, setAnalyzedVideoUrl] = useState("");
  const [annotatedVideoUrl, setAnnotatedVideoUrl] = useState("");
  const [detections, setDetections] = useState<Detection[]>([]);
  const [incidents, setIncidents] = useState<
    {
      incident_id: number;
      start_timestamp: number;
      end_timestamp: number;
      peak_confidence: number;
      detection_count: number;
      alert: string;
    }[]
  >([]);
  const [incidentReport, setIncidentReport] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [videosProcessed, setVideosProcessed] = useState(0);
  const [evidenceFrames, setEvidenceFrames] = useState<EvidenceFrame[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function checkBackend() {
      try {
        const response = await fetch(`${API}/health`);
        if (!response.ok) throw new Error("Backend unavailable");
        setBackendStatus("Connected");
      } catch {
        setBackendStatus("Offline");
      }
    }

    checkBackend();
  }, []);

  async function analyzeVideo() {
    if (!video) {
      setMessage("Please select a video before starting analysis.");
      return;
    }

    setLoading(true);
    setMessage("");
    setDetections([]);
    setIncidentReport("");

    try {
      const formData = new FormData();
      formData.append("file", video);

      const response = await fetch(`${API}/analyze`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Video analysis failed.");
      }

      setDetections(data.detections || []);
      setAnalyzedVideoUrl(URL.createObjectURL(video));
      setAnnotatedVideoUrl(
        data.annotated_video_url ? `${API}${data.annotated_video_url}` : ""
      );
      setIncidents(data.incidents || []);
      setEvidenceFrames(data.evidence_frames || []);
      setIncidentReport(data.incident_report || "");
      setVideosProcessed((count) => count + 1);
      setMessage(
        `Analysis complete. ${data.phone_detections ?? 0} frame detections grouped into ${data.incident_count ?? 0} incidents.`
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not connect to the analysis server."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadIncidentReport() {
    setReportLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API}/incident-report`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Report is not available yet.");
      }

      setIncidentReport(data.report || "No report content was returned.");
      setActiveTab("AI Reports");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to load the report."
      );
    } finally {
      setReportLoading(false);
    }
  }

function handleLogin(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (username === "admin" && password === "admin@123") {
    setIsAuthenticated(true);
    setLoginError("");
    setPassword("");
  } else {
    setLoginError("Invalid username or password.");
  }
}



  const navItems = [
    { name: "Overview", icon: "◫" },
    { name: "CCTV Analysis", icon: "▣" },
    { name: "Incident Center", icon: "⚑" },
    { name: "AI Reports", icon: "▤" },
    { name: "Live Detection", icon: "◉" },
  ];
  const reviewedCount = incidents.length;

  const totalFrameDetections = incidents.reduce(
    (total, incident) => total + incident.detection_count,
    0
  );

  const highConfidenceCount = detections.filter(
    (item) => item.confidence >= 0.7
  ).length;




if (!isAuthenticated) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffaf3] p-5 text-[#321a16]">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[#edd1aa] bg-white shadow-2xl md:grid-cols-2">

        <div className="hidden flex-col justify-between bg-[#321a16] p-10 text-white md:flex">
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f62440] text-2xl font-black">
              E
            </div>
            <h1 className="mt-8 text-3xl font-bold">EXAMGUARD AI</h1>
            <p className="mt-4 leading-7 text-orange-100">
              Intelligent examination monitoring powered by AI.
              Detect potential mobile-phone usage and review evidence
              from a unified security dashboard.
            </p>
          </div>
          <p className="text-xs text-orange-200">
            AI-assisted monitoring · Human review required
          </p>
        </div>

        <div className="p-7 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#f62440]">
            Secure Access
          </p>
          <h2 className="mt-3 text-3xl font-bold">Welcome back</h2>
          <p className="mt-2 text-sm text-[#7c584a]">
            Sign in to access your ExamGuard dashboard.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-semibold">
                Username
              </label>
              <input
                id="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                className="w-full rounded-xl border border-[#edd1aa] bg-[#fffaf3] px-4 py-3 outline-none focus:border-[#f62440] focus:ring-2 focus:ring-[#f62440]/15"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold">
                Password
              </label>
              <div className="flex rounded-xl border border-[#edd1aa] bg-[#fffaf3] focus-within:border-[#f62440]">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="px-4 text-sm font-semibold text-[#7c584a]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {loginError && (
              <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-[#f62440] px-5 py-3.5 font-bold text-white shadow-lg shadow-[#f62440]/20 transition hover:bg-[#de1b36]"
            >
              Sign In →
            </button>
          </form>

          <div className="mt-6 rounded-xl border border-[#edd1aa] bg-[#fffaf3] p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[#7c584a]">
              Demo credentials
            </p>
            <p className="mt-2 text-sm">
              Username: <strong>admin</strong>
            </p>
            <p className="mt-1 text-sm">
              Password: <strong>admin@123</strong>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}


  return (
    <main className="min-h-screen bg-[#fffaf3] text-[#321a16]">
      <div className="flex min-h-screen">
        {/* Sticky Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-[#edd1aa] bg-[#fff2db] p-5 md:sticky md:top-0 md:flex md:h-screen md:overflow-y-auto">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f62440] text-xl font-black text-white shadow-md shadow-[#f62440]/25">
              E
            </div>
            <div>
              <h1 className="text-base font-bold tracking-wide text-[#321a16]">EXAMGUARD</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#7c584a]">
                AI Security Platform
              </p>
            </div>
          </div>

          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7c584a]">
            Workspace
          </p>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                  activeTab === item.name
                    ? "border border-[#edd1aa] bg-[#ffe5bf] font-semibold text-[#321a16] shadow-sm before:absolute before:bottom-2.5 before:left-0 before:top-2.5 before:w-1.5 before:rounded-r before:bg-[#f62440]"
                    : "text-[#7c584a] hover:bg-[#ffe5bf]/60 hover:text-[#321a16]"
                }`}
              >
                <span className="w-5 text-center text-lg">{item.icon}</span>
                {item.name}
                {item.name === "Incident Center" && reviewedCount > 0 && (
                  <span className="ml-auto rounded-md bg-[#f62440] px-2 py-0.5 text-xs font-bold text-white shadow-sm shadow-[#f62440]/30">
                    {reviewedCount}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-[#edd1aa] bg-[#fffaf3] p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  backendStatus === "Connected"
                    ? "bg-emerald-500"
                    : backendStatus === "Offline"
                    ? "bg-[#f62440]"
                    : "bg-amber-500"
                }`}
              />
              <span className="text-xs font-medium text-[#321a16]">
                API {backendStatus}
              </span>
            </div>
            <p className="text-xs leading-5 text-[#7c584a]">
              AI-assisted monitoring. All flagged events require human review.
            </p>
          </div>
        </aside>

        {/* Main area */}
        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-[#edd1aa] bg-[#fffaf3]/90 px-5 py-4 backdrop-blur-xl md:px-9">
            <div>
              <p className="text-xs text-[#7c584a]">Security Operations / Dashboard</p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight text-[#321a16]">
                Examination Monitoring
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-[#edd1aa] bg-[#fff2db] px-3 py-2 text-xs">
                <span
                  className={`h-2 w-2 rounded-full ${
                    backendStatus === "Connected"
                      ? "bg-emerald-500"
                      : backendStatus === "Offline"
                      ? "bg-[#f62440]"
                      : "bg-amber-500"
                  }`}
                />
                <span className="font-medium text-[#321a16]">{backendStatus}</span>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#edd1aa] bg-[#ffe5bf] text-sm font-bold text-[#321a16]">
                AI
              </div>
            </div>

<div className="flex items-center gap-3">
  {/* Keep your existing backend status indicator here */}

  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#edd1aa] bg-[#ffe5bf] text-sm font-bold text-[#321a16]">
    AI
  </div>

  {/* PASTE LOGOUT BUTTON HERE */}
  <button
    onClick={() => {
      setIsAuthenticated(false);
      setUsername("");
      setPassword("");
      setActiveTab("Overview");
      setLiveDetection(false);
    }}
    className="rounded-lg border border-[#edd1aa] bg-[#fff2db] px-3 py-2 text-xs font-semibold hover:bg-[#ffe5bf]"
  >
    Logout
  </button>
</div>

          </header>

          {/* Mobile navigation */}
          <div className="flex gap-2 overflow-x-auto border-b border-[#edd1aa] bg-[#fff2db] px-4 py-3 md:hidden">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition ${
                  activeTab === item.name
                    ? "border border-[#edd1aa] bg-[#ffe5bf] font-semibold text-[#321a16]"
                    : "border border-[#edd1aa] bg-[#fffaf3] text-[#7c584a]"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="mx-auto max-w-[1500px] space-y-7 p-5 md:p-9">
            {/* Heading */}
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#f62440]">
                  <span className="h-px w-6 bg-[#f62440]" />
                  Intelligent surveillance
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-[#321a16] md:text-4xl">
                  {activeTab}
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[#7c584a]">
                  Detect potential phone usage in examination footage and
                  generate evidence-based reports for authorized review.
                </p>
              </div>

              <span className="rounded-lg border border-[#edd1aa] bg-[#fff2db] px-3 py-2 text-xs font-medium text-[#7c584a]">
                YOLO Detection · RAG/LLM Reports
              </span>
            </div>

            {/* Alerts */}
            {message && (
              <div className="flex items-start justify-between gap-3 rounded-xl border border-[#f62440]/30 bg-[#f62440]/10 px-4 py-3 text-sm text-[#f62440]">
                <p className="font-medium">{message}</p>
                <button
                  onClick={() => setMessage("")}
                  className="font-bold text-[#f62440] hover:text-[#321a16]"
                  aria-label="Dismiss message"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Overview */}
            {activeTab === "Overview" && (
              <>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    {
                      label: "Videos Analyzed",
                      value: videosProcessed,
                      icon: "▣",
                      note: "This session",
                      color: "text-[#321a16]",
                    },
                    {
                      label: "Phone Detections",
                      value: totalFrameDetections,
                      icon: "⌕",
                      note: "Events returned by YOLO",
                      color: "text-[#f62440]",
                    },
                    {
                      label: "High Confidence",
                      value: highConfidenceCount,
                      icon: "◈",
                      note: "Confidence ≥ 70%",
                      color: "text-[#f62440]",
                    },
                    {
                      label: "AI Report",
                      value: incidentReport ? "Ready" : "—",
                      icon: "▤",
                      note: "Generated report available",
                      color: "text-emerald-700",
                    },
                    {
                      label: "Live Detection",
                      value: liveDetection ? "Active" : "Ready",
                      icon: "◉",
                      note: "Real-time phone detection",
                      color: "text-[#f62440]",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-[#edd1aa] bg-[#fff2db] p-5 shadow-[0_2px_8px_rgba(50,26,22,0.04)] transition hover:border-[#f62440]/40"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-[#7c584a]">{stat.label}</p>
                        <span className={`text-xl ${stat.color}`}>{stat.icon}</span>
                      </div>
                      <p className="mt-5 text-3xl font-bold tracking-tight text-[#321a16]">
                        {stat.value}
                      </p>
                      <p className="mt-2 text-xs text-[#a38276]">{stat.note}</p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
                  {/* Upload card */}
                  <div className="rounded-2xl border border-[#edd1aa] bg-[#fff2db] p-5 shadow-[0_2px_8px_rgba(50,26,22,0.04)] md:p-7">
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-[#321a16]">CCTV Video Analysis</h3>
                        <p className="mt-1 text-xs text-[#7c584a]">
                          Upload a supported video for analysis
                        </p>
                      </div>
                      <span className="rounded-lg border border-[#edd1aa] bg-[#ffe5bf] px-3 py-1.5 text-xs font-semibold text-[#321a16]">
                        MODULE 01
                      </span>
                    </div>

                    <label className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#d9ba90] bg-[#fffaf3] p-6 text-center transition hover:border-[#f62440] hover:bg-[#fff2db]/50">
                      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#edd1aa] bg-[#ffe5bf] text-2xl font-bold text-[#f62440]">
                        ↑
                      </span>
                      <span className="text-sm font-semibold text-[#321a16]">
                        {video ? video.name : "Select examination footage"}
                      </span>
                      <span className="mt-2 text-xs text-[#7c584a]">
                        Choose a video file from your device
                      </span>
                      <input
                        type="file"
                        accept="video/*"
                        className="sr-only"
                        onChange={(event) => {
                          const selected = event.target.files?.[0] || null;
                          setVideo(selected);
                          setAnalyzedVideoUrl("");
                          setAnnotatedVideoUrl("");
                          setMessage("");
                        }}
                      />
                    </label>

                    {video && (
                      <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-[#edd1aa] bg-[#fffaf3] p-3 text-xs">
                        <span className="truncate font-medium text-[#321a16]">
                          {video.name}
                        </span>
                        <span className="shrink-0 text-[#7c584a]">
                          {(video.size / (1024 * 1024)).toFixed(1)} MB
                        </span>
                      </div>
                    )}

                    <button
                      onClick={analyzeVideo}
                      disabled={loading || !video}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#f62440] px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-[#f62440]/25 transition hover:bg-[#de1b36] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin">◌</span>
                          Analyzing video...
                        </>
                      ) : (
                        <>▶ Start AI Analysis</>
                      )}
                    </button>

                    <p className="mt-3 text-center text-[11px] leading-5 text-[#a38276]">
                      Processing time depends on video length and hardware.
                    </p>
                  </div>

                  {/* System panel */}
                  <div className="rounded-2xl border border-[#edd1aa] bg-[#fff2db] p-5 shadow-[0_2px_8px_rgba(50,26,22,0.04)] md:p-7">
                    <h3 className="font-semibold text-[#321a16]">System Overview</h3>
                    <p className="mt-1 text-xs text-[#7c584a]">
                      Service connection status
                    </p>

                    <div className="mt-6 space-y-4">
                      {[
                        {
                          name: "FastAPI Backend",
                          value: backendStatus,
                          good: backendStatus === "Connected",
                        },
                        {
                          name: "YOLO Detection",
                          value: "Via API",
                          good: backendStatus === "Connected",
                        },
                        {
                          name: "LLM Incident Report",
                          value: incidentReport ? "Report available" : "Awaiting report",
                          good: Boolean(incidentReport),
                        },
                      ].map((service) => (
                        <div
                          key={service.name}
                          className="flex items-center justify-between gap-3 border-b border-[#edd1aa] pb-4"
                        >
                          <span className="text-sm font-medium text-[#321a16]">
                            {service.name}
                          </span>
                          <span
                            className={`text-xs font-semibold ${
                              service.good ? "text-emerald-700" : "text-[#7c584a]"
                            }`}
                          >
                            ● {service.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 rounded-xl border border-[#edd1aa] bg-[#fffaf3] p-4">
                      <p className="text-xs font-semibold text-[#f62440]">
                        Human review required
                      </p>
                      <p className="mt-2 text-xs leading-5 text-[#7c584a]">
                        A detected phone is a potential indicator, not proof of
                        misconduct. Review the footage before taking action.
                      </p>
                    </div>
                  </div>
                </div>

                <DetectionTable detections={detections} />
              </>
            )}

            {activeTab === "Live Detection" && (
              <section className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-[#321a16]">
                    Live Webcam Detection
                  </h2>
                  <p className="mt-1 text-sm text-[#7c584a]">
                    Real-time phone detection using YOLO.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#edd1aa] bg-[#fff2db] p-5 shadow-[0_2px_8px_rgba(50,26,22,0.04)] md:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-[#321a16]">
                      Laptop Camera
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        liveDetection ? "text-[#f62440]" : "text-[#7c584a]"
                      }`}
                    >
                      {liveDetection ? "● LIVE" : "STOPPED"}
                    </span>
                  </div>

                  {liveDetection && (
                    <img
                      src={`${API}/live-detect`}
                      alt="Live YOLO detection stream"
                      className="mt-4 w-220 rounded-lg border border-[#edd1aa] bg-black object-center"
                    />
                  )}

                  <button
                    onClick={() => setLiveDetection((previous) => !previous)}
                    className="mt-4 rounded-lg bg-[#f62440] px-5 py-2 font-semibold text-white shadow-sm shadow-[#f62440]/25 transition hover:bg-[#de1b36]"
                  >
                    {liveDetection ? "Stop Detection" : "Start Live Detection"}
                  </button>
                </div>
              </section>
            )}

            {/* Video analysis */}
            {activeTab === "CCTV Analysis" && (
              <div className="space-y-5">
                <div className="rounded-2xl border border-[#edd1aa] bg-[#fff2db] p-6 shadow-[0_2px_8px_rgba(50,26,22,0.04)] md:p-8">
                  <h3 className="text-lg font-semibold text-[#321a16]">Analyze New Footage</h3>
                  <p className="mt-2 text-sm text-[#7c584a]">
                    Choose a video and submit it to the connected FastAPI
                    analysis service.
                  </p>
                  <label className="mt-6 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#d9ba90] bg-[#fffaf3] p-5 text-center transition hover:border-[#f62440] hover:bg-[#fff2db]/50">
                    <span className="text-3xl font-bold text-[#f62440]">↑</span>
                    <span className="mt-3 text-sm font-semibold text-[#321a16]">
                      {video ? video.name : "Browse video files"}
                    </span>
                    <span className="mt-2 text-xs text-[#7c584a]">
                      Supported formats depend on your backend video decoder
                    </span>
                    <input
                      type="file"
                      accept="video/*"
                      className="sr-only"
                      onChange={(event) => {
                        setVideo(event.target.files?.[0] || null);
                        setMessage("");
                      }}
                    />
                  </label>
                  <button
                    onClick={analyzeVideo}
                    disabled={loading || !video}
                    className="mt-5 rounded-xl bg-[#f62440] px-5 py-3 text-sm font-bold text-white shadow-md shadow-[#f62440]/25 transition hover:bg-[#de1b36] disabled:opacity-40"
                  >
                    {loading ? "Analyzing..." : "Run Detection"}
                  </button>
                </div>
                <DetectionTable detections={detections} />
              </div>
            )}

            {/* Incident center */}
            {activeTab === "Incident Center" && (
              <div className="space-y-5">
                <div className="rounded-2xl border border-[#edd1aa] bg-[#fff2db] p-5 shadow-[0_2px_8px_rgba(50,26,22,0.04)]">
                  <p className="text-sm font-semibold text-[#f62440]">
                    Review queue
                  </p>
                  <p className="mt-2 text-sm text-[#7c584a]">
                    {reviewedCount} grouped incident(s) require review.
                    Check each incident against the original footage and applicable examination rules.
                  </p>
                </div>
                <IncidentTable incidents={incidents} />
                <div className="rounded-2xl border border-[#edd1aa] bg-[#fff2db] p-5 shadow-[0_2px_8px_rgba(50,26,22,0.04)]">
                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {/* Original Video */}
                    <div className="min-w-0 rounded-xl border border-[#edd1aa] bg-[#fffaf3] p-4">
                      <h3 className="font-semibold text-[#321a16]">
                        Original CCTV Footage
                      </h3>
                      <p className="mt-1 text-xs text-[#7c584a]">
                        Uploaded examination recording
                      </p>

                      {analyzedVideoUrl ? (
                        <video
                          ref={videoRef}
                          key={analyzedVideoUrl}
                          src={analyzedVideoUrl}
                          controls
                          className="mt-4 aspect-video w-full rounded-lg bg-black object-contain"
                        />
                      ) : (
                        <div className="mt-4 flex aspect-video items-center justify-center rounded-lg bg-black text-sm text-slate-400">
                          Upload and analyze a video
                        </div>
                      )}
                    </div>

                    {/* YOLO Annotated Video */}
                    <div className="min-w-0 rounded-xl border border-[#edd1aa] bg-[#fffaf3] p-4">
                      <h3 className="font-semibold text-[#f62440]">
                        YOLO Annotated Evidence
                      </h3>
                      <p className="mt-1 text-xs text-[#7c584a]">
                        Detection boxes and labels on video frames
                      </p>

                      {annotatedVideoUrl ? (
                        <video
                          key={annotatedVideoUrl}
                          src={annotatedVideoUrl}
                          controls
                          className="mt-4 aspect-video w-full rounded-lg bg-black object-contain"
                        />
                      ) : (
                        <div className="mt-4 flex aspect-video items-center justify-center rounded-lg bg-black text-sm text-slate-400">
                          Annotated video will appear after analysis
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 border-t border-[#edd1aa] pt-6">
                    <h4 className="text-sm font-semibold text-[#321a16]">
                      Detection Timeline
                    </h4>
                    <p className="mt-1 text-xs text-[#7c584a]">
                      Select a detection to review 1 second before and after it.
                    </p>

                    {detections.length === 0 ? (
                      <p className="mt-4 text-sm text-[#7c584a]">
                        No detections available. Analyze a video first.
                      </p>
                    ) : (
                      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {detections.map((detection, index) => (
                          <div
                            key={`${detection.timestamp}-${index}`}
                            className="rounded-xl border border-[#edd1aa] bg-[#fffaf3] p-4 shadow-sm"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-semibold text-[#321a16]">
                                Detection #{index + 1}
                              </span>
                              <span className="text-xs font-bold text-[#f62440]">
                                {(detection.confidence * 100).toFixed(1)}%
                              </span>
                            </div>

                            <p className="mt-2 text-xs text-[#7c584a]">
                              Detected at {detection.timestamp.toFixed(2)} seconds
                            </p>

                            <button
                              onClick={() => {
                                const player = videoRef.current;
                                if (!player) return;

                                player.currentTime = Math.max(
                                  0,
                                  detection.timestamp - 1
                                );
                                void player.play();
                              }}
                              className="mt-4 w-full rounded-lg border border-[#edd1aa] bg-[#ffe5bf] px-3 py-2 text-xs font-semibold text-[#321a16] transition hover:bg-[#edd1aa]"
                            >
                              ▶ Review before & after
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 border-t border-[#edd1aa] pt-6">
                    <h3 className="font-semibold text-[#321a16]">Visual Evidence</h3>
                    <p className="mt-1 text-xs text-[#7c584a]">
                      Annotated frames captured during phone detection
                    </p>

                    {evidenceFrames.length === 0 ? (
                      <p className="mt-5 text-sm text-[#7c584a]">
                        No snapshots available. Analyze a video first.
                      </p>
                    ) : (
                      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {evidenceFrames.map((frame, index) => (
                          <div
                            key={`${frame.timestamp}-${index}`}
                            className="overflow-hidden rounded-xl border border-[#edd1aa] bg-[#fffaf3] shadow-sm"
                          >
                            <a
                              href={`${API}${frame.image_url || `/evidence/${encodeURIComponent(frame.image)}`}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <img
                                src={`${API}${frame.image_url || `/evidence/${encodeURIComponent(frame.image)}`}`}
                                alt={`Detection evidence at ${frame.timestamp.toFixed(2)} seconds`}
                                className="aspect-video w-full object-cover"
                              />
                            </a>

                            <div className="flex items-center justify-between gap-3 bg-[#fffaf3] p-3">
                              <span className="text-sm font-medium text-[#321a16]">
                                {frame.timestamp.toFixed(2)}s
                              </span>
                              <span className="text-xs font-bold text-[#f62440]">
                                {(frame.confidence * 100).toFixed(1)}% confidence
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Reports */}
            {activeTab === "AI Reports" && (
              <div className="rounded-2xl border border-[#edd1aa] bg-[#fff2db] p-5 shadow-[0_2px_8px_rgba(50,26,22,0.04)] md:p-7">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#321a16]">AI Incident Report</h3>
                    <p className="mt-1 text-xs text-[#7c584a]">
                      Generated explanation and review recommendations
                    </p>
                  </div>
                  <button
                    onClick={loadIncidentReport}
                    disabled={reportLoading}
                    className="rounded-lg border border-[#edd1aa] bg-[#ffe5bf] px-4 py-2.5 text-xs font-semibold text-[#321a16] transition hover:bg-[#edd1aa] disabled:opacity-50"
                  >
                    {reportLoading ? "Loading..." : "Load Latest Report"}
                  </button>
                </div>

                <div className="mt-6 min-h-56 rounded-xl border border-[#edd1aa] bg-[#fffaf3] p-5">
                  {incidentReport ? (
                    <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7 text-[#321a16]">
                      {incidentReport}
                    </pre>
                  ) : (
                    <div className="flex min-h-44 flex-col items-center justify-center text-center">
                      <span className="text-3xl text-[#d9ba90]">▤</span>
                      <p className="mt-3 text-sm font-medium text-[#321a16]">
                        No report loaded
                      </p>
                      <p className="mt-2 max-w-sm text-xs leading-5 text-[#7c584a]">
                        Analyze a video first, or load the latest report from
                        the backend.
                      </p>
                    </div>
                  )}
                </div>

                <p className="mt-4 text-xs leading-5 text-[#a38276]">
                  AI-generated content may be incorrect. Verify all claims
                  against original evidence and official institutional policy.
                </p>
              </div>
            )}

            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edd1aa] pt-5 text-[11px] text-[#7c584a]">
              <span>EXAMGUARD · AI-assisted examination monitoring</span>
              <span>Prototype dashboard · Human verification required</span>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}




function DetectionTable({ detections }: { detections: Detection[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#edd1aa] bg-[#fff2db] shadow-[0_2px_8px_rgba(50,26,22,0.04)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edd1aa] p-5">
        <div>
          <h3 className="font-semibold text-[#321a16]">Detection Events</h3>
          <p className="mt-1 text-xs text-[#7c584a]">
            Results from the latest video analysis
          </p>
        </div>
        <span className="rounded-lg border border-[#edd1aa] bg-[#fffaf3] px-3 py-1.5 text-xs font-medium text-[#7c584a]">
          {detections.length} event(s)
        </span>
      </div>

      {detections.length === 0 ? (
        <div className="p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#ffe5bf] text-xl text-[#7c584a]">
            ⌕
          </div>
          <p className="mt-4 text-sm font-medium text-[#321a16]">
            No detection events to display
          </p>
          <p className="mt-2 text-xs text-[#7c584a]">
            Analyze a video to populate this table with actual API results.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#ffe5bf]/60 text-xs font-semibold text-[#7c584a]">
              <tr>
                <th className="px-5 py-4 font-semibold">Event</th>
                <th className="px-5 py-4 font-semibold">Timestamp</th>
                <th className="px-5 py-4 font-semibold">Confidence</th>
                <th className="px-5 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {detections.map((item, index) => (
                <tr
                  key={`${item.timestamp}-${index}`}
                  className="border-t border-[#edd1aa] transition hover:bg-[#fffaf3]"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f62440]/10 text-[#f62440]">
                        ⚑
                      </span>
                      <div>
                        <p className="font-medium text-[#321a16]">
                          Phone detection
                        </p>
                        <p className="mt-1 text-xs text-[#7c584a]">
                          {item.alert}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 font-medium text-[#321a16]">
                    {Number(item.timestamp).toFixed(2)}s
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#ffe5bf]">
                        <div
                          className="h-full rounded-full bg-[#f62440]"
                          style={{
                            width: `${Math.max(
                              0,
                              Math.min(100, item.confidence * 100)
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs tabular-nums font-semibold text-[#321a16]">
                        {(item.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="whitespace-nowrap rounded-md border border-[#f62440]/25 bg-[#f62440]/10 px-2.5 py-1.5 text-xs font-semibold text-[#f62440]">
                      Review required
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

type Incident = {
  incident_id: number;
  start_timestamp: number;
  end_timestamp: number;
  peak_confidence: number;
  detection_count: number;
  alert: string;
};

function IncidentTable({ incidents }: { incidents: Incident[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#edd1aa] bg-[#fff2db] shadow-[0_2px_8px_rgba(50,26,22,0.04)]">
      <div className="border-b border-[#edd1aa] p-5">
        <h3 className="font-semibold text-[#321a16]">Grouped Incidents</h3>
        <p className="mt-1 text-xs text-[#7c584a]">
          Repeated frame detections grouped into incidents
        </p>
      </div>

      {incidents.length === 0 ? (
        <p className="p-10 text-center text-sm text-[#7c584a]">
          No incidents found. Analyze a video first.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#ffe5bf]/60 text-xs font-semibold text-[#7c584a]">
              <tr>
                <th className="px-5 py-4 font-semibold">Incident</th>
                <th className="px-5 py-4 font-semibold">Time range</th>
                <th className="px-5 py-4 font-semibold">Frame detections</th>
                <th className="px-5 py-4 font-semibold">Peak confidence</th>
                <th className="px-5 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => (
                <tr
                  key={incident.incident_id}
                  className="border-t border-[#edd1aa] transition hover:bg-[#fffaf3]"
                >
                  <td className="px-5 py-4 font-semibold text-[#321a16]">
                    Incident #{incident.incident_id}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-[#321a16]">
                    {incident.start_timestamp.toFixed(2)}s –{" "}
                    {incident.end_timestamp.toFixed(2)}s
                  </td>
                  <td className="px-5 py-4 text-[#321a16]">
                    {incident.detection_count}
                  </td>
                  <td className="px-5 py-4 font-bold text-[#f62440]">
                    {(incident.peak_confidence * 100).toFixed(1)}%
                  </td>
                  <td className="px-5 py-4">
                    <span className="whitespace-nowrap rounded-md border border-[#f62440]/25 bg-[#f62440]/10 px-2.5 py-1.5 text-xs font-semibold text-[#f62440]">
                      Review required
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

