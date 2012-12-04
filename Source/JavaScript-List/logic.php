<?php
include 'dbuser.php';

$strOname=$_POST['oname'];
$strMass=$_POST['mass'];
$strState=$_POST['state'];
$strOname=str_replace("\\", "", $strOname);
$strState=str_replace("\\", "", $strState);
$strMass=str_replace("\\", "", $strMass);
$oname = json_decode($strOname,true);
$mass = json_decode($strMass,true);
$state = json_decode($strState,true);


$con = mysql_connect($mysql_host,$mysql_user,$mysql_password);
if (!$con)
{
  die('Could not connect: ' . mysql_error());
}
mysql_select_db($mysql_database, $con);


$dbAll=mysql_query("SELECT oname, mass FROM object where lname='test' ORDER BY oname");
$i=0;
$dbOname = array();
$dbMass = array();
while($row = mysql_fetch_array($dbAll)){
  $dbOname[$i]=$row[oname];
  $dbMass[$i]=$row[mass];
  $i++;
}
  
  
for($i=0;$i<count($oname);$i++){
  if($state[$i]!='normal'){
    $exist=false;
    for($j=0;$j<count($dbOname);$j++){
      if($oname[$i]==$dbOname[$j]){
        $exist=true;
        if($state[$i]=='new'){
          $sql="UPDATE object SET mass='".$mass[$i]."' WHERE lname='test' AND oname='".$oname[$i]."'";
          mysql_query($sql);
        }else if($state[$i]=='killed'){
          $sql="DELETE from object where lname='test' AND oname='".$oname[$i]."'";
          mysql_query($sql);        
        }
      }
    }
    if(!$exist){
      if($state[$i]=='new'){
        //Insert...
      }
    }
  }
}



$dbAll=mysql_query("SELECT oname, mass FROM object where lname='test' ORDER BY oname");
$i=0;
$dbOname = array();
$dbMass = array();
$dbstate = array();
while($row = mysql_fetch_array($dbAll)){
  $dbOname[$i]=$row[oname];
  $dbMass[$i]=$row[mass];
  $dbState[$i]='normal';
  $i++;
}




echo json_encode($dbOname);
echo ";;;;;";
echo json_encode($dbMass);
echo ";;;;;";
echo json_encode($dbState);
//echo $oname[0];
//echo "<br>".$strOname;


?>