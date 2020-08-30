function htmlListsDisplay() {
    displayArea().innerHTML = "List Items<br/>Put each item on new line.<br/>Begin line without + or - to continue list from previous line.<br/>Begin line with + to nest unordered list.<br/>Begin line with +1, +a, +A, +i, or +I to nest ordered list.<br/>Begin line with /number (/1, /2, /3, etc) to assign custom value to item.<br/>Begin line with - to end list from previous line.<br/>Begin line with multiple - symbols (--, ---, etc) to end multiple lists.<br/>Begin line with -+ (or --+, ---+, etc) to end list then immediately begin another"
    + textArea(20, "listItems")
    + generateButton("htmlListsCode")
    + textArea(20, "output");
    
    output("Coming Soon", "output");
}

function htmlListsCode() {
    // get rows from input
    let listItems = getRows("listItems");
    
    // initiate object list
    // objects in list will have listChange, typeChange, valueChange, and text
    let list = [];
    
    // iterate through rows to populate object list
    for (let i of listItems) {
        // set listChange to regular expression matching /\-*+?/, meaning any number of - and 0 or 1 +
        let listChange = (i.match(/^\-*\+?/) || [""])[0];
        // set typeChange to match character after +
        // if no +, no typeChange
        let typeChange = (i.match(/(?<=^\-*\+)[1aiAI]/) || [""])[0];
        //remove listChange and typeChange characters
        i = i.replace(/^\-*(\+[1aiAI]?)?/, "").trim();
        // set valueChange if begin with slash
        let valueChange = (i.match(/(?<=^\/)\-?\d+/) || [""])[0];
        // remove valueChange characters
        i = i.replace(/^\/\-?\d+/, "").trim();
        // text is what remains
        // create object and push to list
        list.push({listChange:listChange, typeChange:typeChange, valueChange:valueChange, text:i});
    }
    
    // initialize nestedLists to keep track of which lists are being populated
    let nestedLists = [];
    // check whether this is first item on list
    let isFirstItem = false;
    // initialize output code at ""
    let code = "";
    
    // iterate through object list
    for (let i of list) {
        // for listChange, iterate through each character until none left
        while (i.listChange !== "") {
            // if nestedList is empty, the only possible option is to add, so set to +
            if (nestedLists.length === 0) {
                i.listChange = "+";
            }
            // if listChange has -, end li and list
            // remove most recent item from nestedLists
            // remove a minus sign from listChange
            if (i.listChange.includes("-")) {
                code += `</li>
${" ".repeat(8 * nestedLists.length - 8)}</${nestedLists[0].tag}>
${" ".repeat(Math.max(8 * nestedLists.length - 12, 0))}`;
                nestedLists.shift();
                i.listChange = i.listChange.replace("-", "");
            }
            // if nestedList is empty, the only possible option is to add, so set to +
            if (nestedLists.length === 0) {
                i.listChange = "+";
            }
            // if listChange is +, a list needs to be added
            if (i.listChange == "+") {
                // next item added will be first item on list, set isFirstItem to true
                isFirstItem = true;
                // tag is ul if typeChange is empty or invalid
                // tag is ol if typeChange is valid, with typeChange being used as type
                // add to nestedLists
                let tag = "ul";
                let type = "";
                if (["1", "a", "i", "A", "I"].includes(i.typeChange)) {
                    type = i.typeChange;
                    tag = "ol";
                }
                nestedLists.unshift({tag:tag, type:type, value:0});
                code += `
${" ".repeat(nestedLists.length * 8 - 8)}<${tag}`;
                code += ["", "1"].includes(type) ? ">" : ` type="${type}">`;
                i.listChange = "";
            }
        }
        code += isFirstItem ? "" : "</li>";
        code += `
${" ".repeat(8 * nestedLists.length - 4)}`;
        isFirstItem = false;
        if (i.valueChange === "") {
            nestedLists[0].value++;
            code += `<li>${i.text}`;
        } else {
            nestedLists[0].value = parseInt(i.valueChange);
            code += `<li value="${i.valueChange}">${i.text}`;
        }
    }
    
    while(nestedLists.length > 0) {
        code += `</li>
${" ".repeat(8 * nestedLists.length - 8)}</${nestedLists[0].tag}>
${" ".repeat(Math.max(8 * nestedLists.length - 12, 0))}`;
        nestedLists.shift();
    }
    
    output(code.replace(/^[ \n]+/, ""), "output");
}