<?php
include_once($COREDIR . 'db.php');
$R['beforePOST'] = $_POST;
// Handle input:
$username = preg_replace("/[^A-Za-z0-9.]/", '', $_POST['username']);
$R['secured_UserName'] = $username;
$password = md5($_POST['password']);
$R['pass_MD5'] = $password;

// Prevent BOT filled in Fake Email field:
if ($_POST['email']) {
  $R['STATUS'] = 0;
  $R['MESS'] = 'BOT SPAM IS NOT ALLOWED!';
} else {
  if (strlen($username) < 3) {
    $R['STATUS'] = 0;
    $R['MESS'] = "UserName quá ngắn, vui lòng nhập UserName tối thiểu 3 ký tự";
  } else {
    $tmp = $DB->querySingle("SELECT username FROM users WHERE username='$username';");
    $R['UserName_Exist'] = $tmp;
    if ($tmp || $username == "guest") {
      $R['STATUS'] = 0;
      $R['MESS'] = "UserName <b>$username</b> Đã tồn tại, vui lòng đăng ký UserName khác";
    } else {
      $permission = 0; // 0: normal, 1: admin
      $now = date("Y-m-d H:i", time());
      // execute 
      $stm = $DB->prepare("INSERT INTO users
  (username, password, fullname, permission, birthday,
   email, phone, classroom, fbid, address, joined)
  VALUES (?,?,?,?,?,?,?,?,?,?,?);");
      $stm->bindParam(1, $username);
      $stm->bindParam(2, $password);
      $stm->bindParam(3, $_POST['fullname']);
      $stm->bindParam(4, $permission);
      $stm->bindParam(5, $_POST['birthday']);
      $stm->bindParam(6, $_POST['ema']);
      $stm->bindParam(7, $_POST['phone']);
      $stm->bindParam(8, $_POST['classroom']);
      $stm->bindParam(9, $_POST['fbid']);
      $stm->bindParam(10, $_POST['address']);
      $stm->bindParam(11, $now);
      $ret = $stm->execute();
      if (!$ret) {
        $R['STATUS'] = 0;
        $R['MESS'] =  $DB->lastErrorMsg();
      } else { // success
        $R['STATUS'] = 1;
        $R['MESS'] = "Successfully created account!";
        $R['LastInsertID'] = $DB->lastInsertRowid();
      }
    }
  }
}
