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

$USER['ssid'] = session_id();
$USER['UA_Cur'] = $_SERVER['HTTP_USER_AGENT'];
if ($_SESSION['logged'] == 1 && $USER['UA_Cur'] == $_SESSION['UA_Logged']) {
  $USER['logged'] = 1;
  $USER['uname'] = $_SESSION['uname'];
  $USER['fname'] = $_SESSION['fname'];
  $USER['admin'] = $_SESSION['admin'];
} else if ($_SESSION['logged'] == 1 && $USER['UA_Cur'] != $_SESSION['UA_Logged']) {
  // prevent session hjacking:
  header('Location: /api?v=logout');
} else {
  $USER['logged'] = null;
  $USER['uname'] = 'guest';
  $USER['fname'] = 'Khách';
  $USER['admin'] = 0;
}

if (isset($_GET['v']))
  switch ($_GET['v']) {
    case 'test':
      include($COREDIR . "fn.php");
      DEBUG_ON();
      // WRITE TEST CASE:

      break;
    case 'dumpinfo':
      echo json_encode($_SESSION + $USER, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
      break;
    case 'auth':
      echo json_encode($USER, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
      break;
    case 'logout':
      include($COREDIR . "logout.php");
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
      foreach ($files as $file) {
        if (is_file($file)) unlink($file);
      }
      echo 'cleaned up all session files';
      break;
      // ###### Web Defined API:
    case 'listUsers':
      include($COREDIR . 'db.php');
      echo $DB->listUsers($USER['admin']);
      break;
    case 'listLibrary':
      include($COREDIR . 'db.php');
      echo $DB->listLibrary();
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
      echo $DB->checkUserNameExist(preg_replace("/[^A-Za-z0-9.]/", '', $_POST['username']));
      break;
    case 'checkEmailExist':
      include($COREDIR . 'db.php');
      echo $DB->checkEmailExist($_POST['ema']);
      break;
    case 'UpdateLibraryData':
      include($COREDIR . 'library.php');
      break;
    default:
      echo "POST ACTION ['" . $_POST['action'] . "'] not defined!";
      break;
  }
}
