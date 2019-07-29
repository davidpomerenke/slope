var height = 1.0
var space = 1.0
var linewidth = 1.0
var opacity = 1.0
var power = 1.0
var color = "black"
var scale = 1.0
var c = 1.0
var rendering ="line"

function adjustment // for a couple of points on two neighbouring axes
(
    method, 
    heightDifference, // between the points
    widthDifference // between the points = between the axes
) {
    if (method === "original") {
        return 1
    } 
    
    else if (method === "adjusted") {

		var alpha = Math.abs(Math.atan(heightDifference / widthDifference))
        return Math.pow(Math.cos(alpha), power) * c
    } 
    
    else { // experimental techniques, unused here
    
        alpha = Math.abs(Math.atan(heightDifference / widthDifference))
        
        maxHeightDifference = Math.abs(y_scale(1) - y_scale(0))
        
        alpha_max = Math.abs(Math.atan(maxHeightDifference / widthDifference))

        if (method === "neutral bold") {
            return Math.abs(Math.cos(alpha)) / Math.abs(Math.cos(alpha_max)) / 2
        }

        else if (method === "emphasize sim") {
            return Math.abs(Math.cos(alpha)) / Math.abs(Math.cos(alpha_max - alpha))
        }

        else {
            console.log("Error: Invalid line method specified.")
            return 0
        }
    }
}

/* lineMethod
 - original:                     normal lines
 - adjusted:                     adjust line width with math
 - polygon:                      adjust line width with polygon poorer anti-aliasing
 - neutral bold  (experimental): neutral line width corresponds to boldest possible line in emphasize dis
 - emphasize sim (experimental): revert emphasize dis effect useless */
function pcVis(file, pcTarget, method) {

    var m = [10 * height * scale, 10 * space * scale, 10 * height * scale, 10 * space * scale],
        w = (480 - m[1] - m[3]) * scale * space,
        h = (250 - m[0] - m[2]) * scale * height

    var x = d3.scale.ordinal().rangePoints([0, w], 1),
        y = {},
        dragging = {}

    var line = d3.svg.line(),
        axis = d3.svg.axis().orient("left"),
        foreground

    var svg = d3.select(pcTarget)
        .append("svg:svg")
            .attr("width", w  + m[1] + m[3])
            .attr("height", h + m[0] + m[2])
            .attr("shape-rendering", "geometricPrecision")
            .append("svg:g")
                .attr("transform", "translate(" + m[1] + "," + m[0] + "), scale(" + scale + ")")
                .attr("draggable", "false")
                .attr("class", "box")

    d3.csv(file, function (data) {
        
        $(pcTarget).css("display", "none")
        
        y_scale = d3.scale.linear()
                .domain([0, 1])
                .range([h, 0])

        // Extract the list of dimensions and create a scale for each.
        x.domain(dimensions = d3.keys(data[0]).filter(function (d) {
            return d !== "ObjectID" && d !== "id" && d !== "ObjectId" && d != "Cluster" && d !== "cluster" && d !== "class" && (y[d] = d3.scale.linear()
                .domain([0, 1])
                .range([h, 0]))
        }))

        var categories = new Set()
        data.forEach(d => {
            categories.add(d[Object.keys(d)[0]])
        })
        colors = ["grey", "blue", "red", "green", "turquoise", "violet", "yellow"]
        colormap = {}
        i = 0
        for (cat of categories) {
            colormap[cat] = colors[i % colors.length]
            i++
        }
        
        // Returns the path for a given data point.
        // cf. https://stackoverflow.com/questions/750486/javascript-closure-inside-loops-simple-practical-example
        function createPathFunction(k) {
            return function(d) {
                points = [dimensions[k],dimensions[k+1]].map(function (p) {
                    return [position(p), y_scale(d[p])]
                })
                return line(points)  
            }
        }

        function createAdjustmentFunction(k, factor) {
            return function(d) {
                points = [dimensions[k],dimensions[k+1]].map(function (p) {
                    return [position(p), y_scale(d[p])]
                })
                heightDifference = Math.abs(points[1][1] - points[0][1])
                widthDifference = Math.abs(points[1][0] - points[0][0])

                return adjustment(method, heightDifference, widthDifference) * factor
            }
        }

        function createPolygonFunction(k, factor) {
            return function(d) {
                points = [dimensions[k],dimensions[k+1]].map(function (p) {
                    return [position(p), y_scale(d[p])]
                })
                heightDifference = Math.abs(points[1][1] - points[0][1])
                widthDifference = Math.abs(points[1][0] - points[0][0])
                return ""
                    + points[0][0] + "," +  points[0][1]      + " "
                    + points[0][0] + "," + (points[0][1] + factor) + " "
                    + points[1][0] + "," + (points[1][1] + factor) + " "
                    + points[1][0] + "," +  points[1][1]      + " "
            }
        }

        function createColourFunction(k) {
            return function(d) {
                return colormap[d[Object.keys(d)[1]]]
            }
        }
        
        foreground = []

        for (k = 0; k < (dimensions.length - 1); k++) {

            // Add blue foreground lines
            foreground[k] = svg.append("svg:g")
                .attr("class", "foreground")
                .attr("id", "fground"+k)

            if (method === "original" || rendering === "line") {
                foreground[k].selectAll("path")
                    .data(data).enter()
                        .append("svg:path")
                            .attr("d", createPathFunction(k))
                            .attr("stroke-width", 
                                $("#linewidthcheck").is(":checked") 
                                    ? createAdjustmentFunction(k, linewidth) 
                                    : linewidth)
                            .attr("stroke-opacity", 
                                $("#opacitycheck").prop("checked") 
                                    ? createAdjustmentFunction(k, opacity) 
                                    : opacity)
                            .attr("stroke", 
                                color === "multi" 
                                ? createColourFunction(k) 
                                : color)
                            .attr("shape-rendering", "geometricPrecision")
                            .attr("fill", "none")
            }
            else if (method === "adjusted" && rendering === "polygon") {
                // alternative rendering with polygon and without math
                // unfortunately, anti-aliasing is poorer than the above method
                foreground[k].selectAll("path")
                    .data(data).enter()
                        .append("svg:polygon")
                            .attr("points", createPolygonFunction(k, c))
                            .attr("fill", 
                                color === "multi" 
                                ? createColourFunction(k) 
                                : color)
                            .attr("stroke", "none")
                            .attr("opacity", 
                                $("#opacitycheck").prop("checked") 
                                    ? createAdjustmentFunction(k, opacity) 
                                    : opacity)
                            .attr("shape-rendering", "geometricPrecision")
            }
        }

        // Add a group element for each dimension.
        var g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter().append("svg:g")
            .attr("class", "dimension")
            .attr("transform", function (d) {
                return "translate(" + x(d) + ")"
            })

        // Add an axis.
        g.append("svg:g")
            .attr("class", "axis")
            .each(function (d) {
                d3.select(this).call(axis.scale(y[d]).ticks(0))
            })

        $(".domain")
            .attr("stroke", "black")
            .attr("fill", "none")
            .attr("shape-rendering", "geometricPrecision")
        
        $(pcTarget).css("display", "unset")
    })

    function position(d) {
        var v = dragging[d]
        return v == null ? x(d) : v
    }
}
