let username = "student123"; // This should come from your exam page login info

// Fullscreen enforcement
function enableFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      alert("Fullscreen is required for the exam.");
    });
  }
}

// Detect leaving fullscreen
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    sendAlert(username, "Exited fullscreen mode");
    enableFullscreen();
  }
});

// Block shortcuts
document.addEventListener("keydown", (e) => {
  const blocked = ["Control+T", "Control+N", "Control+Tab", "Alt+Tab"];
  if ((e.ctrlKey && e.key === "t") || (e.ctrlKey && e.key === "n") ||
      (e.ctrlKey && e.key === "Tab") || (e.altKey && e.key === "Tab")) {
    e.preventDefault();
    sendAlert(username, `Blocked shortcut: ${e.key}`);
    alert("Shortcut blocked during exam.");
  }
});

// Tab visibility change detection
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    sendAlert(username, "Tab switch detected");
    alert("⚠️ Tab change detected. Stay on the exam page!");
  }
});

// Window blur detection
window.addEventListener("blur", () => {
  sendAlert(username, "Window lost focus");
  alert("⚠️ You switched windows!");
});

// Take webcam snapshots every 30 seconds
setInterval(() => {
  takeWebcamSnapshot(username);
}, 30000);

enableFullscreen();
