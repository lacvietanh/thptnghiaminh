<?php
// DEMO: 
$userlist = [
  'lacvietanh' => [
    'fname' => 'Lạc Việt Anh'
  ],
  'lacquocviet' => [
    'fname' => 'Lạc Quốc Việt'
  ]
];
// START:
$username = preg_replace("/[^A-Za-z0-9.]/", '', $_POST['username']);
$password = md5($_POST['password']);
$USER['debug']
  = "POST action 'login' called!\nUsername: $username\nPassword: $password\n";
if (isset($userlist[$username])) {
  $_SESSION['logged'] =  $USER['logged'] = 1;
  $_SESSION['uname'] = $username;
  $_SESSION['fname'] = $userlist[$username]['fname'];
  $USER['debug'] .= "Login Successfully!";
} else {
  $USER['debug'] .= "Username not found!";
}
$USER['debug'] .= "\n" . json_encode($_SESSION, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
