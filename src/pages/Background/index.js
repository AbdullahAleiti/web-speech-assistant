chrome.action.onClicked.addListener((tab) => {
    console.log("dada");
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { command: "iconClick" });
    });
});