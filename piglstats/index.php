<?php
include 'dbuser.php';

$con = mysql_connect($mysql_host,$mysql_user,$mysql_password);
if (!$con)
{
  die('Could not connect: ' . mysql_error());
}
mysql_select_db($mysql_database, $con);


function rTime ($time)
{
    $orig=$time;
    //seconds
    if($time<60){
      return "".$time." s";
    }
    $time = floor ($time/60);//minutes
    if($time<60){
      $orig=round ($orig-($time*60));
      return "".$time."m ".$orig."s";
    }
    $time = floor ($time/60);//hours
    if($time<24){
      $orig=round(($orig-($time*60*60))/60);
      return "".$time."h ".$orig."m";
    }
    $time = floor ($time/24);//days
    if($time<365){
      $orig=round(($orig-($time*60*60*24))/60/60);
      return "".$time."d ".$orig."h";
    }
    $time = floor ($time/365);//years
    $orig=round(($orig-($time*60*60*24*365))/60/60/24);
    return "".$time."y ".$orig."d";
}


//systemtime
echo "<meta charset='UTF-8'>";
$sql = "SELECT NOW( ) now";
$resp = mysql_query($sql);
$row = mysql_fetch_array($resp);
echo "<p>Systemtime: ".$row['now']."</p>";
$systime = strtotime($row['now']);

//last object added
echo "<h1>Last objects added</h1>";
$sql = "SELECT `lname`,`oname`,`mass`,`date` FROM object WHERE 1 order by date DESC, oname, lname";
$resp = mysql_query($sql);
echo "<p>";
echo "<table border='1' style='border-collapse: collapse'>";
$i=0;
echo "<tr><th>&#8595 Ago</th><th>Object name</th><th>Mass</th><th>Listname</th><th>Last access date</th></tr>";
while($row = mysql_fetch_array($resp)){
  echo "<tr>";
  $diff=(($systime-strtotime($row['date'])));//s
  echo "<td>".rTime($diff)."</td>";
  echo "<td>".$row['oname']."</td>";
  echo "<td>".$row['mass']."</td>";
  echo "<td>".$row['lname']."</td>";
  echo "<td>".$row['date']."</td></tr>";
  $i++;
}
echo "</table>";
echo "Total number of objects: ".$i;    
echo "</p>";


//last lists synced
echo "<h1>Last lists synced</h1>";
$sql = "select lastAccessDate, lname from list order by lastAccessDate DESC";
$resp = mysql_query($sql);
echo "<p>";
echo "<table border='1' style='border-collapse: collapse'>";
$i=0;
echo "<tr><th>&#8595 Ago</th><th>Listname</th><th>Last access date</th></tr>";
while($row = mysql_fetch_array($resp)){
  echo "<tr>";
  $diff=(($systime-strtotime($row['lastAccessDate'])));//s
  echo "<td>".rTime($diff)."</td>";
  echo "<td>".$row['lname']."</td>";
  echo "<td>".$row['lastAccessDate']."</td></tr>";
  $i++;
}
echo "</table>";
echo "Total number of lists: ".$i;    
echo "</p>";


//Lists
echo "<h1>Lists</h1>";
$sql = "SELECT list.lname,object.oname,object.mass,object.date FROM list left join object on list.lname=object.lname WHERE 1 order by lname, oname, date";
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
    echo "<tr><th>&#8595 Object name</th><th>Mass</th><th>Ago</th><th>Date added/edited</th></tr>";
  }
  echo "<tr><td>".$row['oname']."</td>";
  echo "<td>".$row['mass']."</td>";
  $diff=(($systime-strtotime($row['date'])));//s
  echo "<td>".rTime($diff)."</td>";
  echo "<td>".$row['date']."</td></tr>";
  if(strcmp($row['oname'],"")!=0){
    $i++;
    $itot++;
  }
}
echo "</table>";
echo "Total objects in this list: ".$i; 
echo "</p>";
echo "Total objects in all lists: ".$itot; 



