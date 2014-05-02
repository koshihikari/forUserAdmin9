<?php

class Smartphone_GetElementsBehavior extends ModelBehavior {

	/*
	 * ページエレメントの並び順を更新するメソッド
	 * @param	$model				Model
	 * @param	$is_library			true===smartphone_librariesを更新、false===smartphone_pagesを更新
	 * @param	$library_page_id	ライブラリ/ページID
	 * @return	boolean
	 */
	public function getElements(Model $model, $is_library, $library_page_id) {
		if ($is_library === true) {
			$result = $this->_getLibraryElementData($library_page_id);
		} else {
			$result = $this->_getPageElementData($library_page_id);
		}
		return $result;
	}

	/*
	 * 指定されたページIDのページエレメントデータを返すメソッド
	 * @param	$page_id		ページID
	 * @return	ページエレメントデータ
	 */
	private function _getPageElementData($page_id) {
		$options = array(
			'conditions'	=> array(
				'smartphone_page_elements.page_id'=>$page_id
			),
			'order'			=> array(
				'smartphone_page_elements.order ASC'
			)
		);
		$result = ClassRegistry::init('smartphone_page_elements')->find('all', $options);
		$retObj = array();
		$libraryIdObj = array();
		$libraryIdIndexArray = array();
		for ($i=0, $len=count($result); $i<$len; $i++) {
			$elementId = $result[$i]['smartphone_page_elements']['element_id'];
			$retObj[$elementId] = array(
				'smartphonePageElementId'			=> (int)$result[$i]['smartphone_page_elements']['id'],
				'smartphoneLibraryElementId'		=> 0,
				'smartphoneLibraryId'				=> (int)$result[$i]['smartphone_page_elements']['smartphone_library_id'],
				'order'								=> (int)$result[$i]['smartphone_page_elements']['order'],
				'parentId'							=> $result[$i]['smartphone_page_elements']['parent_id'],
				'itemName'							=> $result[$i]['smartphone_page_elements']['item_name'],
				'isLibrary'							=> (int)$result[$i]['smartphone_page_elements']['smartphone_library_id'] === 0 ? false : true,
				'property'							=> json_decode($result[$i]['smartphone_page_elements']['property'])
			);
			// error_log('--------------' . "\n", 3, 'log.txt');
			// error_log('	' . $result[$i]['smartphone_page_elements']['item_name'] . "\n", 3, 'log.txt');
			// error_log('--------------' . "\n", 3, 'log.txt');

			if ($result[$i]['smartphone_page_elements']['item_name'] === 'Library') {
				array_push($libraryIdObj, $result[$i]['smartphone_page_elements']['smartphone_library_id']);
				array_push($libraryIdIndexArray, $elementId);
			}
		}

		// error_log('--------------' . "\n", 3, 'log.txt');
		for ($i=0, $len=count($libraryIdObj); $i<$len; $i++) {
			$options = array(
				'conditions'	=> array(
					'smartphone_library_elements.smartphone_library_id'	=> $libraryIdObj[$i]
				),
				'order'			=> array(
					'smartphone_library_elements.order ASC'
				)
			);
			$result2 = ClassRegistry::init('smartphone_library_elements')->find('all', $options);
			// $microSec = ceil(microtime()*1000);
			// $microSec = 580;
			$microSec = ceil(microtime()*1000) . mt_rand();
			// $element_id_map = array();
			// $microSec = microtime(true)*10000 . mt_rand();
			for ($j=0, $len2=count($result2); $j<$len2; $j++) {
				// error_log('$result2[' . $j . '][smartphone_library_elements][id] = ' . $result2[$j]['smartphone_library_elements']['id'] . "\n", 3, 'log.txt');
				$parentId = $result2[$j]['smartphone_library_elements']['parent_id'];
				$elementId = $result2[$j]['smartphone_library_elements']['element_id'] . '_' . $microSec;
				if ($result2[$j]['smartphone_library_elements']['parent_id'] === 'spContent') {
					$parentId = $libraryIdIndexArray[$i];
					// $element_id_map['spContnte'] = $libraryIdIndexArray[$i];
				} else if (
					$result2[$j]['smartphone_library_elements']['parent_id'] === ''
					&&
					$result2[$j]['smartphone_library_elements']['item_name'] === 'Td'
				) {
					$pieces = explode('_', $result2[$j]['smartphone_library_elements']['element_id']);
					$parentId = $pieces[0] . '_' . $microSec;
					$elementId = $pieces[0] . '_' . $microSec . '_' . $pieces[1];
					// $element_id_map[$result2[$j]['smartphone_library_elements']['element_id']] = $elementId;
				} else {
					// $parentId = $element_id_map[$parentId];
					if (strpos($parentId, '_') !== false) {
						$pieces = explode('_', $parentId);
						$parentId = $pieces[0] . '_' . $microSec . '_' . $pieces[1];
					}
				}
				// $elementId = $result2[$j]['smartphone_library_elements']['element_id'] . '_' . $j;
				// $elementId = $result2[$j]['smartphone_library_elements']['element_id'] . '_' . $microSec;
				$retObj[$elementId] = array(
					'smartphonePageElementId'			=> 0,
					'smartphoneLibraryElementId'		=> (int)$result2[$j]['smartphone_library_elements']['id'],
					'smartphoneLibraryId'				=> (int)$result2[$j]['smartphone_library_elements']['smartphone_library_id'],
					'order'								=> (int)$result2[$j]['smartphone_library_elements']['order'],
					'parentId'							=> $parentId,
					'itemName'							=> $result2[$j]['smartphone_library_elements']['item_name'],
					'isLibrary'							=> true,
					'property'							=> json_decode($result2[$j]['smartphone_library_elements']['property'])
				);
			}
			// error_log("\n", 3, 'log.txt');
		}

		$options = array(
			'conditions'	=> array(
				'smartphone_pages.id'=>$page_id
			)
		);
		$result3 = ClassRegistry::init('smartphone_pages')->find('first', $options);
		$retObj['displayArea'] = array(
			'smartphonePageElementId'			=> 0,
			'smartphoneLibraryElements'			=> 0,
			'smartphoneLibraryId'				=> 0,
			'order'								=> 0,
			'parentId'							=> '',
			'itemName'							=> '',
			'isLibrary'							=> false,
			'property'							=> json_decode($result3['smartphone_pages']['property'])
		);
		// error_log("---------------------------\n", 3, 'log.txt');
		// foreach ($retObj as $elementId => $val) {
		// 	error_log($elementId . "\n", 3, 'log.txt');
		// }
		// error_log("---------------------------\n", 3, 'log.txt');

		return $retObj;
	}

	/*
	 * 指定されたライブラリIDのライブラリエレメントデータを返すメソッド
	 * @param	$library_id		ライブラリID
	 * @return	ライブラリエレメントデータ
	 */
	private function _getLibraryElementData($library_id) {
		$options = array(
			'conditions'	=> array(
				'smartphone_library_elements.smartphone_library_id'=>$library_id,
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
				'smartphone_libraries.id'=>$library_id
			)
		);
		$result3 = ClassRegistry::init('smartphone_libraries')->find('first', $options);

		// ライブラリのプロパティが空の場合、デフォルトプロパティを強制的に記載
		if ($result3['smartphone_libraries']['property'] === '') {
			$options = array(
				'conditions'	=> array(
					'component_name'	=> array('Bg', 'Space')
				)
			);
			$result = ClassRegistry::init('mtr_smartphone_components')->find('all', $options);
			$property = array();
			for ($i=0,$len=count($result); $i<$len; $i++) {
				$property[$result[$i]['mtr_smartphone_components']['component_name']] = json_decode($result[$i]['mtr_smartphone_components']['property']);
			}
			$result3['smartphone_libraries']['property'] = json_encode($property);
		}

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

		return $ret_obj;
	}
}
?>