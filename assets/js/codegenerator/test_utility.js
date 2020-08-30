function testUtilityDisplay() {
    displayArea().innerHTML = "Class Code<br/>copy and paste your code for the class that you'd like to create a Test Utility for"
    + textArea(20, "classCode")
    + generateButton("testUtilityCode")
    + textArea(20, "output");
}

function testUtilityCode() {
    let classCode = getValue("classCode");
    let className = (classCode.match(/(?<=class +)\w+/) || [""])[0];
    let lines = classCode.match(/va[rl] +\w+ *: *[\w<>]+/g) || [];
    let variables = lines.map(v => [(v.match(/(?<=va[rl] +)\w+/) || [""])[0], (v.match(/[\w<>]+$/) || [""])[0]]);
    code = `object TestUtility {
    fun getTesting${className}ListOfSize(size: Int): List<${className}> {
        val list = ArrayList<${className}>()
        for (i in 0 until size) {
            val item = ${className}(`;
    for (let i of variables) {
        if (["String", "Int", "Float", "Double", "Boolean"].includes(i[1])) {
            code += `
                ${i[0]} = generateRandom${i[1]}(),`;
        } else if (i[1].startsWith("List")) {
            code += `
                ${i[0]} = ${["String", "Int", "Float", "Double", "Boolean"].some(v => i[1] == `List<${v}>`) ? "generateRandom" : "getTesting"}${i[1].substring(5, i[1].length - 1)}ListOfSize(5),`;
        } else {
            code += `
                ${i[0]} = getTesting${i[1]}ListOfSize(1)[0],`;
        }
    }
    code = code.slice(0, -1);
    code += `
            )
            list.add(item)
        }
        return list
    }`;
    
    for (let i of ["String", "Int", "Float", "Double", "Boolean"]) {
        if (variables.some(v => v[1] == `List<${i}>`)) {
            code += `
            
    fun generateRandom${i}ListOfSize(size: Int) : List<${i}> {
        val list = ArrayList<${i}>()
        for (i in 0 until size) {
            val item = generateRandom${i}()
            list.add(item)
        }
        return list
    }`;
        }
    }
    
    if (variables.some(v => v[1].includes("String"))) {
        code += `
        
    fun generateRandomString(): String {
        return UUID.randomUUID().toString()
    }`;
    }
    
    if (variables.some(v => v[1].includes("Boolean"))) {
        code += `
        
    fun generateRandomBoolean(): Boolean {
        return Math.random() > .5
    }`;
    }
    
    for (let i of ["Int", "Float"]) {
        if (variables.some(v => v[1].includes(i))) {
            code += `
        
    fun generateRandom${i}(): ${i} {
        return (Math.random() * 100).to${i}()
    }`;
        }
    }
    
    if (variables.some(v => v[1].includes("Double"))) {
        code += `
        
    fun generateRandomDouble(): Double {
        return Math.random() * 100
    }`;
    }
    code += `
}`;
    output(code, "output");
}