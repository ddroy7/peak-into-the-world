import React, { useState } from "react";

export default function App() {
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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "24px" }}>
        Peak Into the World
      </h1>

      <div
        style={{
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
          <p style={{ color: "#555" }}>
            Demo version: upload videos and choose one to display.
          </p>

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
                  border:
                    selectedVideo?.id === video.id
                      ? "2px solid black"
                      : "1px solid #ddd",
                  borderRadius: "12px",
                  padding: "10px",
                  marginBottom: "10px",
                  background: "#fff",
                }}
              >
                <p
                  style={{
                    margin: "0 0 10px 0",
                    fontWeight: "bold",
                    wordBreak: "break-word",
                  }}
                >
                  {video.name}
                </p>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => setSelectedVideo(video)}>Show</button>
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
          <h2>Display Screen</h2>

          {selectedVideo ? (
            <video
              key={selectedVideo.id}
              src={selectedVideo.url}
              controls
              autoPlay
              style={{
                width: "100%",
                maxHeight: "70vh",
                background: "black",
                borderRadius: "12px",
              }}
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
              Upload and select a video to display here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}