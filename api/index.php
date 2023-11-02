<?php
$COREDIR = dirname(__DIR__) . '/core/';
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(0);
ini_set("log_errors", 0);
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

session_name('ssid');
session_save_path($COREDIR . 'session');
session_start();
setcookie(session_name(), session_id(), 2147483647);


$USER['ssid'] = session_id();
if (isset($_SESSION['logged']) && $_SESSION['logged'] == 1) {
  $USER['logged'] = 1;
  $USER['uname'] = $_SESSION['uname'];
  $USER['fname'] = $_SESSION['fname'];
} else {
  $USER['logged'] = null;
  $USER['uname'] = 'guest';
  $USER['fname'] = 'Khách';
}

if (isset($_GET['v']))
  switch ($_GET['v']) {
    case 'auth':
      echo json_encode($USER, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
      break;
    case 'logout':
      session_destroy();
      echo "Đã đăng xuất tài khoản <b>" . $USER['fname'] . " (" . $USER['uname'] . ")</b>";
      break;
    case 'test':
      // echo strtotime("+1 year");
      var_dump($_SESSION);
      break;
    case 'register':
      header('Content-Type: text/html; charset=utf-8');
      echo file_get_contents($COREDIR . '../static/html/register.html');
      break;
    case 'login':
      header('Content-Type: text/html; charset=utf-8');
      echo file_get_contents($COREDIR . '../static/html/login.html');
      break;
    case 'phpinfo':
      header('Content-Type: text/html; charset=utf-8');
      phpinfo();
      break;
    case 'cleanupsession':
      $files = glob($COREDIR . 'session/*'); // get all file names
      foreach ($files as $file) { // iterate files
        if (is_file($file)) {
          unlink($file); // delete file
        }
      }
      echo 'cleaned up all session files';
      break;
    default:
      echo $_GET['v'] . " not defined!";
      break;
  }
elseif (isset($_POST['action'])) {
  switch ($_POST['action']) {
    case 'login':
      include($COREDIR . 'login.php');
      echo json_encode($USER, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
      break;
    case 'register':
      include($COREDIR . 'register.php');
      $R['USER'] = $USER;
      echo json_encode($R, JSON_FORCE_OBJECT | JSON_UNESCAPED_UNICODE);
      break;
    case 'checkUserName':
      include($COREDIR . 'db.php');
      $username = preg_replace("/[^A-Za-z0-9.]/", '', $_POST['username']);
      $tmp = $DB->querySingle("SELECT username FROM users WHERE username='$username';");
      echo $tmp;
      break;
    case 'checkEmailExist':
      include($COREDIR . 'db.php');
      $stmt = $DB->prepare("SELECT email FROM users WHERE email=:email");
      $stmt->bindValue(':email', $_POST['ema'], SQLITE3_TEXT);
      $tmp = $stmt->execute();
      echo json_encode($tmp->fetchArray(1));
      break;
    default:
      echo "POST ACTION ['" . $_POST['action'] . "'] not defined!";
      break;
  }
}
