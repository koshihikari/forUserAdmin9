<?php

class Page_Smartphone_InsertElementAction extends AppModel {
	public $useTable = 'smartphone_page_elements';
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
			// error_log("Page_Smartphone_InsertElementAction :: insertElement\n", 3, 'log.txt');
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
				isset($request->data['base_data']['page_id']) &&
				isset($request->data['insert_data']['element_id']) &&
				isset($request->data['insert_data']['parent_id']) &&
				isset($request->data['insert_data']['item_name']) &&
				isset($request->data['insert_data']['order']) &&
				isset($request->data['insert_data']['property']) &&
				isset($request->data['leave_data_arr'])
			) {
				$this->begin();
				$is_correct = true;
				$is_correct = $this->_updatePageElementsOrderData($is_correct, $request);
				// error_log('$this->latestInsertId = ' . $this->latestInsertId . "\n", 3, 'log.txt');
				// error_log('1 = ' . $is_correct . "\n", 3, 'log.txt');
				$is_correct = $this->cleanupElement($is_correct, false, $request->data['leave_data_arr'], $request->data['base_data']['page_id']);
				// $is_correct = $this->_cleanupElementData($is_correct, $request);
				// error_log('2 = ' . $is_correct . "\n", 3, 'log.txt');
				$is_correct = $this->_insertPageElementsData($is_correct, $request);
				// error_log('2 = ' . $is_correct . "\n", 3, 'log.txt');
				$is_correct = $this->_insertPageElementsRelationData($is_correct, $request);
				// error_log('3 = ' . $is_correct . "\n", 3, 'log.txt');
				$is_correct = $this->_updatePageData($is_correct, $request);
				// error_log('4 = ' . $is_correct . "\n", 3, 'log.txt');
				if ($is_correct === true) {
					$this->commit();
					// $result = $this->_getResultData($this->latestInsertId, $request);
					// error_log('6 = ' . $result . "\n", 3, 'log.txt');
					// $json = array('result'=>true, 'data'=>$result);
					$json = array('result'=>true, 'data'=>$this->getElements(false, $request->data['base_data']['page_id']));

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
	private function _updatePageElementsOrderData($is_correct, $request) {
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
					if ($request->data['leave_data_arr'][$i]['smartphone_page_element_id']) {
						$data = array(
							'id'		=> $request->data['leave_data_arr'][$i]['smartphone_page_element_id'],
							'order'		=> $request->data['leave_data_arr'][$i]['order']
						);
						if (is_array($this->save($data)) === false) {
						// if (!$this->save($data)) {
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
	 * ページエレメントを保存するメソッド
	 * @param	$is_correct		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _insertPageElementsData($is_correct, $request) {
		if ($is_correct === true) {
			$data = array(
				'page_id'						=> $request->data['base_data']['page_id'],
				'user_id'						=> $request->data['base_data']['user_id'],
				'smartphone_library_id'			=> $request->data['base_data']['smartphone_library_id'],
				'element_id'					=> $request->data['insert_data']['element_id'],
				'parent_id'						=> $request->data['insert_data']['parent_id'],
				'item_name'						=> $request->data['insert_data']['item_name'],
				'order'							=> $request->data['insert_data']['order'],
				'property'						=> $request->data['insert_data']['property']
			);
			// error_log('order = ' . $request->data['insert_data']['order'] . "\n", 3, 'log.txt');
			$this->create();
			$result = $this->save($data);
			$this->latestInsertId = $this->getLastInsertID();
			return is_array($result);
		} else {
			return false;
		}
	}

	/*
	 * 関連するページエレメントを保存するメソッド
	 * @param	$is_correct		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _insertPageElementsRelationData($is_correct, $request) {
		if ($is_correct === true) {
			if (isset($request->data['relation_data_arr']) === true && 0 < count($request->data['relation_data_arr'])) {
				for ($i=0, $len=count($request->data['relation_data_arr']); $i<$len; $i++) {
					$data = array(
						'page_id'						=> $request->data['base_data']['page_id'],
						'user_id'						=> $request->data['base_data']['user_id'],
						'smartphone_library_id'			=> $request->data['base_data']['smartphone_library_id'],
						'parent_id'						=> '',
						'element_id'					=> $request->data['relation_data_arr'][$i]['element_id'],
						'item_name'						=> $request->data['relation_data_arr'][$i]['item_name'],
						'property'						=> $request->data['relation_data_arr'][$i]['property'],
						'order'							=> 0
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
	 * ページ一覧テーブルに更新者のユーザIDと更新日時をを上書きするメソッド
	 * @param	$is_correct		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _updatePageData($is_correct, $request) {
		if ($is_correct === true) {
			$this->bindModel(
				array(
					'belongsTo'		=> array(
						'smartphone_pages'			=> array(
							'foreignKey'	=> 'page_id'
						)
					)
				)
			);
			$data = array(
				'smartphone_pages'	=> array(
					'id'		=> $request->data['base_data']['page_id'],
					'user_id'	=> $request->data['base_data']['user_id']
				)
			);
			return is_array($this->smartphone_pages->save($data));
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
	/*
	private function _getResultData($targetId, $request) {
		$this->unbindModel(
			array(
				'belongsTo'		=> array(
					'smartphone_pages'
				)
			)
		);
		$data = array(
			'conditions'		=> array(
				'page_id'					=> $request->data['base_data']['page_id'],
				'element_id like'			=> '%' . $request->data['insert_data']['element_id'] . '%'
			),
			'order'			=> array(
				'order ASC'
			)
		);
		$result = $this->find('all', $data);
		$retObj = array();
		$libraryElementIdArr = array();
		for ($i=0,$len=count($result); $i<$len; $i++) {
			$retObj[$result[$i]['Page_Smartphone_InsertElementAction']['element_id']] = array(
				'smartphonePageElementId'			=> (int)$result[$i]['Page_Smartphone_InsertElementAction']['id'],
				'order'								=> (int)$result[$i]['Page_Smartphone_InsertElementAction']['order'],
				'parentId'							=> $result[$i]['Page_Smartphone_InsertElementAction']['parent_id'],
				'smartphoneLibraryId'				=> (int)$result[$i]['Page_Smartphone_InsertElementAction']['smartphone_library_id'],
				'itemName'							=> $result[$i]['Page_Smartphone_InsertElementAction']['item_name'],
				'isLibrary'							=> $result[$i]['Page_Smartphone_InsertElementAction']['item_name'] === 'Library' ? true : false,
				'property'							=> json_decode($result[$i]['Page_Smartphone_InsertElementAction']['property'])
			);
			if ($result[$i]['Page_Smartphone_InsertElementAction']['item_name'] === 'Library') {
				array_push($libraryElementIdArr, $result[$i]['Page_Smartphone_InsertElementAction']['smartphone_library_id']);
			}
		}

		if (count($libraryElementIdArr)) {
		// if ($result['Page_InsertElementAction']['item_name'] === 'Library') {
			$options = array(
				'conditions'	=> array(
					'smartphone_library_elements.smartphone_library_id'	=> $libraryElementIdArr
				),
				'order'			=> array(
					'smartphone_library_elements.order ASC'
				)
			);
			$result2 = ClassRegistry::init('smartphone_library_elements')->find('all', $options);
			$stamp = microtime();
			list($msec, $sec) = explode(" ", $stamp);
			$strMsec = str_replace('.', '', (string)((float)$sec + (float)$msec));
			for ($i=0,$len=count($result2); $i<$len; $i++) {
				$parentId = $result2[$i]['smartphone_library_elements']['parent_id'];
				if ($parentId === 'spContent') {
					$parentId = $request->data['insert_data']['element_id'];
				} else
				if ($result2[$i]['smartphone_library_elements']['item_name'] === 'Td') {
					$tmpArr = explode('_', $result2[$i]['smartphone_library_elements']['element_id']);
					$parentId = $tmpArr[0];
				}
				$retObj[$result2[$i]['smartphone_library_elements']['element_id'] . '-' . $strMsec . '-' . $i] = array(
					'smartphoneLibraryElementId'			=> $result2[$i]['smartphone_library_elements']['id'],
					'order'									=> (int)$result2[$i]['smartphone_library_elements']['order'],
					// 'parentId'								=> $result2[$i]['smartphone_library_elements']['parent_id'],
					'parentId'								=> $parentId,
					'smartphoneLibraryId'					=> $result2[$i]['smartphone_library_elements']['smartphone_library_id'],
					'itemName'								=> $result2[$i]['smartphone_library_elements']['item_name'],
					'isLibrary'								=> true,
					'property'								=> json_decode($result2[$i]['smartphone_library_elements']['property'])
				);
			}
		}

		return $retObj;
	}
	*/
}
