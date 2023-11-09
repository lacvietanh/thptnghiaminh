<?php
// $COREDIR = dirname(__DIR__) . '/core/';
class AkiDB extends SQLite3 {
  function __construct() {
    global $COREDIR;
    $this->open($COREDIR . 'data.db');
    $this->exec('CREATE TABLE IF NOT EXISTS users (
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
      joined     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );');
    $this->exec('CREATE TABLE IF NOT EXISTS library (
      bid CHAR(5) PRIMARY KEY NOT NULL UNIQUE,
      bname         CHAR(40) NOT NULL,
      categroyCode  CHAR(4) NOT NULL,
      inyear        INT(4) NOT NULL,
      quantity      INT(5) DEFAULT (0),
      available     INT(5),
      price         INT(7),
      updated       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedby     CHAR(26)
    );');
    $this->exec('CREATE TABLE IF NOT EXISTS borrow (
      refid INTEGER PRIMARY KEY AUTOINCREMENT,
      username  CHAR(26),
      bid CHAR(5),
      borQuanti INT(3) DEFAULT (1),
      borDate   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      numOfDay  INT(3) NOT NULL,
      dateDueBack  TIMESTAMP,
      dateReturned TIMESTAMP,
      updated      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedby     CHAR(26)
    );');
  }
  public function checkUserNameExist($n) {
    if ($n == "guest") return "NOT_ALLOWED";
    else {
      $tmp = $this->querySingle("SELECT username FROM users WHERE username='$n';");
      return $tmp;
    }
  }
  public function checkEmailExist($e) {
    $stmt = $this->prepare("SELECT email FROM users WHERE email=:email");
    $stmt->bindValue(':email', $e, SQLITE3_TEXT);
    $tmp = $stmt->execute();
    return json_encode($tmp->fetchArray(1));
  }
  public function listUsers($admin) {
    if ($admin) $q = "SELECT * from users ;";
    else $q = "SELECT fullname, classroom, phone, joined, fbid, birthday from users ;";
    $out = [];
    $tmp = $this->query($q);
    while ($row = $tmp->fetchArray(1)) {
      array_push($out, $row);
    }
    return json_encode($out);
  }
}

$DB = new AkiDB();
// Dòng này để Thêm cột, Chỉ cho chạy 1 lần khi cần.
// $DB->exec('ALTER TABLE users ADD joined INT;');
