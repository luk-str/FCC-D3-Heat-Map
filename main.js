fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
)
  .then((response) => response.json())
  .then(function (data) {
    // Define sizes
    const margin = { top: 30, right: 50, bottom: 30, left: 60 };
    const w = 1000 - margin.left - margin.right;
    const h = 600 - margin.top - margin.bottom;

    // Separate data elements into separate variables
    const baseTemperature = data.baseTemperature;
    const monthlyData = data.monthlyVariance;

    // Convert time data to usable date format
    const parseYear = d3.timeParse("%Y");
    const parseMonth = d3.timeParse("%m");

    monthlyData.forEach((d) => {
      d.year = parseYear(d.year);
      d.month = parseMonth(d.month);
    });

    // Add main chart svg
    const svg = d3
      .select(".chart")
      .append("svg")
      .attr("width", w)
      .attr("height", h);
  });
