function constraintsDisplay() {
    displayArea().innerHTML = "View List<br/>enter as \"viewId, viewType, viewWidth, viewHeight, constraintTop, constraintBottom, constraintLeft, constraintRight\"<br/><br/>viewType can use these hotkeys: tv TextView, iv ImageView, ivc ImageView (centerCrop), et EditText, bu Button, sp Spinner, cb CheckBox, rg RadioGroup, wv WebView, rv RecyclerView, sw Switch, mv GoogleMaps MapView, in include, ll LinearLayout, llv LinearLayout (vertical), llh LinearLayout (horizontal), rl RelativeLayout, cl ConstraintLayout<br/><br/>you may add b, i, bi, or ib to the end of tv, bu, or et to indicate bold or italic, and a number to indicate font size (for example, \"tvb30\" would be a bold TextView with 30 font size, and \"bubi8\" would be a bold italic Button with 8 font size)<br/><br/>viewWidth and viewHeight can be a number, w or c for wrap_content, m or p for match_parent, f for all remaining space<br/>can be entered without comma separator if both are m, p, w, c, or f (for example: mm, mw, cp, mf, fw, ...)<br/><br/>leave a constraint blank(using the comma separator but nothing between the commas) for unused constraints<br/>constraints can be either p for parent or a number corresponding to the row on this list (with 0 being the first row)<br/constraints to another view are on the outside by default, use an asterisk if you wish to constrain to the inside of a view (for example, 1*)<br/>top and bottom constraints can be combined using these hotkeys: c parent center, t parent top only, b parent bottom only, s chain start, m chain middle, e chain end<br/>left and right constraints can be combined using these hotkeys: c parent center, l parent left only, r parent right only, s chain start, m chain middle, e chain end<br/>chain start constrains to parent and next item on list, chain middle constrains to previous and next items on list, chain end constrains to previous item on list and parent<br/>all four constraints can also be combined with just c for vertical and horizontal center<br/>add \"m\" and a number to add a margin (\"pm20\" will constrain to parent with 20 margin)"
    + textArea(10, "viewList")
    + generateButton("constraintsCode")
    + textArea(20, "output");
}

function constraintsCode() {
    let viewList = getRows("viewList").split(",");
    let margin = "";
    for (const [n, i] of viewList.entries()) {
        if (i.length >= 3 && i[2].length == 2 && i[2].split("").every(v => "wcmpf".includes(v))) {
            i.splice(2, 1, i[2][0], i[2][1]);
        }
        if (i.length == 5 && i[4][0] == "c") {
            margin = i[4].substring(1);
            i.splice(4, 1, `p${margin}`, `p${margin}`, `p${margin}`, `p${margin}`);
            continue;
        }
        if (i.length >= 6 && i[4] === "" && "clrsme".split("").some(v => i[5].startsWith(v))) {
            i.splice(4, 0, "");
        }
        if (i.length >= 5) {
            margin = i[4].substring(1);
            switch (i[4][0]) {
                case "c": i.splice(4, 1, `p${margin}`, `p${margin}`); break;
                case "t": i.splice(4, 1, `p${margin}`, ""); break;
                case "b": i.splice(4, 1, "", `p${margin}`); break;
                case "s": i.splice(4, 1, `p${margin}`, n < viewList.length - 1 ? (n+1).toString() + margin : `p${margin}`); break;
                case "m": i.splice(4, 1, n > 0 ? (n-1).toString() + margin : `p${margin}`, n < viewList.length - 1 ? (n+1).toString() + margin : `p${margin}`); break;
                case "e": i.splice(4, 1, n > 0 ? (n-1).toString() + margin : `p${margin}`, `p${margin}`); break;
            }
        }
        if (i.length >= 7) {
            margin = i[6].substring(1);
            switch (i[6][0]) {
                case "c": i.splice(6, 1, `p${margin}`, `p${margin}`); break;
                case "l": i.splice(6, 1, `p${margin}`, ""); break;
                case "r": i.splice(6, 1, "", `p${margin}`); break;
                case "s": i.splice(6, 1, `p${margin}`, n < viewList.length - 1 ? (n+1).toString() + margin : `p${margin}`); break;
                case "m": i.splice(6, 1, n > 0 ? (n-1).toString() + margin : `p${margin}`, n < viewList.length - 1 ? (n+1).toString() + margin : `p${margin}`); break;
                case "e": i.splice(6, 1, n > 0 ? (n-1).toString() + margin : `p${margin}`, `p${margin}`); break;
            }
        }
    }
    viewList = viewList.map(v => v.setLength(8));
    for (let i of viewList) {
        for (let j of [4, 5, 6, 7]) {
            if (/.m\d+/.test(i[j])) {
                i.push(i[j].match(/(?<=m)\d+/)[0]);
                i[j] = i[j].substring(0, i[j].lastIndexOf("m"));
            } else {
                i.push("");
            }
        }
        i[2] = mpwcfHotKey(i[2], "Horizontal");
        i[3] = mpwcfHotKey(i[3], "Vertical");
        if (i[4] == "p") {
            i[4] = `
        app:layout_constraintTop_toTopOf="parent"`;
        } else if (i[4].includes("*")) {
            i[4] = `
        app:layout_constraintTop_toTopOf="@id/${viewList[parseInt(i[4].replace("*", ""))][0]}"`;
        } else if (i[4] !== "") {
            i[4] = `
        app:layout_constraintTop_toBottomOf="@id/${viewList[parseInt(i[4])][0]}"`;
        }
        if (i[5] == "p") {
            i[5] = `
        app:layout_constraintBottom_toBottomOf="parent"`;
        } else if (i[5].includes("*")) {
            i[5] = `
        app:layout_constraintBottom_toBottomOf="@id/${viewList[parseInt(i[5].replace("*", ""))][0]}"`;
        } else if (i[5] !== ""){
            i[5] = `
        app:layout_constraintBottom_toTopOf="@id/${viewList[parseInt(i[5])][0]}"`;
        }
        if (i[6] == "p") {
            i[6] = `
        app:layout_constraintStart_toStartOf="parent"`;
        } else if (i[6].includes("*")) {
            i[6] = `
        app:layout_constraintStart_toStartOf="@id/${viewList[parseInt(i[6].replace("*", ""))][0]}"`;
        } else if (i[6] !== ""){
            i[6] = `
        app:layout_constraintStart_toEndOf="@id/${viewList[parseInt(i[6])][0]}"`;
        }
        if (i[7] == "p") {
            i[7] = `
        app:layout_constraintEnd_toEndOf="parent"`;
        } else if (i[7].includes("*")) {
            i[7] = `
        app:layout_constraintEnd_toEndOf="@id/${viewList[parseInt(i[7].replace("*", ""))][0]}"`;
        } else if (i[7] !== ""){
            i[7] = `
        app:layout_constraintEnd_toStartOf="@id/${viewList[parseInt(i[7])][0]}"`;
        }
        if (i[8] !== "") {
            i[8] = `
        android:layout_marginTop="${i[8]}dp"`;
        }
        if (i[9] !== "") {
            i[9] = `
        android:layout_marginBottom="${i[9]}dp"`;
        }
        if (i[10] !== "") {
            i[10] = `
        android:layout_marginStart="${i[10]}dp"`;
        }
        if (i[11] !== "") {
            i[11] = `
        android:layout_marginEnd="${i[11]}dp"`;
        }
    }
    
    let code = `<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
`;
    for(let i of viewList) {
        code += `
    <${viewHotKey(i[1])}
        android:id="@+id/${i[0]}"
        android:layout_width="${i[2]}"
        android:layout_height="${i[3]}"${i[4]}${i[5]}${i[6]}${i[7]}${i[8]}${i[9]}${i[10]}${i[11]}${viewEndHotKey(i[1])}
`;
    }
    
    code += "\n</androidx.constraintlayout.widget.ConstraintLayout>";
    output(code, "output");
}

function mpwcfHotKey(str, orientation) {
    switch(str) {
        case "m": case "p": return "match_parent";
        case "w": case "c": return "wrap_content";
        case "f": return `0dp"
        app:layout_constraint${orientation}_weight="1`
        default: return str + "dp";
    }
}
function viewTypeHotKey(str) {
    switch(str) {
        case "tv": return "TextView";
        case "bu": return "Button";
        case "et": return "EditText";
        default: return str;
    }
}
function textStyleHotKey(str) {
    switch(str) {
        case "b": return "bold";
        case "i": return "italic";
        case "bi": case "ib": return "bold|italic";
        default: return str;
    }
}
function viewHotKey(str) {
    if (/^(tv|et|bu)(b|i|bi|ib|)\d*$/.test(str)) {
        let type = str.substring(0, 2);
        let style = str.substring(2).replace(/\d/g, "");
        let size = str.replace(/\D/g, "");
        return `${viewTypeHotKey(type)}
        android:text=""${style === "" ? "" : `
        android:textStyle="${textStyleHotKey(style)}"`}${size === "" ? "" : `
        android:textSize="${size}sp"`}`;
    }
    switch(str) {
        case "iv": return `ImageView
        android:src="@drawable/"`;
        case "ivc": return `ImageView
        android:src="@drawable/"
        android:scaleType="centerCrop"`;
        case "sp": return "Spinner";
        case "cb": return "CheckBox";
        case "rg": return "RadioGroup";
        case "ll": return "LinearLayout";
        case "llv": return `LinearLayout
        android:orientation="vertical"`;
        case "llh": return `LinearLayout
        android:orientation="horizontal"`;
        case "rl": return "RelativeLayout";
        case "cl": return "androidx.constraintlayout.widget.ConstraintLayout";
        case "rv": return "androidx.recyclerview.widget.RecyclerView";
        case "wv": return "WebView";
        case "sw": return "Switch";
        case "in": return `include
        layout="@layout/"`;
        case "mv": return "com.google.android.gms.maps.MapView"
        default: return str;
    }
}
function viewEndHotKey(str) {
    switch(str) {
        case "ll": case "llv": case "llh": return `>

    </LinearLayout>`;
        case "rl": return `>

    </RelativeLayout>`;
        case "cl": return `>

    </androidx.constraintlayout.widget.ConstraintLayout>`;
        case "rg": return `>

    </RadioGroup>`;
        default: return " />";
    }
}