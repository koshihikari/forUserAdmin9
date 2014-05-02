<?php

class Outline_DeleteFieldAction extends AppModel {
	public $useTable = 'outlines';
	
	/*
	 * Fieldデータ削除メソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function deleteField($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		// error_log("\n", 3, 'log.txt');
		// error_log("Outline_DeleteFieldAction :: deleteField\n", 3, 'log.txt');
		// error_log('residence_id = ' . $request->data['residence_id'] . "\n", 3, 'log.txt');
		// error_log('company_id = ' . $request->data['company_id'] . "\n", 3, 'log.txt');
		// error_log('user_id = ' . $request->data['user_id'] . "\n", 3, 'log.txt');
		// error_log('id = ' . $request->data['id'] . "\n", 3, 'log.txt');
		if ($request->isPost()) {
			if (
				isset($request->data['residence_id']) && 
				isset($request->data['company_id']) && 
				isset($request->data['user_id']) && 
				isset($request->data['id'])
			) {
				// 削除するFieldのorderを取得
				$result = $this->find('first', array('conditions'=>array('id'=>$request->data['id'])));
				$targetOrder = $result['Outline_DeleteFieldAction']['order'];
				// error_log('targetOrder = ' . $targetOrder . "\n", 3, 'log.txt');

				// 削除するFieldのorderより大きいorderのFieldのorderを-1する
				$data = array(
					'Outline_DeleteFieldAction.order'		=> "`Outline_DeleteFieldAction`.`order` - 1"
				);
				$conditions = array(
					'Outline_DeleteFieldAction.order > '		=> $targetOrder
				);
				$this->begin();
				if ($this->updateAll($data, $conditions)) {

					if ($this->delete($request->data['id'])) {	// Field削除

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
							$json = array('result'=>false, 'message'=>'データ削除に失敗しました。c');
						}
					} else {
						$this->rollback();
						$json = array('result'=>false, 'message'=>'データ削除に失敗しました。b');
					}
				} else {
					$this->rollback();
					$json = array('result'=>false, 'message'=>'データ削除に失敗しました。a');
				}
			}
		}
		return $json;
	}
}