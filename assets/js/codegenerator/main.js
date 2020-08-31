function generatorLoadFunction() {
    setUpSelectBoxes();
}

// add tasks to list
function setUpSelectBoxes() {
    let tasks = ["Nav Graph", "Navigate With Bundle", "Checklist", "Room Database", "Instructions Page", "Layout Constraints", "Shared Preferences", "String Translation", "Parse Strings File", "Convert To @string", "Convert To @style", "Game Maker IAP", "API Call", "Radio Group", "RecyclerView Adapter", "Spinner Adapter", "findViewById", "Firebase", "Custom Tab Layout", "Constants File", "Repeated Layout", "ViewModel Test Utility", "Unit Test", "Test Resources", "Hardcoded Strings", "HTML Lists", "HTML Tables", "HTML Forms", "HTML NavBar"];
    tasks.sort();
    tasks.unshift("select");
    for (let i of tasks) {
        let option = document.createElement("option");
        option.text = i;
        document.getElementById("task").add(option);
    }
}

// activate display area when task is chosen
function taskChanged() {
    switch (document.getElementById("task").value) {
        case "Nav Graph": navGraphDisplay(); break;
        case "Navigate With Bundle": navigateWithBundleDisplay(); break;
        case "Checklist": checklistDisplay(); break;
        case "Room Database": roomDatabaseDisplay(); break;
        case "Instructions Page": instructionsPageDisplay(); break;
        case "Layout Constraints": constraintsDisplay(); break;
        case "Shared Preferences": sharedPreferencesDisplay(); break;
        case "String Translation": stringTranslationDisplay(); break;
        case "Parse Strings File": parseStringsFileDisplay(); break;
        case "Convert To @string": convertToStringDisplay(); break;
        case "Convert To @style": convertToStyleDisplay(); break;
        case "API Call": apiCallDisplay(); break;
        case "Game Maker IAP": gameMakerIapDisplay(); break;
        case "Radio Group": radioGroupDisplay(); break;
        case "RecyclerView Adapter": adapterDisplay(); break;
        case "Spinner Adapter": spinnerDisplay(); break;
        case "findViewById": findViewByIdDisplay(); break;
        case "Firebase": firebaseDisplay(); break;
        case "Custom Tab Layout": tabLayoutDisplay(); break;
        case "Constants File": constantsDisplay(); break;
        case "Repeated Layout": repeatedLayoutDisplay(); break;
        case "ViewModel Test Utility": testUtilityDisplay(); break;
        case "Unit Test": unitTestDisplay(); break;
        case "Test Resources": testResourcesDisplay(); break;
        case "Hardcoded Strings": hardcodedStringsDisplay(); break;
        case "HTML Lists": htmlListsDisplay(); break;
        case "HTML Tables": htmlTablesDisplay(); break;
        case "HTML Forms": htmlFormsDisplay(); break;
        case "HTML NavBar": htmlNavbarDisplay(); break;
        case "***": parkerSquareDisplay(); break;    }
}

// generate textarea with custom number of rows
function textArea(n, id) {
    return `<br/><textarea id="${id}" rows="${n}" style="width:100%"></textarea><br/><br/>`;
}

// generate checkbox
function checkBox(id) {
    return `<input type="checkbox" id="${id}"><br/>`;
}

// capitalize first letter of string
String.prototype.capitalize = function() {
    return this === "" ? "" : this[0].toUpperCase() + this.substring(1);
};

// uncapitalize first letter of string
String.prototype.uncapitalize = function() {
    return this === "" ? "" : this[0].toLowerCase() + this.substring(1);
};

// convert to string with first letters of all words capitalized
String.prototype.toText = function() {
	return this === "" ? "" : this.replace(/[ _](\w)/g, (_, a) => " " + a.toUpperCase()).capitalize();
};

// convert string to underscore notation
String.prototype.toUnderscore = function() {
    if (/[a-z]/.test(this)) {
	    return this === "" ? "" : this.replace(/[A-Z]/g, a => " " + a.toLowerCase()).trim().replace(/[ _]+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
    }
    return this.toLowerCase().trim().replace(/[ _]+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
};

// convert string to capital camel case
String.prototype.toCapCamel = function() {
    if (/[a-z]/.test(this)) {
        return this === "" ? "" : this.toText().replace(/[^a-zA-Z0-9]/g, "");
    }
    return this.toLowerCase().replace(/[ _]/g, "").replace(/[^a-zA-Z0-9]/g, "").capitalize();
};

// convert string to camel case
String.prototype.toCamel = function() {
    return this === "" ? "" : this.toCapCamel().uncapitalize();
};

// check whether two strings are equal regardless of case, spaces, and symbols
String.prototype.matches = function(str) {
    return this.toLowerCase().replace(/[^a-zA-Z0-9]/g, "") == str.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
};

// indent all lines of a string
String.prototype.indent = function (n) {
	return this.replace(/^/, " ".repeat(n)).replace(/\n/g, "\n" + " ".repeat(n));
};

// set textarea's text
function output(text, id) {
    docId(id).value = text;
}

// generate button with "Generate Code" as its text that executes a function with no arguments
function generateButton(func) {
    return `<button onClick="${func}()">Generate Code</button>`;
}

// generate button with custom text that executes a function with custom arguments
function customButton(func, text) {
    return `<button onClick="${func}">${text}</button>`;
}

// set the length of an array by removing extra entries or adding empty strings
Array.prototype.setLength = function(l, char) {
    if (this.length == l) {
        return this;
    }
    if (this.length > l) {
        return this.slice(0, l);
    }
    if (this.length < l) {
        return this.concat(new Array(l - this.length).fill(char));
    }
};

// set the length of an array by removing extra entries
Array.prototype.setMaxLength = function(l, char) {
    if (this.length <= l) {
        return this;
    }
    if (this.length > l) {
        return this.slice(0, l);
    }
};

// set the length of an array by adding empty strings
Array.prototype.setMinLength = function(l, char) {
    if (this.length >= l) {
        return this;
    }
    if (this.length < l) {
        return this.concat(new Array(l - this.length).fill(char));
    }
};

// remove spaces from string
String.prototype.noSpace = function() {
    return this.replace(/ /g, "");
};

// remove unnecessary spaces from string and split string by spaces
String.prototype.trimSplit = function() {
    return this.trim().split(/ +/);
};

// remove spaces from each element in array
Array.prototype.noSpace = function() {
    return this.map(v => v.noSpace());
};

// trim each element in array, removing spaces that are beginning, end, or repeating
Array.prototype.trim = function () {
    return this.map(v => v.trim().replace(/ +/g, " "));
};

// split each element in array
Array.prototype.split = function(del) {
    return this.map(v => v.split(del).trim());
};

// remove unnecessary spaces from array and split array by spaces
Array.prototype.trimSplit = function() {
    return this.map(v => v.trimSplit());
};

// remove spaces from string and split
String.prototype.noSpaceSplit = function(del) {
    return this.noSpace().split(del);
};

// remove spaces and split each element in array
Array.prototype.noSpaceSplit = function(del) {
    return this.map(v => v.noSpaceSplit(del));
};

// keep only substring before character
String.prototype.keepBefore = function(del) {
	return this.includes(del) ? this.substring(0, this.indexOf(del)).trim() : this;
};

// keep only substring after character
String.prototype.keepAfter = function(del) {
	return this.includes(del) ? this.substring(this.indexOf(del) + 1).trim() : "";
};

// for each element in array, keep only substring before character
Array.prototype.keepBefore = function (del) {
    return this.map(v => v.keepBefore(del));
};

// for each element in array, keep only substring after character
Array.prototype.keepAfter = function (del) {
    return this.map(v => v.keepAfter(del));
};

// add to array only if doesn't already exist
Array.prototype.pushUnique = function(item) {
    if (!this.includes(item)) {
        this.push(item);
    }
};

// add array to array if array with matching chosen index doesn't already exist
Array.prototype.pushArrayUnique = function(item, index) {
    if (this.filter(v => v.length > index && item.length > index && v[index] == item[index]).length === 0) {
        this.push(item);
    }
};

// show hardcoded string or string resource
String.prototype.toStringResource = function(change) {
    if (!change) {
        return this;
    }
    return `@string/${this.toUnderscore()}`
}

// add character at string locations
String.prototype.addBreaks = function(arr, char) {
    let str = this;
    arr.sort((a, b) => b - a)
    arr = arr.filter(v => v <= str.length);
    while (arr != 0) {
        str = str.substring(0, arr[0]) + char + str.substring(arr.shift());
    }
    return str;
}

// show color resource in layout
function colorResource(str) {
    if (str === "") {
        return "";
    }
    if (/[^0-9a-fA-F]/.test(str)) {
        return `@color/${str}`
    }
    return `#${str}`
}

// shorthand for document.getElementById(id)
function docId(id) {
    return document.getElementById(id);
}

// shorthand for document.getElementById(id).value
function getValue(id) {
    return docId(id).value.trim();
}

// shorthand for document.getElementById(id).value.split("\n")
// used for getting rows from a textarea
function getRows(id) {
    return getValue(id).split("\n").trim().filter(v => v !== "");
}

// shorthand for document.getElementById("generator_display_area")
function displayArea() {
    return docId("generator_display_area");
}

// translate hotkeys for data types
function hotkey(string) {
    switch (string) {
        case "i": return "Int"
        case "s": return "String";
        case "f": return "Float";
        case "b": return "Boolean"
        default: return string;
    }
}

// translate hotkeys for argTypes
function argHotkey(string) {
    switch (string) {
        case "i": return "integer"
        case "s": return "string";
        case "f": return "float";
        case "b": return "boolean"
        default: return string;
    }
}

function fromArgHotKey(string) {
    return (string == "integer" ? "Int" : capitalize(string));
}

// return empty value for dataType
function emptyValue(string) {
    switch (string) {
        case "s": case "String": case "string": return "\"\"";
        case "i": case "f": case "Int": case "Float": case "integer": case "float": return "0";
        case "b": case "Boolean": case "boolean": return "false";
        default: return "";
    }
}

// convert a JSON string to readable text
String.prototype.dateToText = function() {
    let date = new Date(Date.parse(this))
    return `${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()} at ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
}

// submit button clicked
function submit() {
    let text = getValue("textField").trim();
    if (text !== "") {
        writeHighlarious420post(uid, username, text.replace(/\n/g, "|"));
        docId("textField").value = "";
        alert("Thank you for your high thoughts. Feel free to submit another.");
    } else {
        alert("Your high thoughts cannot be blank. Even though it's very likely for your mind to go blank when you're high, or maybe you forgot what you were going to say, allowing blank submissions would cause this site to become cluttered with blank posts. Also, I can't tell if you accidentally clicked \"Submit\" without typing anything or if you actually meant to type nothing.");
    }
}

// redirect from one page to another
function redirect(start, end) {
    let startFull = start.map(v => v.includes("http") ? v : "http://highlarious420.com/" + v);
    let endFull = end.includes("http") ? end : "http://highlarious420.com/" + end;
    if (startFull.includes(window.location.href)) {
        window.location.href = endFull;
    }
}

// show Icon with size and condition
function icon(src, size, condition, onclick) {
    let newSrc = src.includes("*") ? `/assets/images/${src.replace(/\*/g, "")}` : src;
    return condition ? `<img src="${newSrc}" style="width:${size}px;height:${size}px" onclick="${onclick}"/>` : "";
}

// in a [[key, value], [key value]] array, return the value for the specified key
function arrayKeyValue(array, key, ind, def) {
    if (array.some(v => v[0] == key) && ind >= 1) {
        return array.find(v => v[0] == key)[ind];
    } else {
        return def;
    }
}

// in a [[key, value], [key value]] array, increment the value for the specified key
function arrayKeyIncrement(array, key, n, ind, l) {
    if (array.some(v => v[0] == key) && ind < l && ind >= 1) {
        array.find(v => v[0] == key)[ind] += n;
    } else {
        let element = [key, 0].setLength(Math.max(l, 2), 0)
        element[ind] = n
        array.push(element);
    }
}

// in a [[key, value], [key value]] array, set the value for the specified key
function arrayKeySet(array, key, n, ind, l) {
    if (array.some(v => v[0] == key) && ind < l && ind >= 1) {
        array.find(v => v[0] == key)[ind] = n;
    } else {
        let element = [key, 0].setLength(Math.max(l, 2), 0)
        element[ind] = n
        array.push(element);
    }
}