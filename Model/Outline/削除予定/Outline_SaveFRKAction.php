<?php

class Outline_SaveFRKAction extends AppModel {
	public $useTable = 'outlines';
	
	/*
	 * Elementデータ挿入メソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function saveFRK($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		// error_log("\n", 3, 'log.txt');
		// error_log("Outline_SaveFRKAction :: saveFRK\n", 3, 'log.txt');
		// error_log('residence_id = ' . $request->data['insertData']['residence_id'] . "\n", 3, 'log.txt');
		// error_log('user_id = ' . $request->data['insertData']['user_id'] . "\n", 3, 'log.txt');
		// error_log('order = ' . $request->data['insertData']['order'] . "\n", 3, 'log.txt');
		// error_log('mtr_status_id = ' . $request->data['insertData']['mtr_status_id'] . "\n", 3, 'log.txt');
		if ($request->isPost()) {
			if (
				isset($request->data['residence_id']) && 
				isset($request->data['company_id']) && 
				isset($request->data['user_id']) && 
				isset($request->data['save_data'])
			) {
				// // 追加するFieldのorder以上のorderを持つFieldのorderを+1する
				// $data = array(
				// 	'Outline_InsertFieldAction.order'		=> "`Outline_InsertFieldAction`.`order` + 1"
				// );
				// $conditions = array(
				// 	'Outline_InsertFieldAction.order >= '		=> $request->data['order']
				// );
				$this->begin();
				$isCorrect = true;
				foreach ($request->data['save_data'] as $key => $value) {
					$data = array(
						'id'				=> $request->data['save_data'][$key]['id'],
						'residence_id'		=> $request->data['residence_id'],
						'user_id'			=> $request->data['user_id'],
						'val'				=> $request->data['save_data'][$key]['newVal']
					);
					if (!is_array($this->save($data))) {
						$isCorrect = false;
						break;
					}
				}

				if ($isCorrect === true) {
					$this->commit();
					$json = array('result'=>true);
				} else {
					$this->rollback();
					$json = array('result'=>false, 'message'=>'データ保存に失敗しました。');
				}
			}
		}
		return $json;
	}
}