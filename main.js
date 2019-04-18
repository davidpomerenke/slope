function getFiles() {
    var SEED = [1,2,3,4,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,1,2,3,4,5,6,7];
    var files = [];
    SEED.forEach(function(value, index) {
        var file;
        var noise; 
        var rw_files = [
            "RW01-airquality-normalized.csv",
            "RW02-breasttissue-normalized.csv",
            "RW03-ecoli-normalized.csv",
            "RW04-forestfires-normalized.csv",
            "RW05-glass-normalized.csv",
            "RW06-iris-normalized.csv",
            "RW07-wine-normalized.csv"];
        if (index < 18) {
            if (index < 4) {
                file = "Noise_" + [150,200,300,400][value] + ".csv";
            }
            else {
                if (index < 10) {
                    noise = "60";
                } 
                else if (index < 16) {
                    noise = "90";
                }
                else {
                    noise = "120";
                }
                file = "datasets_PC/" + noise + "%25Noise/" + value.pad(2) + "_" + noise + "%25Noise.csv";
            }
        }
        else {
            file = "datasets_PC/" + rw_files[value];
        }
        files.push("data/" + file);
    });
    return files;
}

// Add leading zeros
Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

var files = getFiles();
var i = 0;

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