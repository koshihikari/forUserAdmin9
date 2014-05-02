<?php

class Page_Featurephone_GetPageListAction extends AppModel {
	public $useTable = 'featurephone_pages';
	public $actsAs = array('Featurephone_GetPageInfo');

	/*
	 * スマホ用ページのエレメントデータを取得するメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function getPageList($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		if ($request->isPost()) {
			if (
				isset($request->data['residence_id'])
			) {
				$result = $this->getPageInfo(true, $request->data['residence_id']);
				// $result = $this->_getPageData($request);
				$json = array('result'=>true, 'data'=>$result);
			}
		}
		return $json;
	}
	/*
	public function getPageList($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		if ($request->isPost()) {
			if (
				isset($request->data['residence_id']) &&
				isset($request->data['device_name'])
			) {
				$result = $this->_getPageLibraryData($request);
				$json = array('result'=>true, 'data'=>$result);
			}
		}
		return $json;
	}
	*/

	/*
	 * Tableエレメントのプロパティ上書きメソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	/*
	private function _getPageLibraryData($request) {
		// $Action = ClassRegistry::init('featurephone_pages');
		$this->bindModel(
			array(
				'belongsTo'		=> array(
					'users'			=> array(
						'foreignKey'	=> 'user_id'
					),
					'mtr_statuses'			=> array(
						'foreignKey'	=> 'status_id'
					)
				)
			)
		);
		$option = array(
			'conditions'	=> array(
				'Page_Featurephone_GetPageListAction.residence_id'=>$request->data['residence_id']
			),
			'order'			=> array(
				'Page_Featurephone_GetPageListAction.order ASC'
			)
		);

		$requestData = $this->find('all', $option);

		for ($i=0,$len=count($requestData); $i<$len; $i++) {
			$requestData[$i]['Page_Featurephone_GetPageListAction']['modified'] = date("Y年m月d日 H時i分s秒",strtotime($requestData[$i]['Page_Featurephone_GetPageListAction']['modified']) + 9 * 60 * 60);
			$requestData[$i]['featurephone_pages'] = $requestData[$i]['Page_Featurephone_GetPageListAction'];
			unset($requestData[$i]['Page_Featurephone_GetPageListAction']);
			// $requestData[$i]['featurephone_pages'] = $requestData[$i]['Page_GetPageListAction'];
			// unset($requestData[$i]['Page_GetPageListAction']);
		}
		return $requestData;
	}
	*/
}
