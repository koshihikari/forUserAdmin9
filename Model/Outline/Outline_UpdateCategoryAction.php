<?php

class Outline_UpdateCategoryAction extends Model {
	public $useTable = 'outlines';
	
	/*
	 * データ更新メソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function updateCategory($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		if ($request->isPost()) {
			if (
				isset($request->data['base_data']) &&
				isset($request->data['update_data'])
			) {
				$is_correct = true;
				$is_correct = $this->_updateCategory($is_correct, $request);
				if ($is_correct === true) {
					$json = array('result'=>true);
				} else {
					$json = array('result'=>false, 'message'=>'データの更新に失敗しました。');
				}
			}
		}
		return $json;
	}

	/*
	 * データ更新メソッド
	 * @param	$is_correct		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _updateCategory($is_correct, $request) {
		if ($is_correct === true) {
			$update_data = $request->data['update_data'];
			$is_success = true;
			$this->begin();
			for ($i=0,$len=count($update_data); $i<$len; $i++) {
				if($update_data[$i]['id'] !== 'undefined' && $update_data[$i]['id'] !== '' && $update_data[$i]['id'] !== 0) {
					$data = array(
						'id'						=> $update_data[$i]['id'],
						'key'						=> $update_data[$i]['key']
					);
					if (is_array($this->save($data)) === false) {
						$is_success = false;
						break;
					}
				}
			}
			if ($is_success === true) {
				$this->commit();
			} else {
				$this->rollback();
			}
			return $is_success;
		} else {
			return false;
		}
	}
}
