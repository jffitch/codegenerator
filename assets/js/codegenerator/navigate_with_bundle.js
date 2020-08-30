function navigateWithBundleDisplay() {
    displayArea().innerHTML = `Fragments? ${checkBox("checkBox")}(checked for Fragment navigation, unchecked for Activity navigation)<br/><br/>`
    + "Destination<br/>enter action name for Fragments, Activity name for Activities"
    + textArea(1, "destination")
    + "Bundle Variables<br/>enter as \"variableName variableType\"<br/>multiple variables on multiple lines<br/>variableType can be typed as one letter using these hotkeys: i Int, s String, f Float, b Boolean"
    + textArea(5, "variableList")
    + generateButton("navigateWithBundleCode")
    + "<br/>Code To Create Intent"
    + textArea(20, "intentCode")
    + "Code To Load In Activity/Fragment"
    + textArea(20, "activityCode");
}

function navigateWithBundleCode() {
    let destination = getValue("destination");
    let variableList = getRows("variableList").trimSplit().filter(v => v.length == 2);
    let fragments = docId("checkBox").checked;
    
    let code = "";
    let codeActivity = "";
    let codeInit = "";
    if (variableList.length === 0) {
        if (fragments) {
            code = `findNavController().navigate(R.id.${destination.toUnderscore()})`;
        } else {
            code = `val intent = Intent(context, ${destination.toText()}::class.java)
startActivity(intent)`;
        }
        output(code, "intentCode");
        output("", "activityCode");
    } else {
        if (fragments) {
            code = "val bundle = Bundle()\n";
            codeActivity = "\narguments?.let {\n";
            for (let i of variableList) {
                code += `bundle.put${hotkey(i[1])}("${i[0]}", ${i[0]})
`;
                codeInit += `var ${i[0]}: ${hotkey(i[1])} = ${emptyValue(i[1])}
`;
                codeActivity += `    ${i[0]} = it.get${hotkey(i[1])}("${i[0]}", ${emptyValue(i[1])})
`;
            }
            code += `findNavController().navigate(R.id.${destination.toUnderscore()}, bundle)`;
            codeActivity += "}";
            output(code, "intentCode");
            output(codeInit + codeActivity, "activityCode");
        } else {
            code = `val intent = Intent(context, ${destination.toText()}::class.java)
`;
            codeActivity = "\nval bundle = intent?.extras\nif (bundle != null) {\n";
            for (let i of variableList) {
                code += `intent.putExtra("${i[0]}", ${i[0]})
`;
                codeInit += `var ${i[0]}: ${hotkey(i[1])} = ${emptyValue(i[1])}
`;
                codeActivity += `    ${i[0]} = bundle.get${hotkey(i[1])}("${i[0]}", ${emptyValue(i[1])})
`;
            }
            code += "startActivity(intent)";
            codeActivity += "}";
            output(code, "intentCode");
            output(codeInit + codeActivity, "activityCode");
        }
    }
}