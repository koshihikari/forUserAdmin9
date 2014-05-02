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
