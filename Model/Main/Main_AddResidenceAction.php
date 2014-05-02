<?php

class Main_AddResidenceAction extends AppModel {
	public $useTable = 'smartphone_library_directories';
	public $latestId = -1;

	/*
	 * 物件追加メソッド
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function addResidence($request) {
		$isCorrect = false;

		if ($request->isPost()) {
			if (
				isset($request->data['company_id']) &&
				isset($request->data['is_company_site']) &&
				isset($request->data['user_id'])
			) {
				$this->begin();
				$isCorrect = true;
				$isCorrect = $this->_addResidence($isCorrect, $request);
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
	 * 物件追加メソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	#request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _addResidence($isCorrect, $request) {
		if ($isCorrect === true) {
			$residences = ClassRegistry::init('residences');

			// 指定された企業IDのページ数を取得して、新規追加する物件のorderを求める
			$options = array(
				'conditions'	=> array(
					'company_id'	=> $request->data['company_id']
				)
			);
			$count = $residences->find('count', $options);
			$order = $count + 1;

			$createData = array(
				'order'							=> $order,
				'support_device_num'			=> 10,
				'company_id'					=> $request->data['company_id'],
				'is_company_site'				=> $request->data['is_company_site'],
				'name'							=> '新規物件('.date('Y-m-d H_i_s').')',
				'user_id'						=> $request->data['user_id']
			);
			$residences->create();
			if (is_array($residences->save($createData)) === true) {
				$this->latestId = $residences->getLastInsertID();
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
}
