function navGraphDisplay() {
    displayArea().innerHTML = "Package Name"
    + textArea(1, "packageName")
    + "for each fragment list:<br/>multiple fragment classes on separate lines<br>for multiple fragments using same class, enter \"className: fragment0, fragment1, fragment2 ...\"<br/>enter just the name if you want the className and fragmentName to be the same<br/><br/>Fragments In Action Bar<br/>if you want the fragments to have an icon instead of being in the overflow menu, put a space after the fragment name and enter the icon name<br/>for example \"className: fragment0 icon0, fragment1, fragment2 icon2 ...\"<br/>use \"*\" as the icon name to match the fragment name"
    + textArea(5, "actionBarList")
    + "Fragments In Tabs<br/>"
    + `tabs placement (checked = top, unchecked = bottom) ${checkBox("tabsTop")}`
    + textArea(5, "tabList")
    + "Other Fragments<br/>enter fragments that are not in the Action Bar or Tabs<br/>this includes fragments in Drawers, fragments accessed by pressing buttons, etc."
    + textArea(5, "otherList")
    + "Drawer Menu<br/>each group on separate line<br/>\"option1, option2, option3\" = unnamed section<br/>\"sectionName: option1, option2, option3\" = named section<br/>\"*option1, option2, option3\" = group<br/>\"option1 icon1, option2 icon2\" = attach icons to each option<br/>\"option1 *, option2 *\" = attach icons with same name as option"
    + textArea(5, "drawerList")
    + "Destination List<br/>start, destination, actionName, animation<br/>multiple destinations on separate lines<br/>leave actionName blank to generate default<br/>animation can be \"up\", \"down\", \"left\", \"right\", or blank"
    + textArea(5, "destinationList")
    + "Argument List<br/>fragment, argumentName, argumentType, argumentValue<br/>multiple arguments on separate lines"
    + textArea(5, "argumentList")
    + `Use @string Resources? ${checkBox("useStrings")}<br/>`
    + generateButton("navGraphCode")
    + "<br/>nav_graph Navigation File Code"
    + textArea(20, "navGraphCode")
    + "action_bar_menu Menu File Code"
    + textArea(20, "actionBarCode")
    + "tabs_menu Menu File Code"
    + textArea(20, "tabsCode")
    + "drawer_menu Menu File Code"
    + textArea(20, "drawerCode")
    + "activity_main Layout File Code"
    + textArea(20, "activityMainCode")
    + "Main Activity Class Code"
    + textArea(20, "mainActivityCode")
    + "Single Fragment Code"
    + customButton("nextFragment()", "Next Fragment")
    + textArea(20, "singleFragment")
    + "All Fragments Code"
    + textArea(20, "allFragments")
    + "strings file"
    + textArea(10, "strings");
}

function navGraphCode() {
    let BAR = 0;
    let TAB = 1;
    let OTHER = 2;
    
    packageName = getValue("packageName");
    R_import = packageName.split(".").length > 3 ? `
import ${packageName.split(".", 3).join(".")}.R` : "";
    
    let strings = docId("useStrings").checked;
    
    let actionBarList = getRows("actionBarList").split(":")
        .filter(v => [1, 2].includes(v.length))
        .map(v => v.length == 1
        ? [v[0].toText(), [v[0].toUnderscore()], BAR]
        : [v[0].toText(), v[1].split(",").trim().map(w => w.toUnderscore()), BAR]);
    let tabList = getRows("tabList").split(":")
        .filter(v => [1, 2].includes(v.length))
        .map(v => v.length == 1
        ? [v[0].toText(), [v[0].toUnderscore()], TAB]
        : [v[0].toText(), v[1].split(",").trim().map(w => w.toUnderscore()), TAB]);
    let otherList = getRows("otherList").split(":")
        .filter(v => [1, 2].includes(v.length))
        .map(v => v.length == 1
        ? [v[0].toText(), [v[0].toUnderscore()], OTHER]
        : [v[0].toText(), v[1].split(",").trim().map(w => w.toUnderscore()), OTHER]);
    let drawerList = getRows("drawerList").map(v => {
        if (v[0] == "*") {
            return ["*", v.substring(1).replace(/:/g, "")];
        }
        if (v.includes(":")) {
            return v.split(":", 2);
        }
        return ["", v];
    });
    let destinationList = getRows("destinationList").split(",")
        .filter(v => [2, 3, 4].includes(v.length))
        .map(v =>
        [v[0].toUnderscore(),
        {destination:v[1].toUnderscore(),
        name:(v.length >= 3 ? v[2].toUnderscore() : `action_${v[0].toUnderscore()}_to_${v[1].toUnderscore()}`),
        anim:(v.length == 4 ? v[3].toUnderscore() : "")}]);
    let argumentList = getRows("argumentList").split(",")
        .filter(v => v.length == 4)
        .map(v => v.map(w => w.toUnderscore()))
        .map(v => [v[0], {name:v[1], type:argHotkey(v[2]), value:v[3]}]);
    
    let combinedList = tabList.concat(actionBarList).concat(otherList);
    
    let fragmentList = [];
    fragmentClassList = [];
    let args = [];
    let dests = [];
    for (let i of combinedList.filter(v => v[1][0] !== "")) {
        if (i[1].length == 1) {
            args = argumentList.filter(v => v[0].matches(i[1][0].split(" ")[0].replace(/\*/g, ""))).map(v => v[1]);
            dests = destinationList.filter(v => v[0].matches(i[1][0].split(" ")[0].replace(/\*/g, ""))).map(v => v[1]);
            fragmentList.push({id:i[1][0].split(" ")[0].replace(/\*/g, ""),
                name:i[0].replace(/\*/g, "").split(" ")[0],
                type:i[2],
                args:args,
                dests:dests,
                icon:(i[1][0].includes("*") ? i[1][0].replace(/\*/g, "").trim() : i[1][0].includes(" ") ? i[1][0].substring(i[1][0].indexOf(" ")) : "")});
            fragmentClassList.pushArrayUnique([i[0].replace(/\*/g, "").split(" ")[0].toCapCamel(), args], 0);
        } else {
            for (let j=0; j<i[1].length; j++) {
                args = argumentList.filter(v => v[0].matches(i[1][0].split(" ")[0].replace(/\*/g, ""))).map(v => v[1]);
                args.push({name:"frag", type:"integer", value:j});
                dests = destinationList.filter(v => v[0].matches(i[1][0].split(" ")[0].replace(/\*/g, ""))).map(v => v[1]);
                fragmentList.push({id:i[1][j].split(" ")[0].replace(/\*/g, ""),
                    name:i[0],
                    type:i[2],
                    args:args,
                    dests:dests,
                    icon:(i[1][0].includes("*") ? i[1][0].replace(/\*/g, "").trim() : i[1][0].includes(" ") ? i[1][0].substring(i[1][0].indexOf(" ")) : "")});
                fragmentClassList.pushArrayUnique([i[0].toCapCamel(), args], 0);
            }
        }
    }
    
    let tabsTop = docId("tabsTop").checked && tabList.length != 0;
    let tabsBottom = !docId("tabsTop").checked && tabList.length != 0;

    let stringList = [];
    
    let code = `<?xml version="1.0" encoding="utf-8"?>
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
            xmlns:app="http://schemas.android.com/apk/res-auto"
            xmlns:tools="http://schemas.android.com/tools"
            android:id="@+id/nav_graph"
            app:startDestination="@id/${(fragmentList[0] || {id:""}).id}">`;
    for (let i of fragmentList) {
        code += `
    <fragment android:id="@+id/${i.id.toUnderscore()}"
              android:name="${packageName}.${i.name.toCapCamel()}"
              android:label="${strings ? `@string/${i.id.toUnderscore()}` : i.id.toText()}"
              tools:layout="@layout/${i.name.toUnderscore()}">`;
        for (let j of i.dests) {
            code += `
        <action android:id="@+id/${j.name}"
                app:destination="@id/${j.destination}"`;
            if (["left", "right", "up", "down"].includes(j.anim)) {
                    code += `
                app:enterAnim="@anim/push_${j.anim}_in"
                app:exitAnim="@anim/push_${j.anim}_out"`;
            }
            code += " />";
        }
        for (let j of i.args) {
            code += `
        <argument android:name="${j.name}"
                  app:argType="${j.type}"
                  android:defaultValue="${j.value}" />`;
        }
        code += `
    </fragment>`;
        if (strings) {
            stringList.pushUnique(i.id);
        }
    }
    code += "\n</navigation>";
    output(code, "navGraphCode");
    
    code = `<?xml version="1.0" encoding="utf-8"?>
<menu xmlns:android="http://schemas.android.com/apk/res/android" xmlns:app="http://schemas.android.com/apk/res-auto">`;
    for (let i of fragmentList.filter(v => v.type == BAR)) {
        code += `
    <item
        android:id="@+id/${i.id.toUnderscore()}"
        android:title="${strings ? `@string/${i.id.toUnderscore()}` : i.id}"`;
        if (i.icon === "") {
            code += `
        app:showAsAction="never" />`;
        } else {
            code += `
        android:icon="@drawable/${i.icon.toUnderscore()}"
        app:showAsAction="always" />`;
        }
    }
    code += "\n</menu>";
    output(code, "actionBarCode");

    code = `<?xml version="1.0" encoding="utf-8"?>
<menu xmlns:android="http://schemas.android.com/apk/res/android" xmlns:app="http://schemas.android.com/apk/res-auto">`;
    for (let i of fragmentList.filter(v => v.type == TAB)) {
        code += `
    <item
        android:id="@+id/${i.id.toUnderscore()}"
        android:title="${strings ? `@string/${i.id.toUnderscore()}` : i.id}"`;
        if (i.icon !== "") {
            code += `
        android:icon="@drawable/${i.icon.toUnderscore()}"`;
        }
        code += " />";
    }
    code += "\n</menu>";
    output(code, "tabsCode");
    
    code = `<?xml version="1.0" encoding="utf-8"?>
<tools:menu xmlns:android="http://schemas.android.com/apk/res/android"
            xmlns:tools="http://schemas.android.com/tools"
            tools:showIn="navigation_view">
`;
    for (let i of drawerList) {
        if (i[0] == "*") {
            code += `    <group android:checkableBehavior="single">
`;
            for (let j of i[1].split(",").trim().map(v => v.includes("*") ? [v.replace(/\*/g, "").trim(), v.replace(/\*/g, "").trim()] :
                v.includes(" ") ? v.split(" ", 2) : [v, ""])) {
                code += `        <item android:id="@+id/${j[0].toUnderscore()}"
              android:title="${strings && j[0] !== "" ? `@string/${j[0].toUnderscore()}` : j[0]}"`;
                if (j[1] !== "") {
                    code += `
              android:icon="@drawable/${j[1].toUnderscore()}"`;
                }
                if (strings) {
                    stringList.pushUnique(j[0]);
                }
                code += " />\n";
            }
            code += "    </group>\n";
        } else {
            code += `    <item android:title="${strings && i[0] !== "" ? `@string/${i[0].toUnderscore()}` : i[0]}">
        <menu>
`;
            for (let j of i[1].split(",").trim().map(v => v.includes("*") ? [v.replace(/\*/g, "").trim(), v.replace(/\*/g, "").trim()] :
                v.includes(" ") ? v.split(" ", 2) : [v, ""])) {
                code += `            <item android:id="@+id/${j[0].toUnderscore()}"
                  android:title="${strings && j[0] !== "" ? `@string/${j[0].toUnderscore()}` : j[0]}"`;
                if (j[1] !== "") {
                    code += `
                  android:icon="@drawable/${j[1].toUnderscore()}"`;
                }
                if (strings) {
                    stringList.pushUnique(j[0]);
                }
                code += " />\n";
            }
            code += `        </menu>
    </item>
`;
            if (strings) {
                stringList.pushUnique(i[0]);
            }
        }
    }
    code += "</tools:menu>";
    
    output(code, "drawerCode");
    
    code = "";
    let d = drawerList.length == 0 ? "" : "    ";
    if (drawerList.length == 0) {
        code = `<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">
    
`;
    } else {
        code = `<androidx.drawerlayout.widget.DrawerLayout xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:app="http://schemas.android.com/apk/res-auto"
        xmlns:tools="http://schemas.android.com/tools"
        android:id="@+id/drawer_layout"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:fitsSystemWindows="true"
        tools:context=".MainActivity">

    <androidx.constraintlayout.widget.ConstraintLayout
            android:layout_width="match_parent"
            android:layout_height="match_parent">
            
`;
    }
    
        code += `${d}    <androidx.appcompat.widget.Toolbar
${d}        android:id="@+id/toolbar"
${d}        android:layout_width="match_parent"
${d}        android:layout_height="?attr/actionBarSize"
${d}        app:layout_constraintTop_toTopOf="parent"
${d}        android:background="@color/colorPrimary"
${d}        android:elevation="4dp"
${d}        android:theme="@style/ThemeOverlay.AppCompat.Dark.ActionBar"
${d}        app:popupTheme="@style/ThemeOverlay.AppCompat.Light" />

`;
        
    if (tabsTop) {
        code += `${d}    <com.google.android.material.bottomnavigation.BottomNavigationView
${d}        android:layout_width="match_parent"
${d}        android:layout_height="wrap_content"
${d}        android:id="@+id/tabs"
${d}        android:background="#c0c0c0"
${d}        app:itemTextColor="#000000"
${d}        app:layout_constraintTop_toBottomOf="@id/toolbar"
${d}        app:menu="@menu/tabs_menu"/>
        
`;
    }

    code += `${d}    <fragment
${d}        android:name="androidx.navigation.fragment.NavHostFragment"
${d}        android:layout_width="0dp"
${d}        android:layout_height="0dp"
${d}        app:layout_constraintVertical_weight="1"
${d}        app:navGraph="@navigation/nav_graph"
${d}        app:defaultNavHost="true"
${d}        android:id="@+id/nav_host_fragment"
${d}        app:layout_constraintTop_toBottomOf="@id/${tabsTop ? "tabs" : "toolbar"}"
${d}        app:layout_constraintBottom_to${tabsBottom ? 'TopOf="@id/tabs"' : 'BottomOf="parent"'}
${d}        app:layout_constraintStart_toStartOf="parent"
${d}        app:layout_constraintEnd_toEndOf="parent" />

`;
    if (tabsBottom) {
        code += `${d}    <com.google.android.material.bottomnavigation.BottomNavigationView
${d}        android:layout_width="match_parent"
${d}        android:layout_height="wrap_content"
${d}        android:id="@+id/tabs"
${d}        android:background="#c0c0c0"
${d}        app:itemTextColor="#000000"
${d}        app:layout_constraintBottom_toBottomOf="parent"
${d}        app:menu="@menu/tabs_menu"/>
        
`;
    }
    
    if (drawerList.length == 0) {
        code += "</androidx.constraintlayout.widget.ConstraintLayout>"
    } else {
        code += `    </androidx.constraintlayout.widget.ConstraintLayout>

    <com.google.android.material.navigation.NavigationView
            android:layout_width="wrap_content"
            android:layout_height="match_parent"
            android:id="@+id/drawer_view"
            app:headerLayout="@layout/drawer_header"
            app:menu="@menu/drawer_menu"
            android:layout_gravity="start"/>

</androidx.drawerlayout.widget.DrawerLayout>`
    }
    
    output(code, "activityMainCode");
    
    code = `class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        setSupportActionBar(toolbar)

        navController = findNavController(nav_host_fragment)
        toolbar.setupWithNavController(navController)${tabList.length == 0 ? "" : `
        tabs.setupWithNavController(navController)`}${drawerList.length == 0 ? "" : `

        val toggle = ActionBarDrawerToggle(
            this,
            drawer_layout,
            toolbar,
            R.string.drawer_open,
            R.string.drawer_close
        )
        drawer_layout.addDrawerListener(toggle)
        toggle.syncState()

        drawer_view.setNavigationItemSelectedListener {
            it.onNavDestinationSelected(navController)
        }`}
    }${actionBarList.length == 0 ? "" : `
    
    override fun onCreateOptionsMenu(menu: Menu?): Boolean {
        menuInflater.inflate(R.menu.action_bar_menu, menu)
        return super.onCreateOptionsMenu(menu)
    }`}${tabList.length == 0 && actionBarList.length == 0 ? "" : `

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return item.onNavDestinationSelected(navController) || super.onOptionsItemSelected(item)
    }`}
}`;
    output(code, "mainActivityCode");
    
    code = "";
    currentFragment = 0;
    for (let i of fragmentClassList) {
        code += fragmentStarterCode(i);
    }
    
    if (fragmentClassList.length != 0) {
        output(fragmentStarterCode(fragmentClassList[0]), "singleFragment");
    }
    output(code, "allFragments");
    
    let stringCode = "";
    stringList.sort();
    if (drawerList.length != 0) {
        stringList.push("Drawer Open");
        stringList.push("Drawer Close");
    }
    for (let i of stringList.filter(v => v !== "")) {
        stringCode += `<string name="${i.toUnderscore()}">${i}</string>
`;
    }
    output(stringCode, "strings");
}

function fragmentStarterCode(arr) {
    let fragCode = "";
    let name = arr[0];
    let args = arr[1];
    fragCode = `package ${packageName}

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment${R_import}

class ${name}: Fragment() {
`;
    for (let i of args) {
        fragCode += `    var ${i.name}: ${fromArgHotKey(i.type)} = ${emptyValue(i.type)}
`;
    }
    fragCode += `    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState) 
`;
    if (args.length != 0) {
        fragCode += `        arguments?.let {
`;
        for (let i of args) {
            fragCode += `            ${i.name} = it.get${fromArgHotKey(i.type)}("${i.name}")
`;
        }
        fragCode += `        }
`;
    }
    fragCode += `        setHasOptionsMenu(true)
    }
    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.${name.toUnderscore()}, container, false)
    }
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
    }
}

`;
    return fragCode;
}
function nextFragment() {
    currentFragment++;
    if (currentFragment >= fragmentClassList.length) {
        currentFragment = 0;
    }
    if (fragmentClassList.length != 0) {
        output(fragmentStarterCode(fragmentClassList[currentFragment]), "singleFragment");
    }
}