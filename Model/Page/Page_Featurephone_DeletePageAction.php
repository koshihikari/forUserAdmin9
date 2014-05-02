<?php

class Page_Featurephone_DeletePageAction extends AppModel {
	public $useTable = 'featurephone_pages';
	private $deletedPageOrder = -1;
	
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
				$this->begin();
				$isCorrect = true;
				$isCorrect = $this->_deletePage($isCorrect, $request);
				// error_log('1 = ' . $isCorrect . "\n", 3, 'log.txt');
				$isCorrect = $this->_reorderPage($isCorrect, $request);
				// error_log('2 = ' . $isCorrect . "\n", 3, 'log.txt');
				if ($isCorrect === true) {
					// $this->rollback();
					$this->commit();
					// error_log('6 = ' . $result . "\n", 3, 'log.txt');
					$json = array('result'=>true);

				} else {
					$this->rollback();
					$json = array('result'=>false, 'message'=>'ページの削除処理に失敗しました');
				}
			}
		}
		return $json;
	}

	/*
	 * ページ削除メソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _deletePage($isCorrect, $request) {
		if ($isCorrect === true) {
			$options = array(
				'conditions'	=> array(
					'id'	=> $request->data['record_id']
				)
			);
			$conditions = array(
				'id'	=> $request->data['record_id']
			);
			$result = $this->find('first', $options);
			$this->deletedPageOrder = $result['Page_Featurephone_DeletePageAction']['order'];
			return $this->deleteAll($options['conditions']);
		} else {
			return false;
		}
	}

	/*
	 * ページのorder更新メソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _reorderPage($isCorrect, $request) {
		if ($isCorrect === true) {
			$data = array(
				'order'		=> "`order` - 1"
			);
			$conditions = array(
				'order > '			=> $this->deletedPageOrder,
				'residence_id '		=> $request->data['residence_id']
			);
			return $this->updateAll($data, $conditions);
		} else {
			return false;
		}
	}
}
