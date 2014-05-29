<?php

class MainController extends AppController {
	var $layout = 'codeless_0.0.2';
	var $components = array('Auth', 'RequestHandler');

	public function beforeFilter() {
		parent::beforeFilter();
	}
	/*
	 * ページ一覧ページ表示メソッド
	 * @param	void
	 * @return	json
	 */
	public function index($device="p") {
		// error_log('isNisshinfudosan = ' . $this->Auth->user('target_company_name') . "\n", 3, 'log.txt');
		$deviceName = $this->getDeviceName($device);
		$userData = $this->Auth->user();

		// ob_start();//ここから
		// var_dump($userData);
		// $out=ob_get_contents();//ob_startから出力された内容をゲットする。
		// ob_end_clean();//ここまで
		// error_log('-----------------' . "\n", 3, 'log.txt');
		// error_log($out . "\n", 3, 'log.txt');
		// error_log('-----------------' . "\n", 3, 'log.txt');
		$catalog = ClassRegistry::init('Residence_ResidenceCatalogAction')->getResidenceCatalog($userData['company_id']);
		$companyResult = ClassRegistry::init('companies')->find('first', array('conditions'=>array('id'=>$userData['company_id'])));
		$Action = ClassRegistry::init('Library_Page_GetMasterElementAction');
		$json = $Action->getMasterElement();
		$json2 = ClassRegistry::init('Library_Smartphone_GetLibraryListAction')->getLibraryList(null, $userData['company_id']);
		$libraries = $json2['data'];

		$this->set(
			array(
				'device'				=> $device,
				'deviceName'			=> $deviceName,
				'title_for_layout'		=> $catalog['companySites'][0]['companies']['name'] . '様の物件一覧',
				'userData' 				=> $userData,
				// 'isAdmin' 				=> $this->isAdmin(),
				// 'targetCompanyName' 	=> $this->Auth->user('target_company_name'),
				'concreteUrl'			=> $companyResult['companies']['url'],
						'menuData'				=> json_encode($json['data']['menuData']),
						'itemData'				=> json_encode($json['data']['itemData']),
						'libraries'				=> $libraries,
				'modified'				=> $this->modified
			)
		);
		// if ($this->isCustomer() === true) {
		// 	$this->render("../Contents/Main/customIndexInMain");
		// } else {
			$this->render("../Contents/Main/indexInMain");
		// }
	}


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
				case 'request':
				case 'getPageTag':
				case 'requestSinglePageData':
					$isSuccess = true;
					break;
						/*
		ob_start();//ここから
		var_dump($result2);
		$out=ob_get_contents();//ob_startから出力された内容をゲットする。
		ob_end_clean();//ここまで
		error_log('-----------------' . "\n", 3, 'log.txt');
		error_log($out . "\n", 3, 'log.txt');
		error_log('-----------------' . "\n", 3, 'log.txt');
						*/
				case 'addResidence':
					$class = ClassRegistry::init('Main_AddResidenceAction');
					$isSuccess = $class->addResidence($request);
					if ($isSuccess === true) {
						$request->data['residence_id'] = $class->latestId;
					}
		// error_log('-----------------' . "\n", 3, 'log.txt');
		// error_log('residence_id = ' . $request->data['residence_id'] . "\n", 3, 'log.txt');
		// error_log('-----------------' . "\n", 3, 'log.txt');
					break;
				case 'delResidence':
					$isSuccess = ClassRegistry::init('Main_DelAction')->delResidence($request);
					if ($isSuccess === true) {
						unset($request->data['residence_id']);
					}
					break;
				case 'changeResidenceString':
					$isSuccess = ClassRegistry::init('Main_ChangeResidenceStringAction')->changeResidenceString($request);
					break;
				case 'duplicateResidence':
					$class = ClassRegistry::init('Main_DuplicateAction');
					$isSuccess = $class->duplicateResidence($request);
					if ($isSuccess === true) {
						$request->data['residence_id'] = $class->duplicatedResidenceId;
					}
					break;
				case 'reorderResidence':
					$isSuccess = ClassRegistry::init('Main_ReorderResidenceAction')->reorderResidence($request);
					break;
				case 'bulkUpdateOutlineData':
					$class = ClassRegistry::init('Main_BulkUpdateOutlineDataAction');
					$isSuccess = $class->bulkUpdateOutlineData($request);
					break;
				case 'addPage':
					$isSuccess = ClassRegistry::init('Main_AddPageAction')->addPage($request);
					break;
				case 'delPage':
					$isSuccess = ClassRegistry::init('Main_DelAction')->delPage($request);
					break;
				case 'duplicatePage':
					$isSuccess = ClassRegistry::init('Main_DuplicateAction')->duplicatePage($request);
					break;
				case 'changePageString':
					$isSuccess = ClassRegistry::init('Main_ChangePageStringAction')->changePageString($request);
					break;
				case 'reorderPage':
					$isSuccess = ClassRegistry::init('Main_ReorderPageAction')->reorderPage($request);
					break;
				case 'movePage':
					$isSuccess = ClassRegistry::init('Main_MovePageAction')->movePage($request);
					break;
				case 'setPageTagData':
					$class = ClassRegistry::init('Main_SetPageTagDataAction');
					$isSuccess = $class->setPageTagData($request);
					break;
			}

			if ($isSuccess === true) {
				if ($methodName === 'bulkUpdateOutlineData') {
					$json = array(
						'result'					=> true
					);
					if ($request->data['is_publish'] === true) {
						$json['spOutlineInfo'] = $class->outlineSpPageInfo;
					}

				} else if ($methodName === 'getPageTag') {
					$json = ClassRegistry::init('Main_GetPageTagAction')->getPageTag($request);

				} else if ($methodName === 'setPageTagData') {
					$json = array('result'=>true);

				// 単一ページデータ取得
				} else if ($methodName === 'requestSinglePageData') {
					$result = ClassRegistry::init('Main_RequestSinglePageDataAction')->requestPage($request);
					if ($result['result'] === true && 0 < count($result['data'])) {
						$json = array(
							'result'					=> true,
							'data'						=> $result['data']
						);
					}

				} else {
					// 物件リストとページリスト取得
					$result = ClassRegistry::init('Main_RequestResidenceAction')->requestResidence($request);
					if ($result['result'] === true && 0 < count($result['data'])) {
						if (!isset($request->data['residence_id'])) {
							$request->data['residence_id'] = $result['data'][0]['residences']['id'];
						}
						$resultOfSp = ClassRegistry::init('Main_Smartphone_RequestPageAction')->requestPage($request);
						$resultOfFp = ClassRegistry::init('Main_Featurephone_RequestPageAction')->requestPage($request);
						$json = array(
							'result'					=> true,
							'residenceId'				=> $request->data['residence_id'],
							'residences'				=> $result['data'],
							// 'smartphonePages'			=> array(),
							'smartphonePages'			=> $resultOfSp['data'],
							'featurephonePages'			=> $resultOfFp['data']
							// 'featurephonePages'			=> array()
						);
						if (
							$methodName === 'delResidence' ||
							$methodName === 'duplicateResidence'
						) {
							$json['targetResidenceId'] = $request->data['residence_id'];
						}
					}
				}
			} else {
				$json = array('result'=>false);
			}
		}

		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');

		return new CakeResponse(array('body' => json_encode($json)));
	}

	/*
	 * 物件/ページ情報取得メソッド
	 * @param	void
	 * @return	json
	 */
	public function request () {
		return $this->_doMethod('request', $this->request);
	}

	/*
	 * 物件を追加するメソッド
	 * @param	void
	 * @return	json
	 */
	public function addResidence () {
		return $this->_doMethod('addResidence', $this->request);
	}

	/*
	 * 物件を削除するメソッド
	 * @param	void
	 * @return	json
	 */
	public function delResidence () {
		return $this->_doMethod('delResidence', $this->request);
	}

	/*
	 * 物件を複製するメソッド
	 * @param	void
	 * @return	json
	 */
	public function duplicateResidence () {
		return $this->_doMethod('duplicateResidence', $this->request);
	}

	/*
	 * 物件の名前/パスのどちらかを変更するメソッド
	 * @param	void
	 * @return	json
	 */
	public function changeResidenceString () {
		return $this->_doMethod('changeResidenceString', $this->request);
	}

	/*
	 * 物件を並び替えるメソッド
	 * @param	void
	 * @return	json
	 */
	public function reorderResidence () {
		return $this->_doMethod('reorderResidence', $this->request);
	}

	/*
	 * 物件概要一括更新メソッド
	 * @param	void
	 * @return	json
	 */
	public function bulkUpdateOutlineData () {
		return $this->_doMethod('bulkUpdateOutlineData', $this->request);
	}

	/*
	 * ページを追加するメソッド
	 * @param	void
	 * @return	json
	 */
	public function addPage () {
		return $this->_doMethod('addPage', $this->request);
	}

	/*
	 * ページを削除するメソッド
	 * @param	void
	 * @return	json
	 */
	public function delPage () {
		return $this->_doMethod('delPage', $this->request);
	}

	/*
	 * ページを複製するメソッド
	 * @param	void
	 * @return	json
	 */
	public function duplicatePage () {
		return $this->_doMethod('duplicatePage', $this->request);
	}

	/*
	 * ページの名前/パスのどちらかを変更するメソッド
	 * @param	void
	 * @return	json
	 */
	public function changePageString () {
		return $this->_doMethod('changePageString', $this->request);
	}

	/*
	 * ページを並び替えるメソッド
	 * @param	void
	 * @return	json
	 */
	public function reorderPage () {
		return $this->_doMethod('reorderPage', $this->request);
	}

	/*
	 * ページの登録先物件を変更するメソッド
	 * @param	void
	 * @return	json
	 */
	public function movePage () {
		return $this->_doMethod('movePage', $this->request);
	}

	/*
	 * フィーチャーフォン用本番ページ書き出しメソッド
	 * @param	void
	 * @return	json
	 */
	public function publishFpPage () {
		$this->autoRender = false;
		$this->autoLayout = false;
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		$isSuccess = ClassRegistry::init('Main_Featurephone_PublishConcretePageAction')->publishFpPage($this->request);
		if ($isSuccess === true) {
			$json = array('result'=>true);
		}

		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');

		return new CakeResponse(array('body' => json_encode($json)));
	}

	/*
	 * ページのタグを取得するメソッド
	 * @param	void
	 * @return	json
	 */
	public function getPageTag () {
		return $this->_doMethod('getPageTag', $this->request);
	}

	/*
	 * ページのタグをセットするメソッド
	 * @param	void
	 * @return	json
	 */
	public function setPageTagData () {
		return $this->_doMethod('setPageTagData', $this->request);
	}

	/*
	 * 単一ページ情報取得メソッド
	 * @param	void
	 * @return	json
	 */
	public function requestSinglePageData () {
		return $this->_doMethod('requestSinglePageData', $this->request);
	}

	/*
	 * 物件の表示/非表示を切り替えるメソッド
	 * @param	void
	 * @return	json
	 */
	public function switchResidenceVisible () {
		$isSuccess = ClassRegistry::init('Main_SwitchVisibleAction')->switchResidenceVisible($this->request);
		if ($isSuccess === true) {
			return $this->_doMethod('request', $this->request);
			// $json = array('result'=>true);
		} else {
			$this->autoRender = false;
			$this->autoLayout = false;
			$json = array('result'=>false, 'message'=>'値が渡されていません');

			$this->RequestHandler->setContent('json');
			$this->RequestHandler->respondAs('application/json; charset=UTF-8');

			return new CakeResponse(array('body' => json_encode($json)));
		}
	}

	/*
	 * ページのタグをセットするメソッド
	 * @param	void
	 * @return	json
	 */
	// public function setPageTag () {
	// 	return $this->_doMethod('setPageTag', $this->request);
	// }

	/*
	 * ページのタグを削除するメソッド
	 * @param	void
	 * @return	json
	 */
	// public function delPageTag () {
	// 	return $this->_doMethod('delPageTag', $this->request);
	// }

	/*
	 * ページのタグをセットするメソッド
	 * @param	void
	 * @return	json
	 */
	// public function reorderPageTag () {
	// 	return $this->_doMethod('reorderPageTag', $this->request);
	// }
}
