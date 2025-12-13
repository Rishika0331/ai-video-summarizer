import React, { useState, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import UploadPage from "./UploadPage";
import ResultPage from "./ResultPage";
import "./style.css";

function App() {
  const [file, setFile] = useState(null);
  const [contentType, setContentType] = useState("Meeting");
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const progressTimerRef = useRef(null);

  const [audioPath, setAudioPath] = useState("");
  const [clips, setClips] = useState([]);
  const [generatingClips, setGeneratingClips] = useState(false);
  const [clipProgress, setClipProgress] = useState(0);
  const [numClips, setNumClips] = useState(5);
  const [segments, setSegments] = useState([]);

  // Start a simulated progress updater while loading is true
  const startSimulatedProgress = () => {
    clearInterval(progressTimerRef.current);
    setProcessingProgress(3);

    // schedule incremental updates that feel realistic
    let elapsed = 0;
    progressTimerRef.current = setInterval(() => {
      elapsed += 1;
      setProcessingProgress((prev) => {
        // different phases speeds
        if (prev < 10) return Math.min(10, prev + Math.random() * 2 + 0.5);
        if (prev < 40) return Math.min(40, prev + Math.random() * 3 + 0.7);
        if (prev < 70) return Math.min(70, prev + Math.random() * 4 + 0.5);
        if (prev < 90) return Math.min(90, prev + Math.random() * 2 + 0.2);
        return prev;
      });
      // safety stop after 120s
      if (elapsed > 120) {
        clearInterval(progressTimerRef.current);
      }
    }, 700);
  };

  const stopSimulatedProgress = (final = 100) => {
    clearInterval(progressTimerRef.current);
    setProcessingProgress(final);
    setTimeout(() => setProcessingProgress(0), 700);
  };

  const handleDownload = (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // handleUpload now supports optional youtubeLink parameter
  const handleUpload = async (youtubeLink = null) => {
    // If both file and youtubeLink provided, file takes priority
    if (!file && !youtubeLink) {
      alert("Please choose a file or paste a YouTube link.");
      return false;
    }

    setLoading(true);
    startSimulatedProgress();

    try {
      if (youtubeLink && !file) {
        // Process YouTube link pathway
        const res = await fetch("http://localhost:8000/process_youtube", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: youtubeLink, content_type: contentType }),
        });

        const data = await res.json();
        setTranscript(data.transcript || "");
        setSummary(data.summary || "");
        setSegments(data.segments || []);
        setAudioPath(data.video_file_path || "");

        stopSimulatedProgress(100);
        return true;
      }

      // Fallback to regular file upload path
      const fd = new FormData();
      fd.append("file", file);
      fd.append("content_type", contentType);

      const res = await fetch("http://localhost:8000/process", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      setTranscript(data.transcript || "");
      setSummary(data.summary || "");
      setSegments(data.segments || []);
      setAudioPath(data.video_file_path || "");

      stopSimulatedProgress(100);
      return true;
    } catch (err) {
      console.error("Upload failed", err);
      stopSimulatedProgress(0);
      alert("Processing failed. See console for details.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const generateClips = async () => {
    if (!audioPath) {
      alert("Audio path missing.");
      return;
    }
    if (!segments.length) {
      alert("No segments found.");
      return;
    }

    setGeneratingClips(true);
    setClipProgress(20);

    try {
      const res = await fetch("http://localhost:8000/generate_clips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_path: audioPath, segments, max_clips: numClips, clip_padding: 1 }),
      });

      setClipProgress(70);

      const data = await res.json();
      setClips(data.created || []);

      setClipProgress(100);
    } catch (err) {
      console.error("Clip generation failed", err);
      alert("Clip generation failed. See console for details.");
    } finally {
      setGeneratingClips(false);
      setTimeout(() => setClipProgress(0), 600);
    }
  };

  const downloadAllClips = async () => {
    if (!clips.length) {
      alert("No clips ready.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/zip_clips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clips),
      });

      const data = await res.json();
      handleDownload(`http://localhost:8000/clips/${data.zip_file}`, data.zip_file);
    } catch (err) {
      console.error("Zip download failed", err);
      alert("Failed to create zip. See console for details.");
    }
  };

  const exportSummaryPDF = async () => {
    if (!summary) {
      alert("No summary available!");
      return;
    }

    try {
      const base = (file && file.name && file.name.split(".")[0]) || "summary";
      const pdfFileName = `${base}_summary.pdf`;

      const res = await fetch("http://localhost:8000/export_pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary, filename: pdfFileName }),
      });

      const data = await res.json();
      handleDownload(`http://localhost:8000/clips/${data.pdf_file}`, data.pdf_file);
    } catch (err) {
      console.error("PDF export failed", err);
      alert("Failed to export PDF. See console for details.");
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <UploadPage
            file={file}
            setFile={setFile}
            contentType={contentType}
            setContentType={setContentType}
            handleUpload={handleUpload}
            loading={loading}
            processingProgress={processingProgress}
          />
        }
      />

      <Route
        path="/result"
        element={
          <ResultPage
            transcript={transcript}
            summary={summary}
            exportSummaryPDF={exportSummaryPDF}
            segments={segments}
            numClips={numClips}
            setNumClips={setNumClips}
            generateClips={generateClips}
            generatingClips={generatingClips}
            clipProgress={clipProgress}
            clips={clips}
            downloadAllClips={downloadAllClips}
            handleDownload={handleDownload}
          />
        }
      />
    </Routes>
  );
}

export default App;
