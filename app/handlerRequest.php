<?php
namespace XMLX;
require '../vendor/autoload.php';

if(  isset ($_POST['actionSend']) ){
    $data = json_decode($_POST['actionSend'],true);
    //@TODO  проверку
 }

    $send_ob= new \TransmitData();
    $new_model = ModelXML::getInstance();
    
    function respondClient(\TransmitData &$ob_,$state){
        $param = ($state) ? (array("actresult" => "success")): array("actresult" => "unsuccess");
        $ob_->Send($param);
    }
            
     switch ($data["action"]){
            case 'addMessage':
                $state = $new_model->addMessage($data);
                respondClient($send_ob, $state);
               break; 
            case 'editMessage':
                $state = $new_model->editMessage($data);
                respondClient($send_ob, $state);
                break;
             case 'addAnswer':
                $state = $new_model->addAnswer($data);
                respondClient($send_ob, $state);
               break; 
            
            
}