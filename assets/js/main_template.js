function block() {
    var i;
    for (i=0;i<arguments.length;i++) {
      ad[arguments[i]]=["blank","blank","blank"];
    }
}
block(5,6,11,12,18);
function randomAds() {
var i;
for (i=0;i<used.length;i++) {
  used[i]=false;
}
used[0]=true;
var chosen;
for (i=0; i<adCount; i++){
  chosen=0;
  while (ad[chosen][0]=="blank" || used[chosen]) {
    chosen = Math.floor(Math.random() * ad.length);
  }
  document.getElementById("img"+i).src = ad[chosen][1];
  document.getElementById("link"+i).href = ad[chosen][2];
  document.getElementById("text"+i).innerHTML = ad[chosen][0];
  used[chosen]=true;
}
setTimeout(randomAds,30000);
}
function setUpAds() {
adCount = 4;
let inner = "";
for (let i=0; i<adCount; i++) {
    inner += "<div><a href=\"home.html\" id=\"link" + i + "\" target=\"_blank\">#ad<br/><img id=\"img" + i + "\"/><br><b id=\"text" + i + "\"></b></a></div>" 
}
document.getElementById("ads").innerHTML = inner;
}
function setUpMenu() {
  let menu = [["Home", "home.html", false],
  ["HTBAMG Book", "HTBAMG book.html", false],
  ["HTBAMG App", "HTBAMG app.html", false],
  ["Blackjack Calculator App", "BJCalc app.html", false],
  ["Tape Measure App", "tapemeasure.html", false],
  ["Cliche Advice Taken Literally", "http://clicheadvice.com", false],
  ["Highlarious 420", "http://highlarious420.com", true],
  ["Programming Help", "computercode.html", false],
  ["Code Generator", "codegenerator.html", false],
  ["Privacy Policy", "privacy.html", false]];
  let inner = ""
  for (let i of menu) {
      inner += "<a href=\"" + i[1] + "\"><b>" + (i[2] ? "<text style=\"color:#ff0000\">NEW! </text>" : "") + i[0] + "</b></a><br>";
  }
  document.getElementById("menu").innerHTML = inner;
}
function headerAndFooter() {
    document.getElementById("header").innerHTML = "<b>Welcome to the website of math genius J. F. Fitch.</b>";
    document.getElementById("footer").innerHTML = "We are a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for us to earn fees by linking to Amazon.com and affiliated sites. As an Amazon Associate, we earn from qualifying purchases.";
}
function loadFunction() {
  let adCount = 0;
  setUpAds();
  setUpMenu();
  headerAndFooter();
  randomAds();
}