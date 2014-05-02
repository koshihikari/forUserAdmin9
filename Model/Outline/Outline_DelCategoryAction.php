<?php

class Outline_DelCategoryAction extends Model {
	public $useTable = 'outlines';
	private $latestInsertId = -1;
	
	/*
	 * データ更新メソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function delCategory($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		if ($request->isPost()) {
			if (
				isset($request->data['base_data']) &&
				isset($request->data['update_data'])
			) {
				$this->begin();
				$is_correct = true;
				$is_correct = $this->_delCategory($is_correct, $request);
				$is_correct = $this->_reorderCategory($is_correct, $request);
				if ($is_correct === true) {
					$this->commit();
					$json = array('result'=>true, 'id'=>$this->latestInsertId);
				} else {
					$this->rollback();
					$json = array('result'=>false, 'message'=>'データの削除に失敗しました。');
				}
			}
		}
		return $json;
	}


	/*
	 * カテゴリ削除メソッド
	 * @param	$is_correct		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _delCategory($is_correct, $request) {
		if ($is_correct === true) {
			$conditions = array(
				'id'			=> $request->data['update_data']
			);
			return $this->deleteAll($conditions);
		} else {
			return false;
		}
	}


	/*
	 * カテゴリ並び順更新メソッド
	 * @param	$is_correct		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _reorderCategory($is_correct, $request) {
		if ($is_correct === true) {
			$options = array(
				'conditions' => array(
					'residence_id'			=> $request->data['base_data']['residence_id'],
					'parent_category_id'	=> 0
				),
				'order'		=> 'order'
			);
			$result = $this->find('all', $options);

			$is_correct = false;
			for ($i=0,$len=count($result); $i<$len; $i++) {
				$data = array(
					'id'			=> $result[$i]['Outline_DelCategoryAction']['id'],
					'order'			=> $i + 1
				);
				if (is_array($this->save($data)) === true) {
					$is_correct = true;
				} else {
					$is_correct = false;
					break;
				}
			}
			return $is_correct;
		} else {
			return false;
		}
	}
}
