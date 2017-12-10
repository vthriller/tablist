// web extensions polyfill for ff/chrome
window.browser = (function () {
    return window.browser || window.chrome;
})();

function listTabs() {
    // `populate` is not supported by Edge
    browser.windows.getAll({populate: true}, function(windows) {
        document.getElementById('window-count').innerHTML = windows.length;
        let tabCount = 0;

        for(w of windows) {
            tabCount += w.tabs.length;

            let wli = document.createElement('li');
            let list = document.createElement('ol');
            wli.appendChild(list);

            for (let tab of w.tabs) {
                    let li = document.createElement('li');
                    li.appendChild(document.createTextNode(tab.url));
                    li.id = tab.id;
                    li.onclick = function() {
                        browser.tabs.update(parseInt(this.id), { active: true }, function(tab) {
                            browser.windows.update(tab.windowId, { focused: true }, function() {});
                        });
                    };
                    list.appendChild(li);
            }

            document.getElementById('list').appendChild(wli);
        }

        document.getElementById('tab-count').innerHTML = tabCount;
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
