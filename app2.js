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
    allAvgs[y]["year"] = t;
    allAvgs[y]["usage"] = avgUsagePerYear(zipcode, uniqYears[y]);
  }
  return allAvgs;
};

var allZipsAvgsForYear = function(year){
  var allZips = [];
  for(var y = 0; y < uniqZips.length; y++){
    var t = uniqZips[y];
    allZips[y] = {};
    allZips[y]["zip"] = t;
    allZips[y]["usage"] = avgUsagePerYear(uniqZips[y], year);
  }
  return allZips;
};
// console.log(allZipsAvgsForYear("13"));


//// D3 STUFF:
var dataset = d3.shuffle(allZipsAvgsForYear("13"));
// console.log(dataset);


var diameter = 960,
    format = d3.format(""),
    color = d3.scale.category20c();

// var bubble = d3.layout.pack()
//     .sort(null)
//     .size([diameter, diameter])
//     .padding(1.5);

var svg = d3.select("body").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

// d3.json("allzips.json", function(error, root) {
//   if (error) throw error;
  var node = svg.selectAll(".node")
      .data(dataset)
        // .filter(function(d) { return !d.children; })
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + Math.random()*(diameter) + "," + Math.random()*(diameter) + ")"; });

    node.append("title")
        .text(function(d) { return d.zip; });

    node.append("circle")
        .attr("r", function(d) { return d.usage; })
        .style("fill", function(d) { return color(d.zip); });

    node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.zip; });
// });

d3.select(self.frameElement).style("height", diameter + "px");
