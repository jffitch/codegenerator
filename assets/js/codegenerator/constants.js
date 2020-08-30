function constantsDisplay() {
    displayArea().innerHTML = "Constants List<br/>each group on new line<br/>each constant in group separated by comma (\"constant1, constant2, constant3...\")<br/>value 0 will be assigned to first constant in each group, counting up by 1"
    + textArea(10, "constantsList")
    + generateButton("constantsCode")
    + textArea(20, "output");
}

function constantsCode() {
    let constantsList = getRows("constantsList").split(",");
    let code = "";
    for (let i of constantsList) {
        for (const [q, j] of i.entries()) {
            code += `const val ${j.toUnderscore().toUpperCase()} = ${q}
`;
        }
        code += "\n";
    }
    output(code, "output");
}