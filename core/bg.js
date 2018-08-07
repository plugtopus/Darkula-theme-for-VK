function setIcon() {
    chrome['browserAction'].setIcon({
        "path": "img/icon_" + localStorage.mode + "_32.png"
    });
}

function changeMode(mode) {
    localStorage.mode = mode;
    chrome.storage.local.set({
        mode: mode
    });
}

if (!localStorage.mode) changeMode('dark');
setIcon();
chrome['browserAction'].onClicked.addListener(function() {
    changeMode(localStorage.mode == 'light' ? 'dark' : 'light');
    setIcon();
    greetings();
});


function include(id) {
    chrome['tabs'].executeScript(id, {
        file: 'core/styles.js'
    });
    chrome['tabs'].executeScript(id, {
        file: 'core/cs.js'
    });
}
chrome['tabs'].query({}, function(tabs) {
    for (var i = 0; i < tabs.length; i++) {
        var url = tabs[i].url.slice(7);
        if (url[0] == '/') url = url.slice(1);
        if (url.indexOf('vk.com') !== 0 && url.indexOf('oauth.vk.com') !== 0) continue;
        include(tabs[i].id);
    }
});
chrome['tabs'].onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status != 'loading') return;
    var url = document.createElement('a');
    url.href = tab.url;
    if (url.host.indexOf('vk.com') !== 0 && url.host.indexOf('oauth.vk.com') !== 0) return;
    chrome['tabs'].executeScript(tabId, {
        code: 'if (blockingCheck) blockingCheck(' + (url.pathname == '/dev' || url.pathname.indexOf('/dev/') === 0 ? 'true' : 'false') + ');'
    });
});

if (!localStorage.version) localStorage.version = '0';
if (!localStorage.updatetime) localStorage.updatetime = 86400000;
getUpdate();


if (!localStorage.install_date) localStorage.install_date = new Date() * 1;

function greetings() {
    if (!localStorage.install_page && new Date() - localStorage.install_date > 604800000 && localStorage.mode == 'dark') {
        localStorage.install_page = 1;
        chrome['tabs'].create({
            url: 'https://sites.google.com/view/promo-extensions-welcome'
        });
    }
}
greetings();

if (!localStorage.loades) localStorage.loades = 0;
localStorage.loades++;
if (!localStorage.use_time) localStorage.use_time = 0;