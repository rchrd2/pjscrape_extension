chrome.devtools.panels.create(
    "PjScrape",
    "badge.png",
    "console.html",
    function cb(panel) {
        panel.onShown.addListener(function(win){ win.focus(); });
    }
);
