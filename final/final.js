const margin = { top: 50, right: 20, bottom: 60, left: 70 };
const width = 1130 - margin.left - margin.right;
const height = 330 - margin.top - margin.bottom;

const svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const svgPrecipitation = d3.select("#precipitation")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const allCities = ["CLT", "CQT", "IND", "JAX", "MDW", "PHL", "PHX"];

const xScale = d3.scaleTime().range([0, width]);
const yScale = d3.scaleLinear().range([height, 0]);

const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b %Y"));
const yAxis = d3.axisLeft(yScale);

const xScale2 = d3.scaleTime().range([0, width]);
const yScale2 = d3.scaleLinear().range([height, 0]);

const xAxis2 = d3.axisBottom(xScale2).tickFormat(d3.timeFormat("%b %Y"));
const yAxis2 = d3.axisLeft(yScale2);

const color = d3.scaleOrdinal(d3.schemeCategory10);

let toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-5, 0])
    .html(function(d) {
        let displayedDate = d3.timeFormat("%b %d, %Y");
        return "<h4>"+ displayedDate(d.date) + ", " +d["actual_max_temp"]+"°F</h4>";
    });

svg.call(toolTip);

let precipitationToolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-5, 0])
    .html(function(d) {
        let displayedDate = d3.timeFormat("%b %d, %Y");
        return "<h4>"+ displayedDate(d.date) + ", " +d["actual_precipitation"]+"in</h4>";
    });

svgPrecipitation.call(precipitationToolTip);

allCities.forEach(d => {
    d3.csv(d + ".csv").then(function(data) {
    
        const parseDate = d3.timeParse("%Y-%m-%d");

        const allData = data.flat();

        allData.forEach(d => {
            d.date = parseDate(d.date);
            d.average_max_temp = +d.average_max_temp;
            d.actual_max_temp = +d.actual_max_temp;
            d.actual_precipitation = +d.actual_precipitation;
            d.average_precipitation = +d.average_precipitation;
        });

        xScale.domain(d3.extent(allData, d => d.date));
        yScale.domain([0, 120]);

        xScale2.domain(d3.extent(allData, d => d.date));
        yScale2.domain([0, 4]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .call(yAxis);

        svg.append("text")
            .attr("class", "x-axis-label")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y",  height + 45)
            .text("July of 2014 to June of 2015 for Selected Cities");

        svg.append("text")
            .attr("class", "y-axis-label")
            .attr("text-anchor", "middle")
            .attr('transform', 'translate(-40, 110) rotate(-90)')
            .text("Temperature (°F)");

        svg.append('text')
            .attr('x', '240')
            .attr('y', '-20')
            .text('The Maximum Temperatures in Farenheit From July 2014 to June 2015')
            .attr('fill', 'black')
            .attr('font-size', '16px')
            .attr('font-weight', '600')
            .attr('text-anchor', 'middle');

        svgPrecipitation.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis2);

        svgPrecipitation.append("g")
            .call(yAxis2);

        svgPrecipitation.append("text")
            .attr("class", "x-axis-label")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y",  height + 45)
            .text("July of 2014 to June of 2015 for Selected Cities");

        svgPrecipitation.append("text")
            .attr("class", "y-axis-label")
            .attr("text-anchor", "middle")
            .attr('transform', 'translate(-40, 110) rotate(-90)')
            .text("Precipitation (in)");
        
        svgPrecipitation.append('text')
            .attr('x', '180')
            .attr('y', '-20')
            .text('The Precipitation Levels From July 2014 to June 2015')
            .attr('fill', 'black')
            .attr('font-size', '16px')
            .attr('font-weight', '600')
            .attr('text-anchor', 'middle');

        updateChart();
    })
});

function updateChart() {
    svg.selectAll(".maxTemp").remove();
    svg.selectAll(".dataPoint").remove();
    svgPrecipitation.selectAll(".precipitation").remove();
    svgPrecipitation.selectAll(".preciPoint").remove();

    const chosenCity = cityCheckboxes.filter(function() {
        return this.checked;
    }).nodes().map(function(checkbox) {
        return checkbox.value;
    });

    chosenCity.forEach(function(city) {
        d3.csv(city + ".csv").then(function(data) {
            const parseDate = d3.timeParse("%Y-%m-%d");

            const cityWeather = data.map(function(d) {
                return {
                    date: parseDate(d.date),
                    average_max_temp: +d.average_max_temp,
                    actual_max_temp: +d.actual_max_temp,
                    actual_precipitation: +d.actual_precipitation,
                    average_precipitation: +d.average_precipitation
                };
            });

            const maxTemp = d3.line()
                .x(function(d) { 
                    return xScale(d.date); 
                })
                .y(function(d) { 
                    return yScale(d.actual_max_temp); 
                });

            const precipitation = d3.line()
                .x(function(d) { 
                    return xScale2(d.date); 
                })
                .y(function(d) { 
                    return yScale2(d.actual_precipitation); 
                });

            svg.append("path")
                .datum(cityWeather)
                .attr("class", "maxTemp")
                .attr("d", maxTemp)
                .style("stroke", color(city))
                .style("fill", "none")
                .style("opacity", 1)
                .on("mouseover", function() {
                    handleMouseOver(city, cityWeather);
                })
                .on("mouseout", function() {
                    handleMouseOut();
                });

            svgPrecipitation.append("path")
                .datum(cityWeather)
                .attr("class", "precipitation")
                .attr("d", precipitation)
                .style("stroke", color(city))
                .style("fill", "none")
                .style("opacity", 1)
                .on("mouseover", function() {
                    handleMouseOver(city, cityWeather);
                })
                .on("mouseout", function() {
                    handleMouseOut();
                });

            svg.selectAll(".dataPoint." + city)
                .data(cityWeather)
                .enter().append("circle")
                .attr("class", function(d) {
                    return "dataPoint " + city;
                })
                .attr("cx", function(d) { 
                    return xScale(d.date); 
                })
                .attr("cy", function(d) { 
                    return yScale(d.actual_max_temp); 
                })
                .attr("r", 3.5)
                .style("fill", color(city))
                .style("opacity", 0)
                .on("mouseover", function(d) {
                    handleMouseOver(city, cityWeather)
                    toolTip.show(d)
                })
                .on("mouseout", function() {
                    handleMouseOut()
                    toolTip.hide()
                });

            
            svgPrecipitation.selectAll(".preciPoint." + city)
                .data(cityWeather)
                .enter().append("circle")
                .attr("class", function(d) {
                    return "preciPoint " + city;
                })
                .attr("cx", function(d) { 
                    return xScale2(d.date); 
                })
                .attr("cy", function(d) {
                    return yScale2(d.actual_precipitation); 
                })
                .attr("r", 5)
                .style("fill", color(city))
                .style("opacity", 0)
                .on("mouseover", function(d) {
                    handleMouseOver(city, cityWeather)
                    precipitationToolTip.show(d)
                })
                .on("mouseout", function() {
                    handleMouseOut()
                    precipitationToolTip.hide()
                });
        });
    });

    function handleMouseOver(city, data) {
        svg.selectAll(".maxTemp")
            .style("opacity", function(d, i) {
                return (city === chosenCity[i]) ? 1 : 0.05;
            });

        svgPrecipitation.selectAll(".precipitation")
            .style("opacity", function(d, i) {
                return (city === chosenCity[i]) ? 1 : 0.05;
            });
    }
    
    function handleMouseOut() {
        svg.selectAll(".maxTemp")
            .style("opacity", 1);

        svgPrecipitation.selectAll(".precipitation")
            .style("opacity", 1);
    }
}


const cityCheckboxes = d3.select("#cityCheckboxes")
        .selectAll("input")
        .on("change", updateChart);

const legend = d3.select("#legend");

const legendItems = legend.selectAll(".legend-item")
    .data(allCities)
    .enter().append("div")
    .attr("class", "legend-item");

legendItems.append("div")
    .attr("class", "legend-color")
    .style("background-color", function(d) {
        return color(d);
    });

legendItems.append("div")
    .attr("class", "legend-label")
    .text(function(d) {
        return d;
    });