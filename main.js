var files = [];
var activeFiles = new Set();

function update(parameter, value, id="") {

    if (parameter === "height") {
        height = value;
    } else if (parameter === "space") {
        space = value; 
    } else if (parameter === "thickness") {
        thickness = value;
    } else if (parameter === "opacity") {
        opacity = value+"";
    } else if (parameter === "colour") {
        colour = $("#select-colour").val();
    } else if (parameter === "power") {
        console.log("P: " + value);
        power = value;
    }
    // Toggle off and on for an update
    var copy = Array.from(activeFiles);
    copy.forEach(e => { toggleVis(e); toggleVis(e) } )
}

function toggleVis(file) {

    if (activeFiles.has(file)) {
        activeFiles.delete(file);
    } else {
        activeFiles.add(file);
    }

    var i = files.indexOf(file);

    ["a", "b"].forEach(s => {

        if ($("#pcTarget"+i+s).html() === "") {
            pcVis(file, "#pcTarget"+i+s, (s === "a" ? "emphasize dis" : "neutral"), 0.5);
        }
        else {
            $("#pcTarget"+i+s).html("");
        }

    });
}

function main() {
    
    $("input:checkbox").removeAttr("checked").prop("checked", false);

    // jQuery UI slider function
    ["height", "space"].forEach(function(parameter){
        $("#slider-" + parameter).slider({
            step: 0.05,
            min: 0.6,
            max: 1.4,
            value: 1, 
            stop: function(event, ui) {
                update(parameter, ui.value * ui.value);
            }
        }); 
    });

    $("#slider-thickness").slider({
        step: 0.1,
        min: 0.1,
        max: 5,
        value: 1, 
        stop: function(event, ui) {
            update("thickness", ui.value * ui.value * ui.value);
        }
    }); 

    $("#slider-opacity").slider({
        step: 0.01,
        min: 0,
        max: 1,
        value: 1, 
        stop: function(event, ui) {
            update("opacity", ui.value*ui.value*ui.value);
        }
    });

    $("#slider-power").slider({
        step: 0.05,
        min: 0.05,
        max: 5,
        value: 1,
        stop: function(event, ui) {
            update("power", ui.value);
        }
    });

    for (i of [150, 200, 300, 400]) {
        files.push("data/noise/RandomNoise/datasets/Noise_"+i+".csv");
    }

    for (i=250; i<=400; i+=50) {
        files.push("data/noise/70%Linear_NoiseOnly/datasets/Noise_"+i+".csv");
    }

    for (noise=0; noise<=300; noise+=150) {
        for (i=1; i<=4; i++) {
            files.push("data/synthetic/FinalVersion/Original/" + noise + "N/DefaultOrdering/" + i + "C." + 1 + ".csv");
        }
    }

    for (file of [
        //"RW03-ecoli-normalized.csv", 
        //"RW06-iris-normalized.csv", 
        "RW09-seeds-normalized.csv", 
        "RW01-airquality-normalized.csv", 
        "RW04-forestfires-normalized.csv", 
        "RW07-wine-normalized.csv", 
        //"RW10-stoneFlakes-normalized.csv", 
        //"RW02-breasttissue-normalized.csv", 
        //"RW05-glass-normalized.csv", 
        //"RW08-mtCars-normalized.csv"
    ]) { files.push("data/realworld datasets/FinalVersion/" + file); }

    var wrapper = document.getElementById("main");

    var i = 0; 

    for (file of files) {

        var row = document.createElement("div")
        row.setAttribute("class", "row");
        wrapper.appendChild(row);

        row.appendChild(document.createElement("div")).setAttribute("id", "pcTarget"+i+"a");
        row.appendChild(document.createElement("div")).setAttribute("id", "pcTarget"+i+"b");

        i++;
    }
}
