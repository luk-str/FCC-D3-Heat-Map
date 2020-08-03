fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
)
  .then((response) => response.json())
  .then(function (data) {
    // Define sizes
    const margin = { top: 30, right: 50, bottom: 30, left: 60 };
    const w = 1000 - margin.left - margin.right;
    const h = 600 - margin.top - margin.bottom;
  });
