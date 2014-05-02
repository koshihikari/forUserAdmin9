<?php

class Page_Smartphone_ReorderElementAction extends AppModel {
	public $useTable = 'smartphone_page_elements';
	public $actsAs = array('Smartphone_CleanupElement', 'Smartphone_UpdateElementOrder', 'Smartphone_UpdateLibraryPageDate');
	
	/*
	 * スマホ用ページのデータを作成するメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function reorderElement($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');
		
		// error_log("\n", 3, 'log.txt');
		// error_log("Page_Smartphone_ReorderElementAction :: reorderElement\n", 3, 'log.txt');
		// error_log('device = ' . $request->data['updateData']['device'] . "\n", 3, 'log.txt');
		// error_log('userId = ' . $request->data['updateData']['userId'] . "\n", 3, 'log.txt');
		// error_log('pageId = ' . $request->data['updateData']['pageId'] . "\n", 3, 'log.txt');
		// error_log('elementId = ' . $request->data['updateData']['elementId'] . "\n", 3, 'log.txt');
		// error_log('parentId = ' . $request->data['updateData']['parentId'] . "\n", 3, 'log.txt');
		// error_log('itemName = ' . $request->data['updateData']['itemName'] . "\n", 3, 'log.txt');
		// error_log('order = ' . $request->data['updateData']['order'] . "\n", 3, 'log.txt');
		// error_log('properties = ' . $request->data['updateData']['properties'] . "\n", 3, 'log.txt');
		
		if ($request->isPost()) {
			if (
				isset($request->data['base_data']['user_id']) && 
				isset($request->data['base_data']['page_id']) && 
				isset($request->data['reorder_data']['id']) && 
				isset($request->data['reorder_data']['parent_id']) && 
				isset($request->data['reorder_data']['order']) && 
				isset($request->data['leave_data_arr'])
			) {
				$this->begin();
				$is_correct = true;
				$is_correct = $this->_updateOrderdElementData($is_correct, $request);
				// error_log('1 = ' . $is_correct . "\n", 3, 'log.txt');
				$is_correct = $this->cleanupElement($is_correct, false, $request->data['leave_data_arr'], $request->data['base_data']['page_id']);
				// error_log('2 = ' . $is_correct . "\n", 3, 'log.txt');
				$is_correct = $this->updateElementOrder($is_correct, $request->data['leave_data_arr']);
				// error_log('3 = ' . $is_correct . "\n", 3, 'log.txt');
				$is_correct = $this->updateLibraryPageDate($is_correct, false, $request->data['base_data']['page_id'], $request->data['base_data']['user_id']);
				// error_log('4 = ' . $is_correct . "\n", 3, 'log.txt');
				if ($is_correct === true) {
					$this->commit();
					$json = array('result'=>true);

				} else {
					$this->rollback();
					$json = array('result'=>false, 'message'=>'データの並び替えに失敗しました。');
				}
			}
		}
		
		return $json;
	}

	/*
	 * 並べ替えられたエレメントを更新するメソッド
	 * @param	$is_correct		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _updateOrderdElementData($is_correct, $request) {
		if ($is_correct === true) {
			$data = array(
				'order'			=> $request->data['reorder_data']['order'],
				'parent_id'		=> $request->data['reorder_data']['parent_id']
			);
			$this->id = $request->data['reorder_data']['id'];
			return is_array($this->save($data));
		} else {
			return false;
		}
	}
}
