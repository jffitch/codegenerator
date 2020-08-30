function repeatedLayoutDisplay() {
    displayArea().innerHTML = "Layout Code<br/>paste the layout code that you want repeated<br/>use asterisks for anything you want to match the IDs in the ID list, everything else will stay the same<br/>asterisk hotkeys: ** ID as is, *^* ID capitalize first letter, *^^* ID all caps, *_* ID underscore notation<br/>\"@string/\" with any asterisk hotkey will show the underscore notation in that place, with the asterisk hotkey's corresponding notation in the strings file"
    + textArea(20, "layoutCode")
    + "ID list<br/>each ID in line separated by \"|\"<br/>each row or each column on new line, depending on CheckBox"
    + textArea(20, "idList")
    + `Arrange in Columns? ${checkBox("columns")} (checked for columns, unchecked for rows)<br/>`
    + generateButton("repeatedLayoutCode")
    + "<br/>New Layout Code"
    + textArea(20, "newLayoutCode")
    + "strings file<br/>if your original Layout Code contains \"@string/*\", strings will appear here"
    + textArea(10, "stringsFile");
}

function repeatedLayoutCode() {
    let layoutCode = getValue("layoutCode");
    let idList = getRows("idList").split("|");
    let idList1d = getValue("idList").split(/\||\n/).trim();
    let columns = docId("columns").checked;

    let code = "";
    let code1 = "";
    let code2 = "";
    for (let i of (layoutCode.match(/(?<=\"\@string\/).*\*.*\*.*(?=\")/g) || [])) {
        for (let j of idList1d) {
            code1 = i.replace(/\*(|\^|\^\^|_)\*/, j.toUnderscore());
            code2 = i.replace(/\*(|\^|\^\^|_)\*/, (_, a) => {
                switch (a) {
                    case "": return j;
                    case "^": return j.capitalize();
                    case "^^": return j.toUpperCase();
                    case "_": return j.toUnderscore();
                }
            });
            code += `<string name="${code1}">${code2.replace(/'/g, "\\'")}</string>
`;
        }
    }
    output(code, "stringsFile");
    
    code = `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:orientation="${columns ? "horizontal" : "vertical"}"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:gravity="center_horizontal">
`;
    for (let i of idList) {
        code += columns ? `
    <LinearLayout
        android:layout_width="wrap_content"
        android:layout_height="match_parent"
        android:orientation="vertical">
` : `
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:gravity="center_horizontal">
`;
        for (let j of i) {
            code += repeatedLayoutBlock(layoutCode, j);
        }
        code += `
    </LinearLayout>`;
    }
    code += `
</LinearLayout>`;
    output(code, "newLayoutCode");
}

function repeatedLayoutBlock(layout, id) {
    return layout.replace(/(?<=\"\@string\/.*)\*.*\*(?=.*\")/g, id.toUnderscore())
        .replace(/\*(|\^|\^\^|_)\*/g, (_, a) => {
            switch (a) {
                case "": return id;
                case "^": return id.capitalize();
                case "^^": return id.toUpperCase();
                case "_": return id.toUnderscore();
            }
        });
}