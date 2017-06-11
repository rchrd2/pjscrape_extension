chrome.devtools.panels.create(
  "PjService",
  "badge.png",
  "console.html",
  function cb(panel) {
      panel.onShown.addListener(function(win){ win.focus(); });
  }
);
