function adapterDisplay() {
    displayArea().innerHTML = "Class Name"
    + textArea(1, "className")
    + "Array Items Data Type"
    + textArea(1, "itemType")
    + "Child View Layout ID"
    + textArea(1, "layout")
    + "View List<br/>each view on different line<br/>for views other than TextView and ImageView, just type the view's ID<br/>for TextView or ImageView, type \"viewId t\" or \"viewId i\" respectively<br/>you may instead paste your XML layout code"
    + textArea(5, "viewList")
    + generateButton("adapterCode")
    + "<br/>This code provides a general outline. You will most likely have to edit the code to get it to do exactly what you want."
    + textArea(20, "output");
}

function adapterCode() {
    let className = getValue("className");
    let itemType = getValue("itemType");
    let layout = getValue("layout");
    let viewList = [];
    
    if (getValue("viewList").includes("<")) {
        let viewTags = getValue("viewList").split(/(?<=\>) *\n/).trim();
        for (let i of viewTags) {
            if (i.includes("android:id=\"@+id/")) {
                viewList.push([i.match(/(?<=android:id="\@\+id\/)[^"]*/)[0], i.startsWith("<TextView") ? "t" : i.startsWith("<ImageView") ? "i" : ""]);
            }
        }
    } else {
        viewList = getRows("viewList").trimSplit().filter(v => [1, 2].includes(v.length));
    }
    
    let code = `class ${className.toCapCamel()} (private val items: ArrayList<${itemType.toCapCamel()}>, val context: Context) : RecyclerView.Adapter<${className.toCapCamel()}.ViewHolder> () {
    override fun getItemCount(): Int {
        return items.size
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        return ViewHolder(LayoutInflater.from(context).inflate(R.layout.${layout.toUnderscore()}, parent, false))
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val i = items[position]`;
    for (let i of viewList.filter(v => v.length == 2 && ["i", "t"].includes(v[1]))) {
        if (i[1] == "t") {
            code += `
        // change "i.${i[0].toCamel()}" to desired text
        holder.${i[0].toCamel()}.text = i.${i[0].toCamel()}`;
        } else {
            code += `
        // change "i.${i[0].toCamel()}" to desired image url
        Glide.with(context).load(i.${i[0].toCamel()}).into(holder.${i[0].toCamel()})
        holder.${i[0].toCamel()}.visibility = if (true) View.VISIBLE else View.GONE`;
        }
    }
    for (let i of viewList.filter(v => v.length == 1 || !["i", "t"].includes(v[1]))) {
        code += `
        holder.${i[0].toCamel()}.visibility = if (true) View.VISIBLE else View.GONE`;
    }
    code += `
        holder.parent.setOnClickListener {
            
        }
    }

    class ViewHolder (view : View) : RecyclerView.ViewHolder(view) {`;
    for (let i of viewList.map(v => v[0])) {
        code += `
        val ${i.toCamel()} = view.${i}`;
    }   
    code += `
        val parent = view
    }
}`;
    output(code, "output");
}