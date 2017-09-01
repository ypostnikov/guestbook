if (typeof XMLP === 'undefined') {

    var XMLP = {
        //Настройки.Задержка отправки м/у сообщениями  и интервал прихода нового сообшения   
        settings:{
           updateInterval: 2000,
           delay_message :10000,
           books: 'data/si.xml'
        },

        iScount: function () {
            var item = 1;
            return function () {
                return item++;
            };
        },
        iSdecrement: function () {
            return (this.iScount() - 2);
        },
        DOMN:{}
    };
    
    function Assembler(){;}
}

$( document ).ready(function() {
    
   loadDoc();
   
$("#btnSendItem").bind("click",function(event) {
    
    
        if ( $(this).hasClass("block10")){
            $('#myModal').modal('show') ; 
            return false;
        }
        var jsonText;
        var checkElement = new Array( XMLP.ic(),$('#formGroupExampleInput').val(), $('#exampleTextarea').val());
        
        //Установка свойств объекта
        var sendItem = {};
        Assembler.copyProperties(sendItem) ;
        sendItem.action="addMessage";
        sendItem.message.origin.name = checkElement[1];
        sendItem.message.origin.origintext= checkElement[2];
        sendItem.message.idmessage = Date.now().toString();
        jsonText =JSON.stringify(sendItem);
        
        
           if ( checkElement[1].length <= 2  ||  checkElement[2].length <=2  ){
             XMLP.iSdecrement();
             return false;
         }
         else{
            setTimeout( function(){loadDoc();},XMLP.settings.updateInterval);
            $(this).addClass("block10");
            setTimeout( function(){$("#btnSendItem").removeClass("block10");},XMLP.settings.delay_message);
            
        $.ajax({
        type:"POST",
        url:"app/handlerRequest.php",
        data: {actionSend:jsonText},
        async:true,
        dataType: "json",
        cache:false,
        
        beforeSend: function (){
        },
        
        complete:function(){
                //@TODO   на кнопках  обработчики 
        },
        
        success: function(data,status,xhr){
          var Answer=data;
          var itemC =checkElement.length;
              if ( Answer.actresult === "success"){
                  //Add Data, render  user UI
                    var fragment = document.createDocumentFragment();
                    var tr = document.createElement("tr");    
                    for (var i = 0; i < itemC; i++) {
                        var td = document.createElement("td");
                        td.innerHTML = checkElement[i];
                        tr.appendChild(td);
                        fragment.appendChild(tr);
                    }
                   document.getElementById("tBook").tBodies.item(0).appendChild(fragment);
              }
        },
            
        error:function(xhr, status,error){
            console.log(status);
        }
            
        });
            }
    });
    
     $("#btnSendAnswer").bind("click",function (e){
     var parentTR = document.getElementById("activeAnswerTD").parentNode ;
     var lastTD=parentTR.cells.length-1; 
     var hideSecret = parentTR.cells[lastTD].textContent;
     var checkElement = new Array(  $('#formGroupAnswerInput').val(), $('#answerTextarea').val());
     var sendItem = {};
        Assembler.copyProperties(sendItem) ;
        sendItem.action="addAnswer";
        sendItem.message.idmessage = hideSecret;
        sendItem.message.answer.name = checkElement[0];
        sendItem.message.answer.origintext= checkElement[1];
        sendItem.message.answer.idanswer = Date.now().toString();
        var jsonText =JSON.stringify(sendItem);
         
        $.ajax({
        type:"POST",
        url:"app/handlerRequest.php",
        data: {actionSend:jsonText},
        async:true,
        dataType: "json",
        cache:false,
        
        beforeSend: function (){

         if ( checkElement[0].length == 0 || checkElement[1].length ==0  ){
//             XMLP.iSdecrement();
             //@TODO проверки
             return false;
         }
        },
        
        complete:function(){
                //@TODO   на кнопках  обработчики 
            $("#activeAnswerTD").removeAttr('id');
            
        },
        
        success: function(data,status,xhr){
         
          var Answer=data;
              if ( Answer.actresult === "success"){
                  $("#formMessage").removeClass('hidden');
                  $("#formAnswer").addClass('hidden');
                var answerToMessage = "<div><ul class='nav nav-list'><li><span class='label label-info'>"+
                    $('#formGroupAnswerInput').val() +"</span></li><li>"+ $('#answerTextarea').val()+"</li></ul></div>";
                    $("#answerToInsert").append(answerToMessage);
                    $("#answerToInsert").removeAttr('id');
                
              }
        },
            
        error:function(xhr, status,error){
            console.log(status);
        }
     
    });
         
     });
});

function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            loadXML(this);
        }
    };
    xhttp.open("POST", XMLP.settings.books, true);
    xhttp.send();
}

function loadXML(xml) {
    XMLP.ic = XMLP.iScount();
    var i;
    var xmlDoc = xml.responseXML;
    var serializer = new XMLSerializer();
//    var xmlString = serializer.serializeToString(xmlDoc);
//    console.log(xmlString );
    
    var table  ="<tr class='bg-info'><th>#</th><th>Пользователь</th><th>Сообщение</th><th>Редактировать сообщение</th>";
        table  +="<th>Ответить на сообщение</th><th class='hidedata'>Скрытое поле атрибута</th></tr>";
    var x = xmlDoc.getElementsByTagName("message");
    
    var numbar ="<input type ='button' class='editData btn btn-info' value='Редактировать сообщение' />";
        numbar +="<div style='margin-top:10px;'><form onsubmit='return false;'>";
        numbar +="<input type ='button' class='btnSendEdited  hidden btn btn-info' value='Отправить сообщение' />";
        numbar +="</form></div>";
        
        var answerBoard ="<input type ='button' class='answerData btn btn-info' value='Ответить на сообщение' />";
        answerBoard +="<div style='margin-top:10px;'><form onsubmit='return false;'>";
        answerBoard +="</form></div>";
        
    for (i = 0; i < x.length; i++) {
          var answer_user = x[i].getElementsByTagName("answer");
          var arr_answer = [].slice.call( answer_user);
                var Answer;
                var answerTable ="<div class='answerToMessage bg bg-info'>";
            for (var ic  = 0 ; ic < arr_answer.length; ++ic ){
                 Answer =   {
                            idasnwer:arr_answer[ic].getAttribute('idanswer'),
                            name: arr_answer[ic].getElementsByTagName("name")[0].childNodes[0].nodeValue,
                            origintext: arr_answer[ic].getElementsByTagName("origintext")[0].childNodes[0].nodeValue
                            };
                            
                   answerTable +="<div><ul class='nav nav-list'><li><span class='label label-info'>"+Answer.name +"</span></li><li>"+Answer.origintext+"</li></ul></div>";         
            }
                   answerTable +="</div>";
        
        var idmessage = x[i].getAttribute("idmessage");
        var name_user = x[i].getElementsByTagName("name")[0].childNodes[0].nodeValue;
        var origintext = x[i].getElementsByTagName("origintext")[0].childNodes[0].nodeValue;
        table += "<tr><td>"+XMLP.ic()+
                "</td><td>" +
                name_user +
                "</td><td><div class='divanswer'>" +
                origintext+"</div>" + answerTable+
                "</td><td class='buttonAction'>"+
                numbar +
                "</td></td><td class='buttonAction'>"+
                answerBoard +
                "</td>+ <td class='hidedata'>" +
                idmessage+
                "</td></tr>";
    }
    $("#tBook").html(table);
    $(".hidedata").hide();
    Assembler.handleActiveAction();
    Assembler.addHandlerAnswer();
} 

 Assembler.addHandlerAnswer =function (){
     var inputElement = document.getElementsByClassName("answerData");
            for(var icount =0 ; icount<inputElement.length; icount++){
                inputElement.item(icount).addEventListener('click',Assembler.fsetAnswer,false);
        }
 };
 
 Assembler.fsetAnswer = function  (e){
     e.stopPropagation();
     window.scrollTo(0,document.body.scrollHeight);
     $("#formMessage").addClass('hidden');
     $("#formAnswer").removeClass('hidden');
     this.parentNode.setAttribute('id','activeAnswerTD');
     this.parentNode.parentNode.cells[2].getElementsByClassName('answerToMessage')[0].setAttribute('id','answerToInsert');
 };

 Assembler.handleActiveAction = function (){  
    var nodes= document.getElementsByClassName ('editData');
    var editRowElement; 
    var editTdCell;
    
    for(var i = 0 ; i < nodes.length ; i++) {
      nodes[i].addEventListener('click', function(e) {
          
         var btnClick = e.target;
           var iCount=0;
            var currentCell = this.parentNode; 
             editRowElement = this.parentNode.parentElement;
             editTdCell = editRowElement.cells[2]; 
             XMLP.DOMN.oldFrag = editTdCell.childNodes.item(1);
             editRowElement.cells[5].setAttribute('id','tdHidden'); 
             editTdCell.setAttribute('id','activeCellEdit'); 
             editTdCell.addEventListener('click',clickArea);
          
            function clickArea(e){
                if(e.type == "click" && iCount >=1){
                    return false;
                }
                iCount++;
                var tdContent =( $(this).children('.divanswer')[0]).innerHTML; 
                var inputField = '<input  style="width:100%; height:100%"; type="text" id="edit" value="' + tdContent +'" />';
                $(this).empty().append(inputField);
                $('#edit').focus();
                $('#edit').keypress(function (e) { if (e.which == 13 && $(this).val().length>4 ) {
                var newContent = $(this).val();
                $(this).parent().text(newContent);
                var btnSendEdited = currentCell.getElementsByClassName('btnSendEdited').item(0);
                    btnSendEdited.classList.remove('hidden'); 
                    editTdCell.removeEventListener('click',clickArea);
                    btnSendEdited.addEventListener('click',Assembler.sendEditMessage);
                 }
             });
                  
              };
       }); 
    }
};


Assembler.sendEditMessage = function (e){
    var btnTarget =e.target;
    var editedRoot = document.getElementById('activeCellEdit');
    var editedValue = editedRoot.childNodes.item(0).nodeValue; 
    var idEditedMessage  = document.getElementById('tdHidden').childNodes.item(0).nodeValue;
    var jsonText;   
    var sendItem = {};
     Assembler.copyProperties(sendItem) ;
        sendItem.action="editMessage";
        sendItem.message.origin.origintext = editedValue;
        sendItem.message.idmessage =idEditedMessage;
        jsonText =JSON.stringify(sendItem);
        
        editedRoot.removeChild( editedRoot.childNodes.item(0));
        var inner = document.createElement('div');
        inner.setAttribute('class','divanswer');
        inner.innerHTML = editedValue ;
        editedRoot.appendChild(inner);
        editedRoot.appendChild( XMLP.DOMN.oldFrag);
       
        $.ajax({
        type:"POST",
        url:"app/handlerRequest.php",
        data: {actionSend:jsonText},
        async:true,
        dataType: "json",
        cache:false,
        
        beforeSend: function (){
            btnTarget.classList.add('hidden');
        },
        
        success: function(data,status,xhr){
            //@TODO Подмигнуть в случае успеха на строке
            var Answer = data;
              if ( Answer.actresult === "success"){
              $("#activeCellEdit").removeAttr('id');
              }
        },
            
        error:function(xhr, status,error){
            console.log(status);
        }
            
        });
};

 Assembler.createdefinedRow = function (param) {
    var icount = param.length;
    var fragment = document.createDocumentFragment();
    var tr = document.createElement("tr");
    for (var i = 0; i < icount; i++) {
        var td = document.createElement("td");
        td.innerHTML = param[i].valvar;
        if (param[i].hasOwnProperty("clascss")) {
            td.setAttribute('class', param[i].clascss);
        }
        if (param[i].hasOwnProperty("iditem")) {
            td.setAttribute('id', param[i].iditem);
        }
        tr.appendChild(td);
        fragment.appendChild(tr);
    }
    return  fragment;
};

//Шаблон для отправки JSON объекта
Assembler.Template={
     action: "",
            message: {
                origin:{
                    name:'',
                    origintext:''  
                },
                 answer:{
                    name:'',  
                    origintext:'',
                    idanswer:''
                },
                idmessage:''
            }
};
             
Assembler.copyProperties = function(dest){
    for(var pro in Assembler.Template ){
        dest[pro]=Assembler.Template[pro];
    }
    return dest;
};
