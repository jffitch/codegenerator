function radioGroupDisplay() {
    displayArea().innerHTML = "Option List<br/>enter as \"option1 | option2 | option3 | ...\"<br/>put an asterisk after the option you want checked by default, for example \"option1 | option2* | option3\" will have option2 checked by default<br/>this generates the code for each RadioButton inside the RadioGroup, use the Layout Constraints task for the RadioGroup itself"
    + textArea(1, "list")
    + `Use @string Resources? ${checkBox("checkBox")}<br/>`
    + generateButton("radioGroupCode")
    + textArea(20, "output")
    + "strings file"
    + textArea(20, "strings");
}

function radioGroupCode() {
    let list = getValue("list").split("|").trim();
    let strings = docId("checkBox").checked;
    list = list.map(v => [v.replace(/\*/g, ""), v.includes("*")]);
    
    let code = "";
    for (let i of list) {
        code += `<RadioButton
    android:id="@+id/${i[0].toCamel()}"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="${strings ? `@string/${i[0].toUnderscore()}` : i[0]}"`;
        if (i[1]) {
            code += `
    android:checked="true"`;
        }
        code += ` />
`;
    }
    
    output(code, "output");
    if (strings) {
        code = "";
        for (let i of list) {
            code += `<string name="${i[0].toUnderscore()}">${i[0].replace(/'/g, "\\'")}</string>
`;
        }
        output(code, "strings");
    }
}