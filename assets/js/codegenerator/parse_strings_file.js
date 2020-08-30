function parseStringsFileDisplay() {
    displayArea().innerHTML = "Strings File"
    + textArea(20, "stringsFile")
    + customButton("parseStringsFileParse()", "Parse")
    + textArea(2, "originalStrings")
    + "Translated String List<br/>copy parsed string list into Google Translate and paste your result"
    + textArea(2, "translatedStrings")
    + generateButton("parseStringsFileCode")
    + "<br/><br/>Translated String File"
    + textArea(20, "stringOutput");
}

function parseStringsFileParse() {
    let stringsFile = getValue("stringsFile");
    let code = (stringsFile.match(/(?<=<string name=".*">).*(?=<\/string>)/g, "$1") || []).join(" | ");
    code = code.replace(/\\\'/g, "'");
    output(code, "originalStrings");
}

function parseStringsFileCode() {
    let originalStrings = getValue("originalStrings").replace(/ *\| */g, "|").replace(/'/g, "\\'").split("|").filter(v => v !== "");
    
    let translatedStrings = getValue("translatedStrings").replace(/ *\| */g, "|").replace(/'/g, "\\'").split("|").filter(v => v !== "");
    
    if (translatedStrings.length > originalStrings.length) {
        translatedStrings.splice(originalStrings.length);
    }
    let isAllCaps = originalStrings.map(v => !/^[a-z]| [a-z]/.test(v) && / [A-Z]/.test(v));
    
    let stringPairs = translatedStrings.map((v, i) => [originalStrings[i], isAllCaps[i] ? v.toText() : v]);
    let code = getValue("stringsFile");
    
    for (let i of stringPairs) {
        code = code.replace(`>${i[0]}<`, `>${i[1].replace(/ *% *(\d)+ *\$ *(s|d|S|D) */g, (_,a,b) => ` %${a}$${b.toLowerCase()} `).trim()}<`);
    }
    output(code, "stringOutput");
}