<?php
namespace XMLX;

class ModelXML implements iXMLInterface  {
    
    use \ModArray;
    
    private static $_instance = null;
    private static $m_path = null;
    const STORAGE = "data/si.xml"; //Путь зашит по умолчанию
    private static $m_xml=null;
    private $root_tag;

    
    private function __construct() { }
    private function __clone() { }  
    
     static public function getInstance() {
        if (is_null(self::$_instance)) {
            self::$m_path = $_SERVER["DOCUMENT_ROOT"] . '/' . self::STORAGE;
            self::$_instance = new namespace\ModelXML();
        }
        return self::$_instance;
    }
    

    private static function init() {
        self::$m_xml = new \DOMDocument("1.0", "UTF-8");
        self::$m_xml->preserveWhiteSpace = false;
        self::$m_xml->formatOutput = true;
        self::$m_xml->load(self::$m_path);
    }
    

    public function addMessage(array &$piece): bool {
        self::init();
        $this->root_tag = self::$m_xml->getElementsByTagName(self::GUESTBOOK)->item(0);
        $this->getKeyArray($piece, self::IDMESSAGE);
        $arr = $this->getKeyArray($piece, self::ORIGIN);
        $message = self::$m_xml->createElement(self::MESSAGE);
        $message->setAttribute(self::IDMESSAGE, $arr [self::IDMESSAGE]);
        $this->root_tag->appendChild($message);
        $origin = self::$m_xml->createElement(self::ORIGIN);
        $message->appendChild($origin);
        $name = self::$m_xml->createElement(self::NAME, $arr[self::ORIGIN][self::NAME]);
        $origintext = self::$m_xml->createElement(self::ORIGINTEXT, $arr[self::ORIGIN][self::ORIGINTEXT]);
        $origin->appendChild($name);
        $origin->appendChild($origintext);
        return $this->writeToDisk();
    }
    
    
    public function editMessage(array &$piece): bool{
         self::init();
         $messg = $piece[self::MESSAGE][self::IDMESSAGE];
         $xpath = new \DOMXPath(self::$m_xml);
         foreach ($xpath->query("/guestbook/message[@idmessage='$messg']/child::origin/origintext") as $node ){
             $node->nodeValue=$piece[self::MESSAGE][self::ORIGIN][self::ORIGINTEXT];
          }
           return self::writeToDisk();
    }
    
    
    public function addAnswer(array &$piece): bool {
         self::init();
        $this->getKeyArray($piece, self::ANSWER);
        $arr = $this->getKeyArray($piece, self::IDMESSAGE);

        $messg = $arr [self::IDMESSAGE];
        $xpath = new \DOMXPath(self::$m_xml);
        $answer = self::$m_xml->createElement(self::ANSWER);
        $answer->setAttribute(self::IDANSWER, $arr [self::ANSWER][self::IDANSWER]);
        $name = self::$m_xml->createElement(self::NAME, $arr[self::ANSWER][self::NAME]);
        $origintext = self::$m_xml->createElement(self::ORIGINTEXT, $arr[self::ANSWER][self::ORIGINTEXT]);
        $answer->appendChild($name);
        $answer->appendChild($origintext);
        foreach ($xpath->query("/guestbook/message[@idmessage='$messg']") as $node) {
            $node->appendChild($answer);
        }

        return self::writeToDisk();
    }
    

    private static function writeToDisk():bool{
         $res = self::$m_xml->save(self::$m_path);
         if ($res > 1) { return true;}
         return false;
    }
    
    
    public function showXml() {}

}
