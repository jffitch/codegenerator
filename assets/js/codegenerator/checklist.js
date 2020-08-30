function checklistDisplay() {
    displayArea().innerHTML = "Option List<br/>multiple options in same column separated by commas<br/>multiple columns on separate lines"
    + textArea(3, "option_list")
    + "Desired Maximum Character Limit<br/>if an option is longer than this many characters, then the font size will be decreased"
    + textArea(1, "sizeLimit")
    + `Use @string Resources? ${checkBox("checkBox")}<br/>`
    + generateButton("checklistCode")
    + textArea(20, "output")
    + "strings file"
    + textArea(10, "strings");
    
    document.getElementById("sizeLimit").value = "10";
}

function checklistCode() {
    let optionList = getRows("option_list");
    optionList = optionList.map(v => v.replace(/ *, */g, ",").split(","));
    
    let sizeLimit = parseInt(getValue("sizeLimit"));
    
    let strings = docId("checkBox").checked;
    
    let stringCode = "";
    let code = `<LinearLayout android:layout_width="match_parent"
              android:layout_height="wrap_content"
              android:orientation="horizontal">
`;
              
    for (let i of optionList) {
        code += `    <LinearLayout android:layout_width="wrap_content"
                  android:layout_height="wrap_content"
                  android:layout_weight="1"
                  android:orientation="vertical">
`;
        for (let j of i) {
            code += `        <LinearLayout android:layout_width="wrap_content"
                      android:layout_height="wrap_content"
                      android:orientation="horizontal">
            <CheckBox android:layout_width="wrap_content"
                      android:layout_height="wrap_content"
                      android:id="@+id/${j.toCamel()}"/>
            <TextView android:layout_width="wrap_content"
                      android:layout_height="wrap_content"
                      android:text="${j.toStringResource(strings)}"
                      android:textSize="${Math.min(14, Math.ceil(14 * sizeLimit / j.length))}sp"/>
        </LinearLayout>
`;
            if (strings) {
                stringCode += `<string name="${j.toUnderscore()}">${j.replace(/'/g, "\\'")}</string>
`;
            }
        }
        code += `    </LinearLayout>
`;
    }
    code += `</LinearLayout>`;
    
    output(stringCode, "strings");
    output(code, "output");
}