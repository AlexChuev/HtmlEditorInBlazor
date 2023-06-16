using Microsoft.AspNetCore.Components;

public class HtmlEditorHtmlChangedEventArgs : EventArgs {
    public string? html { get; set; }
}

[EventHandler("ondxbl:htmleditor-htmlchanged", typeof(HtmlEditorHtmlChangedEventArgs))]
public static class EventHandlers {
}
