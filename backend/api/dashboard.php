<?php
// =============================================
// API: Dashboard
// =============================================
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Patient.php';
require_once __DIR__ . '/../models/Visit.php';

$database = new Database();
$db = $database->getConnection();
$patient = new Patient($db);
$visit = new Visit($db);

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

// Dashboard summary
$totalPatients = $patient->count();
$totalVisits = $visit->count();
$latestVisits = $visit->getLatest(5);

// Chart data
$groupBy = isset($_GET['group_by']) ? $_GET['group_by'] : 'month';
$year = isset($_GET['year']) ? (int) $_GET['year'] : (int) date('Y');
$chartRaw = $visit->getChartData($groupBy, $year);

// Format chart data based on groupBy
$chartData = [];
$months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];

switch ($groupBy) {
    case 'day':
        // Fill in missing days for last 7 days
        for ($i = 6; $i >= 0; $i--) {
            $date = date('Y-m-d', strtotime("-{$i} days"));
            $dayName = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][date('w', strtotime($date))];
            $found = false;
            foreach ($chartRaw as $row) {
                if ($row['label'] === $date) {
                    $chartData[] = ['name' => $dayName, 'kunjungan' => (int) $row['total']];
                    $found = true;
                    break;
                }
            }
            if (!$found) {
                $chartData[] = ['name' => $dayName, 'kunjungan' => 0];
            }
        }
        break;

    case 'week':
        foreach ($chartRaw as $row) {
            $start = date('d/m', strtotime($row['week_start']));
            $end = date('d/m', strtotime($row['week_end']));
            $chartData[] = ['name' => "{$start} - {$end}", 'kunjungan' => (int) $row['total']];
        }
        break;

    case 'month':
        // Fill in all months up to current month
        $currentMonth = (int) date('m');
        for ($m = 1; $m <= $currentMonth; $m++) {
            $found = false;
            foreach ($chartRaw as $row) {
                if ((int) $row['month_num'] === $m) {
                    $chartData[] = ['name' => $months[$m], 'kunjungan' => (int) $row['total']];
                    $found = true;
                    break;
                }
            }
            if (!$found) {
                $chartData[] = ['name' => $months[$m], 'kunjungan' => 0];
            }
        }
        break;

    case 'year':
        $currentYear = (int) date('Y');
        for ($y = $currentYear - 4; $y <= $currentYear; $y++) {
            $found = false;
            foreach ($chartRaw as $row) {
                if ((int) $row['year_num'] === $y) {
                    $chartData[] = ['name' => (string) $y, 'kunjungan' => (int) $row['total']];
                    $found = true;
                    break;
                }
            }
            if (!$found) {
                $chartData[] = ['name' => (string) $y, 'kunjungan' => 0];
            }
        }
        break;
}

echo json_encode([
    'status' => 'success',
    'data' => [
        'total_patients' => $totalPatients,
        'total_visits' => $totalVisits,
        'latest_visits' => $latestVisits,
        'chart_data' => $chartData
    ]
]);
