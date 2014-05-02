<?php

class Library_Page_GetMasterElementAction extends AppModel {
	public $useTable = 'mtr_smartphone_items';
	
	/*
	 * スマホ用ページのエレメントデータを取得するメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function getMasterElement() {
		$result = $this->_getLibraryElementData();
		$retData = array(
			'menuData'		=> $result['menuData'],
			'itemData'		=> $result['itemData']
		);
		$json = array('result'=>true, 'data'=>$retData);
		return $json;
	}

	/*
	 * メニューバーのデータ、各アイテムのデータを返すメソッド
	 * @param	void
	 * @return	boolean
	 */
	private function _getLibraryElementData() {
		$this->bindModel(
			array(
				'hasAndBelongsToMany'		=> array(
					'mtr_smartphone_components'			=> array(
						'joinTable'					=> 'mtr_smartphone_components_mtr_smartphone_items',
						'foreignKey'				=> 'mtr_smartphone_item_id',
						'associationForeignKey'		=> 'mtr_smartphone_component_id',
						'order'	=> array(
							'MtrSmartphoneComponentsMtrSmartphoneItem.order ASC'
						)
					)
				)
			)
		);
		$result = $this->find('all', array('order'=>array('Library_Page_GetMasterElementAction.order ASC')));


		$menuData = array();
		$itemData = array();
		for ($i=0, $len=count($result); $i<$len; $i++) {
			$index = (int)$result[$i]['Library_Page_GetMasterElementAction']['order'];
			if (0 < $index && $result[$i]['Library_Page_GetMasterElementAction']['default_source']) {
				$menuData[$index] = array(
					'label'				=> $result[$i]['Library_Page_GetMasterElementAction']['name'],
					'itemName'			=> $result[$i]['Library_Page_GetMasterElementAction']['item_name'],
					'itemType'			=> $result[$i]['Library_Page_GetMasterElementAction']['item_type'],
					'defaultSource'		=> $result[$i]['Library_Page_GetMasterElementAction']['default_source']
				);
			}


			$components = array();
			for ($j=0, $len2=count($result[$i]['mtr_smartphone_components']); $j<$len2; $j++) {
				$componentName = $result[$i]['mtr_smartphone_components'][$j]['component_name'];
				$components[$componentName] = json_decode($result[$i]['mtr_smartphone_components'][$j]['property']);
			}

			$itemName = $result[$i]['Library_Page_GetMasterElementAction']['item_name'];
			$itemData[$itemName] = array(
				'label'				=> $result[$i]['Library_Page_GetMasterElementAction']['name'],
				'itemType'			=> $result[$i]['Library_Page_GetMasterElementAction']['item_type'],
				'components'		=> $components,
				'defaultSource'		=> $result[$i]['Library_Page_GetMasterElementAction']['default_source']
			);

		}


		// $outlineData = array();
		// $actin = ClassRegistry::init('outlines');
		// $action->bindModel(
		// 	array(
		// 		'belongsTo'		=> array(
		// 			'mtr_statuses'			=> array(
		// 				'foreignKey'	=> 'mtr_status_id'
		// 			)
		// 		)
		// 	)
		// );
		// $data = array(
		// 	'conditions'	=> array(
		// 		'outlines.residence_id'		=> $residenceId
		// 	),
		// 	'order'			=> array(
		// 		'outlines.order'		=> $residenceId
		// 	)
		// );
		// $resut2 = $actin->find('all', $data);
		return array('menuData'=>$menuData, 'itemData'=>$itemData);
	}
}
