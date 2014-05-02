<?php

class Main_ChangePageStringAction extends Model {
	public $useTable = 'residences';
	public $actsAs = array('Smartphone_GetPageInfo');

	/*
	 * ページの名前/パスのどちらかを変更するメソッド
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	Boolean
	 */
	public function changePageString($request) {
		$isCorrect = false;

		if ($request->isPost()) {
			if (
				isset($request->data['company_id']) &&
				isset($request->data['is_company_site']) &&
				isset($request->data['residence_id']) &&
				isset($request->data['user_id']) &&
				isset($request->data['page_id']) &&
				isset($request->data['device_type']) &&
				isset($request->data['key']) &&
				isset($request->data['val'])
			) {
				$this->begin();
				$isCorrect = true;
				$isCorrect = $this->_changePageString($isCorrect, $request);
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
	 * ページの名前/パスのどちらかを変更するメソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	Boolean
	 */
	private function _changePageString($isCorrect, $request) {
		if ($isCorrect === true) {
			$targetTable = $request->data['device_type'] === 'sp' ? ClassRegistry::init('smartphone_pages') : ClassRegistry::init('featurephone_pages');

			$data = array(
				'id'		=> $request->data['page_id'],
				'user_id'	=> $request->data['user_id']
			);
			$data[$request->data['key']] = $request->data['val'];

			return is_array($targetTable->save($data));
		} else {
			return false;
		}
	}
}
