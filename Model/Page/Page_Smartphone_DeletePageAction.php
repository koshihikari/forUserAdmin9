<?php

class Page_Smartphone_DeletePageAction extends AppModel {
	public $useTable = 'smartphone_pages';
	
	/*
	 * ページデータを削除するメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function deletePage($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		if ($request->isPost()) {
			// error_log("\n", 3, 'log.txt');
			// error_log("PageDeleteAction :: deletePage\n", 3, 'log.txt');
			// error_log('device = ' . $request->data['device'] . "\n", 3, 'log.txt');
			// error_log('residenceId = ' . $request->data['residenceId'] . "\n", 3, 'log.txt');
			// error_log('userId = ' . $request->data['userId'] . "\n", 3, 'log.txt');
			// error_log('deviceNum = ' . $request->data['deviceNum'] . "\n", 3, 'log.txt');
			// error_log('order = ' . $request->data['order'] . "\n", 3, 'log.txt');
			if (
				isset($request->data['residence_id']) &&
				isset($request->data['record_id'])
			) {
				$isCorrect = true;
				$result = $this->find('first', array('conditions'=>array('id'=>$request->data['record_id'])));
				// error_log($result['PageDeleteAction']['order'] . "\n", 3, 'log.txt');
				$result2 = $this->find('all', array('conditions'=>array('residence_id'=>$request->data['residence_id'], 'order >'=>$result['Page_Smartphone_DeletePageAction']['order'])));
				for ($i=0,$len=count($result2); $i<$len; $i++) {
					// error_log('	' . $i . ', id = ' . $result2[$i]['PageDeleteAction']['id'] . "\n", 3, 'log.txt');
					$updateData = array(
						'id'	=> $result2[$i]['Page_Smartphone_DeletePageAction']['id'],
						'order'	=> $result2[$i]['Page_Smartphone_DeletePageAction']['order'] - 1
					);
					if (!is_array($this->save($updateData))) {
						$isCorrect = false;
						break;
					}
				}
				if ($isCorrect === true) {
					if ($this->delete($request->data['record_id'])) {
						$json = array('result'=>true, 'data'=>$request->data['record_id']);
					} else {
						$json = array('result'=>false, 'message'=>'ページ削除に失敗しました。');
					}
				} else {
					$json = array('result'=>false, 'message'=>'ページ削除に失敗しました。');
				}
			}
		}
		return $json;
	}
}
