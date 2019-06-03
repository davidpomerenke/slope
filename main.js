var files = [];
var activeFiles = new Set();

function update(parameter, value) {

    if (parameter === "height") {
        height = value;
    } else if (parameter === "space") {
        space = value; 
    } else if (parameter === "thickness") {
        thickness = value;
    } else if (parameter === "opacity") {
        opacity = value+"";
    } else if (parameter === "colour") {
        color = $("#select-colour").val();
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

    var i = files.map(f => f[0]).indexOf(file);

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

    // add all file names and short descriptions
    for (i of [100, 200, 400, 800]) {
        files.push(["data/uniform/"+i+"/"+i+".fv2.csv", "UN"+i])
    }
    for (i of [100, 200, 400, 800]) {
        files.push(["data/linear/"+i+"/"+i+".fv2.csv", "LN"+i])
    }
    for (i of [100, 200, 400, 800]) {
        files.push(["data/gaussian/"+i+"/"+i+".fv2.csv", "GN"+i])
    }
    for (i of [100, 200, 400, 800]) {
        files.push(["data/top/top"+i+"/top"+i+".fv2.csv", "CN"+i])
    }
    for (i of [0, 100, 200, 400]) {
        files.push(["data/maxvar/"+i+"/"+i+".fv2.csv", "MV"+i])
    }
    for (file of [
        //"RW03-ecoli-normalized.csv", 
        //"RW06-iris-normalized.csv", 
        ["RW09-seeds-normalized.csv", "Seeds"], 
        ["RW01-airquality-normalized.csv", "Air Quality"],
        ["RW04-forestfires-normalized.csv", "Forest Fires"],
        ["RW07-wine-normalized.csv", "Wine"],
        //"RW10-stoneFlakes-normalized.csv", 
        //"RW02-breasttissue-normalized.csv", 
        //"RW05-glass-normalized.csv", 
        //"RW08-mtCars-normalized.csv"
    ]) { files.push(["data/realworld/FinalVersion/" + file[0], file[1]]); }

    var i = 0; 

    for (file of files) {

        var headings = {
            0: "Random Noise", 
            4: "Linear Noise", //+- 0.2
            8: "Gaussian Noise", 
            12: "Synthetic Data", 
            16: "Variance",
            20: "Real World Data" };
        if (Object.keys(headings).includes(i+"")) {
            var checkboxgroup = $("<section>")
                .attr("class", "checkboxgroup")
                .appendTo("#boxes");
            $("<b>")
                .text(headings[i])
                .appendTo(checkboxgroup);
        }

        // create checkboxes
        var section = $("<section>")
            .appendTo(checkboxgroup);
        $("<input>")
            .attr("type", "checkbox")
            .attr("id", file[0])
            .attr("onChange", "toggleVis('"+file[0]+"')")
            .appendTo(section);
        $("<label>")
            .attr("for", file[0])
            .text(file[1])
            .appendTo(section);

        // create targets for ordered figures
        var comparebox = $("<div>")
            .attr("class", "row")
            .appendTo("main");
        $("<div>")
            .attr("id", "pcTarget"+i+"a")
            .appendTo(comparebox);
        $("<div>")
            .attr("id", "pcTarget"+i+"b")
            .appendTo(comparebox);

        i++;
    }
}
