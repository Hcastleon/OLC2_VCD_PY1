//import parse from "./ejemplo";
//import parser from "./ejemplo";
parser = require('./ejemplo');

function analize(data) {
  alert(data);
  if (typeof parser !== "undefined") {
    alert(data);
    var result = parse(data);
    //alert(result);
    //document.getElementById("console").value = result;
  }

  //

  //document.getElementById("editor").innerHTML="Paragraph changed.";
}
