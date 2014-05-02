<?php

class Library_Smartphone_GetElementListAction extends AppModel {
	public $useTable = 'smartphone_library_elements';
	// public $actsAs = array('FixecForSmartphoneElements');
	public $actsAs = array(
		'FixecForSmartphoneElements'
		,'Smartphone_GetElements'
	);
	
	/*
	 * スマホ用ページのエレメントデータを取得するメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function getElementList($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		if ($request->isPost()) {
			if (
				isset($request->data['smartphone_library_id'])
			) {
				$elementData = $this->getElements(true, $request->data['smartphone_library_id']);
				$data = $this->fixed($elementData);
				if ($data['result'] === true) {
					$retData = array(
						'elementData'		=> $data['data']
					);
					$json = array('result'=>true, 'data'=>$retData);
				} else {
					$json = array('result'=>false, 'message'=>'並び順の更新に失敗しました');
				}

				/*
				$element_data = $this->_getLibraryElementData($request);
				$data = $this->fixed($element_data);
				if ($data['result'] === true) {
					$ret_data = array(
						'elementData'		=> $data['data']
					);
					$json = array('result'=>true, 'data'=>$ret_data);
				} else {
					$json = array('result'=>false, 'message'=>'並び順の更新に失敗しました');
				}
				*/
			}
		}
		return $json;
	}

	/*
	 * 指定されたライブラリIDのライブラリエレメントデータを返すメソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	request			ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _DEL_getLibraryElementData($request) {
		$options = array(
			'conditions'	=> array(
				'smartphone_library_elements.smartphone_library_id'=>$request->data['smartphone_library_id'],
				'smartphone_library_elements.item_name !='=>'Library'
			),
			'order'			=> array(
				'smartphone_library_elements.order ASC'
			)
		);
		$result = ClassRegistry::init('smartphone_library_elements')->find('all', $options);
		$ret_obj = array();
		for ($i=0, $len=count($result); $i<$len; $i++) {
			$element_id = $result[$i]['smartphone_library_elements']['element_id'];
			$parent_id = $result[$i]['smartphone_library_elements']['parent_id'];
			/*
			if ($result[$i]['smartphone_library_elements']['item_name'] === 'Td') {
				$tmp_arr = explode('_', $element_id);
				// $parentId = $tmpArr[0];
			}
			*/
			$ret_obj[$element_id] = array(
				'smartphonePageElementId'			=> 0,
				'smartphoneLibraryElementId'		=> (int)$result[$i]['smartphone_library_elements']['id'],
				'smartphoneLibraryId'				=> (int)$result[$i]['smartphone_library_elements']['smartphone_library_id'],
				'order'								=> (int)$result[$i]['smartphone_library_elements']['order'],
				'parentId'							=> $parent_id,
				'itemName'							=> $result[$i]['smartphone_library_elements']['item_name'],
				'isLibrary'							=> true,
				'property'							=> json_decode($result[$i]['smartphone_library_elements']['property'])
			);
		}


		$options = array(
			'conditions'	=> array(
				'smartphone_libraries.id'=>$request->data['smartphone_library_id']
			)
		);
		$result3 = ClassRegistry::init('smartphone_libraries')->find('first', $options);
		$ret_obj['displayArea'] = array(
			'smartphonePageElementId'			=> 0,
			'smartphoneLibraryElements'			=> 0,
			'smartphoneLibraryId'				=> 0,
			'order'								=> 0,
			'parentId'							=> '',
			'itemName'							=> '',
			'isLibrary'							=> false,
			'property'							=> json_decode($result3['smartphone_libraries']['property'])
		);

		// if (!isset($ret_obj['displayArea']['property']['Bg']) {
		// 	$ret_obj['displayArea']['property']['Bg'] = array(

		// 	);
		// }

		return $ret_obj;
	}

	// private function getDefaultProperty($component_name) {
	// 	$options = array(
	// 		'component_name'	=> $component_name
	// 	);
	// 	$result = ClassRegistry::init('mtr_smartphone_components')->find('first', $options);
	// 	$ret_obj = array();
	// 	$ret_obj[$component_name] = $result['mtr_smartphone_components'][$component_name];

	// 	return $ret_obj;
	// }
}
