<?php
// $COREDIR = dirname(__DIR__) . '/core/';
$DB = new SQLite3($COREDIR . 'data.db');
function createTable() {
  global $DB;
  $DB->exec('CREATE TABLE IF NOT EXISTS users (
    uid INTEGER PRIMARY KEY AUTOINCREMENT,
    username   CHAR(26) NOT NULL UNIQUE,
    password   CHAR(32) NOT NULL,
    fullname   CHAR(50) NOT NULL,
    permission INT(1) DEFAULT (0),
    birthday   INT,
    email      CHAR(40),
    phone      CHAR(12),
    classroom  CHAR(4),
    fbid       CHAR(25),
    address    CHAR(60),
    joined     INT
  );');
}
createTable();
// Dòng này để Thêm cột, Chỉ cho chạy 1 lần khi cần.
// $DB->exec('ALTER TABLE users ADD joined INT;');
