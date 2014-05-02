<?php

class Page_Featurephone_SetPageSourceAction extends AppModel {
	public $useTable = 'featurephone_pages';
	private $latestInsertId = -1;

	/*
	 * Elementデータ挿入メソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function setPageSource($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		if ($request->isPost()) {
			// error_log("\n", 3, 'log.txt');
			// error_log("PageCreateAction :: createPage\n", 3, 'log.txt');
			// error_log('device = ' . $request->data['device'] . "\n", 3, 'log.txt');
			// error_log('residence_id = ' . $request->data['residence_id'] . "\n", 3, 'log.txt');
			// error_log('user_id = ' . $request->data['user_id'] . "\n", 3, 'log.txt');
			// error_log('device_num = ' . $request->data['device_num'] . "\n", 3, 'log.txt');
			// error_log('order = ' . $request->data['order'] . "\n", 3, 'log.txt');
			if (
				isset($request->data['residence_id']) &&
				// isset($request->data['page_id']) &&
				isset($request->data['user_id']) &&
				isset($request->data['source']) &&
				isset($request->data['device_name']) &&
				$request->data['device_name'] === 'Featurephone'
			) {
				$this->begin();
				$isCorrect = true;
				$isCorrect = $this->_setPageSource($isCorrect, $request);
				if ($isCorrect === true) {
					$this->commit();
					$json = array('result'=>true, 'id'=>$this->latestInsertId);

				} else {
					$this->rollback();
					$json = array('result'=>false, 'message'=>'データ追加に失敗しました。');
				}
			}
		}
		return $json;
	}

	/*
	 * エレメントのプロパティをを更新するメソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _setPageSource($isCorrect, $request) {
		if ($isCorrect === true) {
			if (isset($request->data['id'])) {
				$data = array(
					'id'						=> $request->data['id'],
					'residence_id'				=> $request->data['residence_id'],
					'user_id'					=> $request->data['user_id'],
					'preview_source'			=> $request->data['source'],
					'edited'					=> date('c'),
					'edited_user_id'			=> $request->data['user_id']
				);
				$result = $this->save($data);
				$this->latestInsertId = $this->getLastInsertID();
				return is_array($result);
			} else {
				return false;
			}
			/*
			if (isset($request->data['id'])) {
				$data['id'] = $request->data['id'];
			}
			$result = $this->save($data);
			$this->latestInsertId = $this->getLastInsertID();
			return is_array($result);
			*/
		} else {
			return false;
		}
	}
}
