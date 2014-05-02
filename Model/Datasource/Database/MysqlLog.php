<?php
/**
 * /Model/Datasource/Database/MysqlLog.php
 */
App::uses('Mysql', 'Model/Datasource/Database');
class MysqlLog extends Mysql {
 /**
  * クエリ実行メソッドを拡張して、実行クエリや
  * 処理時間をログ出力
  */
 public function execute($sql, $options = array(), $params = array()) {
  try {
   $t = microtime(true);
   $res = parent::execute($sql, $options, $params);
   $took = round((microtime(true) - $t) * 1000, 0);
   $rows = $this->affected = $this->lastAffected();
   CakeLog::debug("took[{$took}] rows[{$rows}] {$sql}");
   return $res;
  } catch (PDOException $e) {
   CakeLog::error("[EMERGENCY] {$sql}");
   throw $e;
  }
 }
}

