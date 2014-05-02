<?php

class Page_Smartphone_GetPageListAction extends AppModel {
	public $useTable = 'smartphone_pages';
	public $actsAs = array('Smartphone_GetPageInfo');

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
}
