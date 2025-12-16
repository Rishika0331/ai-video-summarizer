import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./assets/logo.png";

export default function UploadPage({
  file,
  setFile,
  contentType,
  setContentType,
  handleUpload,
  loading,
  processingProgress
}) {
  const navigate = useNavigate();
  const [youtubeLink, setYoutubeLink] = useState("");

  const startProcessing = async () => {
    const ok = await handleUpload(youtubeLink.trim());
    if (ok) navigate("/result");
  };

  const removeFile = () => setFile(null);

  const humanFileSize = (size) => {
    if (!size) return "";
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(1) + " " + ["B", "KB", "MB", "GB"][i];
  };

  return (
    <div className="mm-container upload-page">
      <img src={logo} alt="Summarize.AI Logo" className="mm-logo" />
      <h1 className="mm-title">Summarize.AI</h1>

      <div className="upload-card">
        <div className="upload-inner">
          <label
            className="upload-dropzone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.length > 0) {
                setFile(e.dataTransfer.files[0]);
              }
            }}
          >
            <div className="upload-icons">
              <div className="file-icon">📁</div>
            </div>

            <h3 className="upload-heading">
              Drag & drop <span className="highlight">files</span> to upload
            </h3>
            <p className="upload-sub">
              or <span className="browse-link">browse file on your computer</span>
            </p>

            <input
              type="file"
              accept="audio/*,video/*"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>

          <div className="upload-filelist">
            {file ? (
              <div className="file-row">
                <div className="file-meta">
                  <div className="file-name">{file.name}</div>
                  <div className="file-size">{humanFileSize(file.size)}</div>
                </div>

                <div className="file-actions">
                  <button className="btn-small" onClick={removeFile} type="button">
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="file-empty">No file selected</div>
            )}

            <div style={{ marginTop: 15 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 14,
                  color: "var(--muted)",
                  marginBottom: 6
                }}
              >
                Or paste a YouTube link
              </label>

              <input
                type="text"
                className="mm-select"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                style={{ width: "100%", padding: 10 }}
              />
            </div>

            <div className="center-row">
              <select
                className="mm-select small"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
              >
                <option>Meeting</option>
                <option>Lecture</option>
                <option>Podcast</option>
                <option>Interview</option>
                <option>Other</option>
              </select>

              <button
                className="upload-btn"
                onClick={startProcessing}
                disabled={loading || (!file && !youtubeLink)}
              >
                {loading ? (
                  <span className="btn-with-spinner">
                    <span className="spinner-small" />
                    Processing...
                  </span>
                ) : (
                  "Upload"
                )}
              </button>
            </div>

            {loading && (
              <>
                <div
                  style={{
                    marginTop: 12,
                    height: 8,
                    background: "#e6eefc",
                    borderRadius: 8,
                    overflow: "hidden"
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${processingProgress}%`,
                      background:
                        "linear-gradient(90deg, var(--primary), #1d4ed8)",
                      transition: "width 0.3s"
                    }}
                  />
                </div>
                <div
                  style={{
                    textAlign: "center",
                    marginTop: 6,
                    fontSize: 12,
                    color: "var(--muted)"
                  }}
                >
                  {Math.round(processingProgress)}%
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* NEW WAVEFORM LOADER OVERLAY */}
      {loading && (
        <div className="loading-overlay">
          <div className="overlay-card">

            <div className="waveform-loader">
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>

            <p className="loading-text">Processing your meeting…</p>
          </div>
        </div>
      )}
    </div>
  );
}
