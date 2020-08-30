function unitTestDisplay() {
    displayArea().innerHTML = "Function List<br/>enter function name on its own line, then enter each example on its own line<br/>for function name, if it's called using \"function(value)\" then enter \"functionName*\", if it's called using \"value.function()\" then enter \"*functionName\"<br/>variables will be startValue and endValue by default, you may add \"|startValueName|endValueName\" to use other variable names<br/>enter examples as \"startValue|endValue\"<br/>examples are shown"
    + textArea(20, "functionList")
    + generateButton("unitTestCode")
    + textArea(20, "output");
    
    docId("functionList").value = `*addThree
5 | 8
10 | 13
-2 | 1
*spellAsWord | number | word
6 | "six"
9 | "nine"
sqrt*
144 | 12
25 | 5
81 | 9
dayOfWeek* | number | day
2 | "Tuesday"`;
}

function unitTestCode() {
    let functionList = getValue("functionList").split(/\n(?=\w*\*)/).split("\n").map(v => v.split("|"));
    
    let functionName = "";
    let startValueName = "";
    let endValueName = "";
    let isStart = false;
    let code = "";
    let count = 0;
    
    for (let i of functionList) {
        functionName = i[0][0].replace(/\*/g, "").toCamel();
        startValueName = i[0].length >= 2 ? i[0][1].toCamel() : "startValue";
        endValueName = i[0].length >= 3 ? i[0][2].toCamel() : "endValue";
        isStart = i[0][0].startsWith("*");
        count = 0;
        
        for (let j of i.slice(1).filter(v => v.length == 2)) {
            count++;
            code += `@Test
fun ${functionName}Test${i.length == 2 ? "" : count}() {
    val ${startValueName} = ${j[0]}
    val ${endValueName}Expected = ${j[1]}
    val ${endValueName}Actual = ${isStart ? `${startValueName}.${functionName}()` : `${functionName}(${startValueName})`}
    assertEquals(${endValueName}Expected, ${endValueName}Actual)
}

`;
        }
    }
    output(code, "output");
}