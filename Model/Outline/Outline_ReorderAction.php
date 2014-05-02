<?php

class Outline_ReorderAction extends Model {
	public $useTable = 'outlines';
	
	/*
	 * データ並び替えメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function reorder($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		if ($request->isPost()) {
			if (
				isset($request->data['base_data']) &&
				isset($request->data['update_data'])
			) {
				$is_correct = true;
				$is_correct = $this->_updateOrder($is_correct, $request);
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
	 * データ並び替えメソッド
	 * @param	$is_correct		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _updateOrder($is_correct, $request) {
		if ($is_correct === true) {
			$update_data = $request->data['update_data'];
			$is_success = true;
			$this->begin();
			for ($i=0,$len=count($update_data); $i<$len; $i++) {
				if($update_data[$i]['id'] !== '' && $update_data[$i]['id'] !== 0) {
					$data = array(
						'id'						=> $update_data[$i]['id'],
						'order'						=> $update_data[$i]['order'],
						'parent_category_id'		=> $update_data[$i]['parent_category_id']
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
