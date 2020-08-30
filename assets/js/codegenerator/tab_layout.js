function tabLayoutDisplay() {
    displayArea().innerHTML = "Style Name<br/>\"_image\" and \"_text\" will be added to the end of the style name<br/>if you don't wish to use style resources, leave this blank"
    + textArea(1, "styleName")
    + "Font Size<br/>if default, leave blank"
    + textArea(1, "fontSize")
    + "Image Size<br/>if default, leave blank"
    + textArea(1, "imageSize")
    + "Font Color<br/>if using color resource, enter resource name<br/>if not using color resource, enter 6 digit RGB value<br/>if default, leave blank"
    + textArea(1, "fontColor")
    + "Image Color<br/>if using color resource, enter resource name<br/>if not using color resource, enter 6 digit RGB value<br/>if default, leave blank"
    + textArea(1, "imageColor")
    + `Use @string Resources? ${checkBox("useStrings")}<br/>`
    + "Tab List<br/>each tab on new line<br/>enter as \"tabName drawableResourceName\"<br/>if no icon, enter as \"tabName\"<br/>use an asterisk (\"tabName*\") to generate a drawableResourceName equal to the tabName converted to underscore notation"
    + textArea(10, "tabList")
    + generateButton("tabLayoutCode")
    + "<br/><br/>Layout Code"
    + textArea(20, "output")
    + "on click listeners"
    + textArea(10, "onClick")
    + "strings file"
    + textArea(10, "strings")
    + "styles file"
    + textArea(20, "styles")
    + "colors file"
    + textArea(10, "colors");
}

function tabLayoutCode() {
    let styleName = getValue("styleName");
    let fontSize = getValue("fontSize");
    let imageSize = getValue("imageSize");
    let fontColor = getValue("fontColor").replace(/#/g, "");
    let imageColor = getValue("imageColor").replace(/#/g, "");
    let strings = docId("useStrings").checked;
    let styles = styleName !== "";
    let fontUsesColor = fontColor !== "" && !/\D/.test(fontColor);
    let imageUsesColor = imageColor !== "" && !/\D/.test(imageColor);
    let tabList = getRows("tabList").trimSplit().filter(v => [1, 2].includes(v.length)).map(v => [v[0].replace(/\*/g, ""), v[0].includes("*") ? v[0].replace(/\*/g, "") : v.length == 2 ? v[1] : ""]);
    let code = `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal">
`;
    for (let i of tabList) {
        code += `
    <LinearLayout`;
        if (styles) {
            code += `
            style="@style/${styleName.toUnderscore()}"`;
        } else {
            code += `
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:gravity="center_horizontal"
            android:orientation="vertical"
            android:layout_weight="1"`;
        }
        code += `
            android:id="@+id/${i[0].toCamel()}Tab">
        <ImageView`;
        if (styles) {
            code += `
                style="@style/${styleName.toUnderscore()}_image"`;
        } else {
            code += `
                android:layout_width="${imageSize === "" ? "wrap_content" : `${imageSize}dp`}"
                android:layout_height="${imageSize === "" ? "wrap_content" : `${imageSize}dp`}"${imageColor === "" ? "" : `
                android:tint="${colorResource(imageColor)}"`}`;
        }
            code += `
                android:src="@drawable/${i[1].toUnderscore()}" />
        <TextView`;
        if (styles) {
            code += `
                style="@style/${styleName.toUnderscore()}_text"`;
        } else {
            code += `
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"${fontSize === "" ? "" : `
                android:textSize="${fontSize}sp"`}${fontColor === "" ? "" : `
                android:textColor="${colorResource(fontColor)}"`}`;
        }
            code += `
                android:text="${i[0].toStringResource(strings)}" />
    </LinearLayout>`;
    }
    code += "\n</LinearLayout>";
    output(code, "output");
    code = "";
    if (strings) {
        for (let i of tabList) {
            code += `<string name="${i[0].toUnderscore()}">${i[0].replace(/'/g, "\\'")}</string>
`;
        }
    }
    output(code, "strings");
    code = "";
    if (fontColor !== "" && /[^0-9a-fA-F]/.test(fontColor)) {
        code += `<color name="${fontColor}">#</color>
`;
    }
    if (imageColor !== "" && /[^0-9a-fA-F]/.test(imageColor) && imageColor != fontColor) {
        code += `<color name="${imageColor}">#</color>
`;
    }
    output(code, "colors");
    if (styles) {
        code = `<style name="${styleName}">
    <item name="android:layout_width">wrap_content</item>
    <item name="android:layout_height">wrap_content</item>
    <item name="android:gravity">center_horizontal</item>
    <item name="android:orientation">vertical</item>
    <item name="android:layout_weight">1</item>
</style>
<style name="${styleName}_image">
    <item name="android:layout_width">${imageSize === "" ? "wrap_content" : `${imageSize}dp`}</item>
    <item name="android:layout_height">${imageSize === "" ? "wrap_content" : `${imageSize}dp`}</item>${imageColor === "" ? "" : `
    <item name="android:tint">${colorResource(imageColor)}</item>`}
</style>
<style name="${styleName}_text">
    <item name="android:layout_width">wrap_content</item>
    <item name="android:layout_height">wrap_content</item>${fontColor === "" ? "" : `
    <item name="android:textColor">${colorResource(fontColor)}</item>`}${fontSize === "" ? "" : `
    <item name="android:textSize">${fontSize}dp</item>`}
</style>`;
    }
    output(code, "styles");
    code = "";
    for (let i of tabList) {
        code += `${i[0].toCamel()}Tab.setOnClickListener {
        
}
`;
    }
    output(code, "onClick");
}















