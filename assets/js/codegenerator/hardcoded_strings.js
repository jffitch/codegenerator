function hardcodedStringsDisplay() {
    displayArea().innerHTML = "Original File"
    + textArea(20, "original")
    + "Strings To Be Replaced With @string Resource<br/>each string on new line<br/>click \"Parse\" to parse strings from file"
    + customButton("hardcodedParse(0)", "Parse")
    + textArea(20, "replaceResource")
    + "Strings To Be Replaced With Constant<br/>each string on new line<br/>click \"Parse\" to parse strings from file"
    + customButton("hardcodedParse(1)", "Parse")
    + textArea(20, "replaceConstant")
    + generateButton("hardcodedStringsCode")
    + "<br/>New File"
    + textArea(20, "newFile")
    + "Strings File"
    + textArea(20, "stringsFile")
    + "Constants File"
    + textArea(20, "constantsFile");
}

function hardcodedStringsCode() {
    let original = getValue("original");
    let resourceList = getRows("replaceResource").map(v => `"${v}"`);
    let constantsList = getRows("replaceConstant").map(v => `"${v}"`);
    let replaced = original;
    for (let i of resourceList) {
        replaced = replaced.replace(RegExp(i, "g"), `resources.getString(R.string.${i.toUnderscore()})`);
    }
    for (let i of constantsList) {
        replaced = replaced.replace(RegExp(i, "g"), `Constants.STRING_${i.toUnderscore().toUpperCase()}`);
    }
    output(replaced, "newFile");
    let stringsFile = resourceList.map(v => `<string name="${v.toUnderscore()}">${v.replace(/"/g, "")}</string>`).join("\n");
    output(stringsFile, "stringsFile");
    let constantsFile = constantsList.map(v => `const val STRING_${v.toUnderscore().toUpperCase()} = ${v}`).join("\n");
    output(constantsFile, "constantsFile");
}

function hardcodedParse(n) {
    let original = getValue("original");
    let stringList = [...new Set(original.match(/".*"/g) || [])];
    output(stringList.join("\n").replace(/"/g, ""), n === 0 ? "replaceResource" : "replaceConstant");
}