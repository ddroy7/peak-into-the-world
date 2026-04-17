import React, { useEffect, useMemo, useRef, useState } from "react";
import { Menu, Home, LogIn, Upload, Trash2, Maximize, PlayCircle, ShieldCheck, X } from "lucide-react";

export default function App() {
  const [page, setPage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [username, setUsername] = useState("");
  const [heroLoaded, setHeroLoaded] = useState(false);

  const videoRef = useRef(null);

  const selectedVideo = useMemo(
    () => videos.find((video) => video.id === selectedVideoId) || null,
    [videos, selectedVideoId]
  );

  const closeMenu = () => setMenuOpen(false);

  const goTo = (nextPage) => {
    setPage(nextPage);
    closeMenu();
  };

  const fakeLogin = () => {
    setIsLoggedIn(true);
    setPage("admin");
    closeMenu();
  };

  const handleUpload = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const newVideos = files.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
    }));

    setVideos((prev) => {
      const updated = [...prev, ...newVideos];
      if (!selectedVideoId && newVideos[0]) {
        setSelectedVideoId(newVideos[0].id);
      }
      return updated;
    });

    event.target.value = "";
  };

  const handleDelete = (id) => {
    setVideos((prev) => {
      const target = prev.find((video) => video.id === id);
      if (target) URL.revokeObjectURL(target.url);

      const updated = prev.filter((video) => video.id !== id);
      if (selectedVideoId === id) {
        setSelectedVideoId(updated[0]?.id || null);
      }
      return updated;
    });
  };

  const enterFullscreen = async () => {
    const el = videoRef.current;
    if (!el) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await el.requestFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen failed:", error);
    }
  };

  useEffect(() => {
    setHeroLoaded(true);
    return () => {
      videos.forEach((video) => URL.revokeObjectURL(video.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatSize = (size) => {
    if (!size) return "0 MB";
    const mb = size / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const NavButton = ({ icon: Icon, label, onClick }) => (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  const EmptyState = ({ text, subtext }) => (
    <div className="flex min-h-[420px] w-full flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
      <PlayCircle className="mb-4 h-12 w-12 text-slate-400" />
      <p className="text-xl font-semibold text-slate-700">{text}</p>
      <p className="mt-2 max-w-xl text-sm text-slate-500">{subtext}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f8fafc,white_45%,#eef2ff_100%)] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => goTo("home")}
            className="text-left transition hover:opacity-80"
          >
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-500">
              Video Showcase
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Peak Into the World
            </h1>
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:scale-[1.02]"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
              <span>Menu</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-72 rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-900/10">
                <div className="mb-2 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Navigation
                </div>
                <div className="space-y-1">
                  <NavButton icon={Home} label="Home" onClick={() => goTo("home")} />
                  <NavButton icon={LogIn} label="Login" onClick={() => goTo("login")} />
                  {isLoggedIn && <NavButton icon={Upload} label="Admin Panel" onClick={() => goTo("admin")} />}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {page === "home" && (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className={`rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-2xl shadow-slate-200/60 transition duration-700 ${heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
                    <ShieldCheck size={14} />
                    Featured Screen
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Watch in a clean, modern full-view player
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                    Upload videos from the admin panel, choose one for the home page, and open it in fullscreen any time.
                  </p>
                </div>
              </div>

              {selectedVideo ? (
                <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-950 shadow-inner">
                  <div className="flex items-center justify-between border-b border-white/10 bg-slate-900/80 px-4 py-3 text-white">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold sm:text-base">{selectedVideo.name}</p>
                      <p className="text-xs text-slate-300">Ready to play • fullscreen available</p>
                    </div>

                    <button
                      onClick={enterFullscreen}
                      className="ml-4 inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/20"
                    >
                      <Maximize size={16} />
                      Fullscreen
                    </button>
                  </div>

                  <video
                    ref={videoRef}
                    key={selectedVideo.id}
                    src={selectedVideo.url}
                    controls
                    autoPlay
                    playsInline
                    className="max-h-[76vh] min-h-[320px] w-full bg-black object-contain"
                  />
                </div>
              ) : (
                <EmptyState
                  text="No video selected yet"
                  subtext="Go to Login → Admin Panel, upload a video, and select one to show here."
                />
              )}
            </div>

            <aside className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-2xl shadow-slate-200/60">
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Quick Info</p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">Current status</h3>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Selected video</p>
                  <p className="mt-1 break-words text-base font-semibold text-slate-900">
                    {selectedVideo ? selectedVideo.name : "None selected"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Uploaded videos</p>
                  <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">{videos.length}</p>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-5 text-white shadow-lg">
                  <p className="text-sm font-medium text-indigo-100">Demo login</p>
                  <p className="mt-2 text-lg font-semibold">No password needed for now</p>
                  <button
                    onClick={() => goTo("login")}
                    className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:scale-[1.02]"
                  >
                    Open Login
                  </button>
                </div>
              </div>
            </aside>
          </section>
        </main>
      )}

      {page === "login" && (
        <main className="mx-auto flex max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid w-full gap-6 lg:grid-cols-[1fr_1fr]">
            <section className="rounded-[2rem] border border-white/70 bg-slate-900 p-8 text-white shadow-2xl shadow-slate-300/40">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-300">Admin access</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight">Manage your uploaded videos</h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300 sm:text-base">
                This demo version lets you log in without a user ID or password. After entering, you can upload videos, preview them, and choose which one appears on the home screen.
              </p>
            </section>

            <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-2xl shadow-slate-200/60">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Login</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Enter Admin Panel</h2>
              </div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">User name (optional)</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Type a name for demo access"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />

              <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Demo mode: no user ID or password required right now.
              </p>

              <button
                onClick={fakeLogin}
                className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:scale-[1.01]"
              >
                Continue to Admin Panel
              </button>
            </section>
          </div>
        </main>
      )}

      {page === "admin" && isLoggedIn && (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Dashboard</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Admin Panel</h2>
              <p className="mt-2 text-sm text-slate-600">
                Upload videos, manage the list, preview them, and set the home page video.
              </p>
            </div>

            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:scale-[1.02]">
              <Upload size={18} />
              Upload Video
              <input type="file" accept="video/*" multiple onChange={handleUpload} className="hidden" />
            </label>
          </div>

          <section className="grid gap-6 xl:grid-cols-[0.95fr_1.25fr]">
            <div className="rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-2xl shadow-slate-200/60">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Library</p>
                  <h3 className="mt-2 text-xl font-bold text-slate-900">Uploaded Videos</h3>
                </div>
                <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                  {videos.length} total
                </div>
              </div>

              {videos.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <Upload className="mx-auto mb-3 h-10 w-10 text-slate-400" />
                  <p className="text-lg font-semibold text-slate-700">No videos uploaded yet</p>
                  <p className="mt-2 text-sm text-slate-500">Use the upload button above to add videos.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {videos.map((video) => {
                    const active = selectedVideoId === video.id;
                    return (
                      <div
                        key={video.id}
                        className={`rounded-3xl border p-4 transition ${
                          active
                            ? "border-indigo-300 bg-indigo-50/70 shadow-lg shadow-indigo-100/40"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <p className="break-words text-base font-semibold text-slate-900">{video.name}</p>
                            <p className="mt-1 text-sm text-slate-500">{formatSize(video.size)}</p>
                          </div>

                          {active && (
                            <span className="inline-flex w-fit items-center rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-white">
                              On Home
                            </span>
                          )}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            onClick={() => setSelectedVideoId(video.id)}
                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.02]"
                          >
                            Show on Home
                          </button>
                          <button
                            onClick={() => setSelectedVideoId(video.id)}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => handleDelete(video.id)}
                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-2xl shadow-slate-200/60">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Preview</p>
                  <h3 className="mt-2 text-xl font-bold text-slate-900">Live Player</h3>
                </div>

                {selectedVideo && (
                  <button
                    onClick={enterFullscreen}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <Maximize size={16} />
                    Fullscreen
                  </button>
                )}
              </div>

              {selectedVideo ? (
                <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-950 shadow-inner">
                  <div className="border-b border-white/10 bg-slate-900/80 px-4 py-3 text-white">
                    <p className="truncate text-sm font-semibold sm:text-base">{selectedVideo.name}</p>
                    <p className="text-xs text-slate-300">Preview player with fullscreen support</p>
                  </div>
                  <video
                    ref={videoRef}
                    key={selectedVideo.id}
                    src={selectedVideo.url}
                    controls
                    autoPlay
                    playsInline
                    className="max-h-[72vh] min-h-[340px] w-full bg-black object-contain"
                  />
                </div>
              ) : (
                <EmptyState
                  text="Upload a video to preview"
                  subtext="After uploading, choose a video and it will appear here and on the home page."
                />
              )}
            </div>
          </section>
        </main>
      )}
    </div>
  );
}

