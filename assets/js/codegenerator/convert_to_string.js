function convertToStringDisplay() {
    displayArea().innerHTML = "Paste your XML file here.<br/>By default, all fields marked \"android:text\", \"android:hint\", \"android:title\", or \"android:label\" will be changed to the \"@string\" format if they aren't already. You can add an asterisk to the fields (for example, android:text=\"Hello World*\") to leave some fields unchanged.<br/>By default, fields that get changed will have the string named as the text in underscore notation. If you'd like to name it something else, add \"|\" and the desired name (for example, android:text=\"Hello World\" would generate a string named hello_world, while android:text=\"Hello World|hw\" would generate a string named hw)"
    + textArea(20, "xmlFile")
    + `Change Only Asterisked Fields? ${checkBox("changeAsterisk")}If unchecked, you'll change all but the asterisked fields. If checked, you'll change only the asterisked fields.<br/><br/>`
    + generateButton("convertToStringCode")
    + "<br/>New XML File"
    + textArea(20, "newFile")
    + "strings file"
    + textArea(20, "strings");
}

function convertToStringCode() {
    let changeAsterisk = docId("changeAsterisk").checked;
    let xmlFile = getValue("xmlFile");
    let changes = (xmlFile.match(/android:(?:text|hint|label|title)=".*"/g) || []).filter(v => !v.includes("@") && (v.includes("*") == changeAsterisk));
    let code = "";
    for (let i of changes) {
	    let text = i.substring(i.indexOf(`"`) + 1, i.lastIndexOf(`"`));
	    let stringText = (text.includes("|") ? text.substring(0, text.indexOf("|")) : text).replace(/\*/g, "");
	    let stringName = (text.includes("|") ? text.substring(text.indexOf("|") + 1).toUnderscore() : text.toUnderscore()).replace(/\*/g, "");
        let newStr = i.replace(text, `@string/${stringName}`);
	    xmlFile = xmlFile.replace(i, newStr);
	    code += `<string name="${stringName}">${stringText.replace(/'/g, "\\'")}</string>
`;
    }
    xmlFile = xmlFile.replace(/\*/g, "").replace(/\|.*"/g, "\"");
    output(xmlFile, "newFile");
    output(code, "strings");
}