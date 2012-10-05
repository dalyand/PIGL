<?php session_start(); ?>
<head>
<link rel="stylesheet" type="text/css" href="style.css" />
</head>
<body>
<?php

if($_GET[logout]){
  echo "Bitte warten...<br>";
  logout();
  ?><meta http-equiv="refresh" content="0; URL=index.php"><?php
}
if($_GET[ok]){
  echo "Bitte warten...<br>";
  check();
  ?><meta http-equiv="refresh" content="0; URL=index.php"><?php
}

if(isset($_GET[mass])){
    echo "Bitte warten...<br>";
    uncheck();
    ?><meta http-equiv="refresh" content="0; URL=index.php"><?php
  }


if($_GET[fu]){
  askMass();
}
if($_GET[del]){
  echo "Bitte warten...<br>";
  del();
  ?><meta http-equiv="refresh" content="0; URL=index.php"><?php
}

function askMass(){
  echo "<p>Wieviel/e ".$_GET[fu]."/e ?</p>";
  $_SESSION['fu']=$_GET[fu];
  echo "<p><a href=\"showlist.php?mass=0\">Egal wieviel/e!</a>";
  ?>
  <form action="showlist.php" method="get">
  <input type="text" name="mass" />
  <input type="submit" value="OK"/>
  </form></p>
  <?php
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
<p>
<a href="http://www.duendar.ch/list">Refresh</a>
<a href="showlist.php?logout=1"> Logout </a><br>
<form action="addobject.php" method="post">
Mass:<br>
<input type="text" name="mass"><br>
Produkt:<br>
<input type="text" name="oname"/><br>
<input type="submit" value="Auf die Liste!"/>
</form>
</p>
<p>

<?php
$con=connectDB();


echo "<ul>";
$result = mysql_query("SELECT * FROM object where lname='".$_SESSION['lname']."' AND checked='0' ORDER BY oname");

while($row = mysql_fetch_array($result)){
    if($row[mass]!=""){
      echo "<a href=\"showlist.php?ok=".$row['oname']."\"><li>".$row['oname']." x ".$row[mass]."</li></a>";
    }else{
      echo "<a href=\"showlist.php?ok=".$row['oname']."\"><li>".$row['oname']."</li></a>";
    }
}
echo "</ul>";
echo "</p><p class=\"gekauft\">Bereits eingekauft:<br>";
//echo "<FONT COLOR=\"#FF0000\">";
echo "<ul>";
$result = mysql_query("SELECT * FROM object where lname='".$_SESSION['lname']."' AND checked='1' ORDER BY oname");
while($row = mysql_fetch_array($result)){
    echo "<li><a class=\"gekauft\" href=\"showlist.php?fu=".$row['oname']."\" >".$row['oname']."</a>";
    echo " <a class=\"gekauft\" href=\"showlist.php?del=".$row['oname']."\" > [X]</a></li>";
}
echo "</ul>";
?>
</gekauft>
</p>
</body>


<?php
  
  }
?>