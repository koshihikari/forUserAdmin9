<?php

class Page_Featurephone_InsertPageAction extends AppModel {
	public $useTable = 'featurephone_pages';
	public $actsAs = array('Featurephone_GetPageInfo');
	private $latestInsertId = -1;

	/*
	 * Elementデータ挿入メソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function insertPage($request) {
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
				isset($request->data['user_id']) &&
				isset($request->data['device_num'])
			) {
				$this->begin();
				$isCorrect = true;
				$isCorrect = $this->_insertPage($isCorrect, $request);
				// error_log('1 = ' . $isCorrect . "\n", 3, 'log.txt');
				if ($isCorrect === true) {
					$this->commit();
					/*
					$result = $this->_getPage($this->latestInsertId);
					// error_log('6 = ' . $result . "\n", 3, 'log.txt');
					$json = array('result'=>true, 'data'=>$result);
					// $json = array('result'=>true);
					*/
					$result = $this->getPageInfo(true, $request->data['residence_id']);
					// $result = $this->getPageInfo(false, $this->latestInsertId);
					$json = array('result'=>true, 'data'=>$result);

				} else {
					$this->rollback();
					$json = array('result'=>false, 'message'=>'ページの新規追加処理に失敗しました');
				}
			}
		}
		return $json;
	}

	/*
	 * 新規ページ作成メソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _insertPage($isCorrect, $request) {
		if ($isCorrect === true) {
			$options = array(
				'conditions'	=> array(
					'residence_id'=>$request->data['residence_id']
				)
			);
			$count = $this->find('count', $options);

			$data = array(
				'residence_id'			=> $request->data['residence_id'],
				'order'					=> $count + 1,
				'status_id'				=> 1,
				'title'					=> '新規ページ('.date('Y-m-d H_i_s').')',
				'user_id'				=> $request->data['user_id']
			);
			$result = $this->save($data);
			$this->latestInsertId = $this->getLastInsertID();
			return is_array($result);
		} else {
			return false;
		}
	}

	/*
	 * 作成した新規ページ取得メソッド
	 * @param	$latestInsertId		作成した新規ページのレコードID
	 * @return	boolean
	 */
	/*
	private function _getPage($latestInsertId) {
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
		$options = array(
			'conditions'	=> array(
				'Page_Featurephone_InsertPageAction.id'	=> $latestInsertId
			)
		);
		$requestData = $this->find('first', $options);
		$requestData['Page_Featurephone_InsertPageAction']['modified'] = date("Y年m月d日 H時i分s秒",strtotime($requestData['Page_Featurephone_InsertPageAction']['modified']) + 9 * 60 * 60);
		$requestData['featurephone_pages'] = $requestData['Page_Featurephone_InsertPageAction'];
		unset($requestData['Page_Featurephone_InsertPageAction']);
		return $requestData;
	}
	*/
}
