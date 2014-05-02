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
				isset($request->data['residence_id']) && 
				isset($request->data['company_id']) && 
				isset($request->data['user_id']) && 
				isset($request->data['order']) && 
				isset($request->data['is_deletable']) && 
				isset($request->data['mtr_status_id'])
			) {
				// 追加するFieldのorder以上のorderを持つFieldのorderを+1する
				$data = array(
					'Outline_InsertFieldAction.order'		=> "`Outline_InsertFieldAction`.`order` + 1"
				);
				$conditions = array(
					'Outline_InsertFieldAction.order >= '		=> $request->data['order']
				);
				$this->begin();
				if ($this->updateAll($data, $conditions)) {
					$data = array(
						'residence_id'	=> $request->data['residence_id'],
						'user_id'		=> $request->data['user_id'],
						'is_deletable'	=> $request->data['is_deletable'],
						'order'			=> $request->data['order'],
						'mtr_status_id'	=> $request->data['mtr_status_id']
					);
					if (is_array($this->save($data))) {
						$latestInsertId = $this->getLastInsertID();
						$result = $this->find('first', array('conditions'=>array('id'=>$this->getLastInsertID())));
						$result['outlines'] = $result['Outline_InsertFieldAction'];
						unset($result['Outline_InsertFieldAction']);

						// Residencesテーブルのデータの更新日時を更新する
						$data = array(
							'id'			=> $request->data['residence_id'],
							'user_id'		=> $request->data['user_id']
						);
						$this->bindModel(
							array(
								'belongsTo'		=> array(
									'residences'			=> array(
										'foreignKey'	=> 'residence_id'
									)
								)
							)
						);
						if (is_array($this->residences->save($data))) {
							$this->commit();
							$json = array('result'=>true, 'data'=>$result);
						} else {
							$this->rollback();
							$json = array('result'=>false, 'message'=>'データ追加に失敗しました。c');
						}
						// $this->commit();
						// $json = array('result'=>true, 'data'=>$result);
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