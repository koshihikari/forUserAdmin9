<?php

class Outline_UpdateResidenceAction extends Model {
	public $useTable = 'residences';
	
	/*
	 * データ更新メソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function updateResidence($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		if ($request->isPost()) {
			if (
				isset($request->data['base_data']) &&
				isset($request->data['update_data'])
			) {
				$is_correct = true;
				$is_correct = $this->_updateResidence($is_correct, $request);
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
	private function _updateResidence($is_correct, $request) {
		if ($is_correct === true) {
			$update_data = $request->data['update_data'];
			$is_success = true;
			$this->begin();
			$data = array(
				'id'			=> $request->data['base_data']['residence_id'],
				'user_id'		=> $request->data['base_data']['user_id'],
				'num'			=> $request->data['update_data']['num'],
				'name'			=> $request->data['update_data']['name']
			);
			if (is_array($this->save($data)) === true) {
				$this->commit();
				return true;
			} else {
				$this->rollback();
				return false;
			}
		} else {
			return false;
		}
	}
}
