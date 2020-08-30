function instructionsPageDisplay() {
    displayArea().innerHTML = "Instructions<br/>follow pattern as shown"
    + textArea(20, "instructionsList")
    + `Use @string Resources? ${checkBox("checkBox")}<br/>`
    + generateButton("instructionsPageCode")
    + "<br/>Layout Code"
    + textArea(20, "layoutCode")
    + "Strings File"
    + textArea(20, "strings")
    + "Styles File"
    + textArea(20, "styles");
    
    let code = `*Section 1
Paragraph 1
Paragraph 2
Paragraph 3
*Section 2
Paragraph 4
Paragraph 5`;
    output(code, "instructionsList");
    code = `<style name="sectionName">
    <item name="android:layout_width">match_parent</item>
    <item name="android:layout_height">wrap_content</item>
    <item name="android:textSize">18sp</item>
    <item name="android:textStyle">bold</item>
    <item name="android:gravity">start</item>
    <item name="android:layout_marginLeft">10dp</item>
    <item name="android:layout_marginRight">10dp</item>
    <item name="android:layout_marginTop">10dp</item>
    <item name="android:layout_marginBottom">10dp</item>
</style>
<style name="sectionText">
    <item name="android:layout_width">match_parent</item>
    <item name="android:layout_height">wrap_content</item>
    <item name="android:textSize">14sp</item>
    <item name="android:layout_marginLeft">30dp</item>
    <item name="android:layout_marginRight">10dp</item>
    <item name="android:gravity">start</item>
</style>`;
    output(code, "styles");
}

function instructionsPageCode() {
    let strings = docId("checkBox").checked;
    let instructionsList = getRows("instructionsList").trim();
    let code = `<LinearLayout android:layout_width="match_parent"
              android:layout_height="match_parent"
              android:orientation="vertical">`;
    let stringCode = "";
    let sectionName = "";
    let sectionCount = 0;
    for (let i of instructionsList) {
        if (i === "") {
            continue;
        }
        if (i[0] == "*") {
            if (i.substring(1).trim() === "") {
                continue;
            }
            sectionName = i.substring(1).trim();
            sectionCount = 0;
            code += `
            
    <TextView style="@style/sectionName"`;
            if (strings) {
                code += `
              android:text="@string/${sectionName.toUnderscore()}"/>`;
                stringCode += `<string name="${sectionName.toUnderscore()}">${sectionName.replace(/'/g, "\\'")}</string>
`;
            } else {
                code += `
              android:text="${sectionName}"/>`;
            }
        } else {
            sectionCount++;
            code += `
    <TextView style="@style/sectionText"`;
            if (strings) {
                code += `
              android:text="@string/${sectionName.toUnderscore()}_${sectionCount}"/>`;
                stringCode += `<string name="${sectionName.toUnderscore()}_${sectionCount}">${i.replace(/'/g, "\\'")}</string>
`;
            } else {
                code += `
              android:text="${i}"/>`;
            }
        }
    }
    code += "\n</LinearLayout>"
    output(code, "layoutCode");
    if (strings) {
        output(stringCode, "strings");
    }
}