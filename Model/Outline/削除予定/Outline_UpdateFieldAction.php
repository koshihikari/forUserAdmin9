<?php

class Outline_UpdateFieldAction extends AppModel {
	public $useTable = 'outlines';
	
	/*
	 * Fieldデータ削除メソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function updateField($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		// error_log("\n", 3, 'log.txt');
		// error_log("Outline_UpdateFieldAction :: updateField\n", 3, 'log.txt');
		// error_log('residence_id = ' . $request->data['residence_id'] . "\n", 3, 'log.txt');
		// error_log('company_id = ' . $request->data['company_id'] . "\n", 3, 'log.txt');
		// error_log('user_id = ' . $request->data['user_id'] . "\n", 3, 'log.txt');
		// error_log('id = ' . $request->data['id'] . "\n", 3, 'log.txt');
		if ($request->isPost()) {
			if (
				isset($request->data['residence_id']) && 
				isset($request->data['company_id']) && 
				isset($request->data['user_id']) && 
				isset($request->data['id']) && 
				isset($request->data['property']) && 
				(
					isset($request->data['property']['mtr_status_id']) || 
					isset($request->data['property']['name']) || 
					isset($request->data['property']['val'])
				)
			) {
				// Field更新
				$data = array(
					'id'			=> $request->data['id']
				);
				if (isset($request->data['property']['mtr_status_id'])) {
					$data['mtr_status_id'] = $request->data['property']['mtr_status_id'];
				} else if (isset($request->data['property']['name'])) {
					$data['name'] = $request->data['property']['name'];
				} else if (isset($request->data['property']['val'])) {
					$data['val'] = $request->data['property']['val'];
				}
				if (is_array($this->save($data))) {
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
						$json = array('result'=>true);
					} else {
						$this->rollback();
						$json = array('result'=>false, 'message'=>'データ更新に失敗しました。b');
					}
				} else {
					$this->rollback();
					$json = array('result'=>false, 'message'=>'データ更新に失敗しました。a');
				}
			}
		}
		return $json;
	}
}