<?php

class Page_Featurephone_UpdatePageAction extends AppModel {
	public $useTable = 'featurephone_pages';
	
	/*
	 * ページデータを削除するメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function updatePage($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		if ($request->isPost()) {
			// error_log("\n", 3, 'log.txt');
			// error_log("PageUpdateAction :: updatePage\n", 3, 'log.txt');
			// error_log('updateData = ' . $request->data['updateData'] . "\n", 3, 'log.txt');
			// error_log('updateData = ' . count($request->data['updateData']) . "\n", 3, 'log.txt');
			if (
				isset($request->data['updateData'])
				// isset($request->data['updateData']) &&
				// count($request->data['updateData'])
			) {
				$this->begin();
				$isCorrect = true;
				$isCorrect = $this->_updatePage($isCorrect, $request);
				// error_log('1 = ' . $isCorrect . "\n", 3, 'log.txt');
				if ($isCorrect === true) {
					// $this->rollback();
					$this->commit();
					// error_log('6 = ' . $result . "\n", 3, 'log.txt');
					$json = array('result'=>true);

				} else {
					$this->rollback();
					$json = array('result'=>false, 'message'=>'ページの更新処理に失敗しました');
				}
			}
			/*
				if (is_array($request->data['updateData']) && isset($request->data['updateData'][0])) {
					$isCorrectSave = true;
					for ($i=0,$len=count($request->data['updateData']); $i<$len; $i++) {
						error_log('	' . $i . ', id = ' . $request->data['updateData'][$i]['id'] . "\n", 3, 'log.txt');
						if (!is_array($this->save($request->data['updateData'][$i]))) {
							$isCorrectSave = false;
							break;
						}
					}
					if ($isCorrectSave === true) {
						$json = array('result'=>true);
					} else {
						$json = array('result'=>false, 'message'=>'ページ削除に失敗しました。');
					}
				} else {
					if (!is_array($this->save($request->data['updateData']))) {
						$json = array('result'=>true);
					} else {
						$json = array('result'=>false, 'message'=>'ページ削除に失敗しました。');
					}
				}
			}
			*/
		}
		return $json;
	}

	/*
	 * ページ削除メソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _updatePage($isCorrect, $request) {
		if ($isCorrect === true) {
			return is_array($this->save($request->data['updateData']));
			/*
			if (is_array($request->data['updateData']) && isset($request->data['updateData'][0])) {
				$isCorrectSave = true;
				for ($i=0,$len=count($request->data['updateData']); $i<$len; $i++) {
					error_log('	' . $i . ', id = ' . $request->data['updateData'][$i]['id'] . "\n", 3, 'log.txt');
					if (!is_array($this->save($request->data['updateData'][$i]))) {
						$isCorrectSave = false;
						break;
					}
				}
				return $isCorrect;
			} else {
				return false;
				// $json = array('result'=>false, 'message'=>'ページ削除に失敗しました。');
			}
			*/
		} else {
			return false;
		}
	}
}
