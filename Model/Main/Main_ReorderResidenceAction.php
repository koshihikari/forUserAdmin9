<?php

class Main_ReorderResidenceAction extends AppModel {
	public $useTable = 'smartphone_pages';

	/*
	 * 物件を並び替えるメソッド
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function reorderResidence($request) {
		$isCorrect = false;

		if ($request->isPost()) {
			if (
				isset($request->data['company_id']) &&
				isset($request->data['is_company_site']) &&
				isset($request->data['residence_id']) &&
				isset($request->data['user_id']) &&
				isset($request->data['order'])
			) {
				$this->begin();
				$isCorrect = true;
				$isCorrect = $this->_reorderResidence($isCorrect, $request);
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
	 * 物件を並び替えるメソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	#request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _reorderResidence($isCorrect, $request) {
		if ($isCorrect === true) {
			$residences = ClassRegistry::init('residences');

			// 並び替え前のレコードのorderを取得
			$result = $residences->find('first', array('conditions'=>array('id'=>$request->data['residence_id'])));
			$beforeOrder = (int)$result['residences']['order'];
			$afterOrder = (int)$request->data['order'];

			if ($beforeOrder < $afterOrder) {
				// 並び替えるレコードのorderより大きい値のレコードのorderを-1する
				$sql = 'UPDATE residences SET `order` = `order` - 1 WHERE company_id = ' . $request->data['company_id'] . ' AND `order` > ' . $beforeOrder . ' AND `order` <= ' . $afterOrder;
			} else if ($afterOrder < $beforeOrder) {
				// 並び替えるレコードのorderより小さい値のレコードのorderを+1する
				$sql = 'UPDATE residences SET `order` = `order` + 1 WHERE company_id = ' . $request->data['company_id'] . ' AND `order` >= ' . $afterOrder . ' AND `order` < ' . $beforeOrder;
			} else {
				return false;
			}
			$result = $residences->query($sql);

			$data = array(
				'id'		=> $request->data['residence_id'],
				'user_id'	=> $request->data['user_id'],
				'order'		=> $afterOrder
			);
			return is_array($residences->save($data));
		} else {
			return false;
		}
	}
}
