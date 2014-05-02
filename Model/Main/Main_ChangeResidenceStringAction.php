<?php

class Main_ChangeResidenceStringAction extends Model {
	public $useTable = 'residences';
	// public $actsAs = array('Smartphone_GetPageInfo');

	/*
	 * 物件の名前/パスのどちらかを変更するメソッド
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	Boolean
	 */
	public function changeResidenceString($request) {
		$isCorrect = false;

		if ($request->isPost()) {
			if (
				isset($request->data['company_id']) &&
				isset($request->data['is_company_site']) &&
				isset($request->data['residence_id']) &&
				isset($request->data['user_id']) &&
				isset($request->data['key']) &&
				isset($request->data['val'])
			) {
				$this->begin();
				$isCorrect = true;
				$isCorrect = $this->_changeResidenceString($isCorrect, $request);
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
	 * 物件の名前/パスのどちらかを変更するメソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	Boolean
	 */
	private function _changeResidenceString($isCorrect, $request) {
		if ($isCorrect === true) {
			$residences = ClassRegistry::init('residences');

			$data = array(
				'id'		=> $request->data['residence_id'],
				'user_id'	=> $request->data['user_id']
			);
			$data[$request->data['key']] = $request->data['val'];

			return is_array($residences->save($data));
		} else {
			return false;
		}
	}
}
