<?php

class Page_PublishConcretePageAction extends AppModel {
	public $useTable = 'smartphone_concrete_pages';
	
	/*
	 * 本番ページ書き出しメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function publishConcretePage($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		if ($request->isPost()) {
			if (
				isset($request->data['residence_id']) &&
				isset($request->data['page_id']) &&
				isset($request->data['user_id']) &&
				isset($request->data['source'])
			) {
				$this->begin();
				$isCorrect = true;
				$isCorrect = $this->_setPageSource($isCorrect, $request);
				if ($isCorrect === true) {
					$this->commit();
					// error_log('6 = ' . $result . "\n", 3, 'log.txt');
					$json = array('result'=>true);

				} else {
					$this->rollback();
					$json = array('result'=>false, 'message'=>'データ追加に失敗しました。');
				}
			}
		}
		return $json;
	}

	/*
	 * 指定されたソースを書き込むメソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	#request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _setPageSource($isCorrect, $request) {
		if ($isCorrect === true) {
			$options = array(
				'conditions'		=> array(
					'residence_id'		=> $request->data['residence_id'],
					'page_id'			=> $request->data['page_id'],
					'user_id'			=> $request->data['user_id']
				)
			);
			$result = $this->find('first', $options);
			$data = array(
				'residence_id'		=> $request->data['residence_id'],
				'page_id'			=> $request->data['page_id'],
				'user_id'			=> $request->data['user_id'],
				'source'			=> $request->data['source']
			);
			if (0 < count($result)) {
				$data['id'] = $result['Page_PublishConcretePageAction']['id'];
			}
			return is_array($this->save($data));
		} else {
			return false;
		}
	}
}
