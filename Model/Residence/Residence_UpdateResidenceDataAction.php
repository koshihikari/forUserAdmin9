<?php

class Residence_UpdateResidenceDataAction extends AppModel {
	public $useTable = 'residences';
	
	/*
	 * Fieldデータ削除メソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function updateResidenceData($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		// error_log("\n", 3, 'log.txt');
		// error_log("Residence_UpdateResidenceDataAction :: updateResidenceData\n", 3, 'log.txt');
		// error_log('residence_id = ' . $request->data['residence_id'] . "\n", 3, 'log.txt');
		// error_log('company_id = ' . $request->data['company_id'] . "\n", 3, 'log.txt');
		// error_log('user_id = ' . $request->data['user_id'] . "\n", 3, 'log.txt');
		// error_log('id = ' . $request->data['id'] . "\n", 3, 'log.txt');
		if ($request->isPost()) {
			if (
				isset($request->data['id']) && 
				isset($request->data['user_id']) && 
				isset($request->data['num'])
			) {
				// Field更新
				$data = array(
					'id'			=> $request->data['id'],
					'user_id'		=> $request->data['user_id'],
					'num'			=> $request->data['num']
				);
				if (is_array($this->save($data))) {
					$this->commit();
					$json = array('result'=>true);
				} else {
					$this->rollback();
					$json = array('result'=>false, 'message'=>'データ更新に失敗しました。b');
				}
			}
		}
		return $json;
	}
}