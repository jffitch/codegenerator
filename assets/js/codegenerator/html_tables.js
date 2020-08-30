function htmlTablesDisplay() {
    displayArea().innerHTML = "Table ID<br/>IDs will be generated for headings and each row.<br/>Leave blank to not use IDs."
    + textArea(1, "tableId")
    + "Table Column Headings<br/>Separate each column with \"|\".<br/>Leave blank to not use headings."
    + textArea(1, "tableHeadings")
    + "Table Rows<br/>Put each row on new line.</br>Separate each column with \"|\"."
    + textArea(20, "tableRows")
    + generateButton("htmlTablesCode")
    + textArea(20, "output");
}

function htmlTablesCode() {
    let tableId = getValue("tableId");
    let tableHeadings = getValue("tableHeadings").split("|").trim().filter(v => v !== "");
    let tableRows = getRows("tableRows").split("|");
    
    let code = `<table${tableId === "" ? "" : ` id="${tableId}"`}>`;
    if (tableHeadings.length !== 0) {
        code += `
    <thead>
        <tr${tableId === "" ? "" : ` id="${tableId}Heading"`}>`;
        for (let i of tableHeadings) {
            code += `
            <th>${i}</th>`;
        }
        code += `
        </tr>
    </thead>`;
    }
    code += `
    <tbody>`;
    for (const [i, v] of tableRows.entries()) {
        code += `
        <tr${tableId === "" ? "" : ` id="${tableId}Row${i}"`}>`;
        for (let w of v) {
            code += `
            <td>${w}</td>`;
        }
        code += `
        </tr>`;
    }
    code += `
    </tbody>
</table>`;
    
    output(code, "output");
}