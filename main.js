// Define Chart Sizes
const w = 950;
const h = 600;
const margin = { top: 30, right: 50, bottom: 50, left: 100 };

// Add Main Chart svg
const svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

// Load Data
fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
)
  .then((response) => response.json())
  .then(function (data) {
    // Separate Data Elements into Separate Variables
    const baseTemperature = data.baseTemperature;
    const monthlyData = data.monthlyVariance;

    // Define Range of Years in the Data
    const yearRange =
      d3.max(monthlyData, (d) => d.year) - d3.min(monthlyData, (d) => d.year);

    // Insert Base Temperature From Data into Description
    document.getElementById(
      "description"
    ).innerText = `Base temperature: ${baseTemperature}℃`;

    // Convert Time Data to Usable Date Format
    const parseYear = d3.timeParse("%Y");
    const parseMonth = d3.timeParse("%m");

    monthlyData.forEach((d) => {
      d.year = parseYear(d.year);
      d.month = parseMonth(d.month);
    });

    // Define Scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(monthlyData, (d) => d.year))
      .range([margin.left, w - margin.right]);

    const yScale = d3
      .scaleBand()
      .domain(monthlyData.map((d) => d.month))
      .range([margin.top, h - margin.bottom]);

    const temperatureScale = d3
      .scaleLinear()
      .domain(d3.extent(monthlyData, (d) => d.variance))
      .range([0, 1]);

    // Add Function to Get Color Based on Temperature
    const getColor = (d) => d3.interpolateInferno(temperatureScale(d));

    // Append X Axis
    const xAxis = svg
      .append("g")
      .call(d3.axisBottom(xScale))
      .attr("id", "x-axis")
      .attr("class", "axis-bottom")
      .attr("transform", `translate(0, ${h - margin.bottom})`);

    // Append Y Axis
    const yAxis = svg
      .append("g")
      .call(d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B")))
      .attr("id", "y-axis")
      .attr("class", "axis-left")
      .attr("transform", `translate(${margin.left}, 0)`);

    // Define and Append Bars
    svg
      .selectAll("rect")
      .data(monthlyData)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.year))
      .attr("y", (d) => yScale(d.month))
      .attr("width", (w - margin.left - margin.right) / yearRange)
      .attr("height", (h - margin.bottom - margin.top) / 12)
      .attr("fill", (d) => getColor(d.variance));
  });
