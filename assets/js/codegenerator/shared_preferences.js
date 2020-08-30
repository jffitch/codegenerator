function sharedPreferencesDisplay() {
    displayArea().innerHTML = "Shared Preferences Location"
    + textArea(1, "location")
    + "Variables<br/>each variable on a different line<br/>enter variables as \"variableName variableType\"<br/>type can be entered using these hotkeys: i Int, f Float, b Boolean, s String"
    + textArea(5, "variableList")
    + generateButton("sharedPreferencesCode()")
    + "<br/>Code To Save Variables"
    + textArea(20, "saveCode")
    + "Code To Load Variables"
    + textArea(20, "loadCode");
}

function sharedPreferencesCode() {
    let variableList = getRows("variableList").trimSplit();
    let location = getValue("location");
    let code = `val pref = context?.getSharedPreferences("${location}", 0)
`;
    for (let i of variableList) {
        code += `${i[0]} = pref?.get${hotkey(i[1])}("${i[0]}", ${emptyValue(i[1])}) ?: ${emptyValue(i[1])}
`;
    }
    output(code, "loadCode");
    code = `val pref = context?.getSharedPreferences("${location}", 0)
val editor = pref?.edit()
`;
    for (let i of variableList) {
        code += `editor?.put${hotkey(i[1])}("${i[0]}", ${i[0]})
`;
    }
    code += "editor?.apply()";
    output(code, "saveCode");
}