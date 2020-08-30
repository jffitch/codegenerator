function firebaseDisplay() {
    displayArea().innerHTML = "Database Location List<br/>enter as databaseLocation | objectName | keyword | variableList<br/>each database location on new line<br/><br/>for databaseLocation: use \"/\" to indicate a child (\"child1/child2/child3\")<br/>use \"*\" to indicate the name of a Constant instead of a hardcoded string (\"child*\" will become \"Constants.CHILD\")<br/><br/>keyword will be used to generate variable names and function names<br/><br/>for variableList: enter as variable1 dataType1, variable2 dataType2, variable3 dataType3, ...<br/>dataType may use these hotkeys: s String, i Int, f Float, b Boolean"
    + textArea(5, "locations")
    + `Use Separate Functions Class? ${checkBox("useFunctions")}<br/>If checked, the database will be included as a parameter in the functions.`
    + generateButton("firebaseCode")
    + "<br/><br/>Object Class Codes"
    + textArea(20, "objectClassCodes")
    + "Activity Class Code"
    + textArea(20, "activityClassCode");
}

function slashToChild(string) {
    let inner = "";
    if (string.includes("*")) {
        inner = `Constants.${string.replace(/\*/g, "").toUnderscore().toUpperCase()}`;
    } else {
        inner = string;
    }
    return `.child(${inner})`;
}

function firebaseCode() {
    let locations = getRows("locations").split("|").filter(v => v.length == 4).map(v => {
            return {database:v[0].split("/").map(w => slashToChild(w)).join(""),
            object:v[1].toCamel(),
            keyword:v[2].toCamel(),
            variablesList:v[3].split(",").trimSplit().map(w => { return {variable:w[0].toCamel(), dataType:hotkey(w[1])}}),
            variablesInline:v[3].split(",").trimSplit().map(w => `${w[0].toCamel()}: ${hotkey(w[1])}`).join(", ")
            }});
    
    let code = `lateinit var database: DatabaseReference
`;
    let databaseVariable = docId("useFunctions").checked ? ", database: DatabaseReference" : "";
    for (let i of locations) {
        code += `var ${i.object}List = MutableList<${i.object.capitalize()}>()
`;
    }
    code += `
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    
    database = FirebaseDatabase.getInstance().reference
    database.orderByKey().addListenerForSingleValueEvent(itemListener)
}
    
var itemListener: ValueEventListener = object : ValueEventListener {
    override fun onDataChange(dataSnapshot: DataSnapshot) {
        // Get Post object and use the values to update the UI
        addDataToList(dataSnapshot)
    }

    override fun onCancelled(databaseError: DatabaseError) {
        // Getting Item failed, log a message
        Log.w(TAG, "loadItem:onCancelled", databaseError.toException())
    }
}

private fun addDataToList(dataSnapshot: DataSnapshot) {`;
    for (let i of locations) {
        code += `
    val ${i.keyword}s = dataSnapshot${i.database}.children.iterator()
    while (${i.keyword}s.hasNext()) {
        val currentItem = ${i.keyword}s.next()
        val ${i.object} = ${i.object.capitalize()}.create()
        val map = currentItem.getValue() as HashMap<String, Any>
        ${i.object}.id = currentItem.key`;
        for (let j of i.variablesList) {
            code += `
        ${i.object}.${j.variable} = map.get("${j.variable}") as ${j.dataType}?`;
        }
        code += `
        ${i.object}List.add(${i.object})
    }`;
    }
    code += `
}
`;
    for (let i of locations) {
        code += `
fun create${i.keyword.capitalize()}(${i.variablesInline}${databaseVariable}) {
    val newItem = database${i.database}.push()
    val ${i.object} = ${i.object.capitalize()}.create()
    ${i.object}.id = newItem.key`;
        for (let j of i.variablesList) {
            code += `
    ${i.object}.${j.variable} = ${j.variable}`;
        }
        code += `
    newItem.setValue(${i.object})
}

fun update${i.keyword.capitalize()}(itemKey: String, ${i.variablesInline}${databaseVariable}) {
    val itemReference = database${i.database}.child(itemKey)`;
        for (let j of i.variablesList) {
            code += `
    itemReference.child("${j.variable}").setValue(${j.variable})`;
        }
        code += `
}
`;
        for (let j of i.variablesList) {
            code += `
fun update${i.keyword.capitalize()}${j.variable.capitalize()}(itemKey: String, ${j.variable}: ${j.dataType}${databaseVariable}) {
    val itemReference = database${i.database}.child(itemKey)
    itemReference.child("${j.variable}").setValue(${j.variable})
}
`;
        }
        code += `
fun delete${i.keyword.capitalize()}(itemKey: String${databaseVariable}) {
    val itemReference = database${i.database}.child(itemKey)
    itemReference.removeValue()
}
`;
    }
    output(code, "activityClassCode");
    
    code = "";
    for (let i of locations) {
        code += `class ${i.object.capitalize()} {
    companion object Factory {
        fun create(): ${i.object.capitalize()} = ${i.object.capitalize()}()
    }
    var id: String? = null`;
        for (let j of i.variablesList) {
            code += `
    var ${j.variable}: ${j.dataType}? = null`;
        }
        code += `
}


`;
    }
    
    output(code, "objectClassCodes");
}
