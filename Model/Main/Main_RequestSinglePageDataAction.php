<?php

class Main_RequestSinglePageDataAction extends AppModel {
	public $useTable = 'smartphone_library_directories';

	/*
	 * ページタグ取得メソッド
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function requestPage($request) {
		$json = array('result'=>false, 'data'=>null);

		if ($request->isPost()) {
			if (
				isset($request->data['page_id']) &&
				isset($request->data['device_name'])
			) {
				$options = array(
					'conditions'		=> array(
						'id'			=> $request->data['page_id']
					)
				);
				if ($request->data['device_name'] === 'Smartphone') {

				} else if ($request->data['device_name'] === 'Featurephone') {
					$result = ClassRegistry::init('featurephone_pages')->find('first', $options);
				}
				$json = array(
					'result'	=> true,
					'data'		=> $result['featurephone_pages']
				);
			}
		}
		return $json;
	}
}
