<?php

class Main_DelPageTagAction extends AppModel {
	public $useTable = 'featurephone_pages';
	private $deletedPageOrder = -1;

	/*
	 * タグを削除するメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function delPageTag($request) {
		$isCorrect = false;

		if ($request->isPost()) {
			if (
				isset($request->data['id'])
			) {
				$this->begin();
				$isCorrect = true;

				$isCorrect = $this->_delPageTag($isCorrect, $request);

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
	 * タグを削除するメソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _delPageTag($isCorrect, $request) {
		if ($isCorrect === true) {
			$page_tags = ClassRegistry::init('page_tags');

			// page_tagsから、id === $request->data['id']のレコードを取得(削除後、orderを修正するのに必要)
			$result = $page_tags->find('first', array('conditions'=>array('id'=>$request->data['id'])));

			// page_tagsから、id === $request->data['id']のレコードを削除
			if ($page_tags->delete($request->data['id'])) {
				// 削除したレコードのorderより大きい値のレコードのorderを-1する
				$sql = 'UPDATE page_tags SET `order` = `order` - 1 WHERE page_id = ' . $result['page_tags']['page_id'] . ' AND `order` > ' . $result['page_tags']['order'] . ';';
				if ($page_tags->query($sql) !== false) {
					return true;
				} else {
					return false;
				}

			} else {
				return false;
			}
		} else {
			return false;
		}
	}
}
