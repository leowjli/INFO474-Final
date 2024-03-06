// // **** Example of how to create padding and spacing for trellis plot****
// var svg = d3.select('svg');

// // Hand code the svg dimensions, you can also use +svg.attr('width') or +svg.attr('height')
// var svgWidth = +svg.attr('width');
// var svgHeight = +svg.attr('height');

// // Define a padding object
// // This will space out the trellis subplots
// var padding = {t: 20, r: 20, b: 60, l: 60};

// // Compute the dimensions of the trellis plots, assuming a 2x2 layout matrix.
// trellisWidth = svgWidth / 2 - padding.l - padding.r;
// trellisHeight = svgHeight / 2 - padding.t - padding.b;

// // As an example for how to layout elements with our variables
// // Lets create .background rects for the trellis plots
// svg.selectAll('.background')
//     .data(['A', 'B', 'C', 'D']) // dummy data
//     .enter()
//     .append('rect') // Append 4 rectangles
//     .attr('class', 'background')
//     .attr('width', trellisWidth) // Use our trellis dimensions
//     .attr('height', trellisHeight)
//     .attr('transform', function(d, i) {
//         // Position based on the matrix array indices.
//         // i = 1 for column 1, row 0)
//         var tx = (i % 2) * (trellisWidth + padding.l + padding.r) + padding.l;
//         var ty = Math.floor(i / 2) * (trellisHeight + padding.t + padding.b) + padding.t;
//         return 'translate('+[tx, ty]+')';
//     });

// var parseDate = d3.timeParse('%b %Y');
// // To speed things up, we have already computed the domains for your scales
// var dateDomain = [new Date(2000, 0), new Date(2010, 2)];
// var priceDomain = [0, 223.02];

// // **** How to properly load data ****

// d3.csv('stock_prices.csv').then(function(dataset) {

// // **** Your JavaScript code goes here ****
//     dataset.forEach(function(d) {
//         d.date = parseDate(d.date);
//     });

//     let nestedCompany = d3.nest()
//         .key(function(d) {
//             return d.company;
//         })
//         .entries(dataset);

//     let trellisG = svg.selectAll('.trellis')
//         .data(nestedCompany)
//         .enter()
//         .append('g')
//         .attr('class', 'trellis')
//         .attr('transform', function(d, i) {
//             let x = (i % 2) * (trellisWidth + padding.l + padding.r) + padding.l;
//             let y = Math.floor(i / 2) * (trellisHeight + padding.t + padding.b) + padding.t;
//             return 'translate(' + x + ',' + y + ')';
//         });

//     let xScale = d3.scaleTime()
//         .domain(dateDomain)
//         .range([0, trellisWidth]);

//     let yScale = d3.scaleLinear()
//         .domain(priceDomain)
//         .range([trellisHeight, 0]);

//     let lineInterpolate = d3.line()
//         .x((d) => xScale(d.date))
//         .y((d) => yScale(d.price));

//     let xGrid = d3.axisTop(xScale)
//         .tickSize(-trellisHeight, 0, 0)
//         .tickFormat('');
    
//     let yGrid = d3.axisLeft(yScale)
//         .tickSize(-trellisWidth, 0, 0)
//         .tickFormat('')

//     let xTicks = trellisG.append('g')
//         .attr('class', 'x grid')
//     xGrid(xTicks);

//     let yTicks = trellisG.append('g')
//         .attr('class', 'y grid')
//     yGrid(yTicks);

//     let path = trellisG.selectAll('.line-plot')
//         .data(function(d) {
//             return [d];
//         })
//         .enter()
//         .append('path')
//         .attr('class', 'line-plot')
//         .attr('d', function(d) {
//             return lineInterpolate(d.values);
//         })      
//         .style('stroke', '#333');

//     let xAxis = d3.axisBottom(xScale);
//     let yAxis = d3.axisLeft(yScale);

//     let axisX = trellisG.append('g')
//         .attr('class', 'xAxis')
//         .attr('transform', 'translate(0,' + trellisHeight + ')')
//     xAxis(axisX);

//     let axisY = trellisG.append('g')
//         .attr('class', 'yAxis')
//     yAxis(axisY);

//     let colorScale = d3.scaleOrdinal(d3.schemeCategory10);

//     let inputDomain = nestedCompany.map((d) => d.key);
//     colorScale.domain(inputDomain);

//     path.style('stroke', function(d) {
//         return colorScale(d.key);
//     })

//     trellisG.selectAll('.company-label')
//         .data(function(d){
//             return [d];
//         })
//         .enter()
//         .append('text')
//         .attr('class', 'company-label')
//         .text(function(d) {
//             return d.key;   
//         })
//         .attr('transform', 'translate(130, 110)')
//         .style('fill', function(d) {
//             return colorScale(d.key);
//         });

//     trellisG.append('text')
//         .attr('class', 'x axis-label')
//         .attr('transform', 'translate(130, 254)')
//         .text('Date (by Month)');
    
//     trellisG.append('text')
//         .attr('class', 'y axis-label')
//         .attr('transform', 'translate(-30, 110) rotate(-90)')
//         .text('Stock Price (USD)');
// });

// // Remember code outside of the data callback function will run before the data loads


{/* <svg width="800" height="400"></svg> */}

// Define margin, width, and height for the chart
const margin = { top: 20, right: 20, bottom: 30, left: 50 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Append SVG to the body
const svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

Promise.all([
    d3.csv("MDW.csv"),
    d3.csv("PHL.csv"),
    d3.csv("PHX.csv")
]).then(function (data) {
    // Parse the date / time
    const parseDate = d3.timeParse("%Y-%m-%d");

    // Set up scales and axes
    const xScale = d3.scaleTime().range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.value));

    // Combine data for all cities into one array
    const allData = data.flat();

    // Format the data
    allData.forEach(d => {
        d.date = parseDate(d.date);
        d.value = +d.value;
    });

    // Set domain for x and y scales
    x.domain(d3.extent(allData, d => d.date));
    y.domain([0, d3.max(allData, d => d.value)]);

    // Draw x-axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Draw y-axis
    svg.append("g")
        .call(yAxis);

    // Draw lines for each city
    const cities = d3.group(allData, d => d.city);
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    cities.forEach((cityData, city) => {
        svg.append("path")
            .datum(cityData)
            .attr("class", "line")
            .attr("d", line)
            .style("stroke", () => color(city))
            .append("title")
            .text(city);
    });

    // Add legend
    const legend = svg.selectAll(".legend")
        .data(cities.keys())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => "translate(0," + i * 20 + ")");

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(d => d);
});