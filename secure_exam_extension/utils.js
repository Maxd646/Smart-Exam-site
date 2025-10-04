// Send cheating alert to backend
function sendAlert(username, reason) {
  fetch("http://localhost:8000/api/exam-alert/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: username,
      message: reason,
      timestamp: new Date().toISOString()
    })
  }).catch(err => console.error("Alert sending failed:", err));
}

// Take webcam snapshot
function takeWebcamSnapshot(username) {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      let video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      setTimeout(() => {
        let canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);

        let imageData = canvas.toDataURL("image/png");

        fetch("http://localhost:8000/api/webcam-snapshot/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username,
            image: imageData,
            timestamp: new Date().toISOString()
          })
        }).catch(err => console.error("Snapshot sending failed:", err));

        stream.getTracks().forEach(track => track.stop());
      }, 3000); // Take snapshot after 3 seconds
    })
    .catch(err => console.error("Webcam error:", err));
}
