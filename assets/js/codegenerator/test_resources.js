function testResourcesDisplay() {
    displayArea().innerHTML = "Paste your XML code from your resource files."
    + textArea(20, "resources")
    + generateButton("testResourcesCode")
    + textArea(20, "output");
}

function testResourcesCode() {
    let resourceList = getRows("resources");
    let resourceTypes = [];
    let resources = [];
    for (let i of resourceList) {
        let resource = {};
        resource.type = (i.match(/(?<=<)\w+/) || [""])[0];
        resource.name = (i.match(/(?<=name=")[^"]*(?=")/) || [""])[0];
        resource.value = (i.match(/(?<=>)[^<]*(?=<)/) || [""])[0].replace(/\\'/g, "'").replace(/"/g, "\\\"").replace(/\$/g, "\\$");
        if (![resource.type, resource.name, resource.value].includes("")) {
            resources.push(resource);
            resourceTypes.pushUnique(resource.type);
        }
    }
    let code = "class TestResources : Resources(null, null, null) {";
    for (let i of resourceTypes) {
        code += `
    override fun get${i.capitalize()}(id: Int): String {
        try {
            return when (id) {`;
        for (let j of resources.filter(v => v.type == i)) {
            code += `
                R.${i}.${j.name} -> "${j.value}"`;
        }
        code += `
                else -> ""
            }
        } catch (e: NotFoundException) {
            return ""
        }
    }
`;
    }
    code += "\n}";
    output(code, "output");
}