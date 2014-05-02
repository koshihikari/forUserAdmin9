<?php

class Page_Smartphone_EditTableElementAction extends AppModel {
	public $useTable = 'smartphone_page_elements';
	public $actsAs = array(
		'Smartphone_CleanupElement'
		,'Smartphone_GetElements'
		,'Smartphone_UpdateElementOrder'
		,'Smartphone_UpdateLibraryPageDate'
	);
	// private $latest_insert_id = -1;
	
	/*
	 * スマホ用ページのデータを作成するメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function editTableElement($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');
		
		// error_log("\n", 3, 'log.txt');
		// error_log("Page_Smartphone_EditTableElementAction :: editTableElement\n", 3, 'log.txt');
		// error_log('record_id = ' . $request->data['record_id'] . "\n", 3, 'log.txt');
		// error_log('page_id = ' . $request->data['page_id'] . "\n", 3, 'log.txt');
		// error_log('user_id = ' . $request->data['user_id'] . "\n", 3, 'log.txt');
		// error_log('table_element_id = ' . $request->data['table_element_id'] . "\n", 3, 'log.txt');
		// error_log('table_property = ' . $request->data['table_property'] . "\n", 3, 'log.txt');
		
		if ($request->isPost()) {
			// error_log('del_td_element_id_arr = ' . $request->data['del_td_element_id_arr'] . "\n", 3, 'log.txt');
			// error_log('isset(del_td_element_id_arr) = ' . isset($request->data['del_td_element_id_arr']) . "\n", 3, 'log.txt');
			if (
				isset($request->data['base_data']['user_id']) && 
				isset($request->data['base_data']['page_id']) && 
				isset($request->data['table_data']['id']) && 
				isset($request->data['table_data']['element_id']) && 
				isset($request->data['table_data']['parent_id']) && 
				isset($request->data['table_data']['order']) && 
				isset($request->data['table_data']['property'])
			) {
				// error_log('del_td_element_id_arr = ' . $request->data['del_td_element_id_arr'] . "\n", 3, 'log.txt');
				$this->begin();
				$is_correct = true;
				$is_correct = $this->_updateTableProperty($is_correct, $request);
				// error_log('1 = ' . $is_correct . "\n", 3, 'log.txt');
				$is_correct = $this->_insertTdData($is_correct, $request);
				// error_log('2 = ' . $is_correct . "\n", 3, 'log.txt');
				$is_correct = $this->_deleteTdData($is_correct, $request);
				// error_log('3 = ' . $is_correct . "\n", 3, 'log.txt');
				// $is_correct = $this->cleanupElement($is_correct, false, $request->data['leave_data_arr'], $request->data['base_data']['page_id']);
				// error_log('3 = ' . $is_correct . "\n", 3, 'log.txt');
				$is_correct = $this->updateElementOrder($is_correct, $request->data['leave_data_arr']);
				// error_log('4 = ' . $is_correct . "\n", 3, 'log.txt');
				$is_correct = $this->updateLibraryPageDate($is_correct, false, $request->data['base_data']['page_id'], $request->data['base_data']['user_id']);
				// error_log('5 = ' . $is_correct . "\n", 3, 'log.txt');
				if ($is_correct === true) {
					$this->commit();
					// $result = $this->_getResultData($this->latest_insert_id, $request);
					// error_log('6 = ' . $result . "\n", 3, 'log.txt');
					// $json = array('result'=>true);
					$json = array('result'=>true, 'data'=>$this->getElements(false, $request->data['base_data']['page_id']));
					// $json = array('result'=>true, 'data'=>$result);
					// $json = array('result'=>true);

				} else {
					$this->rollback();
					$json = array('result'=>false, 'message'=>'データの並び替えに失敗しました。');
				}
			}
		}
		
		return $json;
	}

	/*
	 * Tableエレメントのプロパティ上書きメソッド
	 * @param	$is_correct		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _updateTableProperty($is_correct, $request) {
		if ($is_correct === true) {
			// error_log('_updateTableProperty' . "\n", 3, 'log.txt');
			$data = array(
				'id'				=> $request->data['table_data']['id'],
				'page_id'			=> $request->data['base_data']['page_id'],
				'user_id'			=> $request->data['base_data']['user_id'],
				'element_id'		=> $request->data['table_data']['element_id'],
				'parent_id'			=> $request->data['table_data']['parent_id'],
				'item_name'			=> 'Table',
				'order'				=> $request->data['table_data']['order'],
				'property'			=> $request->data['table_data']['property']
			);
			// $result = $this->save($data);
			// $this->latest_insert_id = $this->getLastInsertID();
			// return is_array($result);
			return is_array($this->save($data));
		} else {
			return false;
		}
	}

	/*
	 * Tdエレメントを保存するメソッド
	 * @param	$is_correct		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _insertTdData($is_correct, $request) {
		if ($is_correct === true) {
			if (isset($request->data['add_td_data']) && 0 < count($request->data['add_td_data'])) {
				for ($i=0,$len=count($request->data['add_td_data']); $i<$len; $i++) {
					$data = array(
						'page_id'					=> $request->data['base_data']['page_id'],
						'user_id'					=> $request->data['base_data']['user_id'],
						'element_id'				=> $request->data['add_td_data'][$i],
						'parent_id'					=> '',
						'smartphone_library_id'		=> 0,
						'item_name'					=> 'Td',
						'order'						=> 1,
						'property'					=> $request->data['td_property']
					);
					$this->create();
					if (is_array($this->save($data)) === false) {
						return false;
					}
				}
				return $is_correct;
			} else {
				return $is_correct;
			}
		} else {
			return false;
		}
	}

	/*
	 * Tdエレメントを削除するメソッド
	 * @param	$is_correct		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _deleteTdData($is_correct, $request) {
		if ($is_correct === true) {
			if (isset($request->data['del_td_data']) && 0 < count($request->data['del_td_data'])) {
				$conditions = array(
					'element_id'	=> $request->data['del_td_data']
				);
				return $this->deleteAll($conditions);
			} else {
				return $is_correct;
			}
		} else {
			return false;
		}
	}
	/*
	*/

	/*
	 * このクラスで書き込んだデータを取得するメソッド
	 * @param	$targetId
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	このクラスで書き込んだデータオブジェクト
	 */
	private function _getResultData($targetId, $request) {
		$options = array(
			'conditions'		=> array(
				'element_id like'			=> '%' . $request->data['table_data']['element_id'] . '%'
			)
		);
		$result = $this->find('all', $options);
		$retObj = array();
		// error_log('count($result) = ' . count($result) . "\n", 3, 'log.txt');
		for ($i=0,$len=count($result); $i<$len; $i++) {
			$retObj[$result[$i]['Page_Smartphone_EditTableElementAction']['element_id']] = array(
				'smartphonePageElementId'			=> (int)$result[$i]['Page_Smartphone_EditTableElementAction']['id'],
				'order'								=> (int)$result[$i]['Page_Smartphone_EditTableElementAction']['order'],
				'parentId'							=> $result[$i]['Page_Smartphone_EditTableElementAction']['parent_id'],
				'smartphoneLibraryId'				=> (int)$result[$i]['Page_Smartphone_EditTableElementAction']['smartphone_library_id'],
				'itemName'							=> $result[$i]['Page_Smartphone_EditTableElementAction']['item_name'],
				'isLibrary'							=> $result[$i]['Page_Smartphone_EditTableElementAction']['item_name'] === 'Library' ? true : false,
				'property'							=> json_decode($result[$i]['Page_Smartphone_EditTableElementAction']['property'])
			);
		}

		return $retObj;
	}
}
