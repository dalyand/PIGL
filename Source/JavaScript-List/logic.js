var $oname = new Array();
var $mass  = new Array();
var $items = 0;


$(document).ready(function(){
  if(!localStorage.oname){
    commit();
    localStorage['idxOn']=0;
    localStorage['idxOff']=0;
  }
  list();
  $idxOn=localStorage['idxOn'];
  $idxOff=localStorage['idxOff'];
  sync();
});


function sync(){
  
  
}

function add(){
  //Formular auslesen, Daten speichern
  $formOname = $("#oname").val();
  $formMass = $("#mass").val();
  //...Hier Kontrolle der Eingabe...
  $entry = new Array();
  if($formOname){
    if($formMass){
      update();
        $oname[$items] = $formOname;
        $mass[$items]  = $formMass;
        $items = $items+1;
      commit();
      $("#to_buy").append("<li data-icon=\"check\" id=\""+$formOname+"\" onclick=\"remove('"+$formOname+"')\">"+$formOname+" x "+$formMass+"</li>");
      $('#to_buy').listview('refresh');
    }else{
      update();
        $oname[$items] = $formOname;
        $mass[$items]  = 0;
        $items = $items+1;
      commit();
      $("#to_buy").append("<li data-icon=\"check\" id=\""+$formOname+"\" onclick=\"remove('"+$formOname+"')\">"+$formOname+"</li>");
      $('#to_buy').listview('refresh');
    }
  }else{
    //Kein Objekname eingegeben...
  }
  //Formular leeren
  $("#oname").val("");
  $("#mass").val("");
  
  
  
  //Liste anpassen
 
}


function list(){
  update();
  for($i=0;$i<$items;$i++){
    if($mass[$i]==0){
      $("#to_buy").append("<li data-icon=\"check\" id=\""+$oname[$i]+"\" onclick=\"remove('"+$oname[$i]+"')\">"+$oname[$i]+"</li>");
    }else{
      $("#to_buy").append("<li data-icon=\"check\" id=\""+$oname[$i]+"\" onclick=\"remove('"+$oname[$i]+"')\">"+$oname[$i]+" x "+$mass[$i]+"</li>");
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
       delObj($i);
       break;
     }
    }
  commit();
}

function delObj($nr){
  for($i=$nr;$i<$items-1;$i++){
    $oname[$i]=$oname[$i+1];
    $mass[$i]=$mass[$i+1];
  }
  $oname.pop();
  $mass.pop();
  $items=$items-1;
}

/*
function addObj(){

}
*/

function update(){
  updateOname();
  updateMass();
  $items = Number(localStorage['items']);
}

function commit(){
  commitOname();
  commitMass();
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

