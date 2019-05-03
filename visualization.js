var power = 1.0;

function lineWidth // for a couple of points on two neighbouring axes
(
    lineMethod, 
    heightDifference, // between the points
    widthDifference // between the points = between the axes
) {

    if (lineMethod === "emphasize dis") {
        return 1;
    }

    else if (lineMethod === "neutral") {

        var method = 4;

        if (method === 1) {
            return 1 / Math.sqrt(heightDifference / widthDifference + 1);
        }
       
		var alpha = Math.abs(Math.atan(heightDifference / widthDifference));

        if (method === 2) {
			return Math.cos(alpha);
		}
		if (method === 3) {
			return Math.max(Math.cos(alpha * alpha), 0.2);
		}
		if (method === 4) {
			return Math.pow(Math.cos(alpha), power);
        }
    }

    else { // experimental techniques, unused here
    
        alpha = Math.abs(Math.atan(heightDifference / widthDifference));
        
        maxHeightDifference = Math.abs(y_scale(1) - y_scale(0));
        
        alpha_max = Math.abs(Math.atan(maxHeightDifference / widthDifference));

        if (lineMethod === "neutral bold") {
            return Math.abs(Math.cos(alpha)) / Math.abs(Math.cos(alpha_max)) / 2;
        }

        else if (lineMethod === "emphasize sim") {
            return Math.abs(Math.cos(alpha)) / Math.abs(Math.cos(alpha_max - alpha));
        }

        else {
            console.log("Error: Invalid line method specified.");
            return 0;
        }

    }
}

/* lineMethod
 - emphasize dis:                normal lines
 - neutral:                      adjust line width with math
 - neutral polygon:              adjust line width with polygon; poorer anti-aliasing
 - neutral bold  (experimental): neutral; line width corresponds to boldest possible line in emphasize dis
 - emphasize sim (experimental): revert emphasize dis effect; useless */
function pcVis(file, pcTarget, lineMethod, scale_factor = 1) {

    var m = [10, 10, 10, 10],
        w = 960 - m[1] - m[3],
        h = 500 - m[0] - m[2];

    var x = d3.scale.ordinal().rangePoints([0, w], 1),
        y = {},
        dragging = {};

    var line = d3.svg.line(),
        axis = d3.svg.axis().orient("left"),
        foreground;

    var svg = d3.select(pcTarget)
        .append("svg:svg")
            .attr("width", 850 * scale_factor)
            .attr("height", (h + m[0] + m[2]) * scale_factor)
            .append("svg:g")
                .attr("transform", "translate(" + (-50 * scale_factor) + "," + (m[0] * scale_factor) + "), scale(" + scale_factor + ")")
                .attr("draggable", "false")
                .attr("viewBox", "0 0 850" + h + m[0] + m[2])
                .attr("class", "box");

    d3.csv(file, function (data) {
        
        $(pcTarget).css("display", "none");
        
        y_scale = d3.scale.linear()
                .domain([0, 1])
                .range([h, 0]);

        // Extract the list of dimensions and create a scale for each.
        x.domain(dimensions = d3.keys(data[0]).filter(function (d) {
            return d !== "ObjectID" && d !== "id" && d !== "ObjectId" && (y[d] = d3.scale.linear()
                .domain([0, 1])
                .range([h, 0]));
        }));
        
        // Returns the path for a given data point.
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
                points = [dimensions[k],dimensions[k+1]].map(function (p) {
                    return [position(p), y_scale(d[p])];
                });
                heightDifference = Math.abs(points[1][1] - points[0][1]);
                widthDifference = Math.abs(points[1][0] - points[0][0]);
                return lineWidth(lineMethod, heightDifference, widthDifference);
            }
        }

        function createPolygonFunction(k) {
            return function(d) {
                points = [dimensions[k],dimensions[k+1]].map(function (p) {
                    return [position(p), y_scale(d[p])];
                });
                heightDifference = Math.abs(points[1][1] - points[0][1]);
                widthDifference = Math.abs(points[1][0] - points[0][0]);
                return ""
                    + points[0][0] + "," +  points[0][1]      + " "
                    + points[0][0] + "," + (points[0][1] + 1) + " "
                    + points[1][0] + "," + (points[1][1] + 1) + " "
                    + points[1][0] + "," +  points[1][1]      + " "
            }
        }
        
        foreground = [];

        for (k = 0; k < (dimensions.length - 1); k++) {

            // Add blue foreground lines
            foreground[k] = svg.append("svg:g")
                .attr("class", "foreground")
                .attr("id", "fground"+k);

            if (lineMethod != "neutral polygon") {
                foreground[k].selectAll("path")
                    .data(data).enter()
                        .append("svg:path")
                            .attr("d", createPathFunction(k))
                            .attr("stroke-width", createWidthFunction(k))
                            .attr("data-stroke-width", createWidthFunction(k));
            }
            else if (lineMethod === "neutral polygon") {
                // alternative rendering with polygon and without math
                // unfortunately, anti-aliasing is poorer than the above method
                foreground[k].selectAll("path")
                    .data(data).enter()
                        .append("svg:polygon")
                            .attr("points", createPolygonFunction(k))
            }
        }

        // Add a group element for each dimension.
        var g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter().append("svg:g")
            .attr("class", "dimension")
            .attr("transform", function (d) {
                return "translate(" + x(d) + ")";
            });

        // Add an axis.
        g.append("svg:g")
            .attr("class", "axis")
            .each(function (d) {
                d3.select(this).call(axis.scale(y[d]));
            });

        // Update properties from sliders. 
        update("height",    Math.pow($("#slider-height")   .slider("value"), 2),    pcTarget);
        update("space",     Math.pow($("#slider-space")    .slider("value"), 2),    pcTarget);
        update("thickness", Math.pow($("#slider-thickness").slider("value"), 3),    pcTarget);
        update("opacity",            $("#slider-opacity")  .slider("value"),        pcTarget);
        update("colour",             $("#select-colour option:selected").val(),     pcTarget);

        $(pcTarget).css("display", "unset");
    });

    function position(d) {
        var v = dragging[d];
        return v == null ? x(d) : v;
    }

}