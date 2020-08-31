function htmlNavbarDisplay() {
    displayArea().innerHTML = "NavBar Items<br/>"
    + "Put each item on new line.<br/>"
    + "For links, type \"l text href\", where text is the displayed text and href is the link destination.<br/>"
    + "For forms, type \"f button hint\", where button is the button text and hint is the form hint text.<br/>"
    + "For dropdowns, type \"d text\", where text is the displayed text for the dropdown. Then begin typing the contents of the dropdown on the next line.<br/>"
    + "For separators in dropdowns, type only \"s\" on a line.<br/>"
    + "To end the dropdown, type only \"/d\" on a line.<br/>"
    + "Items begin on left side by default. To begin right side, type only \"r\" on a line. All items after will be on right side.<br/>"
    + textArea(20, "itemList")
    + "Brand"
    + textArea(1, "brand")
    + generateButton("htmlNavbarCode")
    + textArea(20, "output");
}

function htmlNavbarCode() {
    let itemList = getRows("itemList").split(/ +/);
    let brand = getValue("brand");
    let isDropdown = false;

    let addCode = "";
    let code = `<nav class="navbar navbar-default">
    <div class="container-fluid">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">${brand}</a>
        </div>
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav">`;
    for (let i of itemList) {
    	if (i[0] == "d") {
    		if (!isDropdown) {
    			code += `
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">${i[1]} <span class="caret"></span></a>
                    <ul class="dropdown-menu">`;
    			isDropdown = true;
    		}
    		continue;
    	}
    	if (i[0] == "/d") {
    		if (isDropdown) {
    			code += `
                    </ul>
                </li>`;
    			isDropdown = false;
    		}
    		continue;
    	}
    	if (i[0] == "r") {
    		if (isDropdown) {
    			code += `
                    </ul>
                </li>`;
    			isDropdown = false;
    		}
    		code += `
            </ul>
            <ul class="nav navbar-nav navbar-right">`;
      		continue;
    	}
    	if (i[0] == "s") {
    		newCode = `
                <li role="separator" class="divider"></li>`;
    		code += newCode.indent(isDropdown ? 8 : 0);
    	}
    	if (["a", "l"].includes(i[0])) {
    		newCode = `
                <li><a href="${i[2]}">${i[1]}</a></li>`;
    		code += newCode.indent(isDropdown ? 8 : 0);
    		continue;
    	}
    	if (i[0] == "f") {
    		newCode = `
                <li>
                    <form class="navbar-form">
                        <div class="form-group">
                            <input type="text" class="form-control" placeholder="${i[2]}">
                        </div>
                        <button type="submit" class="btn btn-default">${i[1]}</button>
                    </form>
                </li>`;
    		code += newCode.indent(isDropdown ? 8 : 0);
    	}
    }
    if (isDropdown) {
		code += `
                    </ul>
                </li>`;
		isDropdown = false;
	}
	code += `
            </ul>
        </div>
    </div>
</nav>`;
	output(code, "output");
}