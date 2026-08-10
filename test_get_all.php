<?php
require 'backend/config/database.php';
require 'backend/models/Patient.php';
$db = (new Database())->getConnection();
$p = new Patient($db);
print_r($p->getAll(''));
