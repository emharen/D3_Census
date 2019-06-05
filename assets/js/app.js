// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);

makeResponsive();


function makeResponsive(){
  // svg container dimension set-up
  var svgArea = d3.select("body").select("svg");
  if (!svgArea.empty()) {svgArea.remove();}

    // SVG wrapper dimensions are determined by the current width and height of the browser window.
  var svgWidth = window.innerWidth- 300;
  var svgHeight = window.innerHeight- 300;

  var margin = {
    top: 30,
    right: 50,
    bottom: 80,
    left: 40
  };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  // Create an SVG wrapper, append an SVG group that will hold our chart,
  // and shift the latter by left and top margins.
  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // Append an SVG group
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


  d3.csv("assets/data/data.csv").then(function(cenData) {

      // parse data
      cenData.forEach(function(data) {
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
      });  

      console.log(cenData);

      var xLinearScale = d3.scaleBand()
      .domain(cenData.map(d => d.obesity))
      .range([0, width])
      .padding(0.1);

    // Create a linear scale for the vertical axis.
      var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(cenData, d => d.smokes)])
      .range([height, 0]); 

    // Create two new functions passing our scales in as arguments
    // These will be used to create the chart's axes
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);

    // Append two SVG group elements to the chartGroup area,
    // and create the bottom and left axes inside of them
      chartGroup.append("g")
      .call(leftAxis);

      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

      svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 0)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Smokes");  

        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height)
            .text("Obesity");

      var circlesGroup = chartGroup.selectAll("circle")
        .data(cenData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.obesity))
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("r", 15)
        .attr("fill", "blue")
        .attr("opacity", ".5");

        var fValue = (d) => {return d.state_abbr;};

        chartGroup.selectAll()
        .data(cenData)
        .enter()
        .append("text")
        .attr("class", "state")
        .attr("x", (d) => xLinearScale(d.obesity))
        .attr("y", (d) => yLinearScale(d.smokes))
        .attr("text-anchor", 'middle')
        .style("fill", "white")
        .text((d) => (d.abbr))

        

      // Step 1: Initialize Tooltip
      var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`<strong> ${(d.state)}<hr> Obesity: ${(d.obesity)}<br/>smokes: ${d.smokes}`);
      });

      // Step 2: Create the tooltip in chartGroup.
      chartGroup.call(toolTip);

      // Step 3: Create "mouseover" event listener to display tooltip
      circlesGroup.on("mouseover", function(d) {
      toolTip.show(d, this);
      })
      // Step 4: Create "mouseout" event listener to hide tooltip
      .on("mouseout", function(d) {
        toolTip.hide(d);
      });

        
  })

}