<?php

trait ModArray {
    //Собирает  из многомерного
    private function getKeyArray($arr, $search) {
        static $result = array();
        foreach ($arr as $k => $v) {
            if ($k == $search){
                $result[$k] = $v;
            }
            if (is_array($arr[$k])){
                $this->getKeyArray($v, $search);
            }
        }
        return $result;
    }

}
