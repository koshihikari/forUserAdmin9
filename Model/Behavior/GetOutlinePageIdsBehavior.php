<?php

class GetOutlinePageIdsBehavior extends ModelBehavior {

	/*
	 * 物件概要パーツが含まれるページIDを返すメソッド
	 * @param	$model				Model
	 * @param	$residenceIds		物件ID配列(この配列に指定されている物件IDのページから物件概要パーツが含まれるページIDを返す)
	 * @return	物件概要パーツが含まれるページID配列
	 */
	public function getOutlinePageIdsForSp(Model $model, $residenceIds) {
		// smartphone_pageの物件IDが$residenceIdsで、smartphone_page_elementsのitem_nameがAboutかLibrary、smartphone_librariesのitem_nameがAboutのレコードを取得
		$smartphone_pages = ClassRegistry::init('smartphone_pages');
		$smartphone_pages->bindModel(
			array(
				'hasMany'		=> array(
					'smartphone_page_elements'			=> array(
						'foreignKey'	=> 'page_id',
						'conditions'	=> array(
							'item_name'		=> array('About', 'Library')
						),
						'fields'		=> array('id', 'page_id', 'item_name'),
						'order'			=> array(
							'order ASC'
						)
					)
				)
			),
			false
		);
		$smartphone_pages->smartphone_page_elements->bindModel(
			array(
				'belongsTo'		=> array(
					'smartphone_libraries'			=> array(
						'foreignKey'	=> 'smartphone_library_id',
						'fields'		=> array('id', 'page_id', 'smartphone_library_id', 'item_name'),
						'order'			=> array(
							'order ASC'
						)
					)
				)
			),
			false
		);
		$smartphone_pages->smartphone_page_elements->smartphone_libraries->bindModel(
			array(
				'belongsTo'		=> array(
					'smartphone_library_elements'			=> array(
						'foreignKey'	=> 'smartphone_library_id',
						'conditions'	=> array(
							'smartphone_libraries.item_name'		=> 'About'
						),
						'fields'		=> array('id'),
						'order'			=> array(
							'order ASC'
						)
					)
				)
			),
			false
		);

		$options = array(
			'conditions'	=> array(
				'smartphone_pages.residence_id'=>$residenceIds
			),
			'fields'		=> array('id', 'residence_id'),
			'order'			=> array(
				'smartphone_pages.order ASC'
			),
			'recursive'		=> 2
		);
		$result = $smartphone_pages->find('all', $options);


		// 取得したデータから、smartphone_page_elementsのitem_nameがAoutもしくは、smartphone_page_elementsのitem_nameがAboutでsmartphone_librariesのitem_nameがAboutのレコードのpage_idとresidence_idを抽出する
		$outlinePageIds = array();
		$outlinePageInfo = array();
		for ($i=0,$len=count($result); $i<$len; $i++) {
			for ($j=0,$len2=count($result[$i]['smartphone_page_elements']); $j<$len2; $j++) {
				if ($result[$i]['smartphone_page_elements'][$j]['item_name'] === 'About') {
					// array_push($outlinePageIds, $result[$i]['smartphone_pages']['id']);
					array_push($outlinePageInfo, array('residenceId'=>$result[$i]['smartphone_pages']['residence_id'], 'pageId'=>$result[$i]['smartphone_pages']['id'], 'deviceType'=>'sp'));
					break;
				} else {
					for ($k=0,$len3=count($result[$i]['smartphone_page_elements'][$j]['smartphone_libraries']); $k<$len3; $k++) {
						if ($result[$i]['smartphone_page_elements'][$j]['smartphone_libraries'][$k]['item_name'] === 'About') {
							// array_push($outlinePageIds, $result[$i]['smartphone_pages']['id']);
							array_push($outlinePageInfo, array('residenceId'=>$result[$i]['smartphone_pages']['residence_id'], 'pageId'=>$result[$i]['smartphone_pages']['id'], 'deviceType'=>'sp'));
							break;
						}
					}
				}
			}
		}

		/*
		ob_start();//ここから
		var_dump($result);
		$out=ob_get_contents();//ob_startから出力された内容をゲットする。
		ob_end_clean();//ここまで
		error_log('-----------------' . "\n", 3, 'log.txt');
		error_log($out . "\n", 3, 'log.txt');
		error_log('-----------------' . "\n", 3, 'log.txt');
		error_log("\n\n\n", 3, 'log.txt');
		ob_start();//ここから
		var_dump($outlinePageInfo);
		$out=ob_get_contents();//ob_startから出力された内容をゲットする。
		ob_end_clean();//ここまで
		error_log('-----------------' . "\n", 3, 'log.txt');
		error_log($out . "\n", 3, 'log.txt');
		error_log('-----------------' . "\n", 3, 'log.txt');
		*/

		return $outlinePageInfo;
	}
}
?>