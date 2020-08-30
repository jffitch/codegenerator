function stringTranslationDisplay() {
    displayArea().innerHTML = "String List<br/>separate multiple strings with \"|\""
    + textArea(2, "originalStrings")
    + "Translated String List<br/>copy String List into Google Translate and paste your result"
    + textArea(2, "translatedStrings")
    + generateButton("stringTranslationCode")
    + "<br/><br/>String File"
    + textArea(20, "stringOutput")
    + "Translated String File"
    + textArea(20, "translatedOutput");
}

function stringTranslationCode() {
    let originalStrings = getValue("originalStrings").replace(/\'/g, "\\'").replace(/ *\| */g, "|").split("|").filter(v => v !== "");
    
    let translatedStrings = getValue("translatedStrings").replace(/ *\| */g, "|").replace(/'/g, "\\'").split("|").filter(v => v !== "");
    
    if (translatedStrings.length > originalStrings.length) {
        translatedStrings.splice(originalStrings.length);
    }
    let isAllCaps = originalStrings.map(v => !/^[a-z]| [a-z]/.test(v) && / [A-Z]/.test(v));
    
    translatedStrings = translatedStrings.map((v, i) => [isAllCaps[i] ? v.toText() : v, originalStrings[i]]);
    
    let code = "";
    for (let i of originalStrings) {
        code += `<string name="${i.toUnderscore()}">${i}</string>
`;
    }
    output(code, "stringOutput");
    
    code = "";
    
    for (let i of translatedStrings) {
        code += `<string name="${i[1].toUnderscore()}">${i[0]}</string>
`;
    }
    
    output(code, "translatedOutput");
}