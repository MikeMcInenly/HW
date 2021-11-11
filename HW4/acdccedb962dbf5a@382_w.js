// https://observablehq.com/@d3/chord-diagram@382
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Chord Diagram

The outer arcs in this [chord diagram](https://github.com/d3/d3-chord) show the proportion of survey respondents owning a particular brand of phone, while the inner chords show the brand of these individuals’ previous phone. Hence, this chart shows how the consumers shift between brands. Data via [Nadieh Bremer](https://www.visualcinnamon.com/2014/12/using-data-storytelling-with-chord.html).`
)});
  main.variable(observer("chart")).define("chart", ["d3","width","height","chord","data","color","names","arc","formatValue","ticks","outerRadius","ribbon"], function(d3,width,height,chord,data,color,names,arc,formatValue,ticks,outerRadius,ribbon)
{
  const svg = d3.create("svg")
      .attr("viewBox", [-width / 2, -height / 2, width, height]);

  const chords = chord(data);

  const group = svg.append("g")
      .attr("font-size", 10)
      .attr("font-family", "sans-serif")
    .selectAll("g")
    .data(chords.groups)
    .join("g");

  group.append("path")
      .attr("fill", d => color(names[d.index]))
      .attr("d", arc);

  group.append("title")
      .text(d => `${names[d.index]}
${formatValue(d.value)}`);

  const groupTick = group.append("g")
    .selectAll("g")
    .data(ticks)
    .join("g")
      .attr("transform", d => `rotate(${d.angle * 180 / Math.PI - 90}) translate(${outerRadius},0)`);

  groupTick.append("line")
      .attr("stroke", "currentColor")
      .attr("x2", 6);

  groupTick.append("text")
      .attr("x", 8)
      .attr("dy", "0.35em")
      .attr("transform", d => d.angle > Math.PI ? "rotate(180) translate(-16)" : null)
      .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
      .text(d => formatValue(d.value));

  group.select("text")
      .attr("font-weight", "bold")
      .text(function(d) {
        return this.getAttribute("text-anchor") === "end"
            ? `↑ ${names[d.index]}`
            : `${names[d.index]} ↓`;
      });

  svg.append("g")
      .attr("fill-opacity", 0.8)
    .selectAll("path")
    .data(chords)
    .join("path")
      .style("mix-blend-mode", "multiply")
      .attr("fill", d => color(names[d.source.index]))
      .attr("d", ribbon)
    .append("title")
      .text(d => `${formatValue(d.source.value)} ${names[d.target.index]} → ${names[d.source.index]}${d.source.index === d.target.index ? "" : `\n${formatValue(d.target.value)} ${names[d.source.index]} → ${names[d.target.index]}`}`);

  return svg.node();
}
);
  main.variable(observer("data")).define("data", function(){return(
Object.assign([
  [.096899, .008859, .000554, .004430, .025471, .024363, .005537, .025471],
  [.001107, .018272, .000000, .004983, .011074, .010520, .002215, .004983],
  [.000554, .002769, .002215, .002215, .003876, .008306, .000554, .003322],
  [.000554, .001107, .000554, .012182, .011628, .006645, .004983, .010520],
  [.002215, .004430, .000000, .002769, .104097, .012182, .004983, .028239],
  [.011628, .026024, .000000, .013843, .087486, .168328, .017165, .055925],
  [.000554, .004983, .000000, .003322, .004430, .008859, .017719, .004430],
  [.002215, .007198, .000000, .003322, .016611, .014950, .001107, .054264]
], {
  names: ["Apple", "HTC", "Huawei", "LG", "Nokia", "Samsung", "Sony", "Other"],
  colors: ["#c4c4c4", "#69b40f", "#ec1d25", "#c8125c", "#008fc8", "#10218b", "#134b24", "#737373"]
})
)});
  main.variable(observer("names")).define("names", ["data","d3"], function(data,d3){return(
data.names === undefined ? d3.range(data.length) : data.names
)});
  main.variable(observer("colors")).define("colors", ["data","d3","names"], function(data,d3,names){return(
data.colors === undefined ? d3.quantize(d3.interpolateRainbow, names.length) : data.colors
)});
  main.variable(observer("ticks")).define("ticks", ["d3","tickStep"], function(d3,tickStep){return(
function ticks({startAngle, endAngle, value}) {
  const k = (endAngle - startAngle) / value;
  return d3.range(0, value, tickStep).map(value => {
    return {value, angle: value * k + startAngle};
  });
}
)});
  main.variable(observer("tickStep")).define("tickStep", ["d3","data"], function(d3,data){return(
d3.tickStep(0, d3.sum(data.flat()), 100)
)});
  main.variable(observer("formatValue")).define("formatValue", ["d3"], function(d3){return(
d3.format(".1~%")
)});
  main.variable(observer("chord")).define("chord", ["d3","innerRadius"], function(d3,innerRadius){return(
d3.chord()
    .padAngle(10 / innerRadius)
    .sortSubgroups(d3.descending)
    .sortChords(d3.descending)
)});
  main.variable(observer("arc")).define("arc", ["d3","innerRadius","outerRadius"], function(d3,innerRadius,outerRadius){return(
d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
)});
  main.variable(observer("ribbon")).define("ribbon", ["d3","innerRadius"], function(d3,innerRadius){return(
d3.ribbon()
    .radius(innerRadius - 1)
    .padAngle(1 / innerRadius)
)});
  main.variable(observer("color")).define("color", ["d3","names","colors"], function(d3,names,colors){return(
d3.scaleOrdinal(names, colors)
)});
  main.variable(observer("outerRadius")).define("outerRadius", ["width","height"], function(width,height){return(
Math.min(width, height) * 0.5 - 60
)});
  main.variable(observer("innerRadius")).define("innerRadius", ["outerRadius"], function(outerRadius){return(
outerRadius - 10
)});
  main.variable(observer("height")).define("height", ["width"], function(width){return(
width
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6")
)});
  return main;
}
