<?php

class Library_GetElementPropertyAction extends AppModel {
	public $useTable = 'smartphone_library_element_properties';
	
	/*
	 * スマホ用ページのエレメントデータを取得するメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function getElementProperty($request) {
		$options = array(
			'conditions'	=> array(
				'smartphone_library_id'		=> $request->data['smartphone_library_id']
			)
		);
		$result = $this->find('all', $options);
		for ($i=0, $len=count($result); $i<$len; $i++) {
			$result[$i]['smartphone_library_element_properties'] = $result[$i]['Library_GetElementPropertyAction'];
			unset($result[$i]['Library_GetElementPropertyAction']);
		}

		$this->bindModel(
			array(
				'belongsTo'		=> array(
					'smartphone_libraries'			=> array(
						'foreignKey'	=> 'smartphone_library_id'
					)
				)
			)
		);
		$options = array(
			'conditions'		=> array(
				'smartphone_libraries.id'		=> $request->data['smartphone_library_id']
			)
		);
		$result2 = $this->smartphone_libraries->find('first', $options);
		$result2['smartphone_libraries']['property'] = json_decode($result2['smartphone_libraries']['property']);
		// $result1['smartphone_pages'] = $result2;
		return array('elementProperty'=>$result, 'libraryProperty'=>$result2['smartphone_libraries']);
		// return $result;
	}
}
