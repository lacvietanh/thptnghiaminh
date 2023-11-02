<?php
include_once($COREDIR . 'db.php');

$EoU = preg_replace("/[^A-Za-z0-9.@]/", '', $_POST['emailOrUname']);
$password = md5($_POST['password']);
$USER['debug'] = "POST action 'login' called!\nEmailOrUsername: $EoU\nPassword: $password\n";
// username when register only accept "." not "@"
// email when register not accept duplicated
if (strpos($EoU, '@')) {
  $loginVia = "Email";
  $sql = 'SELECT * from users where email="' . $EoU . '";';
} else {
  $loginVia = "UserName";
  $sql = 'SELECT * from users where username="' . $EoU . '";';
}
$tmp = $DB->query($sql);
while ($row = $tmp->fetchArray(SQLITE3_ASSOC)) {
  $id = $row['uid'];
  $trueUname = $row["username"];
  $truePass = $row['password'];
  $fullName = $row['fullname'];
}
if ($id) {
  if ($password == $truePass) {
    $_SESSION['logged'] =  $USER['logged'] = 1;
    $_SESSION['uname'] = $trueUname;
    $_SESSION['fname'] = $fullName;
    $USER['MESS'] .= "Đăng nhập bằng $loginVia Thành công!";
  } else $USER['MESS'] .= "Mật khẩu không đúng!";
} else {
  $USER['MESS'] .= "$loginVia không tồn tại! Vui lòng đăng ký thành viên!";
}

$USER['debug'] .= "\n" . json_encode($_SESSION, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
