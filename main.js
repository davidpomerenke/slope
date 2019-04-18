function main() {
    var wrapper = document.getElementById("wrapper");
        var files = [];
    for (i=1; i<4; i++) {
        for (j=1; j<=1; j++) {
            noise = "300";
            files.push("data/synthetic/FinalVersion/Original/" + noise + "N/DefaultOrdering/" + i + "C." + j + ".csv");
        }
    }
    for (file of [
        "RW03-ecoli-normalized.csv", 
        "RW06-iris-normalized.csv", 
        "RW09-seeds-normalized.csv", 
        "RW01-airquality-normalized.csv", 
        "RW04-forestfires-normalized.csv", 
        "RW07-wine-normalized.csv", 
        "RW10-stoneFlakes-normalized.csv", 
        "RW02-breasttissue-normalized.csv", 
        "RW05-glass-normalized.csv", 
        "RW08-mtCars-normalized.csv"
    ]) { files.push("data/realworld datasets/FinalVersion/" + file); }
    for (file of files) {
        wrapper.appendChild(document.createElement("div")).setAttribute("id", "pcTarget"+i+"a");
        wrapper.appendChild(document.createElement("div")).setAttribute("id", "pcTarget"+i+"b");
        pcVis(file, "#pcTarget"+i+"a", "emphasize dis", 0.5, );
        pcVis(file, "#pcTarget"+i+"b", "neutral", 0.5);
    }
}