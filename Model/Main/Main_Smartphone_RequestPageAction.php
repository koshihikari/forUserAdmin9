<?php

class Main_Smartphone_RequestPageAction extends Model {
	public $useTable = 'residences';
	public $actsAs = array('Smartphone_GetPageInfo');

	/*
	 * スマホ用ページのエレメントデータを取得するメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	オブジェクト
	 */
	public function requestPage($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていませんa');

		if ($request->isPost()) {
			if (
				isset($request->data['residence_id'])
			) {
				$result = $this->getPageInfo(true, $request->data['residence_id']);
				$json = array('result'=>true, 'data'=>$result);
			}
		}
		return $json;
	}
}
