////////////////////////////////////////////////////////////
//////////////////////// Set-up ////////////////////////////
////////////////////////////////////////////////////////////

var screenWidth = $(window).width();

var margin = {left: 40, top: 10, right: 40, bottom: 10},
    width = Math.min(screenWidth, 900) - margin.left - margin.right,
    height = Math.min(screenWidth, 900)*5/6 - margin.top - margin.bottom;

var svg = d3.select("#chart").append("svg")
    .attr("width", (width + margin.left + margin.right))
    .attr("height", (height + margin.top + margin.bottom));



var wrapper = svg.append("g").attr("class", "chordWrapper")
    .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");;
//Vis Title

svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .text("Value vs Date Graph");
var outerRadius = Math.min(width, height) / 2  - 100,
    innerRadius = outerRadius * 0.95,
    opacityDefault = 0.7; //default opacity of chords

////////////////////////////////////////////////////////////
////////////////////////// Data ////////////////////////////
////////////////////////////////////////////////////////////

var Names = ["Fall","Winter","Spring","Summer"];

var matrix = [
    [32.02, 149.06, 212.54, 328.5], //march fall
    [44.58, 138.72, 212.47, 348.20], //june winter
    [12.6, 140.89, 220.04, 271.00], //september spring
    [328.5,348.20, 271.00, 0], //december summer

];

var chord = d3.layout.chord()
    .padding(.02)
    // .sortSubgroups(d3.descending) //sort the chords inside an arc from high to low
    //.sortChords(d3.descending) //which chord should be shown on top when chords cross. Now the biggest chord is at the bottom
    .matrix(matrix);

var arc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

var path = d3.svg.chord()
    .radius(innerRadius);

var fill = d3.scale.ordinal()
    .domain(d3.range(Names.length))
    .range(["#03E6B8", "#f8ae05", "#2024E0", "#D400DB"]);

////////////////////////////////////////////////////////////
//////////////////// Draw outer Arcs ///////////////////////
////////////////////////////////////////////////////////////

var g = wrapper.selectAll("g.group")
    .data(chord.groups)
    .enter().append("g")
    .attr("class", "group");;

g.append("path")
    .style("stroke", function(d) { return fill(d.index); })
    .style("fill", function(d) { return fill(d.index); })
    .attr("d", arc);


////////////////////////////////////////////////////////////
////////////////////// Append Names ////////////////////////
////////////////////////////////////////////////////////////

g.append("text")
    .each(function(d) { d.angle = ((d.startAngle + d.endAngle) / 2);})
    .attr("dy", ".35em")
    .attr("class", "titles")
    .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
    .attr("transform", function(d,i) {
        var c = arc.centroid(d);
        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
            + "translate(" + (innerRadius + 40) + ")"
            + (d.angle > Math.PI ? "rotate(180)" : "")
    })
    .text(function(d,i) { return Names[i]; });

////////////////////////////////////////////////////////////
//////////////////// Draw inner chords /////////////////////
////////////////////////////////////////////////////////////

var colors = ["#00A0B0","#CC333F","#EDC951"];
var chords = wrapper.selectAll("path.chord")
    .data(chord.chords)
    .enter().append("path")
    .attr("class", "chord")
    .style("stroke", "none")
    .style("fill", function(d,i) { return fill(d.target.index); })
    .style("opacity", opacityDefault)
    .attr("d", path);

////////////////////////////////////////////////////////////
///////////////////////// Tooltip //////////////////////////
////////////////////////////////////////////////////////////

//Arcs
g.append("title")
    .text(function(d, i) {return Math.round(d.value) + " wind observations in " + Names[i];});

//Chords
chords.append("title")
    .text(function(d) {
        return [Names[d.target.index], " to ", Names[d.source.index]].join("");
    });

//Include the offset in de start and end angle to rotate the Chord diagram clockwise
function startAngle(d) { return d.startAngle + offset; }
function endAngle(d) { return d.endAngle + offset; }


