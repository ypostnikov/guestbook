<?php
final class TransmitData {

    private $m_data;

    public function Send($param) {
        $this->m_data = json_encode($param);
        header("Content-Type:application/json; charset=utf-8");
        echo ($this->m_data);
    }

}
