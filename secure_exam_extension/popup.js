document.getElementById("start").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: enableSecureMode
  });
  document.getElementById("status").textContent = "Running";
});

document.getElementById("stop").addEventListener("click", async () => {
  alert("Secure mode stopped.");
  document.getElementById("status").textContent = "Stopped";
});

function enableSecureMode() {
  alert("Secure mode active.");
  document.documentElement.requestFullscreen();
}
