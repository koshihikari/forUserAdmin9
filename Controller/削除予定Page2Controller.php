<?php

class Page2Controller extends AppController {
	var $layout = 'codeless_0.0.2b';
	var $components = array('Auth', 'RequestHandler');

	public function beforeFilter() {
		parent::beforeFilter();
		$this->Auth->allow('preview', 'getElementList');
	}
	
	public function catalog($device=null, $residenceId=null) {
		$userData = $this->Auth->user();
		if ($userData['company_id'] !== '1' || $device === null || $residenceId === null) {
			$this->redirect(
				array(
					'controller'	=> 'Residence',
					'action'		=> 'catalog'
				)
			);
		}
		
		$deviceName = $this->getDeviceName($device);
		$supportDevice = ClassRegistry::init('Device_GetSupportDeviceAction')->getSupportDevice($residenceId);

		$Action = ClassRegistry::init('ResidenceCompanyInfoAction');
		$data = $Action->getCompanyInfo($residenceId);

		if ($device === 's') {
			$Action = ClassRegistry::init('Library_Page_GetMasterElementAction');
			$json = $Action->getMasterElement();

			$this->set(
				array(
					'device'				=> $device,
					'deviceName'			=> $deviceName,
					'isLibraryElementPage'	=> false,
					'title_for_layout'		=> '【' . $data['ResidenceCompanyInfoAction']['name'] . '】スマートフォンページ一覧',
					// 'companyId'				=> $data['companies']['id'],
					'residenceId'			=> $residenceId,
					'userData' 				=> $userData,
					// 'userId'				=> $userData['id'],
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
			$this->render("../Contents/Page/catalogInPageOnPcToSmartphone");

		} else if ($device === 'f') {
			// $Action = ClassRegistry::init('Library_Page_GetMasterElementAction');
			// $json = $Action->getMasterElement();

			// $Action = ClassRegistry::init('ResidenceCompanyInfoAction');
			$Action = ClassRegistry::init('ResidenceCompanyInfoAction');
			$data = $Action->getCompanyInfo($residenceId);
			$this->set(
				array(
					'device'				=> $device,
					'deviceName'			=> $deviceName,
					'title_for_layout'		=> '【' . $data['ResidenceCompanyInfoAction']['name'] . '】フィーチャーフォンページ一覧',
					'residenceId'			=> $residenceId,
					'data'					=> $data,
					'userData' 				=> $userData,
					'supportDevice'			=> $supportDevice,
					// 'userId'				=> $userData['id'],
					'modified'				=> $this->modified
				)
			);
			$this->render("../Contents/Page/catalogInPageOnPcToFeaturephone");
		}

	}
	
	public function edit($device=null, $residenceId=null, $pageId=null) {
		$userData = $this->Auth->user();
		if ($userData['company_id'] !== '1' || $device === null || $residenceId === null) {
			$this->redirect(
				array(
					'controller'	=> 'Residence',
					'action'		=> 'catalog'
				)
			);
		}
		
		$deviceName = $this->getDeviceName($device);
		$supportDevice = ClassRegistry::init('Device_GetSupportDeviceAction')->getSupportDevice($residenceId);

		if ($device === 's') {
			$pagesResult = ClassRegistry::init('smartphone_pages')->find('first', array('conditions'=>array('id'=>$pageId)));
			$libraryPageProperty = $pagesResult['smartphone_pages']['property'];

			$Action = ClassRegistry::init('Library_Page_GetMasterElementAction');
			$json = $Action->getMasterElement();

			$this->set(
				array(
					'device'				=> $device,
					'deviceName'			=> $deviceName,
					'residenceId'			=> $residenceId,
					'targetDeviceName'		=> 'Smartphone',
					'title_for_layout'		=> '【' . $pagesResult['smartphone_pages']['title'] . '】スマートフォンページ編集',
					'isLibraryElementPage'	=> false,
					'pageId'				=> $pageId,
					'smartphoneLibraryId'	=> '',
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
			$this->render("../Contents/Library_Page/editInLibrary_PageOnPcToSmartPhone");

		} else if ($device === 'f') {
			// echo 111;
			$options = array(
				'conditions'	=> array(
					'id'				=> $pageId
				)
			);
			$result = ClassRegistry::init('featurephone_pages')->find('first', $options);
			$this->set(
				array(
					'device'				=> $device,
					'deviceName'			=> $deviceName,
					'residenceId'			=> $residenceId,
					'title_for_layout'		=> '【' . $result['featurephone_pages']['title'] . '】フィーチャーフォンページ編集',
					'supportDevice'			=> $supportDevice,
					'pageId'				=> $pageId,
					'userData'				=> $userData,
					'userId'				=> $userData['id'],
					'pageSourceReacordId'	=> $result['featurephone_pages']['id'],
					'pageSource'			=> $result['featurephone_pages']['source'],
					'modified'				=> $this->modified
				)
			);
			$this->render("../Contents/Library_Page/editInLibrary_PageOnPcToFeaturephone");
			/*
			*/
		}

	}
	
	public function preview($device, $residenceId, $pageId) {
		$deviceName = $this->getDeviceName($device);
		$userData = $this->Auth->user();
		$stamp = microtime();
		list($msec, $sec) = explode(" ", $stamp);
		$strMsec = str_replace('.', '', (string)((float)$sec + (float)$msec));

		if ($device === 's') {
			$pagesResult = ClassRegistry::init('smartphone_pages')->find('first', array('conditions'=>array('id'=>$pageId)));
			$libraryPageProperty = $pagesResult['smartphone_pages']['property'];

			$Action = ClassRegistry::init('Library_Page_GetMasterElementAction');
			$json = $Action->getMasterElement();
			
			$this->set(
				array(
					'device'				=> $device,
					'deviceName'			=> $deviceName,
					'residenceId'			=> $residenceId,
					'targetDeviceName'		=> 'Smartphone',
					'title_for_layout'		=> $pagesResult['smartphone_pages']['title'],
					'isLibraryElementPage'	=> false,
					'pageId'				=> $pageId,
					'userId'				=> $userData['id'],
					'smartphoneLibraryId'	=> '',
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
					'modified'				=> $strMsec
				)
			);
			$this->render("../Contents/Library_Page/previewInLibrary_PageOnPcToSmartPhone", 'preview');

		} else if ($device === 'f') {
			$options = array(
				'conditions'	=> array(
					'id'			=> $pageId
				)
			);
			$result = ClassRegistry::init('featurephone_pages')->find('first', $options);
			$this->set(
				array(
					'deviceName'			=> $deviceName,
					'pageSource'			=> $result['featurephone_pages']['source'],
					'modified'				=> $strMsec
				)
			);
			$this->render("../Contents/Library_Page/previewInLibrary_PageOnPcToFeaturephone", 'preview');
		}
	}





	/*********************************************************************
	 * ここからcalatlogページ用ajax
	 *********************************************************************/
	/*
	 * Elementリスト取得メソッド
	 * @param	void
	 * @return	json
	 */
	public function getPageList() {
		$this->autoRender = false;
		$this->autoLayout = false;
		$json = array('result'=>false, 'message'=>'値が渡されていません');
		if (
			$this->request->isPost() &&
			isset($this->request->data['device_num'])
		) {
			if ($this->request->data['device_num'] === '2') {
				$Action = ClassRegistry::init('Page_Smartphone_GetPageListAction');
				$json = $Action->getPageList($this->request);
			} else if ($this->request->data['device_num'] === '8') {
				$Action = ClassRegistry::init('Page_Featurephone_GetPageListAction');
				$json = $Action->getPageList($this->request);
			}
		}
		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');
		
		return new CakeResponse(array('body' => json_encode($json)));
	}

	/*
	 * Pageデータ挿入メソッド
	 * @param	void
	 * @return	json
	 */
	public function insertPage() {
		$this->autoRender = false;
		$this->autoLayout = false;
		$json = array('result'=>false, 'message'=>'値が渡されていません');
		if (
			$this->request->isPost() &&
			isset($this->request->data['device_num'])
		) {
			if ($this->request->data['device_num'] === '2') {
				$Action = ClassRegistry::init('Page_Smartphone_InsertPageAction');
				$json = $Action->insertPage($this->request);
			} else if ($this->request->data['device_num'] === '8') {
				$Action = ClassRegistry::init('Page_Featurephone_InsertPageAction');
				$json = $Action->insertPage($this->request);
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
	public function deletePage() {
		$this->autoRender = false;
		$this->autoLayout = false;
		$json = array('result'=>false, 'message'=>'値が渡されていません');
		if (
			$this->request->isPost() &&
			isset($this->request->data['device_num'])
		) {
			if ($this->request->data['device_num'] === '2') {
				$Action = ClassRegistry::init('Page_Smartphone_DeletePageAction');
				$json = $Action->deletePage($this->request);
			} else if ($this->request->data['device_num'] === '8') {
				$Action = ClassRegistry::init('Page_Featurephone_DeletePageAction');
				$json = $Action->deletePage($this->request);
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
	public function updatePage() {
		$this->autoRender = false;
		$this->autoLayout = false;
		if (
			$this->request->isPost() &&
			isset($this->request->data['device_num'])
		) {
			if ($this->request->data['device_num'] === '2') {
				$Action = ClassRegistry::init('Page_Smartphone_UpdatePageAction');
				$json = $Action->updatePage($this->request);
			} else if ($this->request->data['device_num'] === '8') {
				$Action = ClassRegistry::init('Page_Featurephone_UpdatePageAction');
				$json = $Action->updatePage($this->request);
			}
		}
		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');
		
		return new CakeResponse(array('body' => json_encode($json)));
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
		$json = array('result'=>false, 'data'=>null);
		if (
			$this->request->isPost() &&
			isset($this->request->data['device_num'])
		) {
			if ($this->request->data['device_num'] === '2') {
				$Action = ClassRegistry::init('Page_Smartphone_GetElementListAction');
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
				$Action = ClassRegistry::init('Page_Smartphone_InsertElementAction');
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
	public function deleteElement() {
		$this->autoRender = false;
		$this->autoLayout = false;
		$json = array('result'=>false, 'data'=>null);

		if (
			$this->request->isPost() &&
			isset($this->request->data['device_num'])
		) {
			if ($this->request->data['device_num'] === '2') {
				$Action = ClassRegistry::init('Page_Smartphone_DeleteElementAction');
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
				$Action = ClassRegistry::init('Page_Smartphone_UpdateElementAction');
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
				$Action = ClassRegistry::init('Page_Smartphone_ReorderElementAction');
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
	public function updatePageProperty() {
		$this->autoRender = false;
		$this->autoLayout = false;
		
		$Action = ClassRegistry::init('Page_Smartphone_UpdatePagePropertyAction');
		$json = $Action->updatePageProperty($this->request);

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
				$Action = ClassRegistry::init('Page_Smartphone_EditTableElementAction');
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





	/*********************************************************************
	 * ここから本番ページ書き出し用ajax
	 *********************************************************************/
	/*
	 * 本番ページ書き出しメソッド
	 * @param	void
	 * @return	json
	 */
	public function publishConcretePage() {
		$this->autoRender = false;
		$this->autoLayout = false;
		if (
			$this->request->isPost() &&
			isset($this->request->data['device_num'])
		) {
			if ($this->request->data['device_num'] === '2') {
				$Action = ClassRegistry::init('Page_Smartphone_PublishConcretePageAction');
				$json = $Action->publishConcretePage($this->request);
			} else if ($this->request->data['device_num'] === '8') {
				$Action = ClassRegistry::init('Page_Featurephone_PublishConcretePageAction');
				$json = $Action->publishConcretePage($this->request);
			}
		}
		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');
		return new CakeResponse(array('body' => json_encode($json)));
	}
	/*********************************************************************
	 * ここから本番ページ書き出し用ajax
	 *********************************************************************/





	/*********************************************************************
	 * ここからページソース修正用ajax
	 *********************************************************************/
	/*
	 * 本番ページ書き出しメソッド
	 * @param	void
	 * @return	json
	 */
	public function setPageSource() {
		$this->autoRender = false;
		$this->autoLayout = false;
		
		$Action = ClassRegistry::init('Page_Featurephone_SetPageSourceAction');
		$json = $Action->setPageSource($this->request);
		
		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');
		return new CakeResponse(array('body' => json_encode($json)));
	}
	/*********************************************************************
	 * ここまでページソース修正用ajax
	 *********************************************************************/
}
