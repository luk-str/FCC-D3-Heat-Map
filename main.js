// Define Chart Sizes
const w = 1200;
const h = 800;
const margin = { top: 30, right: 50, bottom: 200, left: 120 };

// Add Main Chart svg
const svg = d3
  .select(".chart")
  .append("svg")
  .attr("class", "svg")
  .attr("width", w)
  .attr("height", h);

// Load Data
fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
)
  .then((response) => response.json())
  .then(function (data) {
    // BASIC DATA //

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

    // Define Color Scheme
    const getColor = (d) => d3.interpolateInferno(d);

    // SCALES //

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

    // AXIS //

    // Add X Axis
    svg
      .append("g")
      .call(d3.axisBottom(xScale))
      .attr("id", "x-axis")
      .attr("class", "axis-bottom")
      .attr("transform", `translate(0, ${h - margin.bottom})`);

    // Add Y Axis
    svg
      .append("g")
      .call(d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B")))
      .attr("id", "y-axis")
      .attr("class", "axis-left")
      .attr("transform", `translate(${margin.left}, 0)`);

    // Add X Axis Label
    svg
      .append("text")
      .text("Year")
      .attr("text-anchor", "middle")
      .attr("dx", w / 2)
      .attr("dy", h + margin.top - margin.bottom + 15);

    // Add Y Axis Label
    svg
      .append("text")
      .text("Month")
      .attr("text-anchor", "middle")
      .attr("dx", (-h + margin.bottom + margin.top) / 2)
      .attr("dy", margin.left / 3)
      .attr("transform", "rotate(-90)");

    // BARS //

    // Define and Append Bars
    const bars = svg
      .selectAll("rect")
      .data(monthlyData)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("data-month", (d) => +d3.timeFormat("%m")(d.month) - 1)
      .attr("data-year", (d) => +d3.timeFormat("%Y")(d.year))
      .attr("data-temp", (d) => d.variance)
      .attr("x", (d) => xScale(d.year))
      .attr("y", (d) => yScale(d.month))
      .attr("width", (w - margin.left - margin.right) / yearRange)
      .attr("height", (h - margin.bottom - margin.top) / 12)
      .attr("fill", (d) => getColor(temperatureScale(d.variance)));

    // TOOLTIPS //

    // Define Tooltip
    const tooltip = d3
      .select(".chart")
      .append("g")
      .attr("class", "tooltip")
      .attr("id", "tooltip")
      .style("opacity", 0);

    // Append Tooltip to Bars on Mouseover
    bars
      .on("mouseover", function (d) {
        d3.select(this).raise();
        tooltip
          .style("opacity", 1)
          .style("left", +d3.select(this).attr("x") - 100 + "px")
          .style("top", +d3.select(this).attr("y") + "px")
          .attr("data-year", +d3.timeFormat("%Y")(d.year)).html(`
          Land-surface temperature:
          <b>${(baseTemperature + d.variance).toFixed(3)}℃</b>
          <br>
          Variance: <b>${d.variance}℃</b>
          <br><br>
          Date: <b>${d3.timeFormat("%B")(
            d.month
          )} ${d3.timeFormat("%Y")(d.year)}</b>`);
      })
      .on("mouseout", (d) => tooltip.style("opacity", 0));

    // LEGEND //

    // Define Legend Width
    const legendWidth = (w - margin.left - margin.right) / 2;

    // Generate Color Data
    const colorsArray = [];
    for (let i = 0; i < 1; i += 0.001) {
      colorsArray.push(getColor(i));
    }

    // Append Legend Group to svg
    const legend = svg
      .append("g")
      .attr("id", "legend")
      .attr("transform", `translate(${w / 2 - legendWidth / 2}, ${h - 80})`);

    // Define Legend Scale
    const legendScale = d3
      .scaleLinear()
      .domain(d3.extent(monthlyData, (d) => d.variance))
      .range([0, legendWidth])
      .nice();

    // Add Legend Axis
    legend
      .append("g")
      .call(d3.axisBottom(legendScale).tickFormat((d) => d + "℃"));

    // Add Legend Label
    legend
      .append("text")
      .text("Temperature variance")
      .attr("text-anchor", "middle")
      .attr("dx", legendWidth / 2)
      .attr("dy", 50);

    // Add Legend Bars
    legend
      .selectAll("rect")
      .data(colorsArray)
      .enter()
      .append("rect")
      .attr("width", legendWidth / colorsArray.length + 1)
      .attr("height", 30)
      .attr("x", (d, i) => (legendWidth / colorsArray.length) * i)
      .attr("y", -30)
      .attr("fill", (d) => d);
  });
