<?php session_start(); ?>

<head> 
	<title>PIGL</title> 
	<meta name="viewport" content="width=device-width, initial-scale=1" charset="ISO-8859-1"> 
	<link rel="stylesheet" href="http://code.jquery.com/mobile/1.2.0/jquery.mobile-1.2.0.min.css" />
	<script src="http://code.jquery.com/jquery-1.8.2.min.js"></script>
	<script src="http://code.jquery.com/mobile/1.2.0/jquery.mobile-1.2.0.min.js"></script>
</head> 
<body>
<?php

if($_GET[logout]){
  //echo "Bitte warten...<br>";
  logout();
  ?><meta http-equiv="refresh" content="0; URL=index.php"><?php
}
if($_GET[ok]){
  //echo "Bitte warten...<br>";
  check();
  ?><meta http-equiv="refresh" content="0; URL=index.php"><?php
}

if(isset($_GET[mass])){
    //echo "Bitte warten...<br>";
    uncheck();
    ?><meta http-equiv="refresh" content="0; URL=index.php"><?php
  }


if($_GET[fu]){
  askMass();
}
if($_GET[del]){
  //echo "Bitte warten...<br>";
  del();
  ?><meta http-equiv="refresh" content="0; URL=index.php"><?php
}

function askMass(){
  echo "<div data-role=\"header\"><h1>PIGL</h1></div><!-- /header -->";
  echo "<ul data-role=\"listview\">";
  echo "<li data-role=\"list-divider\">".$_GET[fu]." hinzufügen:</li>";
  //echo "<div data-role=\"content\"><p>".$_GET[fu]." hinzufügen:</p></div><!-- /header -->";
  ?>
  <li><a href="showlist.php?mass=0" data-role="button">Egal wieviel/e!</a></li>
  <?php
  //echo "<p>Wieviel/e ".$_GET[fu]."/e ?</p>";
  $_SESSION['fu']=$_GET[fu];
  //echo "<p><a href=\"showlist.php?mass=0\">Egal wieviel/e!</a>";
  ?>
  <li data-role="fieldcontain">
  <form action="showlist.php" method="get">
  <div data-role="fieldcontain" class="ui-hide-label">
	  <label for="mass">MASS</label>
	  <input type="text" name="mass" id="mass" value="" placeholder="MASS"/>
	  <input type="submit" value="OK" />
  </div>
  </form>
  </li>
  <?php
  echo "<li data-role=\"list-divider\">".$_GET[fu]." löschen:</li>";
  //echo "<div data-role=\"content\"><p>".$_GET[fu]." löschen:</p></div><!-- /header -->";
  echo "<li data-icon=\"delete\"><a href=\"showlist.php?del=".$_GET[fu]."\">".$_GET[fu]." komplett löschen</a></li></ul>";
  echo "</body>";
  
}

function del(){
  $con=connectDB();
  $sql="DELETE from object where lname='".$_SESSION['lname']."' AND oname='".$_GET[del]."' AND checked='1'";
  mysql_query($sql);
}

function check(){
  $con=connectDB();
  $sql="UPDATE object SET checked='1', mass='' WHERE lname='".$_SESSION['lname']."' AND oname='".$_GET[ok]."' AND checked='0'";
  //echo $sql."<br>";
  mysql_query($sql);
}
//-------mass------If !0
function uncheck(){
  $con=connectDB();
  if($_GET[mass]!="0"){
    $sql="UPDATE object SET checked='0', mass='".$_GET[mass]."' WHERE lname='".$_SESSION['lname']."' AND oname='".$_SESSION[fu]."' AND checked='1'";
  }else{
    $sql="UPDATE object SET checked='0', mass='' WHERE lname='".$_SESSION['lname']."' AND oname='".$_SESSION[fu]."' AND checked='1'";
  }
  //echo $sql."<br>";
  mysql_query($sql);
  $_SESSION[fu]="";
}

function logout(){
 // if(isset($_SESSION['lname']))
 // unset($_SESSION['lname']);
 session_destroy();
}

function connectDB(){


//$mysql_host = 
//$mysql_database = 
//$mysql_user = 
//$mysql_password = 

$con = mysql_connect($mysql_host,$mysql_user,$mysql_password);
if (!$con)
{
  die('Could not connect: ' . mysql_error());
}

mysql_select_db($mysql_database, $con);
return $con;

}

function showlist(){
  ?>
<div data-role="page">

	<div data-role="header">
		<h1>PIGL</h1>
	</div><!-- /header -->

<div data-role="controlgroup" data-type="horizontal">
<a href="javascript:location.reload()" data-role="button" data-inline="true">Aktualisieren</a>
<a href="showlist.php?logout=1" data-role="button" data-inline="true">Abmelden</a>
</div>

<form action="addobject.php" method="post">
  <div data-role="fieldcontain" class="ui-hide-label">
	  <label for="oname">Produkt</label>
	  <input type="text" name="oname" id="oname" value="" placeholder="Produkt"/>
	  <label for="mass">Mass</label>
	  <input type="text" name="mass" id="mass" value="" placeholder="Mass"/>
	  <input type="submit" value="Auf die Liste!" />
  </div>
  </form>





<?php
$con=connectDB();


echo "<ul data-role=\"listview\" data-theme=\"e\">";
echo "<li data-role=\"list-divider\">Einzukaufen:</li>";
$result = mysql_query("SELECT * FROM object where lname='".$_SESSION['lname']."' AND checked='0' ORDER BY oname");

while($row = mysql_fetch_array($result)){
    if($row[mass]!=""){
      echo "<li data-icon=\"check\"><a href=\"showlist.php?ok=".$row['oname']."\">".$row['oname']." x ".$row[mass]."</a></li>";
    }else{
      echo "<li data-icon=\"check\"><a href=\"showlist.php?ok=".$row['oname']."\">".$row['oname']."</a></li>";
    }
}
echo "</ul>";
//echo "</p><p class=\"gekauft\">Bereits eingekauft:<br>";
echo "<ul data-role=\"listview\">";
echo "<li data-role=\"list-divider\">Bereits eingekauft:</li>";
//echo "<FONT COLOR=\"#FF0000\">";
//echo "<ul>";
$result = mysql_query("SELECT * FROM object where lname='".$_SESSION['lname']."' AND checked='1' ORDER BY oname");
while($row = mysql_fetch_array($result)){
    echo "<li><a class=\"gekauft\" href=\"showlist.php?fu=".$row['oname']."\" >".$row['oname']."</a></li>";
    //echo " <a class=\"gekauft\" href=\"showlist.php?del=".$row['oname']."\" > [X]</a></li>";
}
echo "</ul>";
?>
</gekauft>

</div><!-- /page -->
</body>
<?php
  
  }
?>
