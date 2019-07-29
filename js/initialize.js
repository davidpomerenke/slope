var targetCounter = 0
var checkboxgroup

function initialize(files, uploaded = false) {
    for (file of files) {
        if (Object.keys(headings).includes(targetCounter + "")) {
            checkboxgroup = $("<section>")
                .attr("class", "checkboxgroup")
                .appendTo("#boxes")
            $("<b>")
                .text(headings[targetCounter])
                .appendTo(checkboxgroup)
        }

        // create checkboxes
        var section = $("<section>")
            .appendTo(checkboxgroup)
        $("<input>")
            .attr("type", "checkbox")
            .attr("id", file[0])
            .attr("onChange", "toggleVis('" + file[0] + "', uploaded = " + uploaded + ")")
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
            .attr("id", "pcTarget" + targetCounter + "a")
            .appendTo(comparebox)
        $("<div>")
            .attr("id", "pcTarget" + targetCounter + "b")
            .appendTo(comparebox)

        targetCounter++
    }
}