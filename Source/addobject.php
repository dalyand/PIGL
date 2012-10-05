<?php session_start(); ?>
<head>
<link rel="stylesheet" type="text/css" href="style.css" />
</head>
<?php
echo "".$_POST[oname]." wird hinzugefuegt...<br>";
include "showlist.php";
$con=connectDB();


//Konrolle ob objekt bereits vorhanden und ob Feld nicht leer...
$doppel=0;
$leer=0;
if($_POST[oname]=="") {
  $leer=1;
  echo "Bitte einen Namen eingeben!<br>";
  mysql_close($con);
  ?><meta http-equiv="refresh" content="0; URL=index.php"><?php
}
else{//Falls feld nicht leer, kontrolle ob kein dublikat.
  $result = mysql_query("SELECT * FROM object where lname='".$_SESSION['lname']."' AND oname='".$_POST[oname]."'");
  while($row = mysql_fetch_array($result)){
    if(0==strcasecmp($row[oname],$_POST[oname])){
      echo $_POST[oname]." ist bereits auf der Liste.<br>";
      $doppel=1;
      addDouble();
      mysql_close($con);
      ?><meta http-equiv="refresh" content="0; URL=index.php"><?php
      ////echo "<meta http-equiv=\"refresh\" content=\"0; URL=showlist.php?fu=".$_POST[oname]."\">";
    }
  }
}


if(!$doppel && !$leer){
  if($_POST[mass]!="0"){
    $sql="INSERT INTO object (lname, mass, oname, checked)
    VALUES ('".$_SESSION['lname']."','$_POST[mass]','$_POST[oname]','0')";
  }else{
    $sql="INSERT INTO object (lname, mass, oname, checked)
    VALUES ('".$_SESSION['lname']."','','$_POST[oname]','0')";
  }
  if (!mysql_query($sql,$con))
  {
    die('Error: ' . mysql_error());
  }
  mysql_close($con);
  ?><meta http-equiv="refresh" content="0; URL=index.php"><?php
}

function addDouble(){
  echo "Neues Mass wird uebernommen.<br>";
  if($_POST[mass]!="0"){
    $sql="UPDATE object SET checked='0', mass='".$_POST[mass]."' WHERE lname='".$_SESSION['lname']."' AND oname='$_POST[oname]'";
  }else{
    $sql="UPDATE object SET checked='0', mass='' WHERE lname='".$_SESSION['lname']."' AND oname='$_POST[oname]'";
  }
  mysql_query($sql);
}

?>