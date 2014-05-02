<?php

class LibraryController extends AppController {
	var $layout = 'codeless_0.0.2';
	var $components = array('Auth', 'RequestHandler');

	public function beforeFilter() {
		parent::beforeFilter();
		$this->Auth->allow('preview', 'getElementList');
	}

	public function catalog($device=null, $residenceId=null) {
		$userData = $this->Auth->user();
		// if ($userData['company_id'] !== '1' || $device === null || $residenceId === null) {
		// 	$this->redirect(
		// 		array(
		// 			'controller'	=> 'Residence',
		// 			'action'		=> 'catalog'
		// 		)
		// 	);
		// }

		$deviceName = $this->getDeviceName($device);
		$supportDevice = ClassRegistry::init('Device_GetSupportDeviceAction')->getSupportDevice($residenceId);

		if ($device === 's') {
			$Action = ClassRegistry::init('Library_Page_GetMasterElementAction');
			$json = $Action->getMasterElement();

			$Action = ClassRegistry::init('ResidenceCompanyInfoAction');
			$data = $Action->getCompanyInfo($residenceId);

			$this->set(
				array(
					'device'				=> $device,
					'deviceName'			=> $deviceName,
					'title_for_layout'		=> '【' . $data['ResidenceCompanyInfoAction']['name'] . '】スマートフォン共通パーツ一覧',
					'isLibraryElementPage'	=> true,
					'residenceId'			=> $residenceId,
					'userData' 				=> $userData,
					'userId'				=> $userData['id'],
					'data'					=> $data,
					'supportDevice'			=> $supportDevice,
					'smartphoneLibraryId'	=> '',
					// 'libraryPageProperty'	=> json_encode($libraryPageProperty),
					'libraryPageProperty'	=> '',
					'menuData'				=> json_encode($json['data']['menuData']),
					'itemData'				=> json_encode($json['data']['itemData']),
					'libraries'				=> ClassRegistry::init('smartphone_libraries')->find(
						'all',
						array(
							'conditions'	=> array('residence_id' => $residenceId),
							'order'			=> array('order'=>'asc')
						)
					),
					'modified'				=> $this->modified
				)
			);
		}

		$this->render("../Contents/Library/catalogInLibraryOnPcToSmartphone");
	}

	public function edit($device=null, $residenceId=null, $smartphoneLibraryId=null) {
		$userData = $this->Auth->user();
		// if ($userData['company_id'] !== '1' || $device === null || $residenceId === null || $smartphoneLibraryId === null) {
		// 	$this->redirect(
		// 		array(
		// 			'controller'	=> 'Residence',
		// 			'action'		=> 'catalog'
		// 		)
		// 	);
		// }

		$deviceName = $this->getDeviceName($device);
		$supportDevice = ClassRegistry::init('Device_GetSupportDeviceAction')->getSupportDevice($residenceId);

		if ($device === 's') {
			$pagesResult = ClassRegistry::init('smartphone_libraries')->find('first', array('conditions'=>array('id'=>$smartphoneLibraryId)));
			$libraryPageProperty = $pagesResult['smartphone_libraries']['property'];

			$Action = ClassRegistry::init('Library_Page_GetMasterElementAction');
			$json = $Action->getMasterElement();

			// $pagesResult = ClassRegistry::init('smartphone_libraries')->find('first', array('conditions'=>array('id'=>$smartphoneLibraryId)));

			$this->set(
				array(
					'device'				=> $device,
					'deviceName'			=> $deviceName,
					'residenceId'			=> $residenceId,
					'targetDeviceName'		=> 'Smartphone',
					'title_for_layout'		=> '【' . $pagesResult['smartphone_libraries']['title'] . '】スマートフォン共通パーツ編集',
					'isLibraryElementPage'	=> true,
					'pageId'				=> '',
					'smartphoneLibraryId'	=> $smartphoneLibraryId,
					'supportDevice'			=> $supportDevice,
					'userData' 				=> $userData,
					'userId'				=> $userData['id'],
					'libraryPageProperty'	=> json_encode($libraryPageProperty),
					'menuData'				=> json_encode($json['data']['menuData']),
					'itemData'				=> json_encode($json['data']['itemData']),
					'libraries'				=> ClassRegistry::init('smartphone_libraries')->find(
						'all',
						array(
							'conditions'	=> array('residence_id' => $residenceId),
							'order'			=> array('order'=>'asc')
						)
					),
					'modified'				=> $this->modified
				)
			);
		}

		$this->render("../Contents/Library_Page/editInLibrary_PageOnPcToSmartPhone");
	}

	public function preview($device, $residenceId, $smartphoneLibraryId) {
		$deviceName = $this->getDeviceName($device);
		$userData = $this->Auth->user();

		if ($device === 's') {
			$pagesResult = ClassRegistry::init('smartphone_libraries')->find('first', array('conditions'=>array('id'=>$smartphoneLibraryId)));
			$libraryPageProperty = $pagesResult['smartphone_libraries']['property'];
			$stamp = microtime();
			list($msec, $sec) = explode(" ", $stamp);
			$strMsec = str_replace('.', '', (string)((float)$sec + (float)$msec));
			$this->set(
				array(
					'device'				=> $device,
					'deviceName'			=> $deviceName,
					'residenceId'			=> $residenceId,
					'targetDeviceName'		=> 'Smartphone',
					'isLibraryElementPage'	=> true,
					'pageId'				=> '',
					'userId'				=> $userData['id'],
					'libraryPageProperty'	=> $libraryPageProperty,
					'smartphoneLibraryId'	=> $smartphoneLibraryId,
					'modified'				=> $strMsec
				)
			);
		}

		$this->render("../Contents/Library_Page/previewInLibrary_PageOnPcToSmartPhone", 'preview');
	}





	/*********************************************************************
	 * ここからcalatlogページ用ajax
	 *********************************************************************/
	private function _doMethod($methodName, $request) {
		$this->autoRender = false;
		$this->autoLayout = false;
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		if (
			$request->isPost() &&
			isset($request->data['device_num']) &&
			$request->data['device_num'] === '2'
		) {
			switch ($methodName) {
				case 'getLibraryList':
					$json = array('result'=>true);
					break;

				case 'addDirectory':
					$json = ClassRegistry::init('Library_Smartphone_AddDirectoryAction')->addDirectory($request);
					break;

				case 'delDirectory':
					$json = ClassRegistry::init('Library_Smartphone_DelDirectoryAction')->delDirectory($request);
					break;

				case 'reorderDirectory':
					$json = ClassRegistry::init('Library_Smartphone_ReorderDirectoryAction')->reorderDirectory($request);
					break;

				case 'addLibrary':
					$json = ClassRegistry::init('Library_Smartphone_AddLibraryAction')->addLibrary($request);
					break;

				case 'duplicateLibrary':
					$json = ClassRegistry::init('Library_Smartphone_DuplicateLibraryAction')->duplicateLibrary($request);
					break;

				case 'delLibrary':
					$json = ClassRegistry::init('Library_Smartphone_DelLibraryAction')->delLibrary($request);
					break;

				case 'reorderLibrary':
					$json = ClassRegistry::init('Library_Smartphone_ReorderLibraryAction')->reorderLibrary($request);
					break;

				case 'moveLibrary':
					$json = ClassRegistry::init('Library_Smartphone_MoveLibraryAction')->moveLibrary($request);
					break;
			}

			if (isset($request->data['company_id']) && $json['result'] === true) {
				$json = ClassRegistry::init('Library_Smartphone_GetLibraryListAction')->getLibraryList($request);
			} else {
				$json = array('result'=>false, 'message'=>'企業IDが渡されていません');
			}
		}

		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');

		return new CakeResponse(array('body' => json_encode($json)));
	}
	/*
	 * Libraryリスト取得メソッド
	 * @param	void
	 * @return	json
	 */
	public function getLibraryList() {
		return $this->_doMethod('getLibraryList', $this->request);
		// $this->autoRender = false;
		// $this->autoLayout = false;
		// $json = array('result'=>false, 'message'=>'値が渡されていません');
		// if (
		// 	$this->request->isPost() &&
		// 	isset($this->request->data['device_num'])
		// ) {
		// 	if ($this->request->data['device_num'] === '2') {
		// 		$Action = ClassRegistry::init('Library_Smartphone_GetLibraryListAction');
		// 		$json = $Action->getLibraryList($this->request);
		// 	}
		// }
		// $this->RequestHandler->setContent('json');
		// $this->RequestHandler->respondAs('application/json; charset=UTF-8');

		// return new CakeResponse(array('body' => json_encode($json)));
	}

	/*
	 * LibraryDirectory追加メソッド
	 * @param	void
	 * @return	json
	 */
	public function addDirectory() {
		return $this->_doMethod('addDirectory', $this->request);
		// $this->autoRender = false;
		// $this->autoLayout = false;
		// $json = array('result'=>false, 'message'=>'値が渡されていません');
		// if (
		// 	$this->request->isPost() &&
		// 	isset($this->request->data['device_num'])
		// ) {
		// 	if ($this->request->data['device_num'] === '2') {
		// 		$Action = ClassRegistry::init('Library_Smartphone_AddDirectoryAction');
		// 		$json = $Action->addDirectory($this->request);
		// 		if ($json['result'] === true) {
		// 			$Action = ClassRegistry::init('Library_Smartphone_GetLibraryListAction');
		// 			$json = $Action->getLibraryList($this->request);
		// 		}
		// 	}
		// }
		// $this->RequestHandler->setContent('json');
		// $this->RequestHandler->respondAs('application/json; charset=UTF-8');

		// return new CakeResponse(array('body' => json_encode($json)));
	}

	/*
	 * LibraryDirectory削除メソッド
	 * @param	void
	 * @return	json
	 */
	public function delDirectory() {
		return $this->_doMethod('delDirectory', $this->request);
		// $this->autoRender = false;
		// $this->autoLayout = false;
		// $json = array('result'=>false, 'message'=>'値が渡されていません');
		// if (
		// 	$this->request->isPost() &&
		// 	isset($this->request->data['device_num'])
		// ) {
		// 	if ($this->request->data['device_num'] === '2') {
		// 		$Action = ClassRegistry::init('Library_Smartphone_DelDirectoryAction');
		// 		$json = $Action->delDirectory($this->request);
		// 		if ($json['result'] === true) {
		// 			$Action = ClassRegistry::init('Library_Smartphone_GetLibraryListAction');
		// 			$json = $Action->getLibraryList($this->request);
		// 		}
		// 	}
		// }
		// $this->RequestHandler->setContent('json');
		// $this->RequestHandler->respondAs('application/json; charset=UTF-8');

		// return new CakeResponse(array('body' => json_encode($json)));
	}

	/*
	 * LibraryDirectory並び替えメソッド
	 * @param	void
	 * @return	json
	 */
	public function reorderDirectory() {
		return $this->_doMethod('reorderDirectory', $this->request);
		// $this->autoRender = false;
		// $this->autoLayout = false;
		// $json = array('result'=>false, 'message'=>'値が渡されていません');
		// if (
		// 	$this->request->isPost() &&
		// 	isset($this->request->data['device_num'])
		// ) {
		// 	if ($this->request->data['device_num'] === '2') {
		// 		$Action = ClassRegistry::init('Library_Smartphone_ReorderDirectoryAction');
		// 		$json = $Action->reorderDirectory($this->request);
		// 		if ($json['result'] === true) {
		// 			$Action = ClassRegistry::init('Library_Smartphone_GetLibraryListAction');
		// 			$json = $Action->getLibraryList($this->request);
		// 		}
		// 	}
		// }
		// $this->RequestHandler->setContent('json');
		// $this->RequestHandler->respondAs('application/json; charset=UTF-8');

		// return new CakeResponse(array('body' => json_encode($json)));
	}

	/*
	 * Library追加メソッド
	 * @param	void
	 * @return	json
	 */
	public function addLibrary () {
		return $this->_doMethod('addLibrary', $this->request);
		// $this->autoRender = false;
		// $this->autoLayout = false;
		// $json = array('result'=>false, 'message'=>'値が渡されていません');
		// if (
		// 	$this->request->isPost() &&
		// 	isset($this->request->data['device_num'])
		// ) {
		// 	if ($this->request->data['device_num'] === '2') {
		// 		$Action = ClassRegistry::init('Library_Smartphone_AddLibraryAction');
		// 		$json = $Action->addLibrary($this->request);
		// 		if ($json['result'] === true) {
		// 			$Action = ClassRegistry::init('Library_Smartphone_GetLibraryListAction');
		// 			$json = $Action->getLibraryList($this->request);
		// 		}
		// 	}
		// }
		// $this->RequestHandler->setContent('json');
		// $this->RequestHandler->respondAs('application/json; charset=UTF-8');

		// return new CakeResponse(array('body' => json_encode($json)));
	}

	/*
	 * Library複製メソッド
	 * @param	void
	 * @return	json
	 */
	public function duplicateLibrary() {
		return $this->_doMethod('duplicateLibrary', $this->request);
	}

	/*
	 * Library削除メソッド
	 * @param	void
	 * @return	json
	 */
	public function delLibrary() {
		return $this->_doMethod('delLibrary', $this->request);
		// $this->autoRender = false;
		// $this->autoLayout = false;
		// $json = array('result'=>false, 'message'=>'値が渡されていません');
		// if (
		// 	$this->request->isPost() &&
		// 	isset($this->request->data['device_num'])
		// ) {
		// 	if ($this->request->data['device_num'] === '2') {
		// 		$Action = ClassRegistry::init('Library_Smartphone_DelLibraryAction');
		// 		$json = $Action->delLibrary($this->request);
		// 		if ($json['result'] === true) {
		// 			$Action = ClassRegistry::init('Library_Smartphone_GetLibraryListAction');
		// 			$json = $Action->getLibraryList($this->request);
		// 		}
		// 	}
		// }
		// $this->RequestHandler->setContent('json');
		// $this->RequestHandler->respondAs('application/json; charset=UTF-8');

		// return new CakeResponse(array('body' => json_encode($json)));
	}

	/*
	 * Library並び替えメソッド
	 * @param	void
	 * @return	json
	 */
	public function reorderLibrary() {
		return $this->_doMethod('reorderLibrary', $this->request);
		// $this->autoRender = false;
		// $this->autoLayout = false;
		// $json = array('result'=>false, 'message'=>'値が渡されていません');
		// if (
		// 	$this->request->isPost() &&
		// 	isset($this->request->data['device_num'])
		// ) {
		// 	if ($this->request->data['device_num'] === '2') {
		// 		$Action = ClassRegistry::init('Library_Smartphone_ReorderLibraryAction');
		// 		$json = $Action->reorderLibrary($this->request);
		// 		if ($json['result'] === true) {
		// 			$Action = ClassRegistry::init('Library_Smartphone_GetLibraryListAction');
		// 			$json = $Action->getLibraryList($this->request);
		// 		}
		// 	}
		// }
		// $this->RequestHandler->setContent('json');
		// $this->RequestHandler->respondAs('application/json; charset=UTF-8');

		// return new CakeResponse(array('body' => json_encode($json)));
	}

	/*
	 * Libraryの親Directory変更メソッド
	 * @param	void
	 * @return	json
	 */
	public function moveLibrary() {
		return $this->_doMethod('moveLibrary', $this->request);
		// $this->autoRender = false;
		// $this->autoLayout = false;
		// $json = array('result'=>false, 'message'=>'値が渡されていません');
		// if (
		// 	$this->request->isPost() &&
		// 	isset($this->request->data['device_num'])
		// ) {
		// 	if ($this->request->data['device_num'] === '2') {
		// 		$Action = ClassRegistry::init('Library_Smartphone_MoveLibraryAction');
		// 		$json = $Action->moveLibrary($this->request);
		// 		if ($json['result'] === true) {
		// 			$Action = ClassRegistry::init('Library_Smartphone_GetLibraryListAction');
		// 			$json = $Action->getLibraryList($this->request);
		// 		}
		// 	}
		// }
		// $this->RequestHandler->setContent('json');
		// $this->RequestHandler->respondAs('application/json; charset=UTF-8');

		// return new CakeResponse(array('body' => json_encode($json)));
	}














	/*
	 * Libraryデータ挿入メソッド
	 * @param	void
	 * @return	json
	 */
	// public function insertLibrary() {
	// 	$this->autoRender = false;
	// 	$this->autoLayout = false;

	// 	$Action = ClassRegistry::init('Library_Smartphone_InsertLibraryAction');
	// 	$json = $Action->insertLibrary($this->request);

	// 	$this->RequestHandler->setContent('json');
	// 	$this->RequestHandler->respondAs('application/json; charset=UTF-8');

	// 	return new CakeResponse(array('body' => json_encode($json)));
	// }

	/*
	 * Pageデータ削除メソッド
	 * @param	void
	 * @return	json
	 */
	// public function deleteLibrary() {
	// 	$this->autoRender = false;
	// 	$this->autoLayout = false;

	// 	$Action = ClassRegistry::init('Library_DeleteLibraryAction');
	// 	$json = $Action->deleteLibrary($this->request);

	// 	$this->RequestHandler->setContent('json');
	// 	$this->RequestHandler->respondAs('application/json; charset=UTF-8');

	// 	return new CakeResponse(array('body' => json_encode($json)));
	// }

	/*
	 * Librarayデータ削除メソッド
	 * @param	void
	 * @return	json
	 */
	public function updateLibrary() {
		$this->autoRender = false;
		$this->autoLayout = false;
		$json = array('result'=>false, 'message'=>'値が渡されていません');
		if (
			$this->request->isPost() &&
			isset($this->request->data['device_num'])
		) {
			if ($this->request->data['device_num'] === '2') {
				$Action = ClassRegistry::init('Library_Smartphone_UpdateLibraryAction');
				$json = $Action->updateLibrary($this->request);
			}
		}
		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');
		return new CakeResponse(array('body' => json_encode($json)));

		/*
		$Action = ClassRegistry::init('Library_UpdateLibraryAction');
		$json = $Action->updateLibrary($this->request);

		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');

		return new CakeResponse(array('body' => json_encode($json)));
		*/
	}
	/*********************************************************************
	 * ここまでcalatlogページ用ajax
	 *********************************************************************/





	/*********************************************************************
	 * ここからeditページ用ajax
	 *********************************************************************/
	/*
	 * Elementリスト取得メソッド
	 * @param	void
	 * @return	json
	 */
	public function getElementList() {
		$this->autoRender = false;
		$this->autoLayout = false;
		$json = array('result'=>false, 'message'=>'値が渡されていません');
		if (
			$this->request->isPost() &&
			isset($this->request->data['device_num'])
		) {
			if ($this->request->data['device_num'] === '2') {
				$Action = ClassRegistry::init('Library_Smartphone_GetElementListAction');
				$json = $Action->getElementList($this->request);
			}
		}
		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');
		return new CakeResponse(array('body' => json_encode($json)));
	}

	/*
	 * Elementデータ挿入メソッド
	 * @param	void
	 * @return	json
	 */
	public function insertElement() {
		$this->autoRender = false;
		$this->autoLayout = false;
		$json = array('result'=>false, 'data'=>null);
		if (
			$this->request->isPost() &&
			isset($this->request->data['device_num'])
		) {
			if ($this->request->data['device_num'] === '2') {
				$Action = ClassRegistry::init('Library_Smartphone_InsertElementAction');
				$json = $Action->insertElement($this->request);
			}
		}
		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');

		return new CakeResponse(array('body' => json_encode($json)));
	}

	/*
	 * Elementデータ削除メソッド
	 * @param	void
	 * @return	json
	 */

	/*
	 * Elementデータ削除メソッド
	 * @param	void
	 * @return	json
	 */
	public function deleteElement() {
		$this->autoRender = false;
		$this->autoLayout = false;
		$json = array('result'=>false, 'data'=>null);

		if (
			$this->request->isPost() &&
			isset($this->request->data['device_num'])
		) {
			if ($this->request->data['device_num'] === '2') {
				$Action = ClassRegistry::init('Library_Smartphone_DeleteElementAction');
				$json = $Action->deleteElement($this->request);
			}
		}

		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');
		return new CakeResponse(array('body' => json_encode($json)));
	}

	/*
	 * Elementデータ更新メソッド
	 * @param	void
	 * @return	json
	 */
	public function updateElement() {
		$this->autoRender = false;
		$this->autoLayout = false;
		$json = array('result'=>false, 'data'=>null);

		if (
			$this->request->isPost() &&
			isset($this->request->data['device_num'])
		) {
			if ($this->request->data['device_num'] === '2') {
				$Action = ClassRegistry::init('Library_Smartphone_UpdateElementAction');
				$json = $Action->updateElement($this->request);
			}
		}

		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');
		return new CakeResponse(array('body' => json_encode($json)));
	}

	/*
	 * Elementデータ更新メソッド
	 * @param	void
	 * @return	json
	 */
	public function reorderElement() {
		$this->autoRender = false;
		$this->autoLayout = false;
		$json = array('result'=>false, 'data'=>null);

		if (
			$this->request->isPost() &&
			isset($this->request->data['device_num'])
		) {
			if ($this->request->data['device_num'] === '2') {
				$Action = ClassRegistry::init('Library_Smartphone_ReorderElementAction');
				$json = $Action->reorderElement($this->request);
			}
		}

		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');
		return new CakeResponse(array('body' => json_encode($json)));
	}

	/*
	 * Pageデータ削除メソッド
	 * @param	void
	 * @return	json
	 */
	public function updateLibraryProperty() {
		$this->autoRender = false;
		$this->autoLayout = false;

		$Action = ClassRegistry::init('Library_UpdateLibraryPropertyAction');
		$json = $Action->updateLibraryProperty($this->request);

		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');

		return new CakeResponse(array('body' => json_encode($json)));
	}

	/*
	 * テーブルElement修正メソッド
	 * @param	void
	 * @return	json
	 */
	public function editTableElement() {
		$this->autoRender = false;
		$this->autoLayout = false;
		$json = array('result'=>false, 'data'=>null);

		if (
			$this->request->isPost() &&
			isset($this->request->data['device_num'])
		) {
			if ($this->request->data['device_num'] === '2') {
				$Action = ClassRegistry::init('Library_Smartphone_EditTableElementAction');
				$json = $Action->editTableElement($this->request);
			}
		}

		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');
		return new CakeResponse(array('body' => json_encode($json)));
	}
	/*********************************************************************
	 * ここまでeditページ用ajax
	 *********************************************************************/
}
