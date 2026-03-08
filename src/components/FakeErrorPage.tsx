import { useState, useCallback } from "react";

interface FakeErrorPageProps {
  onUnlock: () => void;
}

const FakeErrorPage = ({ onUnlock }: FakeErrorPageProps) => {
  const [clickCount, setClickCount] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const handleIconClick = useCallback(() => {
    const next = clickCount + 1;
    setClickCount(next);
    if (next >= 5) {
      onUnlock();
    }
  }, [clickCount, onUnlock]);

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif",
        backgroundColor: "#292a2d",
        color: "#9aa0a6",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        padding: "120px 0 40px 0",
        userSelect: "none",
      }}
    >
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 40px", width: "100%" }}>
        {/* Chrome-style error icon - monitor with page */}
        <div
          onClick={handleIconClick}
          style={{
            cursor: "default",
            marginBottom: 30,
            width: 56,
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            {/* Monitor outline */}
            <rect x="4" y="6" width="40" height="28" rx="2" fill="none" stroke="#636466" strokeWidth="2" />
            {/* Screen inner */}
            <rect x="7" y="9" width="34" height="22" fill="#35363a" />
            {/* Stand */}
            <line x1="18" y1="34" x2="18" y2="40" stroke="#636466" strokeWidth="2" />
            <line x1="30" y1="34" x2="30" y2="40" stroke="#636466" strokeWidth="2" />
            <line x1="14" y1="40" x2="34" y2="40" stroke="#636466" strokeWidth="2" />
            {/* Page/document icon on screen */}
            <rect x="17" y="13" width="14" height="16" rx="1" fill="none" stroke="#636466" strokeWidth="1.5" />
            <polyline points="25,13 25,17 29,17" fill="none" stroke="#636466" strokeWidth="1.5" />
          </svg>
        </div>

        <h1
          style={{
            fontSize: "1.3em",
            fontWeight: 400,
            color: "#e8eaed",
            marginBottom: 12,
            letterSpacing: "-0.01em",
            lineHeight: 1.3,
          }}
        >
          This site can't be reached
        </h1>

        <p
          style={{
            fontSize: "0.85em",
            color: "#9aa0a6",
            marginBottom: 28,
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: "#e8eaed", fontWeight: 500 }}>
            {window.location.hostname}
          </strong>{" "}
          refused to connect.
        </p>

        <div
          style={{
            fontSize: "0.85em",
            color: "#9aa0a6",
            marginBottom: 16,
            lineHeight: 1.8,
          }}
        >
          <p style={{ marginBottom: 6 }}>Try:</p>
          <ul style={{ paddingLeft: 28, margin: 0, listStyleType: "disc" }}>
            <li style={{ marginBottom: 2 }}>Checking the connection</li>
            <li>
              <span
                style={{ color: "#8ab4f8", cursor: "default" }}
              >
                Checking the proxy and the firewall
              </span>
            </li>
          </ul>
        </div>

        <p
          style={{
            fontSize: "0.75em",
            color: "#9aa0a6",
            fontFamily: "monospace",
            marginBottom: 32,
            letterSpacing: "0.02em",
          }}
        >
          ERR_CONNECTION_REFUSED
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "8px 28px",
              fontSize: "0.85em",
              fontWeight: 500,
              borderRadius: 4,
              border: "none",
              backgroundColor: "#8ab4f8",
              color: "#202124",
              cursor: "pointer",
              letterSpacing: "0.01em",
            }}
          >
            Reload
          </button>

          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              padding: "8px 20px",
              fontSize: "0.85em",
              fontWeight: 500,
              borderRadius: 4,
              border: "1px solid #5f6368",
              backgroundColor: "transparent",
              color: "#8ab4f8",
              cursor: "pointer",
            }}
          >
            Details
          </button>
        </div>

        {showDetails && (
          <div
            style={{
              marginTop: 20,
              fontSize: "0.8em",
              color: "#9aa0a6",
              lineHeight: 1.7,
              borderTop: "1px solid #3c4043",
              paddingTop: 16,
            }}
          >
            <p>{window.location.hostname}'s server IP address could not be found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FakeErrorPage;
