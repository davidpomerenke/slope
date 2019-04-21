// slider parameters
var height      = 1;
var space       = 1;

var files = [];

function update(parameter, value) {

    if (parameter === "height") {

        $("svg, g").each(function(){

            if (typeof $(this).attr("height") !== typeof undefined) {

                $(this).attr("height", function(i, px){
                
                    return px * value / height;
                });
            }
        });

        $("g.box").each(function(){

            if (typeof $(this).attr("transform") !== typeof undefined) {
                
                $(this).attr("transform", function(i, px){
                
                    return px.replace(/translate\([0-9\.-]+,[0-9\.-]+\)/g, function(m) {

                        return (
                            m.replace(/,.*$/, ",")
                            + 
                            value / space * parseFloat(m.replace(/(^.*,|\))/g, "")) + ")");
                    });
                });
            }
        });

        $("path").attr("d", function(i, px){

            return px.replace(/(M|L)?(\d|\.)*(,|V)(\d|\.)+/gi, function(m) { 

                return (
                    m.replace(/(V|,).*$/, "$1")
                    +
                    value / height * parseFloat(m.replace(/^.*(,|V)/, ""))
                ); 
            });
        });

        height = value;
    }
    else if (parameter === "space") {

        $("svg, g").each(function(){

            if (typeof $(this).attr("width") !== typeof undefined) {

                $(this).attr("width", function(i, px){
                
                    return px * value / space;
                });
            }
        });

        $("g.dimension").attr("transform", function(i, px){
                
            return px.replace(/translate\(.*\)/, function(m){

                return ("translate(" + (value / space * parseFloat(m.replace(/[^0-9\.]/g, ""))) + ")")
            });
        });

        $("path").attr("d", function(i, px){

            return px.replace(/[LMH](\d|\.)+/gi, function(m) {

                return (
                    m.replace(/[^LMH]/gi, "")
                    +
                    value / space * parseFloat(m.replace(/[LMH]/gi, ""))
                ); 
            });
        });

        space = value;
    }
    else if (parameter === "thickness") {

        $("path").each(function(){

            $(this).attr("stroke-width", value * parseFloat($(this).attr("data-stroke-width")) + "");
        });
    }
    else if (parameter === "opacity") {

        $("path").css("opacity", value + "");
    }
    else if (parameter === "colour") {

        $(".foreground path").css("stroke", $("#select-colour").val());
    }
}

function toggleVis(vis) {
    
    if (vis.substring(0,2) === "RW") {

        var file = "data/realworld datasets/FinalVersion/" + vis;
    }
    else{

        var s = vis.split("-");
        console.log(s);
        var file = "data/synthetic/FinalVersion/Original/" + s[0] + "N/DefaultOrdering/" + s[1] + "C." + 1 + ".csv"
    }

    var i = files.indexOf(file);

    if ($("#pcTarget"+i+"a").html() === "") {

        pcVis(file, "#pcTarget"+i+"a", "emphasize dis", 0.5);
        pcVis(file, "#pcTarget"+i+"b", "neutral", 0.5);
    }
    else {

        $("#pcTarget"+i+"a").html("");
        $("#pcTarget"+i+"b").html("");
    }
}

function main() {
    
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