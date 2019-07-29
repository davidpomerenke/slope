var files = []
var activeFiles = new Set()

function update(parameter, value) {

    $("#show-" + parameter).text(Math.round(value * 10) / 10)

    if (parameter === "height") {
        height = value
    } else if (parameter === "space") {
        space = value
    } else if (parameter === "c") {
        c = value
    } else if (parameter === "linewidth") {
        linewidth = value
    } else if (parameter === "opacity") {
        opacity = value + ""
    } else if (parameter === "colour") {
        color = $("#select-colour").val()
    } else if (parameter === "power") {
        power = value
    } else if (parameter === "rendering") {
        rendering = $("#select-rendering").val()
    }
    // Toggle off and on for an update
    var copy = Array.from(activeFiles)
    copy.forEach(e => { toggleVis(e); toggleVis(e) })
}

function toggleVis(file) {

    if (activeFiles.has(file)) {
        activeFiles.delete(file)
    } else {
        activeFiles.add(file)
    }

    var i = files.map(f => f[0]).indexOf(file);

    ["a", "b"].forEach(s => {

        if ($("#pcTarget" + i + s).html() === "") {
            pcVis(file, "#pcTarget" + i + s, (s === "a" ? "original" : "adjusted"), 0.5)
        }
        else {
            $("#pcTarget" + i + s).html("")
        }

    })
}

function main() {

    $("input:checkbox :not(.linkcheck)").removeAttr("checked").prop("checked", false)

    $(".linkcheck").attr("onchange", "update()");

    // jQuery UI slider function
    ["height", "space", "c"].forEach(function (parameter) {
        $("#slider-" + parameter).slider({
            step: 0.05,
            min: 0.6,
            max: 1.4,
            value: 1,
            stop: function (event, ui) {
                update(parameter, ui.value * ui.value)
            }
        })
    })

    $("#slider-thickness").slider({
        step: 0.1,
        min: 0.1,
        max: 5,
        value: 1,
        stop: function (event, ui) {
            update("linewidth", ui.value * ui.value * ui.value)
        }
    })

    $("#slider-opacity").slider({
        step: 0.01,
        min: 0,
        max: 1,
        value: 1,
        stop: function (event, ui) {
            update("opacity", ui.value * ui.value * ui.value)
        }
    })

    $("#slider-power").slider({
        step: 0.05,
        min: -2,
        max: 5,
        value: 1,
        stop: function (event, ui) {
            update("power", ui.value)
        }
    })

    // define headings for datasets
    var headings = {
        0: "Random Noise",
        4: "Linear Noise", //+- 0.2
        8: "Gaussian Noise",
        12: "Synthetic Data 1",
        16: "Synthetic Data 2",
        20: "Variance",
        24: "Correlations",
        28: "Realworld Data",
        32: "", 
        36: "Own Datasets"
    }

    // add all file names and short descriptions
    for (dataset of ["uniform", "linear", "linear", "synthetic-1", "synthetic-2", "variance", "correlations"]) {
        for (i of [100, 200, 400, 800]) {
            files.push(["data/" + dataset + "-" + i + ".csv", "N" + i])
        }
    }
    for (file of [
        ["realworld-acidosis-patients.csv", "Acidosis"],
        ["realworld-all-mammals-milk-1956.csv", "Milk 1"],
        ["realworld-life-expectancy-1971.csv", "Life Exp."],
        ["realworld-mutation-distances-1967.csv", "Mutations"],
        ["realworld-rda-meat-fish-fowl-1959.csv", "Fowl"],
        ["realworld-sample-mammals-milk-1956.csv", "Milk 2"],
        ["realworld-us-south-demographics-1965.csv", "Demograph."],
        ["realworld-mammal-dentition.csv", "Dentition"],
    ]) {
        files.push(["data/" + file[0], file[1]])
    }
    for (ownfile of ownFiles) {
        files.push(["data/" + ownfile[0], ownfile[1]])
    }

    var i = 0

    // create headers for checkboxes and target areas for plots
    for (file of files) {

        if (Object.keys(headings).includes(i + "")) {
            var checkboxgroup = $("<section>")
                .attr("class", "checkboxgroup")
                .appendTo("#boxes")
            $("<b>")
                .text(headings[i])
                .appendTo(checkboxgroup)
        }

        // create checkboxes
        var section = $("<section>")
            .appendTo(checkboxgroup)
        $("<input>")
            .attr("type", "checkbox")
            .attr("id", file[0])
            .attr("onChange", "toggleVis('" + file[0] + "')")
            .appendTo(section)
        $("<label>")
            .attr("for", file[0])
            .text(file[1])
            .appendTo(section)

        // create targets for ordered figures
        var comparebox = $("<div>")
            .attr("class", "row")
            .appendTo("main")
        $("<div>")
            .attr("id", "pcTarget" + i + "a")
            .appendTo(comparebox)
        $("<div>")
            .attr("id", "pcTarget" + i + "b")
            .appendTo(comparebox)

        i++
    }
}
