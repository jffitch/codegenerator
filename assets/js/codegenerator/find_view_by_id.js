function findViewByIdDisplay() {
    displayArea().innerHTML = "paste XML layout code here"
    + textArea(20, "xmlFile")
    + generateButton("findViewByIdCode")
    + textArea(20, "output");
}

function findViewByIdCode() {
    let viewTags = getValue("xmlFile").split(/(?<=\>) *\n/).filter(v => v.includes("android:id=\"@+id")).map(v => [(v.match(/(?<=<)\S*/) || [""])[0].split(".").reverse()[0], (v.match(/(?<=android:id="\@\+id\/)[^"]*/) || [""])[0]]);
    let code = "";
    for (let i of viewTags) {
        code += `${i[0]} ${i[1]};
`;
    }
    code += `
public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
`;
    for (let i of viewTags) {
        code += `    ${i[1]} = (${i[0]}) findViewById(R.id.${i[1]});
`;
    }
    code += `}`;
    output(code, "output");
}