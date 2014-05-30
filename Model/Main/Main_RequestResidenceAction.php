<?php

class Main_RequestResidenceAction extends Model {
	public $useTable = 'residences';

	/*
	 * 物件一覧データを取得するメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	オブジェクト
	 */
	public function requestResidence($request) {
		$residences = ClassRegistry::init('residences');
		if ($request->data['is_customer'] === '1') {
			$residences->bindModel(
				array(
					'hasMany'		=> array(
						'smartphone_pages'			=> array(
							'foreignKey'	=> 'residence_id',
							'conditions'	=> array(
								'is_show'	=> 1
							)
						),
						'featurephone_pages'		=> array(
							'foreignKey'	=> 'residence_id',
							'conditions'	=> array(
								'is_show'	=> 1
							)
						)
					)
				)
			);
		} else {
			$residences->bindModel(
				array(
					'hasMany'		=> array(
						'smartphone_pages'			=> array(
							'foreignKey'	=> 'residence_id'
						),
						'featurephone_pages'		=> array(
							'foreignKey'	=> 'residence_id'
						)
					)
				)
			);
		}
		$options = array(
			'conditions'		=> array(
				'company_id'			=> $request->data['company_id']
			),
			// 'conditions'		=> array(
			// 	'company_id'			=> $request->data['company_id'],
			// 	'is_company_site'		=> $request->data['is_company_site']
			// ),
			'order'				=> array(
				'order'
			)
		);
		// error_log('比較 =  ' . ($request->data['is_customer']) . "\n", 3, 'log.txt');
		// error_log('比較 =  ' . ($request->data['is_customer'] === '1') . "\n", 3, 'log.txt');
		// error_log('比較 =  ' . ($request->data['is_customer'] === 1) . "\n", 3, 'log.txt');
		// error_log('比較 =  ' . ($request->data['is_customer'] === true) . "\n", 3, 'log.txt');
		// error_log('比較 =  ' . ($request->data['is_customer'] === 'true') . "\n", 3, 'log.txt');
		if ($request->data['is_customer'] === '1') {
			$options['conditions']['is_show'] = '1';
		}
		// ob_start();//ここから
		// var_dump($options);
		// $out=ob_get_contents();//ob_startから出力された内容をゲットする。
		// ob_end_clean();//ここまで
		// error_log('-----------------' . "\n", 3, 'log.txt');
		// error_log($out . "\n", 3, 'log.txt');
		// error_log('-----------------' . "\n", 3, 'log.txt');
		$result = $residences->find('all', $options);

		for ($i=0, $len=count($result); $i<$len; $i++) {
			$result[$i]['residences']['path'] = $result[$i]['residences']['path'] ? $result[$i]['residences']['path'] : '';
			$result[$i]['residences']['smartphone_page_count'] = count($result[$i]['smartphone_pages']);
			$result[$i]['residences']['featurephone_page_count'] = count($result[$i]['featurephone_pages']);
			unset($result[$i]['smartphone_pages'], $result[$i]['featurephone_pages']);
		}

		return array('result'=>true, 'data'=>$result);
	}
}
