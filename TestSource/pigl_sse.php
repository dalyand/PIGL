<?php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');

include 'dbuser.php';



$lname="test";



$con = mysql_connect($mysql_host,$mysql_user,$mysql_password);
if (!$con)
{
  die('Could not connect: ' . mysql_error());
}
mysql_select_db($mysql_database, $con);




$dbAll=mysql_query("SELECT oname, mass FROM object where lname='".$lname."' ORDER BY oname");
$i=0;
$dbOname = array();
$dbMass = array();
$dbstate = array();
$dbState[$i]="";
while($row = mysql_fetch_array($dbAll)){
  $dbOname[$i]=$row[oname];
  $dbMass[$i]=$row[mass];
  $dbState[$i]='normal';
  $i++;
}



echo "data: ".json_encode($dbOname);
echo "data: ;;;;;";
echo "data: ".json_encode($dbMass);
echo "data: ;;;;;";
echo "data: ".json_encode($dbState);


flush();
?>