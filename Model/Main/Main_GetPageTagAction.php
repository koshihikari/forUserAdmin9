<?php

class Main_GetPageTagAction extends AppModel {
	public $useTable = 'smartphone_library_directories';

	/*
	 * ページタグ取得メソッド
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function getPageTag($request) {
		$json = array('result'=>false, 'data'=>null);

		if ($request->isPost()) {
			if (
				isset($request->data['page_id'])
			) {
				$options = array(
					'conditions'		=> array(
						'page_id'			=> $request->data['page_id']
					),
					'order'				=> array(
						'order'
					)
				);
				$result = ClassRegistry::init('page_tags')->find('all', $options);
				$json = array(
					'result'	=> true,
					'data'		=> $result
				);
			}
		}
		return $json;
	}
}
