<?php

class Library_Smartphone_ReorderElementAction extends AppModel {
	public $useTable = 'smartphone_library_elements';
	public $actsAs = array('Smartphone_CleanupElement', 'Smartphone_UpdateElementOrder', 'Smartphone_UpdateLibraryPageDate');

	/*
	 * スマホ用ページのデータを作成するメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function reorderElement($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		// error_log("\n", 3, 'log.txt');
		// error_log("PageReorderActionForSmartphone :: reorderData\n", 3, 'log.txt');
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
				$is_correct = $this->cleanupElement($is_correct, true, $request->data['leave_data_arr'], $request->data['base_data']['smartphone_library_id']);
				// error_log('2 = ' . $is_correct . "\n", 3, 'log.txt');
				$is_correct = $this->updateElementOrder($is_correct, $request->data['leave_data_arr']);
				// error_log('3 = ' . $is_correct . "\n", 3, 'log.txt');
				$is_correct = $this->updateLibraryPageDate($is_correct, true, $request->data['base_data']['smartphone_library_id'], $request->data['base_data']['user_id']);
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
		/*
		if ($request->isPost()) {
			if (
				isset($request->data['user_id']) &&
				isset($request->data['page_id']) &&
				isset($request->data['record_id']) &&
				isset($request->data['reorder_element_id']) &&
				isset($request->data['new_parent_id']) &&
				isset($request->data['old_parent_id']) &&
				isset($request->data['new_order']) &&
				isset($request->data['old_order'])
			) {
				$this->begin();
				$isCorrect = true;
				$isCorrect = $this->_reorderOldParentChildrenData($isCorrect, $request);
				// error_log('1 = ' . $isCorrect . "\n", 3, 'log.txt');
				$isCorrect = $this->_reorderNewParentChildrenData($isCorrect, $request);
				// error_log('2 = ' . $isCorrect . "\n", 3, 'log.txt');
				$isCorrect = $this->_updateOrderdElementData($isCorrect, $request);
				// error_log('3 = ' . $isCorrect . "\n", 3, 'log.txt');
				if ($isCorrect === true) {
					$this->commit();
					$json = array('result'=>true);

				} else {
					$this->rollback();
					$json = array('result'=>false, 'message'=>'データの並び替えに失敗しました。');
				}
			}
		}

		return $json;
		*/
	}

	/*
	 * 並べ替えられたエレメントの古い親エレメントの子エレメントのorderを更新するメソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	// private function _reorderOldParentChildrenData($isCorrect, $request) {
	// 	if ($isCorrect === true) {
	// 		if ($request->data['old_parent_id'] === $request->data['new_parent_id']) {
	// 			if ($request->data['old_order'] < $request->data['new_order']) {
	// 				$data = array(
	// 					'Library_ReorderElementAction.order'		=> "`Library_ReorderElementAction`.`order` - 1"
	// 				);
	// 				$conditions = array(
	// 					'Library_ReorderElementAction.order > '		=> $request->data['old_order'],
	// 					'Library_ReorderElementAction.order <= '		=> $request->data['new_order'],
	// 					'Library_ReorderElementAction.parent_id '		=> $request->data['old_parent_id']
	// 				);
	// 			} else {
	// 				$data = array(
	// 					'Library_ReorderElementAction.order'		=> "`Library_ReorderElementAction`.`order` + 1"
	// 				);
	// 				$conditions = array(
	// 					'Library_ReorderElementAction.order < '		=> $request->data['old_order'],
	// 					'Library_ReorderElementAction.order >= '		=> $request->data['new_order'],
	// 					'Library_ReorderElementAction.parent_id '		=> $request->data['old_parent_id']
	// 				);
	// 			}
	// 			return $this->updateAll($data, $conditions);
	// 		} else {
	// 			$data = array(
	// 				'Library_ReorderElementAction.order'		=> "`Library_ReorderElementAction`.`order` - 1"
	// 			);
	// 			$conditions = array(
	// 				'Library_ReorderElementAction.order > '		=> $request->data['old_order'],
	// 				'Library_ReorderElementAction.parent_id '		=> $request->data['old_parent_id']
	// 			);
	// 			return $this->updateAll($data, $conditions);
	// 		}
	// 	} else {
	// 		return false;
	// 	}
	// }

	/*
	 * 並べ替えられたエレメントのa新しい親エレメントの子エレメントのorderを更新するメソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	// private function _reorderNewParentChildrenData($isCorrect, $request) {
	// 	if ($isCorrect === true) {
	// 		if ($request->data['old_parent_id'] !== $request->data['new_parent_id']) {
	// 			$data = array(
	// 				'Library_ReorderElementAction.order'		=> "`Library_ReorderElementAction`.`order` + 1"
	// 			);
	// 			$conditions = array(
	// 				'Library_ReorderElementAction.order >= '		=> $request->data['new_order'],
	// 				'Library_ReorderElementAction.parent_id '		=> $request->data['new_parent_id']
	// 			);
	// 			return $this->updateAll($data, $conditions);
	// 		} else {
	// 			return $isCorrect;
	// 		}
	// 	} else {
	// 		return false;
	// 	}
	// }

	/*
	 * 並べ替えられたエレメントを更新するメソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
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
	/*
	private function _updateOrderdElementData($isCorrect, $request) {
		if ($isCorrect === true) {
			$data = array(
				// 'Library_ReorderElementAction.id'				=> $request->data['record_id'],
				'order'			=> $request->data['new_order'],
				'parent_id'		=> $request->data['new_parent_id']
			);
			$this->id = $request->data['record_id'];
			return is_array($this->save($data));
		} else {
			return false;
		}
	}
	*/
}
