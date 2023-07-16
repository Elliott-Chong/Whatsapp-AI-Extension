document.addEventListener("DOMContentLoaded", function () {
  chrome.runtime.sendMessage({
    ai_complete: true,
  });
});
