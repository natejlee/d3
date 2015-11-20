//// SIMPLIFYING DATA:
var months = _.pluck(data, 9);
var zipcodes = _.pluck(data, 10);
var uniqZips = _.uniq(zipcodes);
var usage = _.pluck(data, 11);
var years = [];
for (var i = 0; i < months.length; i++) {
  years.push(months[i].split("-")[1]);
};
var uniqYears = _.uniq(years);
////  THIS IS OUR DATA IN FORMAT [ZIPCODE, YEAR, USAGE]
var condensedData = _.zip(zipcodes, years, usage);
// console.log(condensedData);
var avgUsagePerYear = function(zipcode, year){
  var usage = [];
  for (var i = 0; i < condensedData.length; i++) {
    if(condensedData[i][0] === zipcode && condensedData[i][1] === year){
      usage.push(condensedData[i][2]);
    }
  };
  var compound = _.reduce(usage, function(memo, item){
    return (+memo)+(+item);
  });
  return compound/usage.length;
}


var avgsForZip = function(zipcode){
  var allAvgs = [];
  for(var y = 0; y < uniqYears.length; y++){
    var t = uniqYears[y];
    allAvgs[y] = {};
    allAvgs[y][t] = avgUsagePerYear(zipcode, uniqYears[y]);
  }
  return allAvgs;
}

//// D3 STUFF:
var dataset = avgsForZip("90001");

var objKey = function(obj){
  for(var key in obj){
    return "20" + key;
  }
}

var objVal = function(obj){
  for(var key in obj){
    return obj[key];
  }
}

var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 540 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .domain(dataset.map(function(d) { return objKey(d); }))
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d) { return objVal(d); })])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    // .ticks(20)
    .tickFormat(d3.format(""));

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong>Gallons:</strong> <span style='color:lightblue'>" + Math.round(objVal(d)*748) + "</span>";
    });

var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("fill", "cornflowerblue")
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(25," + height + ")")
  .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "1em")
    .style("text-anchor", "end")
    .text("HCF");

svg.selectAll(".bar")
  .data(dataset)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr({
    width: function(d){return 50},
    height: function(d, i){ return objVal(d) * 20 },
    x: function(d, i){return i*52 + 30},
    y: function(d){ return height - objVal(d) * 20 }
  })
  .on('mouseover', tip.show)
  .on('mouseout', tip.hide);

var objects = avgsForZip("90001");
console.log(objKey(objects[0]));
