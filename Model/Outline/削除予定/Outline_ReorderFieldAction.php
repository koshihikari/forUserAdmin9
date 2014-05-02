<?php

class Outline_ReorderFieldAction extends AppModel {
	public $useTable = 'outlines';
	
	/*
	 * Elementデータ挿入メソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function reorderField($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		// error_log("\n", 3, 'log.txt');
		// error_log("Outline_ReorderFieldAction :: reorderField\n", 3, 'log.txt');
		// error_log('residence_id = ' . $request->data['insertData']['residence_id'] . "\n", 3, 'log.txt');
		// error_log('user_id = ' . $request->data['insertData']['user_id'] . "\n", 3, 'log.txt');
		// error_log('order = ' . $request->data['insertData']['order'] . "\n", 3, 'log.txt');
		// error_log('mtr_status_id = ' . $request->data['insertData']['mtr_status_id'] . "\n", 3, 'log.txt');
		if ($request->isPost()) {
			if (
				isset($request->data['residence_id']) && 
				isset($request->data['company_id']) && 
				isset($request->data['user_id']) && 
				isset($request->data['id']) && 
				isset($request->data['order'])
			) {
				// 入れ替え前のFieldのorderを取得
				$result = $this->find('first', array('conditions'=>array('id'=>$request->data['id'])));
				$prevOrder = $result['Outline_ReorderFieldAction']['order'];

				if ($prevOrder < $request->data['order']) {
					$data = array(
						'Outline_ReorderFieldAction.order'		=> "`Outline_ReorderFieldAction`.`order` - 1"
					);
					$conditions = array(
						'Outline_ReorderFieldAction.order > '		=> $prevOrder,
						'Outline_ReorderFieldAction.order <= '		=> $request->data['order']
					);
				} else {
					$data = array(
						'Outline_ReorderFieldAction.order'		=> "`Outline_ReorderFieldAction`.`order` + 1"
					);
					$conditions = array(
						'Outline_ReorderFieldAction.order < '		=> $prevOrder,
						'Outline_ReorderFieldAction.order >= '		=> $request->data['order']
					);
				}

				// 追加するFieldのorder以上のorderを持つFieldのorderを+1する
				$this->begin();
				if ($this->updateAll($data, $conditions)) {
					$data = array(
						'id'			=> $request->data['id'],
						'order'			=> $request->data['order']
					);
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
							$json = array('result'=>false, 'message'=>'データ更新に失敗しました。c');
						}
						// $this->commit();
						// $json = array('result'=>true, 'data'=>$result);
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