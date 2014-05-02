<?php

class Main_ReorderPageTagAction extends AppModel {
	public $useTable = 'smartphone_pages';

	/*
	 * ページタグを並び替えるメソッド
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function reorderPageTag($request) {
		$isCorrect = false;

		if ($request->isPost()) {
			if (
				isset($request->data['user_id']) &&
				isset($request->data['id']) &&
				isset($request->data['order']) &&
				isset($request->data['page_id'])
			) {
				$this->begin();
				$isCorrect = true;
				$isCorrect = $this->_reorderPageTag($isCorrect, $request);
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
	 * ページタグを並び替えるメソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	#request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _reorderPageTag($isCorrect, $request) {
		if ($isCorrect === true) {
			$page_tags = ClassRegistry::init('page_tags');

			// 並び替え前のレコードのorderを取得
			$result = $page_tags->find('first', array('conditions'=>array('id'=>$request->data['id'])));
			$beforeOrder = (int)$result['page_tags']['order'];
			$afterOrder = (int)$request->data['order'];

			if ($beforeOrder < $afterOrder) {
				// 並び替えるレコードのorderより大きい値のレコードのorderを-1する
				$sql = 'UPDATE page_tags SET `order` = `order` - 1 WHERE page_id = ' . $request->data['page_id'] . ' AND `order` > ' . $beforeOrder . ' AND `order` <= ' . $afterOrder;
			} else if ($afterOrder < $beforeOrder) {
				// 並び替えるレコードのorderより小さい値のレコードのorderを+1する
				$sql = 'UPDATE page_tags SET `order` = `order` + 1 WHERE page_id = ' . $request->data['page_id'] . ' AND `order` >= ' . $afterOrder . ' AND `order` < ' . $beforeOrder;
			} else {
				return false;
			}
			$result = $page_tags->query($sql);

			$data = array(
				'id'		=> $request->data['id'],
				'user_id'	=> $request->data['user_id'],
				'order'		=> $afterOrder
			);
			return is_array($page_tags->save($data));
		} else {
			return false;
		}
	}
}
