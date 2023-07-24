class HtmlEditorHtmlChangedEventContext {
    html = null;

    constructor(html) {
        this.html = html;
    }
}
class HtmlEditorHtmlChangedEvent extends CustomEvent {
    static eventName = "dxbl:htmleditor-htmlchanged";

    constructor(html) {
        super(HtmlEditorHtmlChangedEvent.eventName, {
            detail: new HtmlEditorHtmlChangedEventContext(html),
            bubbles: true,
            composed: true,
            cancelable: false
        });
    }
}
window.Blazor.registerCustomEventType(HtmlEditorHtmlChangedEvent.eventName, {
    createEventArgs: x => x.detail
});

let devExtremeInitPromise = null;
function ensureDevExtremeAsync() {
    return devExtremeInitPromise || (devExtremeInitPromise = new Promise(async (resolve, _) => {
        await loadScriptAsync("https://cdnjs.cloudflare.com/ajax/libs/devextreme-quill/1.6.2/dx-quill.min.js");
        await loadScriptAsync("https://cdn3.devexpress.com/jslib/23.1.3/js/dx.all.js");
        await loadStylesheetAsync("https://cdn3.devexpress.com/jslib/23.1.3/css/dx.common.css");
        await loadStylesheetAsync("https://cdn3.devexpress.com/jslib/23.1.3/css/dx.material.purple.light.compact.css");

        resolve();
    }));

    function loadScriptAsync(src) {
        return new Promise((resolve, _) => {
            const scriptEl = document.createElement("SCRIPT");
            scriptEl.src = src;
            scriptEl.onload = resolve;
            document.head.appendChild(scriptEl);
        });
    }
    function loadStylesheetAsync(href) {
        return new Promise((resolve, _) => {
            const stylesheetEl = document.createElement("LINK");
            stylesheetEl.href = href;
            stylesheetEl.rel = "stylesheet";
            stylesheetEl.onload = resolve;
            document.head.appendChild(stylesheetEl);
        });
    }
}

export async function initializeHtmlEditor(element, toolbarContainer, html) {
    await ensureDevExtremeAsync();
    let dispatchTimeoutId = -1;
    return new DevExpress.ui.dxHtmlEditor(element, {
        height: "100%",
        value: html,
        valueType: "html",
        onValueChanged: arg => dispatchHtmlChanged(arg.value),
        toolbar: {
            container: toolbarContainer,
            items: [
                "undo", "redo", "separator",
                {
                    formatName: "size",
                    formatValues: ["8pt", "10pt", "12pt", "14pt", "18pt", "24pt", "36pt"]
                },
                {
                    formatName: "font",
                    formatValues: ["Arial", "Courier New", "Georgia", "Impact", "Lucida Console", "Tahoma", "Times New Roman", "Verdana"]
                },
                "separator", "bold", "italic", "strike", "underline", "separator",
                "alignLeft", "alignCenter", "alignRight", "alignJustify", "separator",
                "orderedList", "bulletList", "separator",
                {
                    formatName: "header",
                    formatValues: [false, 1, 2, 3, 4, 5]
                }, "separator",
                "color", "background", "separator",
                "link", "image", "separator",
                "clear", "codeBlock", "blockquote"
            ]
        },
        mediaResizing: {
            enabled: true
        }
    });

    function dispatchHtmlChanged(newHtml) {
        clearTimeout(dispatchTimeoutId);
        dispatchTimeoutId = setTimeout(() => element.dispatchEvent(new HtmlEditorHtmlChangedEvent(newHtml)), 200);
    }
}
