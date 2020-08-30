function htmlFormsDisplay() {
    displayArea().innerHTML = "Form Elements<br/>Put each element on new line.<br/>Most elements should be in the form \"type name\".<br/><br/>Enter type using 2-letter hotkeys: button (bu), checkbox (cb), color (co), date (da), datetime-local (dt), email (em), file (fi), hidden (hi), image (im), month (mo), number (nu), password (pw), radio (rd), range (rg), search (se), select (sl), submit (su), tel (tl), text (tx), time (ti), url (ur), week (wk).<br/><br/>More information about each input type can be found below."
    + textArea(20, "formElements")
    + "<b>Dates</b><br/>For date, enter \"da name | startDate, minDate, maxDate\", with startDate, minDate, and maxDate being in yyyyMMdd form. Symbols in dates are optional. To skip one of the dates, enter any nondigit symbol in its place.<br/>For datetime-local, do same as date but with \"dt\" and enter dates in yyyyMMddHHmm form.<br/>For month, do same as date but with \"mo\" and enter dates in yyyyMM form.<br/>For time, do same as date but with \"ti\" and enter times in HHmm form.<br/>For week, do same as date but with \"wk\" and enter dates in yyyyww form.<br/><b>Numbers</b><br/>For number, enter \"nu name | start min max\". To skip one of the numbers, enter any nondigit symbol except \"-\" in its place.<br/>For range, do same as number but with \"rg\".<br/><b>Selectors</b><br/>For radio, enter \"rd name | option1 | option2 | option3\".<br/>For select, do same as radio but with \"sl\".<br/><b>Others</b><br/>For color, enter \"co name | startColor\", with startColor being a 6-digit base-16 code.<br/>For email, enter \"em name | placeholder\".<br/>For url, enter \"ur name | placeholder\".<br/>For file, enter \"fi name | acceptedFileTypes\", with acceptedFileTypes entered as \"type1 type2 type3\". For example, \"fi Select File | doc docx pdf\".<br/><br/>"
    + generateButton("htmlFormsCode")
    + "<br/>Code provides a general outline. You may have to alter the code in order to do exactly what you want."
    + textArea(20, "output");
}

function htmlFormsCode() {
    let formElements = getRows("formElements");
    let code = "<form>";
    for (let i of formElements) {
        code += formElement(i) + "<br/>";
    }
    code += "\n</form>";
    output (code, "output");
}

function formElement(line) {
    let element = line.substring(0, 2);
    let info = line.substring(2).split("|").trim().setMinLength(2, "");
    switch(element) {
        case "bu": return `
    <input type="button" id="${info[0].toUnderscore()}" value="${info[0]}">`;
        case "cb": return `
    <label for="${info[0].toUnderscore()}">${info[0]}</label>
    <input type="checkbox" id="${info[0].toUnderscore()}" name="${info[0].toUnderscore()}"`;
        case "co": return `
    <label for="${info[0].toUnderscore()}">${info[0]}</label>
    <input type="color" id="${info[0].toUnderscore()}" name="${info[0].toUnderscore()}"${info[1] === "" ? "" : ` value="#${info[1]}"`}>`;
        case "da": return `
    <label for="${info[0].toUnderscore()}">${info[0]}</label>
    <input type="date" id="${info[0].toUnderscore()}" name="${info[0].toUnderscore()}"${dateInputValues(info[1], "da")}>`;
        case "dt": return `
    <label for="${info[0].toUnderscore()}">${info[0]}</label>
    <input type="datetime-local" id="${info[0].toUnderscore()}" name="${info[0].toUnderscore()}"${dateInputValues(info[1], "dt")}>`;
        case "em": return `
    <label for="${info[0].toUnderscore()}">${info[0]}</label>
    <input type="email" id="${info[0].toUnderscore()}" name="${info[0].toUnderscore()}" placeholder="${info[1] === "" ? "abc@example.com" : info[1]}"}>`;
        case "fi": return `
    <label for="${info[0].toUnderscore()}">${info[0]}</label>
    <input type="file" id="${info[0].toUnderscore()}" name="${info[0].toUnderscore()}"${info[1] === "" ? "" : ` accept="${info[1].replace(/\./g, " ").trimSplit().map(v => "." + v).join(",")}"`}>`;
        case "hi": return `
    <input type="hidden" id="${info[0].toUnderscore()}" name="${info[0].toUnderscore()}">`;
        case "im": return `
    <input type="image" id="${info[0].toUnderscore()}" alt="${info[0]}">`;
        case "mo": return `
    <label for="${info[0].toUnderscore()}">${info[0]}</label>
    <input type="month" id="${info[0].toUnderscore()}" name="${info[0].toUnderscore()}"${dateInputValues(info[1], "mo")}>`;
        case "nu": return `
    <label for="${info[0].toUnderscore()}">${info[0]}</label>
    <input type="number" id="${info[0].toUnderscore()}" name="${info[0].toUnderscore()}"${numberInputValues(info[1])}>`;
        case "pw": return `
    <label for="${info[0].toUnderscore()}">${info[0]}</label>
    <input type="password" id="${info[0].toUnderscore()}" name="${info[0].toUnderscore()}">`;
        case "rd": return `
    <p>${info[0]}</p>${info.slice(1).map(v => radioInputValues(v, info[0])).join("<br/>")}`;
        case "rg": return `
    <label for="${info[0].toUnderscore()}">${info[0]}</label>
    <input type="range" id="${info[0].toUnderscore()}" name="${info[0].toUnderscore()}"${numberInputValues(info[1])}>`;
        case "se": return `
    <label for="${info[0].toUnderscore()}">${info[0]}</label>
    <input type="search" id="${info[0].toUnderscore()}" name="${info[0].toUnderscore()}" placeholder="${info[0]}"}>`;
        case "sl": return `
    <label for="${info[0].toUnderscore()}">${info[0]}</label>
    <select id="${info[0].toUnderscore()}" name="${info[0].toUnderscore()}">${info.slice(1).map(v => `
        <option value="${v.toUnderscore()}">${v}</option>`).join("")}
    </select>`;
        case "su": return `
    <input type="submit" id="${info[0].toUnderscore()}" value="${info[0]}">`;
        case "tl": return `
    <label for="${info[0].toUnderscore()}">${info[0]}</label>
    <input type="tel" id="${info[0].toUnderscore()}" name="${info[0].toUnderscore()}" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" placeholder="555-555-1234"}>`;
        case "tx": return `
    <label for="${info[0].toUnderscore()}">${info[0]}</label>
    <input type="text" id="${info[0].toUnderscore()}" name="${info[0].toUnderscore()}" placeholder="${info[0]}">`;
        case "ti": return `
    <label for="${info[0].toUnderscore()}">${info[0]}</label>
    <input type="time" id="${info[0].toUnderscore()}" name="${info[0].toUnderscore()}"${dateInputValues(info[1], "ti")}>`;
        case "ur": return `
    <label for="${info[0].toUnderscore()}">${info[0]}</label>
    <input type="url" id="${info[0].toUnderscore()}" name="${info[0].toUnderscore()}" placeholder="${info[1] === "" ? "example.com" : info[1]}"}>`;
        case "wk": return `
    <label for="${info[0].toUnderscore()}">${info[0]}</label>
    <input type="week" id="${info[0].toUnderscore()}" name="${info[0].toUnderscore()}"${dateInputValues(info[1], "wk")}>`;
        default: return "";
    }
}

function dateInputValues(str, type) {
    let arr = str.trimSplit().setLength(3, "").map(v => v.replace(/\D/g, ""));
    return dateInputValue(arr[0], type, "value") + dateInputValue(arr[1], type, "min") + dateInputValue(arr[2], type, "max");
}

function dateInputValue(str, type, tag) {
    if (str === "") {
        return "";
    }
    let tagValue = "";
    switch (type) {
        case "da": {
            tagValue = str.padEnd(8, "0").substring(0, 8).addBreaks([4, 6], "-");
            break;
        }
        case "dt": {
            tagValue = str.padEnd(12, "0").substring(0, 12).addBreaks([10], ":").addBreaks([8], "T").addBreaks([4, 6], "-");
            break;
        }
        case "ti": {
            tagValue = str.padEnd(4, "0").substring(0, 4).addBreaks([2], ":");
            break;
        }
        case "mo": {
            tagValue = str.padEnd(6, "0").substring(0, 6).addBreaks([4], "-");
            break;
        }
        case "wk": {
            tagValue = str.padEnd(6, "0").substring(0, 6).addBreaks([4], "-W");
            break;
        }
    }
    return ` ${tag}="${tagValue}"`;
}

function numberInputValues(str) {
    let arr = str.trimSplit().setLength(3, "").map(v => v.replace(/[^0-9\-]/g, ""));
    let valuePart = arr[0] === "" ? "" : ` value="${arr[0]}"`;
    let minPart = arr[1] === "" ? "" : ` min="${arr[1]}"`;
    let maxPart = arr[2] === "" ? "" : ` max="${arr[2]}"`;
    return valuePart + minPart + maxPart;
}

function radioInputValues(button, group) {
    return `
    <label for="${button.toUnderscore()}">${button}</label>
    <input type="radio" id="${button.toUnderscore()}" name="${group.toUnderscore()}" value="${button.toUnderscore()}">`;
}