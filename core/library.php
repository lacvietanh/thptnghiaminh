<?php
include_once($COREDIR . 'db.php');
$now = date("d/m/Y H:i:s", time());
$stm = $DB->prepare("REPLACE INTO library
  (bid, bname, categoryCode, quantity, price, inyear, updated, updatedby)
  VALUES (?,?,?,?,?,?,?,?);");
$stm->bindParam(1, $_POST['bid']);
$stm->bindParam(2, $_POST['bname']);
$stm->bindParam(3, $_POST['cateCode']);
$stm->bindParam(4, $_POST['quanti']);
$stm->bindParam(5, $_POST['price']);
$stm->bindParam(6, $_POST['inyear']);
$stm->bindParam(7, $now);
$stm->bindParam(8, $USER['uname']);
$ret = $stm->execute();
if (!$ret) {
  $R['STATUS'] = 0;
  $R['MESS'] =  $DB->lastErrorMsg();
} else { // success
  $R['STATUS'] = 1;
  $R['MESS'] = "Successfully Updated data to Library!";
  $R['LastInsertID'] = $DB->lastInsertRowid();
}
echo json_encode($R, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
