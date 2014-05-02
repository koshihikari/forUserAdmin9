<?php

class Library_Smartphone_GetLibraryListAction extends AppModel {
	public $useTable = 'smartphone_libraries';
	public $actsAs = array('Smartphone_GetLibraryInfo');

	/*
	 * スマホ用ページのエレメントデータを取得するメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function getLibraryList($request, $companyId=null) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

				// error_log('$request' . "\n", 3, 'log.txt');
				// error_log($request . "\n", 3, 'log.txt');
				// error_log('$request->isPost()' . "\n", 3, 'log.txt');
				// error_log($request->isPost() . "\n", 3, 'log.txt');
				// error_log('$request->data[device_num]' . "\n", 3, 'log.txt');
				// error_log($request->data['device_num'] . "\n", 3, 'log.txt');
				// error_log('-------------------' . "\n", 3, 'log.txt');
		if (isset($request) && $request->isPost()) {
			if (
				isset($request->data['company_id'])
			) {
				$result = $this->getLibraryInfo($request->data['company_id']);
				$json = array('result'=>true, 'data'=>$result);
			}
		} else if ($companyId !== null) {
			$result = $this->getLibraryInfo($companyId);
			$json = array('result'=>true, 'data'=>$result);
		}
		return $json;
	}
}
