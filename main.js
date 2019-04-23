// slider parameters
var height      = 1;
var space       = 1;

var files = [];

function update(parameter, value, id="") {

    var isNew = (id !== "" && (id = " "+id+" ")) ? true : false;

    if (parameter === "height") {

        $(id+"svg, "+id+"g").each(function(){

            if (typeof $(this).attr("height") !== typeof undefined) {

                $(this).attr("height", function(i, px){

                    return px * value / (isNew ? 1 : height);
                });
            }
        });

        $(id+"g.box").each(function(){

            if (typeof $(this).attr("transform") !== typeof undefined) {
                
                $(this).attr("transform", function(i, px){
                
                    return px.replace(/translate\([0-9\.-]+,[0-9\.-]+\)/g, function(m) {

                        return (
                            m.replace(/,.*$/, ",")
                            + 
                            value * parseFloat(m.replace(/(^.*,|\))/g, "")) / (isNew ? 1 : space) + ")");
                    });
                });
            }
        });

        $(id+"path").attr("d", function(i, px){

            return px.replace(/(M|L)?(\d|\.)*(,|V)(\d|\.)+/gi, function(m) { 

                return (
                    m.replace(/(V|,).*$/, "$1")
                    +
                    value / (isNew ? 1 : height) * parseFloat(m.replace(/^.*(,|V)/, ""))
                ); 
            });
        });

        height = value;
    }
    else if (parameter === "space") {

        $(id+"svg, "+id+"g").each(function(){

            if (typeof $(this).attr("width") !== typeof undefined) {

                $(this).attr("width", function(i, px){
                
                    return px * value / (isNew ? 1 : space);
                });
            }
        });

        $(id+"g.dimension").attr("transform", function(i, px){
                
            return px.replace(/translate\(.*\)/, function(m){

                return ("translate(" + (value * parseFloat(m.replace(/[^0-9\.]/g, ""))) / (isNew ? 1 : space) + ")")
            });
        });

        $(id+"path").attr("d", function(i, px){

            return px.replace(/[LMH](\d|\.)+/gi, function(m) {

                return (
                    m.replace(/[^LMH]/gi, "")
                    +
                    value * parseFloat(m.replace(/[LMH]/gi, "")) / (isNew ? 1 :space)
                ); 
            });
        });

        space = value;
    }
    else if (parameter === "thickness") {

        $(id+"path").each(function(){

            $(this).attr("stroke-width", value * parseFloat($(this).attr("data-stroke-width")) + "");
        });
    }
    else if (parameter === "opacity") {

        $(id+"path").css("opacity", value + "");
    }
    else if (parameter === "colour") {

        $(id+"g.foreground path").css("stroke", $("#select-colour").val());

    }
}

function toggleVis(file) {
    
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
        max: 1.95,
        value: 1, 
            value: 1, 
        value: 1, 
            value: 1, 
        value: 1, 
            value: 1, 
        value: 1, 
            value: 1, 
        value: 1, 
        stop: function(event, ui) {
            update("thickness", ui.value * ui.value * ui.value);
        }
    }); 

    $("#slider-opacity").slider({
        step: 0.05,
        min: 0,
        max: 1,
        value: 1, 
        stop: function(event, ui) {
            update("opacity", ui.value);
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