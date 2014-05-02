<?php

class Main_ReorderPageAction extends AppModel {
	public $useTable = 'smartphone_pages';

	/*
	 * ページを並び替えるメソッド
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function reorderPage($request) {
		$isCorrect = false;

		if ($request->isPost()) {
			if (
				isset($request->data['company_id']) &&
				isset($request->data['is_company_site']) &&
				isset($request->data['residence_id']) &&
				isset($request->data['user_id']) &&
				isset($request->data['page_id']) &&
				isset($request->data['device_type']) &&
				isset($request->data['order'])
			) {
				$this->begin();
				$isCorrect = true;
				$isCorrect = $this->_reorderPage($isCorrect, $request);
				if ($isCorrect === true) {
					$this->commit();
				} else {
					$this->rollback();
				}
			}
		}
		return $isCorrect;
	}

	/*
	 * ページを並び替えるメソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	#request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _reorderPage($isCorrect, $request) {
		if ($isCorrect === true) {
			// デバイスタイプに応じて操作対象のテーブルとテーブル名を取得
			$targetTable = $request->data['device_type'] === 'sp' ? ClassRegistry::init('smartphone_pages') : ClassRegistry::init('featurephone_pages');
			$targetTableName = $request->data['device_type'] === 'sp' ? 'smartphone_pages' : 'featurephone_pages';

			// 並び替え前のレコードのorderを取得
			$result = $targetTable->find('first', array('conditions'=>array('id'=>$request->data['page_id'])));
			$beforeOrder = (int)$result[$targetTableName]['order'];
			$afterOrder = (int)$request->data['order'];

			if ($beforeOrder < $afterOrder) {
				// 並び替えるレコードのorderより大きい値のレコードのorderを-1する
				$sql = 'UPDATE ' . $targetTableName .' SET `order` = `order` - 1 WHERE residence_id = ' . $request->data['residence_id'] . ' AND `order` > ' . $beforeOrder . ' AND `order` <= ' . $afterOrder;
			} else if ($afterOrder < $beforeOrder) {
				// 並び替えるレコードのorderより小さい値のレコードのorderを+1する
				$sql = 'UPDATE ' . $targetTableName . ' SET `order` = `order` + 1 WHERE residence_id = ' . $request->data['residence_id'] . ' AND `order` >= ' . $afterOrder . ' AND `order` < ' . $beforeOrder;
			} else {
				return false;
			}
			$result = $targetTable->query($sql);

			$data = array(
				'id'		=> $request->data['page_id'],
				'user_id'	=> $request->data['user_id'],
				'order'		=> $afterOrder
			);
			return is_array($targetTable->save($data));
		} else {
			return false;
		}
	}
}
