// slider parameters
var height      = 1;
var space       = 1;
var thickness   = 1;

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

    if (parameter === "space") {

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

    if (parameter === "thickness") {

        $("path").attr("stroke-width", function(i, px){

            return (value / thickness * parseFloat(px)) + "";
        });

        thickness = value;
    }
}

function main() {
    
    // jQuery UI slider function
    ["height", "space", "thickness"].forEach(function(parameter){

        $("#slider-" + parameter).slider({
            step: 0.1,
            min: 0.5,
            max: 2,
            value: 1, 
            stop: function(event, ui) {
                update(parameter, ui.value)
              }
        }); 
    });

    for (noise=150; noise<=300; noise+=150) {

        for (i=1; i<=4; i+=2) {

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

    var i = 1; 

    for (file of files.slice(-12)) {

        var row = document.createElement("div")
        row.setAttribute("class", "row");
        wrapper.appendChild(row);

        row.appendChild(document.createElement("div")).setAttribute("id", "pcTarget"+i+"a");
        row.appendChild(document.createElement("div")).setAttribute("id", "pcTarget"+i+"b");

        pcVis(file, "#pcTarget"+i+"a", "emphasize dis", 0.5);
        pcVis(file, "#pcTarget"+i+"b", "neutral", 0.5);

        i++;
    }
}