var i = 0;
var files = getFiles(0);
var pc;

var task_page = document.getElementById("task");

function next() {
    document.getElementById("pcTarget1").innerHTML = "";
    document.getElementById("pcTarget2").innerHTML = "";
    document.getElementById("pcTarget3").innerHTML = "";
    document.getElementById("pcTarget4").innerHTML = "";
    pcVis(files[i], "#pcTarget1", 0.5, "emphasize_dis");
    pcVis(files[i], "#pcTarget2", 0.5, "bold");
    pcVis(files[i], "#pcTarget3", 0.5, "thin");
    pcVis(files[i], "#pcTarget4", 0.5, "emphasize_sim");
    if (i < files.length) {
        i++;
    }
    else {
        alert("All datasets displayed, starting again from set one.")
        i = 0;
    }
}