function gameMakerIapDisplay() {
    displayArea().innerHTML = "These functions have been deprecated as of Game Maker Studio version 2.2.4.<br/><br/>IAP List<br/>each purchase on new line<br/>format as \"id, title, description, price\""
    + textArea(5, "purchaseList")
    + generateButton("gameMakerIapCode")
    + "<br/><br/>Start Of App<br/>create a controller object that exists exactly once for the entire time that the app is running, place this code in the Create event of the controller object"
    + textArea(20, "createEvent")
    + "IAP Event<br/>place this code in the IAP event of the controller object"
    + textArea(20, "iapEvent")
    + "Purchase Script<br/>you may choose any name for this script<br/>call thisScript(n) from any event to purchase item n<br/>replace \"controller\" with the name of your controller object"
    + textArea(20, "callScript")
}

function gameMakerIapCode() {
    let purchaseList = getRows("purchaseList").split(",").filter(v => v.length == 4);
    purchaseList = purchaseList.map(v => [v[0].noSpace(), v[1].trim(), v[2].trim(), v[3].replace(/[^0-9.]/g, "")]);
    let code = `// save array for later use
// you'll call "purchases[n]" to see if item n has been purchased` 
    for (let i=0; i<purchaseList.length; i++) {
        code += `
purchases[${i}] = 0;`;
    }
    code += `

// initialize list, individual purchases, and maps with each purchase's values 
var purchaseList`;
    for (let i=0; i<purchaseList.length; i++) {
        code += `, purchase${i}`;
    }
    code += ";\npurchaseList = ds_list_create();"
    for (let i=0; i<purchaseList.length; i++) {
        code += `
purchase${i} = ds_map_create();`;
    }
    for (let i of purchaseList) {
        code += `

ds_map_add(purchase0, "id", "${i[0]}"); 
ds_map_add(purchase0, "title", "${i[1]}"); 
ds_map_add(purchase0, "description", "${i[2]}"); 
ds_map_add(purchase0, "price", "${i[3]}");`;
    }
    code += "\n\nds_list_add(purchaseList"
    for (let i=0; i<purchaseList.length; i++) {
        code += `, purchase${i}`;
    }
    code += `);
    
// activate purchases on list 
iap_activate(purchaseList);  
 
// destroy maps and list to prevent memory leaks`;
    for (let i=0; i<purchaseList.length; i++) {
        code += `
ds_map_destroy(purchase${i});`;
    }
    code += "\nds_list_destroy(purchaseList);"
    output(code, "createEvent");
    
    code = `// initialize variables, iap_data is a map that's automatically created 
var p_map = ds_map_create(); 
var p_index = ds_map_find_value(iap_data, "index"); 
var p_type = ds_map_find_value(iap_data, "type"); 
 
// this should work only if the event "type" is purchasing (iap_ev_purchase) or activating on create (iap_ev_product) 
if (p_type == iap_ev_purchase || p_type == iap_ev_product) { 
    // this puts the details in the map named "p_map", returning the id as "p_product" and checking whether it has been purchased 
    iap_purchase_details(p_index, p_map); 
    var p_product = ds_map_find_value(p_map, "product"); 
    // if it has been purchased, the purchases array is updated 
    if (ds_map_find_value(p_map, "status") == iap_purchased) {
        switch (p_product) {`;
    for (let i=0; i<purchaseList.length; i++) {
        code += `
            case "${purchaseList[i][0]}" : purchases[${i}] = 1; break;`
    }
    code += `
        }
    }
}
 
ds_map_destroy(p_map);`;
    output(code, "iapEvent");
    
    code = `if (!controller.purchases[argument0]) {
    switch (argument0) {`;
    for (let i=0; i<purchaseList.length; i++) {
        code += `
        case "${i}": iap_acquire("${purchaseList[i][0]}, ""); break;`;
    }
    code += `
    }
}`;
    output(code, "callScript");
}