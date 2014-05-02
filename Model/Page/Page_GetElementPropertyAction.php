<?php

class Page_GetElementPropertyAction extends AppModel {
	public $useTable = 'smartphone_page_element_properties';
	
	/*
	 * スマホ用ページのエレメントデータを取得するメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function getElementProperty($request) {
		$options = array(
			'conditions'	=> array(
				'page_id'		=> $request->data['page_id']
			)
		);
		$result = $this->find('all', $options);
		for ($i=0, $len=count($result); $i<$len; $i++) {
			$result[$i]['smartphone_page_element_properties'] = $result[$i]['Page_GetElementPropertyAction'];
			unset($result[$i]['Page_GetElementPropertyAction']);
		}

		$this->bindModel(
			array(
				'belongsTo'		=> array(
					'smartphone_pages'			=> array(
						'foreignKey'	=> 'page_id'
					)
				)
			)
		);
		$options = array(
			'conditions'		=> array(
				'smartphone_pages.id'		=> $request->data['page_id']
			)
		);
		$result2 = $this->smartphone_pages->find('first', $options);
		$result2['smartphone_pages']['property'] = json_decode($result2['smartphone_pages']['property']);
		return array('elementProperty'=>$result, 'pageProperty'=>$result2['smartphone_pages']);
	}
}
