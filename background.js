chrome.runtime.onMessage.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting
      .executeScript({
        target: { tabId: tabs[0].id },
        files: ["scripts/complete.js"],
      })
      .then(() => {
        console.log("Executed script");
      });
  });
});
