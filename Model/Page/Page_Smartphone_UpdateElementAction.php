<?php

class Page_Smartphone_UpdateElementAction extends AppModel {
	public $useTable = 'smartphone_page_elements';
	public $actsAs = array('Smartphone_UpdateElementOrder', 'Smartphone_CleanupElement', 'Smartphone_UpdateLibraryPageDate');

	/*
	 * スマホ用ページのデータを作成するメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function updateElement($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		// error_log("\n", 3, 'log.txt');
		// error_log("Library_UpdateElementAction :: updateData\n", 3, 'log.txt');
		// error_log('device = ' . $request->data['device'] . "\n", 3, 'log.txt');
		// error_log('recordId = ' . $request->data['recordId'] . "\n", 3, 'log.txt');
		// error_log('userId = ' . $request->data['userId'] . "\n", 3, 'log.txt');
		// error_log('pageId = ' . $request->data['pageId'] . "\n", 3, 'log.txt');
		// error_log('elementId = ' . $request->data['elementId'] . "\n", 3, 'log.txt');
		// error_log('parentId = ' . $request->data['parentId'] . "\n", 3, 'log.txt');
		// error_log('itemName = ' . $request->data['itemName'] . "\n", 3, 'log.txt');
		// error_log('order = ' . $request->data['order'] . "\n", 3, 'log.txt');
		// error_log('properties = ' . $request->data['properties'] . "\n", 3, 'log.txt');

		if ($request->isPost()) {
			if (
				isset($request->data['base_data']['user_id']) &&
				isset($request->data['base_data']['page_id']) &&
				isset($request->data['leave_data_arr']) &&
				0 < count($request->data['leave_data_arr'])
			) {
				$this->begin();
				$is_correct = true;
				// error_log('---------------------------' . "\n", 3, 'log.txt');
				// error_log('1' . "\n", 3, 'log.txt');
				// for ($i=0,$len=count($request->data['leave_data_arr']); $i<$len; $i++) {
				// 	error_log('i = ' . $i . "\n", 3, 'log.txt');
				// 	error_log('		smartphone_page_element_id = ' . $request->data['leave_data_arr'][$i]['smartphone_page_element_id'] . "\n", 3, 'log.txt');
				// 	error_log('		order = ' . $request->data['leave_data_arr'][$i]['order'] . "\n", 3, 'log.txt');
				// }
				// error_log('---------------------------' . "\n", 3, 'log.txt');
				// error_log('2' . "\n", 3, 'log.txt');
				$is_correct = $this->_updateElementData($is_correct, $request);
				// error_log('Behavior呼び出し(cleanupElement)' . "\n", 3, 'log.txt');
				// error_log('---------------------------' . "\n", 3, 'log.txt');
				// for ($i=0,$len=count($request->data['leave_data_arr']); $i<$len; $i++) {
				// 	error_log('i = ' . $i . "\n", 3, 'log.txt');
				// 	error_log('		smartphone_page_element_id = ' . $request->data['leave_data_arr'][$i]['smartphone_page_element_id'] . "\n", 3, 'log.txt');
				// 	error_log('		order = ' . $request->data['leave_data_arr'][$i]['order'] . "\n", 3, 'log.txt');
				// }
				// error_log('---------------------------' . "\n", 3, 'log.txt');
				// error_log('3' . "\n", 3, 'log.txt');
				$is_correct = $this->cleanupElement($is_correct, false, $request->data['leave_data_arr'], $request->data['base_data']['page_id']);
				// error_log('1 = ' . $is_correct . "\n", 3, 'log.txt');
				// error_log('---------------------------' . "\n", 3, 'log.txt');
				// for ($i=0,$len=count($request->data['leave_data_arr']); $i<$len; $i++) {
				// 	error_log('i = ' . $i . "\n", 3, 'log.txt');
				// 	error_log('		smartphone_page_element_id = ' . $request->data['leave_data_arr'][$i]['smartphone_page_element_id'] . "\n", 3, 'log.txt');
				// 	error_log('		order = ' . $request->data['leave_data_arr'][$i]['order'] . "\n", 3, 'log.txt');
				// }
				// error_log('---------------------------' . "\n", 3, 'log.txt');
				$is_correct = $this->updateElementOrder($is_correct, $request->data['leave_data_arr']);
				// error_log('2 = ' . $is_correct . "\n", 3, 'log.txt');
				$is_correct = $this->updateLibraryPageDate($is_correct, false, $request->data['base_data']['page_id'], $request->data['base_data']['user_id']);
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

	/*
	 * エレメントのプロパティをを更新するメソッド
	 * @param	$is_correct		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _updateElementData($is_correct, $request) {
		if ($is_correct === true) {
			$data = array(
				'user_id'		=> $request->data['base_data']['user_id'],
				'property'		=> $request->data['update_data']['property']
			);
			if ($request->data['update_data']['id'] !== '' && $request->data['update_data']['id'] !== '0') {
				$this->id = $request->data['update_data']['id'];
				return is_array($this->save($data));

			} else if ($request->data['update_data']['element_id'] !== '') {
				$data['page_id'] = $request->data['base_data']['page_id'];
				$data['element_id'] = $request->data['update_data']['element_id'];
				$data['parent_id'] = $request->data['update_data']['parent_id'];
				$data['item_name'] = $request->data['update_data']['item_name'];
				// $data['order'] = $request->data['order'];
				return is_array($this->save($data));

			} else {
				return false;
			}
		} else {
			return false;
		}
	}
}
