<?php
include 'dbuser.php';

$con = mysql_connect($mysql_host,$mysql_user,$mysql_password);
if (!$con)
{
  die('Could not connect: ' . mysql_error());
}
mysql_select_db($mysql_database, $con);

//last object access
echo "<h1>Last object access</h1>";
$sql = "SELECT `lname`,`oname`,`mass`,`date` FROM object WHERE 1 order by date DESC, oname, lname";
$resp = mysql_query($sql);
echo "<p>";
echo "<table border='1' style='border-collapse: collapse'>";
$i=0;
echo "<tr><th>&#8595 Last access date</th><th>Object name</th><th>Mass</th><th>Listname</th></tr>";
while($row = mysql_fetch_array($resp)){
  echo "<tr>";
  echo "<td>".$row['date']."</td>";
  echo "<td>".$row['oname']."</td>";
  echo "<td>".$row['mass']."</td>";
  echo "<td>".$row['lname']."</td></tr>";
  $i++;
}
echo "</table>";
echo "Total number of objects: ".$i;    
echo "</p>";


//last list access
echo "<h1>Last list access</h1>";
$sql = "select lastAccessDate, lname from list order by lastAccessDate DESC";
$resp = mysql_query($sql);
echo "<p>";
echo "<table border='1' style='border-collapse: collapse'>";
$i=0;
echo "<tr><th>&#8595 Last access date</th><th>Listname</th></tr>";
while($row = mysql_fetch_array($resp)){
  echo "<tr>";
  echo "<td>".$row['lastAccessDate']."</td>";
  echo "<td>".$row['lname']."</td></tr>";
  $i++;
}
echo "</table>";
echo "Total number of lists: ".$i;    
echo "</p>";


//Lists
echo "<h1>Lists</h1>";
$sql = "SELECT `lname`,`oname`,`mass`,`date` FROM object WHERE 1 order by lname, oname, date";
$resp = mysql_query($sql);
$i=0;
$itot=0;
$act="";
$first=1;
while($row = mysql_fetch_array($resp)){
  if(strcmp($row['lname'],$act) != 0){
    if(!$first){
      echo "</table>";
      echo "Total objects in this list: ".$i; 
      $i=0;
      echo "</p>";
    }
    $first=0;
    $act = $row['lname'];
    echo "<h2>".$act."</h2>";
    echo "<p>";
    echo "<table border='1' style='border-collapse: collapse'>";
    echo "<tr><th>&#8595 Object name</th><th>Mass</th><th>Date added/edited</th></tr>";
  }
  echo "<tr><td>".$row['oname']."</td>";
  echo "<td>".$row['mass']."</td>";
  echo "<td>".$row['date']."</td></tr>";
  $i++;
  $itot++;
}
echo "</table>";
echo "Total objects in this list: ".$i; 
echo "</p>";
echo "Total objects in all lists: ".$itot; 



