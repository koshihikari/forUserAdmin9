<?php

class Main_AddPageAction extends AppModel {
	public $useTable = 'smartphone_library_directories';

	/*
	 * ページ追加メソッド
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function addPage($request) {
		$isCorrect = false;

		if ($request->isPost()) {
			if (
				isset($request->data['company_id']) &&
				isset($request->data['is_company_site']) &&
				isset($request->data['device_type']) &&
				isset($request->data['user_id']) &&
				isset($request->data['residence_id'])
			) {
				$this->begin();
				$isCorrect = true;
				$isCorrect = $this->_addLibrary($isCorrect, $request);
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
	 * ページ追加メソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	#request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _addLibrary($isCorrect, $request) {
		if ($isCorrect === true) {
			// デバイスタイプに応じて捜査対象のテーブルとテーブル名を取得
			$targetTable = $request->data['device_type'] === 'sp' ? ClassRegistry::init('smartphone_pages') : ClassRegistry::init('featurephone_pages');
			$targetTableName = $request->data['device_type'] === 'sp' ? 'smartphone_pages' : 'featurephone_pages';

			// 指定された物件IDのページ数を取得して、新規追加するページのorderを求める
			$options = array(
				'conditions'	=> array(
					'residence_id'	=> $request->data['residence_id']
				)
			);
			$count = $targetTable->find('count', $options);
			$order = $count + 1;

			if ($request->data['device_type'] === 'sp') {
				$options2 = array(
					'conditions'	=> array(
						'component_name'	=> array('Bg', 'Space')
					)
				);
				$result = ClassRegistry::init('mtr_smartphone_components')->find('all', $options2);
				$property = array();
				for ($i=0,$len=count($result); $i<$len; $i++) {
					$property[$result[$i]['mtr_smartphone_components']['component_name']] = json_decode($result[$i]['mtr_smartphone_components']['property']);
				}
				$createData = array(
					'residence_id'			=> $request->data['residence_id'],
					'order'					=> $order,
					'status_id'				=> 1,
					'title'					=> '新規ページ('.date('Y-m-d H_i_s').')',
					'user_id'				=> $request->data['user_id'],
					'property'				=> json_encode($property)
				);
			} else {
				$createData = array(
					'residence_id'			=> $request->data['residence_id'],
					'order'					=> $order,
					'status_id'				=> 1,
					'title'					=> '新規ページ('.date('Y-m-d H_i_s').')',
					'user_id'				=> $request->data['user_id']
				);
			}
			$targetTable->create();
			return is_array($targetTable->save($createData));
		} else {
			return false;
		}
	}
}
