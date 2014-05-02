<?php

class Library_Smartphone_DeleteElementAction extends AppModel {
	public $useTable = 'smartphone_library_elements';
	public $actsAs = array('Smartphone_UpdateElementOrder', 'Smartphone_CleanupElement', 'Smartphone_UpdateLibraryPageDate');
	
	/*
	 * スマホ用ページのデータを作成するメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function deleteElement($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');
		
		// error_log("\n", 3, 'log.txt');
		// error_log("Library_Smartphone_DeleteElementAction :: deleteElement\n", 3, 'log.txt');
		// error_log('user_id = ' . $request->data['base_data']['user_id'] . "\n", 3, 'log.txt');
		// error_log('page_id = ' . $request->data['base_data']['page_id'] . "\n", 3, 'log.txt');
		// error_log('delete_id_arr = ' . isset($request->data['leave_data_arr']) . "\n", 3, 'log.txt');
		// error_log('count = ' . count($request->data['leave_data_arr'])  . "\n", 3, 'log.txt');
		
		if ($request->isPost()) {
			$request->data['leave_data_arr'] = isset($request->data['leave_data_arr']) ? $request->data['leave_data_arr'] : array();
			if (
				isset($request->data['base_data']['user_id']) && 
				isset($request->data['base_data']['smartphone_library_id']) && 
				isset($request->data['leave_data_arr'])
			) {
				$this->begin();
				$is_correct = true;
				// error_log('Behavior呼び出し(cleanupElement)' . "\n", 3, 'log.txt');
				$is_correct = $this->cleanupElement($is_correct, true, $request->data['leave_data_arr'], $request->data['base_data']['smartphone_library_id']);
				// error_log('1 = ' . $is_correct . "\n", 3, 'log.txt');
					$is_correct = $this->updateElementOrder($is_correct, $request->data['leave_data_arr']);
				// error_log('2 = ' . $is_correct . "\n", 3, 'log.txt');
				$is_correct = $this->updateLibraryPageDate($is_correct, true, $request->data['base_data']['smartphone_library_id'], $request->data['base_data']['user_id']);
				// error_log('3 = ' . $is_correct . "\n", 3, 'log.txt');

				if ($is_correct === true) {
					$this->commit();
					$json = array('result'=>true);
				} else {
					$this->rollback();
					$json = array('result'=>false, 'message'=>'データ削除に失敗しました。');
				}
			}
		}
		
		return $json;
	}
}
