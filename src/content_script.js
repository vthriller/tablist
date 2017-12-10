// web extensions polyfill for ff/chrome
window.browser = (function () {
    return window.browser || window.chrome;
})();

function listTabs() {
    browser.windows.getAll({}, function(windows) {
        for(w of windows) {
            let li = document.createElement('li');
            document.getElementById('list').appendChild(li);
            let list = document.createElement('ol');
            li.appendChild(list);

    browser.tabs.query({windowId: w.id}, function (tabs) {
        for (let tab of tabs) {
                let li = document.createElement('li');
                li.appendChild(document.createTextNode(tab.url));
                list.appendChild(li);
        }
    });

        }
    });
}

function activateTabs() {
    browser.tabs.query({}, async function(tabs) {
        for (let tab of tabs) {
            await browser.tabs.update(tab.id, {
                active: true
            });
        }
        listTabs()
    });
}

function init() {
    browser.runtime.getPlatformInfo(function (platform) {
        if (platform.os === "android") {
            // workaround for ff on android
            // tab.url is only available for tabs that have been recently used. so we'll activate them all before we query them
            alert("Generating list of tabs. This may take a moment...");
            activateTabs()
        } else {
            listTabs()
        }
    });
}

init();
