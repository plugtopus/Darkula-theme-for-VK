var styleBlock,
    localMode = 'light',
    blocking = location.pathname.indexOf('/dev') === 0 ? true : false;

if (!document.getElementById('darkvk')) {
    styleBlock = document.createElement('div');
    styleBlock.id = 'darkvk';
    document.getElementsByTagName('html')[0].appendChild(styleBlock);
} else styleBlock = document.getElementById('darkvk');

function setMode() {
    if (blocking) {
        return;
    }
    if (localMode == 'dark') {
        chrome['storage'].local.get(['styles'], function(obj) {
            const styleNode = document.createElement('style');
            if (obj.styles) {
                styleNode.textContent = obj.styles;
                styleBlock.innerHTML = '';
                styleBlock.appendChild(styleNode);
            } else if (styles) {
                styleNode.textContent = styles;
                styleBlock.innerHTML = '';
                styleBlock.appendChild(styleNode);
            }
        });
    } else styleBlock.textContent = '';
}

chrome['storage'].local.get(['mode'], function(obj) {
    localMode = obj.mode;
    setMode();
});
chrome['storage'].onChanged.addListener(function(obj) {
    if (obj.styles && obj.styles.newValue) {
        chrome['storage'].local.get(['mode'], function(obj) {
            localMode = obj.mode;
            setMode();
        });
    }
    if (obj.mode && obj.mode.newValue) {
        localMode = obj.mode.newValue;
        setMode();
    }
});

function blockingCheck(switcher) {
    if (switcher === blocking) return;
    blocking = switcher;
    if (blocking)
        styleBlock.innerHTML = '';
    else
        setMode();
}