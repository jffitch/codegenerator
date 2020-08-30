function spinnerDisplay() {
    displayArea().innerHTML = "Spinner ID"
    + textArea(1, "spinnerId")
    + "Spinner Item List<br/>enter as \"item0 | item1 | item2 | ...\""
    + textArea(1, "itemList")
    + `Use @string Resources? ${checkBox("useStrings")}<br/>`
    + `Use "for" Loop Format? ${checkBox("useForLoop")}<br/>`
    + generateButton("spinnerCode")
    + textArea(10, "output")
    + "strings file"
    + textArea(10, "strings");
}

function spinnerCode() {
    let spinnerId = getValue("spinnerId").trim();
    let itemList = getValue("itemList").split("|").trim();
    let strings = docId("useStrings").checked;
    let forLoop = docId("useForLoop").checked;
    
    let stringList = itemList.map(v => `"${v}"`);
    if (strings) {
        stringList = itemList.map(v => `resources.getString(R.string.${v.toUnderscore()})`);
    }
    
    let code = `val list = ArrayList<String>()
`;
    if (forLoop) {
        code += `for (i in arrayOf(${stringList.map(v => ` ${v}`).join(",").substring(1)})) {
    list.add(i)
}
`;
    } else {
        for (let i of stringList) {
            code += `list.add(${i})
`;
        }
    }
    code += `val adapter = ArrayAdapter<String>(this, android.R.layout.simple_spinner_item, list)
adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
${spinnerId}.adapter = adapter`;
    output(code, "output");
    
    if (strings) {
        code = "";
        for (let i of itemList) {
            code += `<string name="${i.toUnderscore()}">${i}</string>
`;
        }
        output(code, "strings");
    }
}