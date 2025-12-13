import { useNavigate } from "react-router-dom";
import logo from "./assets/logo.png";

export default function ResultPage({
  transcript,
  summary,
  exportSummaryPDF,
  segments,
  numClips,
  setNumClips,
  generateClips,
  generatingClips,
  clipProgress,
  clips,
  downloadAllClips,
  handleDownload
}) {
  const navigate = useNavigate();

  return (
    <div className="mm-container">
      {/* <h1 className="mm-title">📄 Results</h1> */}

      {/* ✅ Go Back Button */}
      <img src={logo} className="mm-logo" />

      <button
        className="mm-btn-secondary"
        style={{ marginBottom: "20px" }}
        onClick={() => navigate("/")}
      >
        ⬅ Go Back to Upload Page
      </button>

      {transcript && (
        <div className="mm-card">
          <h2>Transcript</h2>
          <div className="mm-output">{transcript}</div>
        </div>
      )}

      {summary && (
        <div className="mm-card">
          <h2>Summary</h2>
          <div
            className="mm-output"
            dangerouslySetInnerHTML={{ __html: summary }}
          />
          <button className="mm-btn-secondary" onClick={exportSummaryPDF}>
            Download Summary PDF
          </button>
        </div>
      )}

      {segments?.length > 0 && (
        <div className="mm-card">
          <label className="mm-label">Number of Clips</label>
          <select
            className="mm-select"
            value={numClips}
            onChange={(e) => setNumClips(Number(e.target.value))}
          >
            <option value={1}>1</option>
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>

          <button className="mm-btn-primary" onClick={generateClips}>
            Generate Clips
          </button>

          {generatingClips && (
            <div className="mm-progress">
              <div
                className="mm-progress-bar"
                style={{ width: `${clipProgress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {clips?.length > 0 && (
        <div className="mm-card">
          <h2>Generated Clips</h2>

          <div className="mm-clips-grid">
            {clips.map((clip, idx) => (
              <div className="mm-clip-card" key={idx}>
                <h4>Clip {idx + 1}</h4>

                {clip.endsWith(".mp4") ? (
                  <video controls src={`http://localhost:8000/clips/${clip}`} />
                ) : (
                  <audio controls src={`http://localhost:8000/clips/${clip}`} />
                )}

                <button
                  className="mm-btn-download"
                  onClick={() =>
                    handleDownload(
                      `http://localhost:8000/clips/${clip}`,
                      clip
                    )
                  }
                >
                  Download
                </button>
              </div>
            ))}
          </div>

          <button className="mm-btn-green" onClick={downloadAllClips}>
            Download All (ZIP)
          </button>
        </div>
      )}
    </div>
  );
}
