<?php

class Page_Smartphone_UpdatePagePropertyAction extends AppModel {
	public $useTable = 'smartphone_pages';
	
	/*
	 * ページデータを削除するメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function updatePageProperty($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		if ($request->isPost()) {
			// error_log("\n", 3, 'log.txt');
			// error_log("Page_Smartphone_UpdatePagePropertyAction :: updatePageProperty\n", 3, 'log.txt');
			// error_log('id = ' . $request->data['id'] . "\n", 3, 'log.txt');
			// error_log('user_id = ' . $request->data['user_id'] . "\n", 3, 'log.txt');
			// error_log('property = ' . $request->data['property'] . "\n", 3, 'log.txt');
			if (
				isset($request->data['id']) &&
				isset($request->data['user_id']) &&
				count($request->data['property'])
			) {
				if (is_array($this->save($request->data))) {
					$json = array('result'=>true);
				} else {
					$json = array('result'=>false, 'message'=>'ページ更新に失敗しました。');
				}
			}
		}
		return $json;
	}
}
