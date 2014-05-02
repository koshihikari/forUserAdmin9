<?php

class Util_OutputAction extends AppModel {
	public $useTable = 'companies';

	/*
	 * 物件/ページ/ライブラリ複製メソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function getPageInfo($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		$companyId = 0;
		if ($request->isPost()) {
			$companyId = isset($request->data['company_id']) ? $request->data['company_id'] : 0;
		// if (isset($request->query['company_id'])) {
		// 	$companyId = 0 < (int)$request->query['company_id'] ? $request->query['company_id'] : 0;
		}

		$companies = ClassRegistry::init('companies');
		$options = array(
			'fields'	=> array(
				'companies.id', 'companies.name'
			)
		);
		$list = $companies->find('list', $options);

		if (0 < $companyId) {
			$companies = ClassRegistry::init('companies');
			$companies->bindModel(
				array(
					'hasMany'		=> array(
						'residences'			=> array(
							'foreignKey'	=> 'company_id',
							'fields'		=> array(
								'residences.id', 'residences.company_id', 'residences.name', 'residences.path'
							),
							'order'			=> 'residences.order ASC'
						)
					)
				)
			);
			$residences = ClassRegistry::init('residences');
			$residences->bindModel(
				array(
					'hasMany'		=> array(
						'smartphone_pages'			=> array(
							'foreignKey'	=> 'residence_id',
							'fields'		=> array(
								'smartphone_pages.id', 'smartphone_pages.residence_id', 'smartphone_pages.title', 'smartphone_pages.path', 'smartphone_pages.source'
								// 'smartphone_pages.id', 'smartphone_pages.residence_id', 'smartphone_pages.title', 'smartphone_pages.path'
							),
							'order'			=> 'smartphone_pages.order ASC'
						)
					)
				)
			);
			$options = array(
				'conditions'	=> array(
					'companies.id'=>$companyId
				),
				'fields'	=> array(
					'companies.id', 'companies.name', 'companies.url'
				),
				'recursive'		=> 2
			);

			$result = $companies->find('first', $options);
			// ob_start();//ここから
			// var_dump($result);
			// $out=ob_get_contents();//ob_startから出力された内容をゲットする。
			// ob_end_clean();//ここまで
			// error_log('-----------------' . "\n", 3, 'log.txt');
			// error_log($out . "\n", 3, 'log.txt');
			// error_log('-----------------' . "\n", 3, 'log.txt');

			if ($result) {
				return array('result'=>true, 'data'=>$result, 'list'=>$list);
			} else {
				return array('result'=>false, 'reason'=>'指定された企業IDのデータは見つかりませんでした。');
			}

		} else {
			return array('result'=>false, 'list'=>$list);
		}
	}
}
