document.addEventListener("DOMContentLoaded", function () {
  fetchChartData("getchart_faculty.php", renderCharts);
});

function fetchChartData(localhost, callback) {
  fetch(localhost)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => callback(data))
    .catch((error) => console.error("Error fetching data:", error));
}


function renderCharts(data) {
  renderRatioByRank(data.ratioByRank);
  renderRatioByEduc(data.ratioByEduc);
  renderNumberOfTotalFaculty(data.numberOfTotalFaculty);
  renderNumberOfPublications(data.numberOfPublications);
  renderResearchInvolvement(data.researchInvolvement); 
  renderFacultySembyRank(data.facultySembyRank)
  renderFacultyByEducAttainment(data.facultyByEducAttainment)
}

function renderRatioByRank(chartData) {
  var labels = chartData.map((item) => item.facultyRank);
  var counts = chartData.map((item) => item.rankCount);
  var customColors = ['#8E1537', '#FFB81D', '#005740', '#8E1537', '#C70039']; // Example custom colors

  var ctx = document.getElementById("totalByRank");
  var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: labels,
        datasets: [{
            label: 'Total by Rank',
            data: counts,
            backgroundColor: customColors,
            borderWidth: 5
        }]
    },
    options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
    }
  });
}


function renderRatioByEduc(chartData) {
  var labels = chartData.map((item) => item.educationalAttainment);
  var counts = chartData.map((item) => item.facultyCount);
  
  // Define your custom color palette
  var customColors = ['#8E1537', '#FFB81D', '#005740', '#808080'];

  var ctx = document.getElementById("ratioByEduc");  // Use the existing ID if needed
  var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: labels,
        datasets: [{
            label: 'Total by Educational Attainment',
            data: counts,
            backgroundColor: customColors,
            borderWidth: 5
        }]
    },
    options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
    }
  });
}


let totalFacultyChart;

function renderNumberOfTotalFaculty(chartData) {
  var labels = chartData.map((item) => item.SchoolYear + " " + item.semester);
  var totalFaculty = chartData.map((item) => item.totalFaculty);
  var customColors = ['#8E1537', '#FFB81D', '#005740', '#808080'];

  var ctx = document.getElementById('numberOfTotalFaculty').getContext("2d");
  totalFacultyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Total Faculty',
        data: totalFaculty,
        backgroundColor: customColors,
        borderColor: customColors,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

let numberOfPublicationsChart;

function renderNumberOfPublications(chartData) {
  var labels = chartData.map((item) => item.SchoolYear + ' Semester ' + item.semester);
  var counts = chartData.map((item) => item.totalPublications);
  var customColors = ['#8E1537', '#FFB81D', '#005740', '#808080'];

  var ctx = document.getElementById('numberOfPublications').getContext("2d");
  numberOfPublicationsChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Publications',
        data: counts,
        backgroundColor: customColors,
        borderColor: customColors,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

let researchInvolvementChart;

function renderResearchInvolvement(chartData) {
  var publicationTitles = chartData.map((item) => item.publicationTitle);
  var totalFacultyParticipation = chartData.map((item) => item.totalFacultyParticipation);
  var customColors = ['#8E1537', '#FFB81D', '#005740', '#808080', '000000'];

  var ctx = document.getElementById('researchInvolvement').getContext("2d");
  researchInvolvementChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: publicationTitles,
        datasets: [{
            label: 'Research Involvement',
            data: totalFacultyParticipation,
            backgroundColor: customColors,
            borderColor: customColors,
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
    }
  });
}

let facultySembyRankChart;

function renderFacultySembyRank(chartData) {
  // Create a set to hold unique semester labels
  var labelSet = new Set();
  var datasets = {};

  // Define custom colors for each rank
  var customColors = ['#8E1537', '#FFB81D', '#005740', '#C70039', '#0066cc', '#ff8c00'];

  // Loop through the chart data to populate the label set and initialize datasets
  chartData.forEach((item, index) => {
    var semesterLabel = item.SchoolYear + " " + item.semester;
    labelSet.add(semesterLabel);
    if (!datasets[item.Rank]) {
      datasets[item.Rank] = {
        label: item.Rank,
        data: [],
        backgroundColor: customColors[index % customColors.length], // Use modulo to cycle through colors
        borderColor: customColors[index % customColors.length],
        borderWidth: 1
      };
    }
  });

  // Convert the set of labels to an array
  var labels = Array.from(labelSet);

  // Initialize data arrays for each rank
  for (var rank in datasets) {
    for (var i = 0; i < labels.length; i++) {
      datasets[rank].data.push(0); // Initialize all data points to 0
    }
  }

  // Fill in the data arrays with actual counts
  chartData.forEach((item) => {
    var semesterLabel = item.SchoolYear + " " + item.semester;
    var labelIndex = labels.indexOf(semesterLabel);
    datasets[item.Rank].data[labelIndex] = item.facultyCount;
  });

  // Convert datasets object to array
  var datasetsArray = Object.values(datasets);

  var ctx = document.getElementById('facultySembyRank').getContext("2d");
  facultySembyRankChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: datasetsArray
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Semesters'
          }
        },
        y: {
          title: {
            display: true,
            text: ''
          },
        }
      },
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

let facultyByEducAttainmentChart;

function renderFacultyByEducAttainment(chartData) {
  // Extract unique labels for semesters
  var labels = [...new Set(chartData.map((item) => item.SchoolYear + " " + item.semester))];
  
  var datasets = {};
  
  // Define custom colors for each educational attainment
  var customColors = ['#8E1537', '#FFB81D', '#005740', '#C70039'];

  // Loop through the chart data to create datasets for each educational attainment
  chartData.forEach((item) => {
    if (!datasets[item.EducationalAttainment]) {
      datasets[item.EducationalAttainment] = {
        label: item.EducationalAttainment,
        data: new Array(labels.length).fill(0),
        backgroundColor: customColors,
        borderColor: customColors,
        borderWidth: 1,
        fill: false
      };
    }
    var labelIndex = labels.indexOf(item.SchoolYear + " " + item.semester);
    if (labelIndex !== -1) {
      datasets[item.EducationalAttainment].data[labelIndex] = item.facultyCount;
    }
  });

  // Convert datasets object to array
  var datasetsArray = Object.values(datasets);

  var ctx = document.getElementById('facultyByEducAttainment').getContext("2d");
  facultyByEducAttainmentChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: datasetsArray
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

$(document).ready(function() {
  $('#filterButton').on('submit', function(e) {
      e.preventDefault();

      var fromYear = $('#fromYear').val();
      var toYear = $('#toYear').val();
      var fromSemester = $('#fromSemester').val();
      var toSemester = $('#toSemester').val();

      console.log("Inputted in Form", fromYear, toYear, fromSemester, toSemester);

      $.ajax({
          url: 'getchart_faculty.php',
          method: 'POST',
          data: {
              fromYear: fromYear,
              toYear: toYear,
              fromSemester: fromSemester,
              toSemester: toSemester
          },
          success: function(response) {
              var data = JSON.parse(response);
              rerenderCharts(data);
          }
      });})});

function rerenderCharts(data) {
  totalFacultyChart.destroy();
  renderNumberOfTotalFaculty(data.numberOfTotalFaculty);

  numberOfPublicationsChart.destroy();
  renderNumberOfPublications(data.numberOfPublications);

  researchInvolvementChart.destroy();
  renderResearchInvolvement(data.researchInvolvement);

  facultySembyRankChart.destroy();
  renderFacultySembyRank(data.facultySembyRank);

  facultyByEducAttainmentChart.destroy();
  renderFacultyByEducAttainment(data.facultyByEducAttainment);
}