<?php session_start(); ?>
<head>
<link rel="stylesheet" type="text/css" href="style.css" />
</head>
<?php
include "showlist.php";
$con=connectDB();

$result = mysql_query("SELECT * FROM list where lname='$_POST[lname]'");

$pw=md5($_POST[pw]);

$login=0;
while($row = mysql_fetch_array($result))
  {
    if($row[pw]==$pw){
      $_SESSION['lname']=$_POST[lname];
      echo "Willkommen!<br>Einen Augenblick...<br>";
      $login=1;
      ?><meta http-equiv="refresh" content="0; URL=index.php"><?php
      break;
    }
  }
if(!$login){
  echo "Versuchen Sie es nocheinmal...";
  ?><meta http-equiv="refresh" content="2; URL=index.php"><?php
}




mysql_close($con);
?>