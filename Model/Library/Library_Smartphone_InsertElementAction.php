<?php

class Library_Smartphone_InsertElementAction extends AppModel {
	public $useTable = 'smartphone_library_elements';
	public $actsAs = array(
		'Smartphone_CleanupElement'
		,'Smartphone_GetElements'
		,'Smartphone_UpdateElementOrder'
		,'Smartphone_UpdateLibraryPageDate'
	);
	// public $actsAs = array('Smartphone_CleanupElement');
	// private $latestInsertId = -1;

	/*
	 * Elementデータ挿入メソッド
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function insertElement($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		if ($request->isPost()) {
			$request->data['leave_data_arr'] = isset($request->data['leave_data_arr']) ? $request->data['leave_data_arr'] : array();
			// error_log("\n", 3, 'log.txt');
			// error_log("Library_Smartphone_InsertElementAction :: insertElement\n", 3, 'log.txt');
			// error_log('user_id = ' . $request->data['base_data']['user_id'] . "\n", 3, 'log.txt');
			// error_log('page_id = ' . $request->data['base_data']['page_id'] . "\n", 3, 'log.txt');
			// error_log('element_id = ' . $request->data['insert_data']['element_id'] . "\n", 3, 'log.txt');
			// error_log('smartphone_library_id = ' . $request->data['base_data']['smartphone_library_id'] . "\n", 3, 'log.txt');
			// error_log('parent_id = ' . $request->data['insert_data']['parent_id'] . "\n", 3, 'log.txt');
			// error_log('item_name = ' . $request->data['insert_data']['item_name'] . "\n", 3, 'log.txt');
			// error_log('order = ' . $request->data['insert_data']['order'] . "\n", 3, 'log.txt');
			// error_log('property = ' . $request->data['insert_data']['property'] . "\n", 3, 'log.txt');
			if (
				isset($request->data['base_data']['user_id']) &&
				isset($request->data['base_data']['smartphone_library_id']) &&
				isset($request->data['insert_data']['element_id']) &&
				isset($request->data['insert_data']['parent_id']) &&
				isset($request->data['insert_data']['item_name']) &&
				isset($request->data['insert_data']['order']) &&
				isset($request->data['insert_data']['property']) &&
				isset($request->data['leave_data_arr'])
			) {
				$this->begin();
				$is_correct = true;
				$is_correct = $this->_updateLibraryElementsOrderData($is_correct, $request);
				// error_log('$this->latestInsertId = ' . $this->latestInsertId . "\n", 3, 'log.txt');
				// error_log('1 = ' . $is_correct . "\n", 3, 'log.txt');
				$is_correct = $this->cleanupElement($is_correct, true, $request->data['leave_data_arr'], $request->data['base_data']['smartphone_library_id']);
				// $is_correct = $this->_cleanupElementData($is_correct, $request);
				// error_log('2 = ' . $is_correct . "\n", 3, 'log.txt');
				$is_correct = $this->_insertLibraryElementsData($is_correct, $request);
				// error_log('2 = ' . $is_correct . "\n", 3, 'log.txt');
				$is_correct = $this->_insertLibraryElementsRelationData($is_correct, $request);
				// error_log('3 = ' . $is_correct . "\n", 3, 'log.txt');
				$is_correct = $this->_updateLibraryData($is_correct, $request);
				// error_log('4 = ' . $is_correct . "\n", 3, 'log.txt');
				if ($is_correct === true) {
					$this->commit();
					// $result = $this->_getResultData($this->latestInsertId, $request);
					// error_log('6 = ' . $result . "\n", 3, 'log.txt');
					// $json = array('result'=>true, 'data'=>$result);
					$json = array('result'=>true, 'data'=>$this->getElements(true, $request->data['base_data']['smartphone_library_id']));

				} else {
					$this->rollback();
					$json = array('result'=>false, 'message'=>'データ追加に失敗しました。');
				}
			}
		}
		return $json;
	}

	/*
	 * ページエレメントの並び順を更新するメソッド
	 * @param	$is_correct		true===処理開始、false===処理せず終了
	 * @param	#request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _updateLibraryElementsOrderData($is_correct, $request) {
		if ($is_correct === true) {
			$leave_data_arr = json_decode($request->data['leave_data_arr'], true);
			$leave_data_arr = json_decode($leave_data_arr['elements'], true);
			if (0 < count($leave_data_arr)) {
				for ($i=0,$len=count($leave_data_arr); $i<$len; $i++) {
					if ($leave_data_arr[$i]['smartphone_page_element_id']) {
						$data = array(
							'id'		=> $leave_data_arr[$i]['smartphone_page_element_id'],
							'order'		=> $leave_data_arr[$i]['order']
						);
						if (is_array($this->save($data)) === false) {
						// if (!$this->save($data)) {
							$is_correct = false;
							break;
						}
					}
				}
			}
			/*
			if (isset($request->data['leave_data_arr']) === true && 0 < count($request->data['leave_data_arr'])) {
				for ($i=0,$len=count($request->data['leave_data_arr']); $i<$len; $i++) {
					if ($request->data['leave_data_arr'][$i]['smartphone_library_element_id']) {
						$data = array(
							'id'		=> $request->data['leave_data_arr'][$i]['smartphone_library_element_id'],
							'order'		=> $request->data['leave_data_arr'][$i]['order']
						);
						if (!$this->save($data)) {
							$is_correct = false;
							break;
						}
					}
				}
			}
			*/
			return $is_correct;
		} else {
			return false;
		}
	}

	/*
	 * ライブラリエレメントを保存するメソッド
	 * @param	$is_correct		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _insertLibraryElementsData($is_correct, $request) {
		if ($is_correct === true) {
			$data = array(
				// 'page_id'						=> $request->data['baseData']['page_id'],
				'user_id'						=> $request->data['base_data']['user_id'],
				'smartphone_library_id'			=> $request->data['base_data']['smartphone_library_id'],
				'element_id'					=> $request->data['insert_data']['element_id'],
				'parent_id'						=> $request->data['insert_data']['parent_id'],
				'item_name'						=> $request->data['insert_data']['item_name'],
				'order'							=> $request->data['insert_data']['order'],
				'property'						=> $request->data['insert_data']['property']
			);
			// error_log('order = ' . $request->data['insertData']['order'] . "\n", 3, 'log.txt');
			$this->create();
			$result = $this->save($data);
			// $this->latestInsertId = $this->getLastInsertID();
			return is_array($result);
		} else {
			return false;
		}
	}

	/*
	 * 関連するライブラリエレメントを保存するメソッド
	 * @param	$is_correct		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _insertLibraryElementsRelationData($is_correct, $request) {
		if ($is_correct === true) {
			if (isset($request->data['relation_data_arr']) === true && 0 < count($request->data['relation_data_arr'])) {
				for ($i=0, $len=count($request->data['relation_data_arr']); $i<$len; $i++) {
					$data = array(
						'smartphone_library_id'			=> $request->data['base_data']['smartphone_library_id'],
						'user_id'						=> $request->data['base_data']['user_id'],
						'element_id'					=> $request->data['relation_data_arr'][$i]['element_id'],
						'parent_id'						=> '',
						'item_name'						=> $request->data['relation_data_arr'][$i]['item_name'],
						'order'							=> 0,
						'property'						=> $request->data['relation_data_arr'][$i]['property']
						// 'property'						=> json_encode($request->data['relationData'][$i]['property'])
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
	 * ライブラリ一覧テーブルに更新者のユーザIDと更新日時をを上書きするメソッド
	 * @param	$is_correct		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _updateLibraryData($is_correct, $request) {
		if ($is_correct === true) {
			$this->bindModel(
				array(
					'belongsTo'		=> array(
						'smartphone_libraries'			=> array(
							'foreignKey'	=> 'smartphone_library_id'
						)
					)
				)
			);
			$data = array(
				'smartphone_libraries'	=> array(
					'id'		=> $request->data['base_data']['smartphone_library_id'],
					'user_id'	=> $request->data['base_data']['user_id']
				)
			);
			return is_array($this->smartphone_libraries->save($data));
		} else {
			return false;
		}
	}

	/*
	 * このクラスで書き込んだデータを取得するメソッド
	 * @param	$targetId
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	このクラスで書き込んだデータオブジェクト
	 */
	// private function _getResultData($targetId, $request) {
	// 	$this->unbindModel(
	// 		array(
	// 			'belongsTo'		=> array(
	// 				'smartphone_libraries'
	// 			)
	// 		)
	// 	);
	// 	$data = array(
	// 		'conditions'		=> array(
	// 			'id'			=> $targetId
	// 		),
	// 		'order'			=> array(
	// 			'order ASC'
	// 		)
	// 	);
	// 	$result = $this->find('first', $data);
	// 	$retObj = array();
	// 	$retObj[$result['Library_Smartphone_InsertElementAction']['element_id']] = array(
	// 		'smartphoneLibraryElementId'		=> (int)$result['Library_Smartphone_InsertElementAction']['id'],
	// 		'order'								=> (int)$result['Library_Smartphone_InsertElementAction']['order'],
	// 		'parentId'							=> $result['Library_Smartphone_InsertElementAction']['parent_id'],
	// 		'itemName'							=> $result['Library_Smartphone_InsertElementAction']['item_name'],
	// 		'isLibrary'							=> true,
	// 		'property'							=> json_decode($result['Library_Smartphone_InsertElementAction']['property'])
	// 	);
	// 	return $retObj;
	// }
}
