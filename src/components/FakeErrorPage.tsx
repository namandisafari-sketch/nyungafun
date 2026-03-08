import { useState, useCallback } from "react";

interface FakeErrorPageProps {
  onUnlock: () => void;
}

const FakeErrorPage = ({ onUnlock }: FakeErrorPageProps) => {
  const [clickCount, setClickCount] = useState(0);

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
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#1a1a2e",
        color: "#c4c4c4",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        userSelect: "none",
      }}
    >
      {/* Fake browser-style error icon */}
      <div
        onClick={handleIconClick}
        style={{
          cursor: "default",
          marginBottom: 32,
          width: 72,
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6b6b8d"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
          <path d="M7 10l3 3m0-3l-3 3M14 10l3 3m0-3l-3 3" />
        </svg>
      </div>

      <h1
        style={{
          fontSize: 24,
          fontWeight: 400,
          color: "#9a9ab0",
          marginBottom: 16,
          textAlign: "center",
        }}
      >
        This site can't be reached
      </h1>

      <p
        style={{
          fontSize: 14,
          color: "#6b6b8d",
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        <strong style={{ color: "#8a8aa0" }}>
          {window.location.hostname}
        </strong>{" "}
        refused to connect.
      </p>

      <div
        style={{
          fontSize: 13,
          color: "#6b6b8d",
          textAlign: "left",
          marginBottom: 24,
        }}
      >
        <p style={{ marginBottom: 8 }}>Try:</p>
        <ul style={{ paddingLeft: 24, margin: 0 }}>
          <li style={{ marginBottom: 4 }}>Checking the connection</li>
          <li>Checking the proxy and the firewall</li>
        </ul>
      </div>

      <p
        style={{
          fontSize: 12,
          color: "#4a4a60",
          fontFamily: "monospace",
          marginBottom: 32,
        }}
      >
        ERR_CONNECTION_REFUSED
      </p>

      <button
        onClick={() => window.location.reload()}
        style={{
          padding: "8px 32px",
          fontSize: 14,
          borderRadius: 4,
          border: "1px solid #3a3a5c",
          backgroundColor: "#252540",
          color: "#8a8aa0",
          cursor: "pointer",
        }}
      >
        Reload
      </button>
    </div>
  );
};

export default FakeErrorPage;
