function roomDatabaseDisplay() {
    displayArea().innerHTML = "Package Name"
    + textArea(1, "packageName")
    + "For database, DAO, and table names, use the format \"folderName.className\", where the class's location is \"packageName.folderName.className\".<br/><br/>Database Class Name"
    + textArea(1, "databaseClass")
    + "DAO Class Name"
    + textArea(1, "daoClass")
    + "Table Class Name"
    + textArea(1, "tableClass")
    + "Table Columns<br/>use format \"columnName dataType\"<br/>put each column name on a different line<br/>for primary key, put a \"*\" symbol anywhere in the line<br/>datatype can be typed as one letter using these hotkeys: i Int, s String, f Float"
    + textArea(5, "tableColumns")
    + "DAO Default Functions<br/>"
    + customButton("daoDefaultFunctions()", "Generate Default Names")
    + "<br/>enter desired function name for each after the dash"
    + textArea(4, "daoDefaultFunctions")
    + "DAO Custom Functions<br/>enter as \"functionName | returnType | sqlQuery | variableTypes\"<br/>put each function on a different line<br/>variableTypes should be separated by spaces if there are more than one, with one Variable Type for each time \":variable\" appears in SQL query<br/>datatypes (returnType and variableTypes) can be typed as one letter using these hotkeys: i Int, s String, f Float, a List, l LiveData, t TableName<br/>see after field for Favorite Queries"
    + textArea(10, "daoCustomFunctions")
    + "Favorite Queries<br/>Click the button below to generate Favorite Queries after filling out the fields above.<br/>Then, after entering a Function Name and Return Type, click a Favorite Query to add it to the field."
    + "<div id=\"favoriteQueriesDiv\">"
    + customButton("generateFavoriteQueries()", "Generate Favorite Queries")
    + "</div><br/><br/>"
    + generateButton("roomDatabaseCode")
    + "<br/><br/>Database Class Code"
    + textArea(20, "databaseClassCode")
    + "DAO Class Code"
    + textArea(20, "daoClassCode")
    + "Table Class Code"
    + textArea(20, "tableClassCode");
    
    let code = `insert ignore - 
insert replace - 
update - 
delete - `
    output(code, "daoDefaultFunctions");
}

function daoDefaultFunctions() {
    let table = getValue("tableClass").split(".").pop();
    let code = `insert ignore - insert${table}IfNotExists
insert replace - insert${table}
update - update${table}
delete - delete${table}`;
    output(code, "daoDefaultFunctions");
}

function generateFavoriteQueries() {
    let table = getValue("tableClass").split(".").pop();
    let tableColumns = getRows("tableColumns").trim().map(v => v.substring(0, v.indexOf(" ")).replace(/\*/g, ""));
    let code = customButton("generateFavoriteQueries()", "Generate Favorite Queries") + "<br/>"
    + customButton(`addQuery(&quot;SELECT * FROM ${table}&quot;)`, `SELECT * FROM ${table}`) + " ";
    let query = "";
    for (let i of tableColumns) {
        query = `SELECT ${i} FROM ${table}`
        code += customButton(`addQuery(&quot;${query}&quot;)`, query) + " ";
        query = `SELECT * FROM ${table} ORDER BY ${i}`
        code += customButton(`addQuery(&quot;${query}&quot;)`, query) + " ";
        query = `SELECT * FROM ${table} WHERE ${i} = `
        code += customButton(`addQuery(&quot;${query}&quot;)`, query) + " ";
    }
    docId("favoriteQueriesDiv").innerHTML = code;
}

function addQuery(query) {
    output(getValue("daoCustomFunctions") + query, "daoCustomFunctions");
}

function roomDatabaseCode() {
    let tableFolder = getValue("tableClass").replace(/ /g, "").split(".");
    let table = tableFolder.pop();
    tableFolder = tableFolder.join(".");
    if (tableFolder != "") {
        tableFolder = "." + tableFolder
    }
    
    let daoFolder = getValue("daoClass").replace(/ /g, "").split(".");
    let dao = daoFolder.pop();
    daoFolder = daoFolder.join(".");
    if (daoFolder != "") {
        daoFolder = "." + daoFolder
    }
    
    let databaseFolder = getValue("databaseClass").replace(/ /g, "").split(".");
    let database = databaseFolder.pop();
    databaseFolder = databaseFolder.join(".");
    if (databaseFolder != "") {
        databaseFolder = "." + databaseFolder
    }
    
    let packageName = getValue("packageName");
    
    let tableColumns = getRows("tableColumns").trim().map(v => [v.substring(0, v.indexOf(" ")).replace(/\*/g, ""),
        v.substring(v.lastIndexOf(" ")).replace(/\*/g, "").trim(),
        v.includes("*")]);
    for (let i of tableColumns) {
        switch(i[1]) {
            case "i": i[1] = "Int"; break;
            case "s": i[1] = "String"; break;
            case "f": i[1] = "Float"; break;
        }
    }
    
    let daoDefault = getRows("daoDefaultFunctions").noSpaceSplit("-").filter(v => v.length == 2 && ["insertignore", "insertreplace", "update", "delete"].includes(v[0]));
    
    let daoCustom = getRows("daoCustomFunctions").split("|").filter(v => [3, 4].includes(v.length)).map(v => [noSpace(v[0]),
        noSpace(v[1]),
        v[2].trim(),
        v.length == 4 ? trimSplit(v[3]) : [],
        (v[2].match(/:\w+/g) || []).map(w => w.substring(1))]);
        
    for (let i of daoCustom) {
        switch(i[1]) {
            case "i": i[1] = "Int"; break;
            case "s": i[1] = "String"; break;
            case "f": i[1] = "Float"; break;
            case "t": i[1] = table; break;
            case "a": i[1] = `List<${table}>`; break;
            case "l": i[1] = `LiveData<List<${table}>>`; break;
        }
        
        i[3] = i[3].map(v => {
            switch(v) {
                case "i": return "Int"
                case "s": return "String";
                case "f": return "Float";
                default: return v;
            }
        })
    }
    
    // database output
    let addCode = "";
    let code = `package ${packageName}${databaseFolder}

import android.content.Context
import androidx.room.*
import ${packageName}${daoFolder}.${dao}
import ${packageName}${tableFolder}.${table}

@Database(entities = [${table}::class], version = 1, exportSchema = false)
abstract class ${database} : RoomDatabase() {
    abstract fun ${dao.uncapitalize()}(): ${dao}

    companion object {
        private var INSTANCE: ${database}? = null
        var TEST_MODE = false

        fun getDataBase(context: Context): ${database}? {
            if (INSTANCE == null) {
                synchronized(${database}::class) {
                    if (TEST_MODE) {
                        INSTANCE = Room.inMemoryDatabaseBuilder(context.applicationContext, ${database}::class.java)
                            .allowMainThreadQueries()
                            .build()
                    } else {
                        INSTANCE = Room.databaseBuilder(context.applicationContext, ${database}::class.java, "myDB")
                            .build()
                    }
                }
            }
            return INSTANCE
        }

        fun destroyDataBase() {
            INSTANCE = null
        }
    }
}`;

    output(code, "databaseClassCode");
    
    // DAO output
    code = `package ${packageName}${daoFolder}

import androidx.lifecycle.LiveData
import androidx.room.*
import ${packageName}${tableFolder}.${table}

@Dao
interface MoodsDao{`

    for (let i of daoDefault) {
        switch (i[0]) {
            case "insertignore" : {
                code += `
    @Insert(onConflict = OnConflictStrategy.IGNORE)`; break;
            }
            case "insertreplace" : {
                code += `
    @Insert(onConflict = OnConflictStrategy.REPLACE)`; break;
            }
            case "update" : {
                code += `
    @Update`; break;
            }
            case "delete" : {
                code += `
    @Delete`; break;
            }
        }
        code += `
    fun ${i[1]}(${table.uncapitalize()}: ${table})
`;
    }
    
    for (let i of daoCustom) {
        code += `
    @Query("${i[2]}")
    fun ${i[0]}(`;
    addCode = "";
    for (let j=0; j<Math.min(i[3].length, i[4].length); j++) {
        addCode += `, ${i[4][j]}: ${i[3][j]}`;
    }
    addCode = addCode.replace(", ", "");
    code += `${addCode}): ${i[1]}
`;
    }
    
    code += "}";
    output(code, "daoClassCode");
    
    // table output
    code = `package ${packageName}${tableFolder}

import androidx.room.*

@Entity
data class ${table}(`
    for (let i of tableColumns) {
        code += ","
        if (i[2]) {
            code += `
    @PrimaryKey`;
        }
        code += `
    val ${i[0]}: ${i[1]}`;
    }
    code += "\n)"
    output(code.replace(",", ""), "tableClassCode");
}