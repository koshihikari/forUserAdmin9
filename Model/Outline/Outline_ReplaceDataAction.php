<?php

class Outline_ReplaceDataAction extends Model {
	public $useTable = 'outlines';
	
	/*
	 * データ並び替えメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function replaceData($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		if ($request->isPost()) {
			if (
				isset($request->data['base_data']) &&
				isset($request->data['update_data'])
			) {
				$is_correct = true;
				$is_correct = $this->_replaceData($is_correct, $request);
				if ($is_correct === true) {
					$options = array(
						'conditions'	=> array(
							'residence_id'		=> $request->data['base_data']['residence_id']
						),
						'order'			=> 'order'
					);
					$result = $this->find('all', $options);
					$data = array();
					for ($i=0,$len=count($result); $i<$len; $i++) {
						array_push($data, $result[$i]['Outline_ReplaceDataAction']);
					}
					$residences = ClassRegistry::init('residences')->find('first', array('id'=>$request->data['base_data']['residence_id']));
					$json = array('result'=>true, 'data'=>array('residences'=>$residences['residences'], 'outlines'=>$data));
					// $json = array('result'=>true, 'data'=>$data);
				} else {
					$json = array('result'=>false, 'message'=>'データの更新に失敗しました。');
				}
			}
		}
		return $json;
	}

	/*
	 * データ差し替えメソッド
	 * @param	$is_correct		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _replaceData($is_correct, $request) {
		if ($is_correct === true) {
			$is_success = true;
			$outlines = ClassRegistry::init('outlines');
			$outlines->begin();


			// まず、該当する全データを消去
			$conditions = array(
				'residence_id'		=> $request->data['base_data']['residence_id']
			);
			$outlines->deleteAll($conditions);

			$outline_data = $request->data['update_data']['outlines'];
			$latestInsertId = -1;
			for ($i=0,$len=count($outline_data); $i<$len; $i++) {
				$data = array(
					'mtr_outline_id'			=> $outline_data[$i]['mtr_outline_id'],
					'residence_id'				=> $request->data['base_data']['residence_id'],
					'user_id'					=> $request->data['base_data']['user_id'],
					'key'						=> $outline_data[$i]['key'],
					'val'						=> $outline_data[$i]['val'],
					'is_required'				=> $outline_data[$i]['is_required'],
					'frk_index'					=> $outline_data[$i]['frk_index'],
					'order'						=> $outline_data[$i]['order'],
					'parent_category_id'		=> $outline_data[$i]['parent_category_id'] === '' ? $latestInsertId : $outline_data[$i]['parent_category_id']
				);
				if (is_array($outlines->save($data)) === false) {
					$is_success = false;
					break;
				} else {
					if ($outline_data[$i]['parent_category_id'] !== '') {
						$latestInsertId = $outlines->getLastInsertID();
					}
					$outlines->create();
				}
			}
			if ($is_success === true) {
				$residences = ClassRegistry::init('residences');
				$residences->begin();
				$data = array(
					'id'		=> $request->data['base_data']['residence_id'],
					'num'	=> $request->data['update_data']['frk_num'],
					'name'	=> $request->data['update_data']['residence_name']
				);
				if (is_array($residences->save($data)) === true) {
					$outlines->commit();
					$residences->commit();
				} else {
					$is_success = false;
					$outlines->rollback();
					$residences->rollback();
				}
			} else {
				$outlines->rollback();
			}
			return $is_success;
		} else {
			return false;
		}
	}
}
