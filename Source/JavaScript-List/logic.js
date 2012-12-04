var $oname = new Array();
var $mass  = new Array();
var $state = new Array();
var $sync  = 'offline';
var $count = 100;
var $items = 0;
var $URL="logic.php";


$(document).ready(function(){
  if(!localStorage.oname){
    commit();
  }
  list();
  
 
  
  sync();
});

function setIcon($icon){
  //$("#icon").html("<img src=\"img/"+$icon+".png\" width=\"20\" height=\"20\">");
  //$("#icon").button('refresh');

}

function syncBack($data,$status){

  localStorage['syncdata']=$data;
  localStorage['syncstatus']=$status;

  var myString = $data;
  var myArray = myString.split(';;;;;');
  $newOname=JSON.parse(myArray[0]);
  $newMass=JSON.parse(myArray[1]);
  $newState=JSON.parse(myArray[2]);
  $newItems=$newOname.length;
 
  update();
  for($j=0;$j<$newItems;$j++){
  $exist=false;
    for($i=0;$i<$items;$i++){
      if($oname[$i]==$newOname[$j]){
        $exist=true;
        delObj($i);
        $oname[$items]=$newOname[$j];
        $mass[$items]=$newMass[$j];
        $state[$items]=$newState[$j];
        $items=items+1;
        break;
      }
    }
    if(!$exist){
      $oname[$items]=$newOname[$j];
      $mass[$items]=$newMass[$j];
      $state[$items]=$newState[$j];
      $items=$items+1;
    }
  }
  commit();
  setIcon("online");
  $sync='online';
  list();
}



function sync(){
  setIcon("busy");
  $sync='busy';
  $.post($URL,
  {
    oname:localStorage['oname'],
    mass:localStorage['mass'],
    state:localStorage['state']
  },
  function(data,status){
    syncBack(data,status);
    //alert("Data: " + data + "\nStatus: " + status);
  });
}




function add(){
  //Formular auslesen, Daten speichern
  $formOname = $("#oname").val();
  $formMass = $("#mass").val();
  //...Hier Kontrolle der Eingabe...
  $formOname = $formOname.replace(" ","_");
  if($formOname){
    //Check if obj allready exist
    $exist = false;
    update();
    for($i=0;$i<$items;$i++){
    //Falls Bereits vorhanden
      if($oname[$i]==$formOname){
        $exist = true;
        if($formMass){
          $mass[$i]  = $formMass;
          
          if($state[$i]=='killed'){
            $("#to_buy").append("<li data-icon=\"check\" id=\""+$formOname+"\" onclick=\"remove('"+$formOname+"')\">"+$formOname+" x "+$formMass+"</li>");
            $('#to_buy').listview('refresh');
          }else{
            $("#"+$formOname).remove();
            $("#to_buy").append("<li data-icon=\"check\" id=\""+$formOname+"\" onclick=\"remove('"+$formOname+"')\">"+$formOname+" x "+$formMass+"</li>");
            $('#to_buy').listview('refresh'); 
          }
          $state[$i] = 'normal';
          commit();
          //sync();
        }else{
          if($state[$i]=='killed'){
            $("#to_buy").append("<li data-icon=\"check\" id=\""+$formOname+"\" onclick=\"remove('"+$formOname+"')\">"+$formOname+"</li>");
            $('#to_buy').listview('refresh');
          }
          if($state[$i]=='killed')$state[$i] = 'normal';
          $mass[$i]  = 0;
          commit();
          //sync();
        } 
        break; 
      }   
    }
    //Falls noch nicht vorhanden
    if(!$exist){
      if($formMass){
        update();
          $oname[$items] = $formOname;
          $mass[$items]  = $formMass;
          $state[$items] = 'new';
          $items = $items+1;
        commit();
        $("#to_buy").append("<li data-icon=\"check\" id=\""+$formOname+"\" onclick=\"remove('"+$formOname+"')\">"+$formOname+" x "+$formMass+"</li>");
        $('#to_buy').listview('refresh');
        //sync();
      }else{
        update();
          $oname[$items] = $formOname;
          $mass[$items]  = 0;
          $state[$items] = 'new';
          $items = $items+1;
        commit();
        $("#to_buy").append("<li data-icon=\"check\" id=\""+$formOname+"\" onclick=\"remove('"+$formOname+"')\">"+$formOname+"</li>");
        $('#to_buy').listview('refresh');
        //sync();
      }
    }
  }else{
    //Kein Objekname eingegeben...
  }
  //Formular leeren
  $("#oname").val("");
  $("#mass").val("");
  
  
  
  
 
}


function list(){
  update();
  for($i=0;$i<$items;$i++){
    if($state[$i]!='killed'){
      if($mass[$i]==0){
        $("#to_buy").append("<li data-icon=\"check\" id=\""+$oname[$i]+"\" onclick=\"remove('"+$oname[$i]+"')\">"+$oname[$i]+"</li>");
      }else{
        $("#to_buy").append("<li data-icon=\"check\" id=\""+$oname[$i]+"\" onclick=\"remove('"+$oname[$i]+"')\">"+$oname[$i]+" x "+$mass[$i]+"</li>");
      }
    }
  }
  $('#to_buy').listview('refresh'); 
}

function remove($formOname){
  $("#"+$formOname).remove();
  $('#to_buy').listview('refresh');
  update();
    for($i=0;$i<$items;$i++){
      if($oname[$i]==$formOname){
        if($state[$i]=='new') delObj($i);
        else $state[$i]='killed';
        break;
     }
    }
  commit();
  //sync();
}

function delObj($nr){
  for($i=$nr;$i<$items-1;$i++){
    $oname[$i]=$oname[$i+1];
    $mass[$i]=$mass[$i+1];
    $state[$i]=$state[$i+1];
  }
  $oname.pop();
  $mass.pop();
  $state.pop();
  $items=$items-1;
}

/*
function addObj(){

}
*/

function update(){
  updateOname();
  updateMass();
  updateState();
  $items = Number(localStorage['items']);
}

function commit(){
  commitOname();
  commitMass();
  commitState();
  localStorage['items'] = $items;
}

function updateOname(){
  $oname = JSON.parse(localStorage['oname']);
}

function commitOname(){
  localStorage['oname']=JSON.stringify($oname);
}

function updateMass(){
  $mass = JSON.parse(localStorage['mass']);
}

function commitMass(){
  localStorage['mass']=JSON.stringify($mass);
}

function updateState(){
  $state = JSON.parse(localStorage['state']);
}

function commitState(){
  localStorage['state']=JSON.stringify($state);
}
