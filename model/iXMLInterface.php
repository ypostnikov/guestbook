<?php
namespace XMLX;

interface iXMLInterface {
    const GUESTBOOK = "guestbook";
    const MESSAGE = "message";
    const ANSWER  = "answer";
    const IDANSWER  = "idanswer";
    const ORIGIN = "origin";
    const NAME =  "name";
    const ORIGINTEXT = "origintext";
    const IDMESSAGE ="idmessage";
    function addMessage(array &$piece);
    function editMessage(array &$piece);
    public function addAnswer(array &$piece);
    function showXml();
}
