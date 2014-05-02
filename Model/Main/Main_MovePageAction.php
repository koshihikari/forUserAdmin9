<?php

class Main_MovePageAction extends AppModel {
	public $useTable = 'smartphone_pages';

	/*
	 * ページの登録先物件を変更するメソッド
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function movePage($request) {
		$isCorrect = false;

		if ($request->isPost()) {
			if (
				isset($request->data['company_id']) &&
				isset($request->data['is_company_site']) &&
				isset($request->data['residence_id']) &&
				isset($request->data['user_id']) &&
				isset($request->data['page_id']) &&
				isset($request->data['device_type']) &&
				isset($request->data['residence_id'])
			) {
				$this->begin();
				$isCorrect = true;
				$isCorrect = $this->_movePage($isCorrect, $request);
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
	 * ページの登録先物件を変更するメソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	#request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _movePage($isCorrect, $request) {
		if ($isCorrect === true) {
			// デバイスタイプに応じて操作対象のテーブルとテーブル名を取得
			$targetTableName = $request->data['device_type'] === 'sp' ? 'smartphone_pages' : 'featurephone_pages';
			$targetTable = ClassRegistry::init($targetTableName);
			// $targetTable = $request->data['device_type'] === 'sp' ? ClassRegistry::init('smartphone_pages') : ClassRegistry::init('featurephone_pages');

			// 移動前の物件IDとorderを取得
			$result = $targetTable->find('first', array('conditions'=>array('id'=>$request->data['page_id'])));
			$preResidenceId = $result[$targetTableName]['residence_id'];
			$preOrder = $result[$targetTableName]['order'];

			// 移動後のレコードのorderを取得
			$count = $targetTable->find('count', array('conditions'=>array('residence_id'=>$request->data['residence_id'])));
			$afterOrder = $count + 1;

			// 指定されたページの登録先物件IDを変更
			$updateData = array(
				'id'			=> $request->data['page_id'],
				'residence_id'	=> $request->data['residence_id'],
				'user_id'		=> $request->data['user_id'],
				'order'			=> $afterOrder
			);
			if (is_array($targetTable->save($updateData)) === true) {
				// 移動元物件に登録されているページのorderを更新
				$sql = 'UPDATE ' . $targetTableName .' SET `order` = `order` - 1 WHERE residence_id = ' . $preResidenceId . ' AND `order` > ' . $preOrder;
				if ($targetTable->query($sql) !== false) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
			/*
			// 移動前のレコードのorderを取得
			$result = $targetTable->find('first', array('conditions'=>array('id'=>$request->data['page_id'])));
			$beforeOrder = (int)$result[$targetTableName]['order'];

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
			*/
		} else {
			return false;
		}
	}
}
