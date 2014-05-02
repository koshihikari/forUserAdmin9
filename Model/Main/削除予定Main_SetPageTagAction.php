<?php

class Main_SetPageTagAction extends AppModel {
	public $useTable = 'smartphone_library_directories';
	public $editTagId = -1;

	/*
	 * ページタグ設定メソッド
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function setPageTag($request) {
		$isCorrect = false;

		if ($request->isPost()) {
			if (
				isset($request->data['user_id']) &&
				isset($request->data['id']) &&
				isset($request->data['page_id']) &&
				isset($request->data['tag_name']) &&
				isset($request->data['tag_code']) &&
				isset($request->data['order'])
			) {
				$this->begin();
				$isCorrect = true;
				$isCorrect = $this->_setPageTag($isCorrect, $request);
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
	 * ページタグ設定メソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _setPageTag($isCorrect, $request) {
		if ($isCorrect === true) {
			$page_tags = ClassRegistry::init('page_tags');

			$data = array(
				// 'id'		=> $request->data['id'],
				'page_id'		=> $request->data['page_id'],
				'device_num'	=> $request->data['device_num'],
				'tag_name'		=> $request->data['tag_name'],
				'tag_code'		=> $request->data['tag_code'],
				'user_id'		=> $request->data['user_id'],
				'order'			=> $request->data['order']
			);
			if (0 < (int)$request->data['id']) {
				$data['id'] = $request->data['id'];
			} else {
				// 挿入するレコードのorderより大きい値のレコードのorderを+1する
				$sql = 'UPDATE page_tags SET `order` = `order` + 1 WHERE page_id = ' . $request->data['page_id'] . ' AND `order` >= ' . $request->data['order'];
				$result = $page_tags->query($sql);
			}

			if (is_array($page_tags->save($data)) === true) {
				$this->editTagId = 0 < (int)$request->data['id'] ? $request->data['id'] : $page_tags->getLastInsertID();
				return true;
			} else {
				return false;
			}
			// return is_array($page_tags->save($data));
		} else {
			return false;
		}
	}
}
