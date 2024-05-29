<?php

$fromYear = '2022-2023';
$fromSemester = 1;
$toYear = '2022-2023';
$toSemester = 1;

$fromYear = isset($_POST['fromYear']) ? $_POST['fromYear'] : '2022-2023';
$fromSemester = isset($_POST['fromSemester']) ? $_POST['fromSemester'] : 1;
$toYear = isset($_POST['toYear']) ? $_POST['toYear'] : '2022-2023';
$toSemester = isset($_POST['toSemester']) ? $_POST['toSemester'] : 1;

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "dmpcs_dashboard";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$charts = [];

// Helper function to execute a query and fetch all results
function fetchQueryResults($conn, $sql) {
    $result = $conn->query($sql);
    if ($result === FALSE) {
        die("Query failed: " . $conn->error);
    }
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    return $data;
}

// Execute SQL query to retrieve the total count of faculty by rank
$sql1 = "SELECT 
            rank_title.title AS facultyRank, 
            SUM(COALESCE(faculty.count, 0)) AS rankCount
         FROM 
            faculty
         JOIN 
            rank_title ON faculty.rankID = rank_title.rankID
         GROUP BY 
            rank_title.title
         ORDER BY 
            rankCount DESC";

$charts['ratioByRank'] = fetchQueryResults($conn, $sql1);


// Execute SQL query to retrieve the ratio of faculty by educational attainment
// Execute SQL query to retrieve the total count of faculty by educational attainment
$sql2 = "SELECT 
            educ_attainment.attainment AS educationalAttainment,
            SUM(COALESCE(faculty.count, 0)) AS facultyCount
         FROM 
            faculty
         JOIN 
            educ_attainment ON faculty.educAttainmentID = educ_attainment.educAttainmentID
         GROUP BY 
            educ_attainment.attainment
         ORDER BY 
            facultyCount DESC";

$charts['ratioByEduc'] = fetchQueryResults($conn, $sql2);

// Execute SQL query to retrieve the total number of faculty per semester
$sql3 = "SELECT 
         time_period.SchoolYear,
         time_period.semester,
         SUM(faculty.count) AS totalFaculty
      FROM 
         faculty
      JOIN 
         time_period ON faculty.timeID = time_period.timeID
      WHERE
         CAST(SUBSTRING_INDEX(time_period.SchoolYear, '-', 1) AS UNSIGNED) BETWEEN CAST(SUBSTRING_INDEX('$fromYear', '-', 1) AS UNSIGNED) AND CAST(SUBSTRING_INDEX('$toYear', '-', 1) AS UNSIGNED)
         AND time_period.semester BETWEEN $fromSemester AND $toSemester
      GROUP BY 
         time_period.SchoolYear, time_period.semester
      ORDER BY 
         time_period.SchoolYear, time_period.semester";

$charts['numberOfTotalFaculty'] = fetchQueryResults($conn, $sql3);

// Execute SQL query to retrieve the total number of publications per year
$sql4 = "SELECT 
         time_period.SchoolYear AS SchoolYear,
         time_period.semester AS semester,
         SUM(publication.count) AS totalPublications
      FROM 
         publication
      JOIN 
         time_period ON publication.timeID = time_period.timeID
      WHERE 
         CAST(SUBSTRING_INDEX(time_period.SchoolYear, '-', 1) AS UNSIGNED) BETWEEN CAST(SUBSTRING_INDEX('$fromYear', '-', 1) AS UNSIGNED) AND CAST(SUBSTRING_INDEX('$toYear', '-', 1) AS UNSIGNED)
         AND time_period.semester BETWEEN $fromSemester AND $toSemester
      GROUP BY 
         time_period.SchoolYear, time_period.semester
      ORDER BY 
         time_period.SchoolYear, time_period.semester";

$charts['numberOfPublications'] = fetchQueryResults($conn, $sql4);

// Execute SQL query to retrieve the total faculty involvement per publication
$sql5 = "SELECT 
         publication.title AS publicationTitle,
         SUM(faculty.count) AS totalFacultyParticipation
      FROM 
         publication
      JOIN 
         faculty ON publication.publicationID = faculty.publicationID
      JOIN 
         time_period ON publication.timeID = time_period.timeID
      WHERE 
         CAST(SUBSTRING_INDEX(time_period.SchoolYear, '-', 1) AS UNSIGNED) BETWEEN CAST(SUBSTRING_INDEX('$fromYear', '-', 1) AS UNSIGNED) AND CAST(SUBSTRING_INDEX('$toYear', '-', 1) AS UNSIGNED)
         AND time_period.semester BETWEEN $fromSemester AND $toSemester
      GROUP BY 
         publication.title";

$charts['researchInvolvement'] = fetchQueryResults($conn, $sql5);

// Execute SQL query to retrieve the population of faculty by rank per semester
$sq6 = "SELECT 
         time_period.SchoolYear,
         time_period.semester,
         rank_title.title AS Rank,
         SUM(faculty.count) AS facultyCount
      FROM 
         faculty
      JOIN 
         rank_title ON faculty.rankID = rank_title.rankID
      JOIN 
         time_period ON faculty.timeID = time_period.timeID
      WHERE
         CAST(SUBSTRING_INDEX(time_period.SchoolYear, '-', 1) AS UNSIGNED) BETWEEN CAST(SUBSTRING_INDEX('$fromYear', '-', 1) AS UNSIGNED) AND CAST(SUBSTRING_INDEX('$toYear', '-', 1) AS UNSIGNED)
         AND time_period.semester BETWEEN $fromSemester AND $toSemester
      GROUP BY 
         time_period.SchoolYear, time_period.semester, rank_title.title
      ORDER BY 
         time_period.SchoolYear, time_period.semester, rank_title.title";

$charts['facultySembyRank'] = fetchQueryResults($conn, $sq6);

// Execute SQL query to retrieve the population of faculty by educational attainment
$sql7 = "SELECT 
         time_period.SchoolYear,
         time_period.semester,
         educ_attainment.attainment AS EducationalAttainment,
         SUM(faculty.count) AS facultyCount
      FROM 
         faculty
      JOIN 
         educ_attainment ON faculty.educAttainmentID = educ_attainment.educAttainmentID
      JOIN 
         time_period ON faculty.timeID = time_period.timeID
      WHERE 
         CAST(SUBSTRING_INDEX(time_period.SchoolYear, '-', 1) AS UNSIGNED) BETWEEN CAST(SUBSTRING_INDEX('$fromYear', '-', 1) AS UNSIGNED) AND CAST(SUBSTRING_INDEX('$toYear', '-', 1) AS UNSIGNED)
         AND time_period.semester BETWEEN $fromSemester AND $toSemester
      GROUP BY 
         time_period.SchoolYear, time_period.semester, educ_attainment.attainment
      ORDER BY 
         time_period.SchoolYear, time_period.semester, educ_attainment.attainment";

$charts['facultyByEducAttainment'] = fetchQueryResults($conn, $sql7);
echo json_encode($charts);
$conn->close();
?>
