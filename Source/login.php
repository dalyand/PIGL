<?php
include 'dbuser.php';

$lname=$_POST['lname'];
$pw=$_POST['pw'];


$pw=md5($pw);

$con = mysql_connect($mysql_host,$mysql_user,$mysql_password);
if (!$con)
{
  die('Could not connect: ' . mysql_error());
}
mysql_select_db($mysql_database, $con);




$dbAll=mysql_query("SELECT lname, pw FROM list where lname='".$lname."'");
$i=0;
$dbOname = array();
$dbMass = array();
$row = mysql_fetch_array($dbAll);
if($row['pw']==$pw){
  echo $row['lname'];
}else {
  echo "0";
}
