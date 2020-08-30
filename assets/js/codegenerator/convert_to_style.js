function convertToStyleDisplay() {
    displayArea().innerHTML = "Paste your XML file here."
    + textArea(20, "xmlFile")
    + "Style List<br/>enter the styles and attributes in the order as shown<br/>styles can be entered as '*styleName' or '&lt;style name=\"styleName\"&gt;'<br/>attributes can be entered as 'attributeName attributeValue', '&lt;item name=\"attributeName\"&gt;attributeValue&lt;/item&gt;', or 'attributeName=\"attributeValue\"'<br/>all views that contain all attributes and corresponding values in a style will be converted to the @style notation<br/>if you wish to use the @style notation when one of the values doesn't match, put an asterisk after the value"
    + textArea(20, "styleList")
    + "attribute names can use these hotkeys: lw layout_width, lh layout_height, txs textSize, txst textStyle, txc textColor, gv gravity, bg background, el elevation, th theme, vi visibility, or orientation, mg layout_margin (add t, b, l, r, s, e, h, v for individual directions), pd padding (add t, b, l, r, s, e, h, v for individual directions), ctt constraintTop_toTopOf (change each t to t, b, l, r, s, e for top, bottom, left, right, start, end)<br/>"
    + generateButton("convertToStyleCode")
    + "<br/>New XML File"
    + textArea(20, "newFile")
    + "styles file"
    + textArea(20, "styles");
    
    let code = `*Style1
Attribute1 Value1
Attribute2 Value2
Attribute3 Value3
*Style2
Attribute4 Value4
Attribute5 Value5`;
    output(code, "styleList");
}

function convertToStyleCode() {
    let viewTags = getValue("xmlFile").split(/(?<=\>) *\n/);
    let viewAttrs = viewTags.map(v => v.includes("</") ? [] : v.replace(/<\S*/, "").replace(/\/*>/, "").split("\n").map(w => w.trim()).filter(w => w !== ""));
    let styleList = getRows("styleList").trim().filter(v => v !== "");
    let styleArray = [];
    let name = "";
    let value = "";
    for (let i of styleList.filter(v => !v.startsWith("</"))) {
        if (i.startsWith("*")) {
            styleArray.push([i.substring(1).toUnderscore(), []]);
            continue;
        }
        if (i.startsWith("<style")) {
            styleArray.push([i.substring(i.indexOf('"') + 1, i.lastIndexOf('"')).toUnderscore(), []]);
            continue;
        }
        if (styleArray.length === 0) {
            continue;
        }
        styleArray[styleArray.length - 1][1].push(i.replace(/(<item name)*=*"/g, " ").replace("</item>", "").replace(">", "").trim().split(/ +/g));
    }
    styleArray = styleArray.filter(v => v[1].length !== 0);
    for (let i of styleArray) {
        i.push(i[1].map(v => `${attrHotKey(v[0])}="${v[1]}"`));
    }
    viewAttrs = viewAttrs.map(i => {
        for (let j of styleArray) {
            if (j[2].some(v => i.includes(v.replace(/\*/g, ""))) && j[2].every(v => i.some(w => v.includes("*") && w.startsWith(v.replace(/\*/g, "").split('"')[0]) || v == w))) {
                i = i.filter(v => j[2].every(w => v != w.replace(/\*/g, "")));
                i.unshift(`style="@style/${j[0]}"`);
            }
        }
        return i;
    });
    
    viewTags = viewTags.map((v, i) => {
        for (let j of viewAttrs[i]) {
            v = v.replace(/ [^ \*]*".*"/, " *" + j.replace(/\*/g, ""));
        }
        v = v.replace(/\n[^\*]*".*"/g, "").replace(/\*/g, "");
        return v;
    });
    output(viewTags.join("\n").replace(/\*/g, ""), "newFile");
    
    let code = "";
    for (let i of styleArray) {
        code += `<style name="${i[0]}">
`;
        for (let j of i[1]) {
            code += `    <item name="${attrHotKey(j[0].replace(/\*/g, ""))}">${j[1].replace(/\*/g, "")}</item>
`;
        }
        code += `</style>
`;
    }
    output(code, "styles");
}

function attrHotKey(str) {
    switch (str) {
        case "lw": return "android:layout_width";
        case "lh": return "android:layout_height";
        case "txs": return "android:textSize";
        case "txst": return "android:textStyle";
        case "txc": return "android:textColor";
        case "gv": return "android:gravity";
        case "bg": return "android:background";
        case "el": return "android:elevation";
        case "th": return "android:theme";
        case "vi": return "android:visibility";
        case "or": return "android:orientation";
        case "mg": return "android:layout_margin";
        case "mgt": return "android:layout_marginTop";
        case "mgb": return "android:layout_marginBottom";
        case "mgl": return "android:layout_marginLeft";
        case "mgr": return "android:layout_marginRight";
        case "mgs": return "android:layout_marginStart";
        case "mge": return "android:layout_marginEnd";
        case "mgh": return "android:layout_marginHorizontal";
        case "mgv": return "android:layout_marginVertical";
        case "pd": return "android:padding";
        case "pdt": return "android:paddingTop";
        case "pdb": return "android:paddingBottom";
        case "pdl": return "android:paddingLeft";
        case "pdr": return "android:paddingRight";
        case "pds": return "android:paddingStart";
        case "pde": return "android:paddingEnd";
        case "pdh": return "android:paddingHorizontal";
        case "pdv": return "android:paddingVertical";
        case "ctt": return "app:layout_constraintTop_toTopOf";
        case "cbb": return "app:layout_constraintBottom_toBottomOf";
        case "cll": return "app:layout_constraintLeft_toLeftOf";
        case "crr": return "app:layout_constraintRight_toRightOf";
        case "css": return "app:layout_constraintStart_toStartOf";
        case "cee": return "app:layout_constraintEnd_toEndOf";
        case "ctb": return "app:layout_constraintTop_toBottomOf";
        case "cbt": return "app:layout_constraintBottom_toTopOf";
        case "clr": return "app:layout_constraintLeft_toRightOf";
        case "crl": return "app:layout_constraintRight_toLeftOf";
        case "cse": return "app:layout_constraintStart_toEndOf";
        case "ces": return "app:layout_constraintEnd_toStartOf";
        default: return str;
    }
}