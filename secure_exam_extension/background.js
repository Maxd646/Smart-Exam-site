chrome.runtime.onInstalled.addListener(() => {
  console.log("Secure Exam Protocol v1.1 installed.");
});

chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, tab => {
    console.log("Exam tab active:", tab.url);
  });
});
