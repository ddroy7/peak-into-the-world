import React, { useState } from "react";

export default function App() {
  const [page, setPage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleUpload = (event) => {
    const files = Array.from(event.target.files || []);

    const newVideos = files.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setVideos((prev) => [...prev, ...newVideos]);

    if (!selectedVideo && newVideos.length > 0) {
      setSelectedVideo(newVideos[0]);
    }
  };

  const handleDelete = (id) => {
    setVideos((prev) => {
      const updated = prev.filter((video) => video.id !== id);
      if (selectedVideo && selectedVideo.id === id) {
        setSelectedVideo(updated[0] || null);
      }
      return updated;
    });
  };

  const fakeLogin = () => {
    setIsLoggedIn(true);
    setPage("admin");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: "Arial, sans-serif" }}>
      <header
        style={{
          background: "white",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          position: "relative",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "24px" }}>Peak Into the World</h1>

        <div style={{ position: "relative" }}>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ padding: "10px 16px", cursor: "pointer" }}>
            Menu ▾
          </button>

          {menuOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "44px",
                background: "white",
                border: "1px solid #ddd",
                borderRadius: "10px",
                minWidth: "160px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                overflow: "hidden",
                zIndex: 10,
              }}
            >
              <button
                onClick={() => {
                  setPage("home");
                  setMenuOpen(false);
                }}
                style={{ width: "100%", padding: "12px", border: "none", background: "white", textAlign: "left", cursor: "pointer" }}
              >
                Home
              </button>

              <button
                onClick={() => {
                  setPage("login");
                  setMenuOpen(false);
                }}
                style={{ width: "100%", padding: "12px", border: "none", background: "white", textAlign: "left", cursor: "pointer" }}
              >
                Login
              </button>
            </div>
          )}
        </div>
      </header>

      {page === "home" && (
        <div style={{ padding: "24px" }}>
          <div
            style={{
              maxWidth: "1100px",
              margin: "0 auto",
              background: "white",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              padding: "20px",
            }}
          >
            <h2>Home</h2>
            {selectedVideo ? (
              <video
                key={selectedVideo.id}
                src={selectedVideo.url}
                controls
                autoPlay
                style={{ width: "100%", maxHeight: "75vh", background: "black", borderRadius: "12px" }}
              />
            ) : (
              <div
                style={{
                  height: "70vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px dashed #ccc",
                  borderRadius: "12px",
                  color: "#777",
                }}
              >
                No video selected yet.
              </div>
            )}
          </div>
        </div>
      )}

      {page === "login" && (
        <div style={{ padding: "24px" }}>
          <div
            style={{
              maxWidth: "420px",
              margin: "40px auto",
              background: "white",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              padding: "24px",
            }}
          >
            <h2>Login</h2>
            <p style={{ color: "#555" }}>Demo version: no user ID or password required for now.</p>

            <input
              type="text"
              placeholder="User name (optional for demo)"
              style={{ width: "100%", padding: "12px", marginBottom: "12px", boxSizing: "border-box" }}
            />

            <button onClick={fakeLogin} style={{ width: "100%", padding: "12px", cursor: "pointer" }}>
              Enter Admin Panel
            </button>
          </div>
        </div>
      )}

      {page === "admin" && isLoggedIn && (
        <div style={{ padding: "24px" }}>
          <div
            style={{
              maxWidth: "1100px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: "24px",
            }}
          >
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              <h2>Admin Panel</h2>
              <p style={{ color: "#555" }}>Upload videos and choose which one appears on the home page.</p>

              <input
                type="file"
                accept="video/*"
                multiple
                onChange={handleUpload}
                style={{ marginTop: "12px", marginBottom: "16px", width: "100%" }}
              />

              <h3>Uploaded Videos</h3>

              {videos.length === 0 ? (
                <p style={{ color: "#777" }}>No videos uploaded yet.</p>
              ) : (
                videos.map((video) => (
                  <div
                    key={video.id}
                    style={{
                      border: selectedVideo?.id === video.id ? "2px solid black" : "1px solid #ddd",
                      borderRadius: "12px",
                      padding: "10px",
                      marginBottom: "10px",
                      background: "#fff",
                    }}
                  >
                    <p style={{ margin: "0 0 10px 0", fontWeight: "bold", wordBreak: "break-word" }}>{video.name}</p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button onClick={() => setSelectedVideo(video)}>Show on Home</button>
                      <button onClick={() => handleDelete(video.id)}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              <h2>Preview</h2>
              {selectedVideo ? (
                <video
                  key={selectedVideo.id}
                  src={selectedVideo.url}
                  controls
                  autoPlay
                  style={{ width: "100%", maxHeight: "70vh", background: "black", borderRadius: "12px" }}
                />
              ) : (
                <div
                  style={{
                    height: "70vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px dashed #ccc",
                    borderRadius: "12px",
                    color: "#777",
                  }}
                >
                  Upload and select a video to preview here.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
