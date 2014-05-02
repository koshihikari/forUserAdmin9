<?php

class Outline_InsertFieldAction extends AppModel {
	public $useTable = 'outlines';
	
	/*
	 * Elementデータ挿入メソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function insertField($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		// error_log("\n", 3, 'log.txt');
		// error_log("Outline_InsertFieldAction :: insertField\n", 3, 'log.txt');
		// error_log('residence_id = ' . $request->data['insertData']['residence_id'] . "\n", 3, 'log.txt');
		// error_log('user_id = ' . $request->data['insertData']['user_id'] . "\n", 3, 'log.txt');
		// error_log('order = ' . $request->data['insertData']['order'] . "\n", 3, 'log.txt');
		// error_log('mtr_status_id = ' . $request->data['insertData']['mtr_status_id'] . "\n", 3, 'log.txt');
		if ($request->isPost()) {
			if (
				isset($request->data['insertData']['residence_id']) && 
				isset($request->data['insertData']['user_id']) && 
				isset($request->data['insertData']['order']) && 
				isset($request->data['insertData']['is_deletable']) && 
				isset($request->data['insertData']['mtr_status_id'])
			) {
				$data = array(
					'Outline_InsertFieldAction.order'		=> "`Outline_InsertFieldAction`.`order` + 1"
				);
				$conditions = array(
					'Outline_InsertFieldAction.order >= '		=> $request->data['insertData']['order']
				);
				$this->begin();
				if ($this->updateAll($data, $conditions)) {
					if (is_array($this->save($request->data['insertData']))) {
						$latestInsertId = $this->getLastInsertID();
						$result = $this->find('first', array('conditions'=>array('id'=>$this->getLastInsertID())));
						$result['outlines'] = $result['Outline_InsertFieldAction'];
						unset($result['Outline_InsertFieldAction']);
						$this->commit();
						$json = array('result'=>true, 'data'=>$result);
					} else {
						$this->rollback();
						$json = array('result'=>false, 'message'=>'データ追加に失敗しました。b');
					}
				} else {
					$this->rollback();
					$json = array('result'=>false, 'message'=>'データ追加に失敗しました。a');
				}
			}
		}
		return $json;
	}
}