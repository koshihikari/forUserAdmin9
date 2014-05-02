<?php

class Outline_AddCategoryAction extends Model {
	public $useTable = 'outlines';
	private $latestInsertId = -1;
	
	/*
	 * データ更新メソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function addCategory($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		if ($request->isPost()) {
			if (
				isset($request->data['base_data']) &&
				isset($request->data['update_data'])
			) {
				$this->begin();
				$is_correct = true;
				$is_correct = $this->_reorderCategory($is_correct, $request);
				$is_correct = $this->_addCategory($is_correct, $request);
				if ($is_correct === true) {
					$this->commit();
					$json = array('result'=>true, 'id'=>$this->latestInsertId);
				} else {
					$this->rollback();
					$json = array('result'=>false, 'message'=>'データの追加に失敗しました。');
				}
			}
		}
		return $json;
	}


	/*
	 * カテゴリ並び順更新メソッド
	 * @param	$is_correct		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _reorderCategory($is_correct, $request) {
		if ($is_correct === true) {
			// $this->begin();
			$data = array(
				'order'					=> '`order` + 1'
			);
			$conditions = array(
				'residence_id'			=> $request->data['base_data']['residence_id'],
				'parent_category_id'	=> 0,
				'order >= '				=> $request->data['update_data']['order']
			);
			return $this->updateAll($data, $conditions);
		} else {
			return false;
		}
	}


	/*
	 * カテゴリ追加メソッド
	 * @param	$is_correct		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _addCategory($is_correct, $request) {
		if ($is_correct === true) {
			// $this->begin();
			$data = array(
				'mtr_outline_id'		=> 0,
				'residence_id'			=> $request->data['base_data']['residence_id'],
				'user_id'				=> $request->data['base_data']['user_id'],
				'key'					=> '',
				'val'					=> '',
				'is_required'			=> 0,
				'frk_index'				=> '',
				'order'					=> $request->data['update_data']['order'],
				'parent_category_id'	=> 0
			);
			if (is_array($this->save($data)) === true) {
				// $this->commit();
				$this->latestInsertId = $this->getLastInsertID();
				return true;
			} else {
				// $this->rollback();
				return false;
			}
		} else {
			return false;
		}
	}
}
