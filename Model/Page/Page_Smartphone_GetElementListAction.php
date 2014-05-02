<?php

class Page_Smartphone_GetElementListAction extends AppModel {
	public $useTable = 'smartphone_page_elements';
	public $actsAs = array(
		'FixecForSmartphoneElements'
		,'Smartphone_GetElements'
	);
	
	/*
	 * スマホ用ページのエレメントデータを取得するメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function getElementList($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		if ($request->isPost()) {
			if (
				isset($request->data['page_id'])
			) {
				$elementData = $this->getElements(false, $request->data['page_id']);
				$data = $this->fixed($elementData);
				if ($data['result'] === true) {
					$retData = array(
						'elementData'		=> $data['data']
					);
					$json = array('result'=>true, 'data'=>$retData);
				} else {
					$json = array('result'=>false, 'message'=>'並び順の更新に失敗しました');
				}
			}
		}
		return $json;
	}
}
