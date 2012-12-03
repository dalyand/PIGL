var $oname = new Array();
var $mass  = new Array();
var $state  = new Array();
var $items = 0;


$(document).ready(function(){
  if(!localStorage.oname){
    commit();
  }
  list();
  
 
  
  sync();
});


function sync(){
  
  
}
//Kontrolle ob als killed....
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
        }else{
          if($state[$i]=='killed'){
            $("#to_buy").append("<li data-icon=\"check\" id=\""+$formOname+"\" onclick=\"remove('"+$formOname+"')\">"+$formOname+"</li>");
            $('#to_buy').listview('refresh');
          }
          $mass[$i]  = 0;
          $state[$i] = 'normal';
          commit();
        }  
      }
      break;
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
      }else{
        update();
          $oname[$items] = $formOname;
          $mass[$items]  = 0;
          $state[$items] = 'new';
          $items = $items+1;
        commit();
        $("#to_buy").append("<li data-icon=\"check\" id=\""+$formOname+"\" onclick=\"remove('"+$formOname+"')\">"+$formOname+"</li>");
        $('#to_buy').listview('refresh');
      }
    }
  }else{
    //Kein Objekname eingegeben...
  }
  //Formular leeren
  $("#oname").val("");
  $("#mass").val("");
  
  
  
  sync();
 
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
