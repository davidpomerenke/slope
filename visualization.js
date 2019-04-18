var numberOfDimensions = 0;

function pcVis(file, pcTarget, scale_factor = 1, lineMethod = "emphasize_dis") {

    dataName = file;
    pc = true;
    sg = false;
    var m = [30, 10, 10, 10],
        w = 960 - m[1] - m[3],
        h = 500 - m[0] - m[2];

    var x = d3.scale.ordinal().rangePoints([0, w], 1),
        y = {},
        dragging = {};

    var line = d3.svg.line(),
        axis = d3.svg.axis().orient("left"),
        foreground;

    var svg = d3.select(pcTarget).append("svg:svg")
        .attr("width", 850 * scale_factor)
        .attr("height", (h + m[0] + m[2]) * scale_factor)
        .append("svg:g")
        .attr("transform", "translate(" + (-50 * scale_factor) + "," + (m[0] * scale_factor) + "), scale(" + scale_factor + ")")
        .attr("draggable", "false")
        .attr("viewBox", "0 0 850" + h + m[0] + m[2])

    d3.csv(file, function (data) {
        
        y_scale = d3.scale.linear()
                .domain([0, 1])
                .range([h, 0]);

        // Extract the list of dimensions and create a scale for each.
        x.domain(dimensions = d3.keys(data[0]).filter(function (d) {
            return d !== "ObjectID" && (y[d] = d3.scale.linear()
                .domain([0, 1])
                .range([h, 0]));
        }));
        numberOfDimensions = dimensions.length;
        
        // cf. https://stackoverflow.com/questions/750486/javascript-closure-inside-loops-simple-practical-example
        function createPathFunction(k) {
            return function(d) {
                    points = [dimensions[k],dimensions[k+1]].map(function (p) {
                            return [position(p), y_scale(d[p])];
                        });
                    return line(points);  
                }
        }

        function createWidthFunction(k) {
            return function(d) {
                if (lineMethod === "emphasize_dis") {
                    return 1;
                }
                else {
                    points = [dimensions[k],dimensions[k+1]].map(function (p) {
                            return [position(p), y_scale(d[p])];
                        });
                    heightDifference = Math.abs(points[1][1] - points[0][1]);
                    widthDifference = Math.abs(points[1][0] - points[0][0]);
                    alpha = Math.abs(Math.atan(heightDifference / widthDifference));
                    if (lineMethod === "thin") {
                        return Math.abs(Math.cos(alpha));
                    }
                    else {
                        maxHeightDifference = Math.abs(y_scale(1) - y_scale(0));
                        alpha_max = Math.abs(Math.atan(maxHeightDifference / widthDifference));
                        if (lineMethod === "bold") {
                            return Math.abs(Math.cos(alpha)) / Math.abs(Math.cos(alpha_max)) / 2;
                        }
                        else if (lineMethod === "emphasize_sim") {
                            return Math.abs(Math.cos(alpha)) / Math.abs(Math.cos(alpha_max - alpha));
                        }
                        else {
                            console.log("Error: Invalid line method pecified.");
                            return 0;
                        }
                    }
                    }
                }
        }
            
        path = [];
        width = []
        for (k = 0; k < (numberOfDimensions - 1); k++) {
            // Returns the path for a given data point.
            path[k] = createPathFunction(k);
            width[k] = createWidthFunction(k);
        }

        // Add blue foreground lines
        foreground = [];
        for (j = 0; j < (numberOfDimensions - 1); j++) {
            foreground[j] = svg.append("svg:g")
                .attr("class", "foreground")
                .attr("id", "fground"+j)
                .selectAll("path")
                .data(data)
                .enter().append("svg:path")
                .attr("d", path[j])
                .attr("stroke-width", width[j]);
        }

        // Add a group element for each dimension.
        var g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter().append("svg:g")
            .attr("class", "dimension")
            .attr("transform", function (d) {
                return "translate(" + x(d) + ")";
            });

        // Add an axis and title.
        g.append("svg:g")
            .attr("class", "axis")
            .each(function (d) {
                d3.select(this).call(axis.scale(y[d]));
            })
            .append("svg:text")
            .attr("text-anchor", "middle")
            .attr("y", -9)
            .text(String);
    });

    function position(d) {
        var v = dragging[d];
        return v == null ? x(d) : v;
    }
}