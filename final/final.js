function Select() {
    const selectedCities = cityCheckboxes.filter(function() {
        return this.checked;
    }).nodes().map(function(checkbox) {
        return checkbox.value;
    });
    
    updateChart(selectedCities);
}

const cityCheckboxes = d3.select("#cityCheckboxes")
                        .selectAll("input")
                        .on("change", Select);

const margin = { top: 50, right: 20, bottom: 60, left: 70 };
const width = 830 - margin.left - margin.right;
const height = 430 - margin.top - margin.bottom;

const svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const allCities = ["CLT", "CQT", "IND", "JAX", "MDW", "PHL", "PHX"];

const xScale = d3.scaleTime().range([0, width]);
const yScale = d3.scaleLinear().range([height, 0]);

const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b %Y"));
const yAxis = d3.axisLeft(yScale);

const color = d3.scaleOrdinal(d3.schemeCategory10);

allCities.forEach(d => {
    d3.csv(d + ".csv").then(function(data) {
    
        const parseDate = d3.timeParse("%Y-%m-%d");

        const allData = data.flat();

        allData.forEach(d => {
            d.date = parseDate(d.date);
            d.actual_max_temp = +d.actual_max_temp;
            d.actual_min_temp = +d.actual_min_temp;
        });

        xScale.domain(d3.extent(allData, d => d.date));
        yScale.domain([0, 120]);

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
            .attr('transform', 'translate(-40, 155) rotate(-90)')
            .text("Temperature (°F)");

        updateChart();
    })
});

function updateChart() {
    svg.selectAll(".maxTemp").remove();

    const chosenCity = cityCheckboxes.filter(function() {
        return this.checked;
    }).nodes().map(function(checkbox) {
        return checkbox.value;
    });

    chosenCity.forEach(function(city) {
        d3.csv(city + ".csv").then(function(data) {
            const parseDate = d3.timeParse("%Y-%m-%d");

            const cityData = data.map(function(d) {
                return {
                    date: parseDate(d.date),
                    actual_max_temp: +d.actual_max_temp,
                    actual_min_temp: +d.actual_min_temp
                };
            });

            const maxTemp = d3.line()
                .x(function(d) { 
                    return xScale(d.date); 
                })
                .y(function(d) { 
                    return yScale(d.actual_max_temp); 
                });

            // const minTemp = d3.line()
            //     .x(function(d) { 
            //         return xScale(d.date); 
            //     })
            //     .y(function(d) { 
            //         return yScale(d.actual_min_temp); 
            //     });

            svg.append("path")
                .datum(cityData)
                .attr("class", "maxTemp")
                .attr("d", maxTemp)
                .style("stroke", color(city))
                .style("fill", "none");
            
            // svg.append("path")
            //     .datum(cityData)
            //     .attr("class", "minTemp")
            //     .attr("d", minTemp)
            //     .style("stroke", color(city))
            //     .style("fill", "none");
        });
    });
}