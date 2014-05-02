<?php

class Smartphone_GetLibraryInfoBehavior extends ModelBehavior {

	/*
	 * ページエレメントの並び順を更新するメソッド
	 * @param	$model				Model
	 * @param	$is_correct			true===処理開始、false===処理せず終了
	 * @param	$is_library			true===smartphone_librariesを更新、false===smartphone_pagesを更新
	 * @param	$library_page_id	ライブラリ/ページID
	 * @param	$user_id			ユーザID
	 * @return	boolean
	 */
	public function getLibraryInfo(Model $model, $companyId) {
		$result = $this->_getLibraryInfo($companyId);
		return $result;
	}

	private function _getLibraryInfo($companyId) {
		$smartphone_library_directories = ClassRegistry::init('smartphone_library_directories');
		$smartphone_library_directories->bindModel(
			array(
				'hasMany'		=> array(
					'smartphone_libraries'			=> array(
						'foreignKey'	=> 'smartphone_library_directory_id',
						'fields'		=> array('id', 'title', 'order', 'user_id', 'modified'),
						'order'			=> array(
							'order ASC'
						)
					)
				)
			),
			false
		);
		$smartphone_library_directories->smartphone_libraries->bindModel(
			array(
				'belongsTo'		=> array(
					'users'			=> array(
						'foreignKey'	=> 'user_id'
					),
					'mtr_statuses'			=> array(
						'foreignKey'	=> 'status_id'
					)
				)
			),
			false
		);
		$options = array(
			'conditions'	=> array(
				'smartphone_library_directories.company_id'=>$companyId
			),
			'fields'		=> array(
				'id', 'name', 'order'
			),
			'order'			=> array(
				'order ASC'
			),
			'recursive'		=> 2
		);
		$result = $smartphone_library_directories->find('all', $options);

		// ob_start();//ここから
		// var_dump($result);
		// $out=ob_get_contents();//ob_startから出力された内容をゲットする。
		// ob_end_clean();//ここまで
		// error_log('-----------------' . "\n", 3, 'log.txt');
		// error_log($out . "\n", 3, 'log.txt');
		// error_log('-----------------' . "\n", 3, 'log.txt');

		if (0 < count($result)) {
			$isSorted = false;
			for ($i=0,$len=count($result); $i<$len; $i++) {
				// for ($j=0,$len2=count($result[$i]['smartphone_library_directories']); $j<$len2; $j++) {
					if ((int) $result[$i]['smartphone_library_directories']['order'] !== ($i + 1)) {
						$data = array(
							'id'		=> $result[$i]['smartphone_library_directories']['id'],
							'order'		=> ($i + 1)
						);
						if (!is_array($smartphone_library_directories->save($data))) {
							return false;
						}
						$isSorted = true;
					}
				// }
				for ($j=0,$len2=count($result[$i]['smartphone_libraries']); $j<$len2; $j++) {
					if ((int) $result[$i]['smartphone_libraries'][$j]['order'] !== ($j + 1)) {
						$data = array(
							'id'		=> $result[$i]['smartphone_libraries'][$j]['id'],
							'order'		=> ($j + 1)
						);
						if (!is_array($smartphone_library_directories->smartphone_libraries->save($data))) {
							return false;
						}
						$isSorted = true;
					}
				}
			}

			if ($isSorted === true) {
				$result = $smartphone_library_directories->find('all', $options);
			}
			for ($i=0,$len=count($result); $i<$len; $i++) {
				for ($j=0,$len2=count($result[$i]['smartphone_libraries']); $j<$len2; $j++) {
					$edited = $result[$i]['smartphone_libraries'][$j]['modified'];

					// // 取得したデータの編集日時を整形する
					$result[$i]['smartphone_libraries'][$j]['edited'] = $edited === '0000-00-00 00:00:00' ? '' : date("Y/m/d H:i:s",strtotime($edited) + 9 * 60 * 60);

					// // 編集ユーザ名を代入する
					$result[$i]['smartphone_libraries'][$j]['edited_user_name'] = $result[$i]['smartphone_libraries'][$j]['users']['name'];
				}
			}

			// ob_start();//ここから
			// var_dump($result);
			// $out=ob_get_contents();//ob_startから出力された内容をゲットする。
			// ob_end_clean();//ここまで
			// error_log('-----------------' . "\n", 3, 'log.txt');
			// error_log($out . "\n", 3, 'log.txt');
			// error_log('-----------------' . "\n", 3, 'log.txt');

		} else {
			// $residences = ClassRegistry::init('residences');
			// $residences->bindModel(
			// 	array(
			// 		'hasMany'		=> array(
			// 			'smartphone_libraries'			=> array(
			// 				'foreignKey'	=> 'residence_id',
			// 				'order'			=> array(
			// 					'order ASC'
			// 				)
			// 			)
			// 		)
			// 	),
			// 	false
			// );
			// $residences->smartphone_libraries->bindModel(
			// 	array(
			// 		'belongsTo'		=> array(
			// 			'users'			=> array(
			// 				'foreignKey'	=> 'user_id'
			// 			),
			// 			'mtr_statuses'			=> array(
			// 				'foreignKey'	=> 'status_id'
			// 			)
			// 		)
			// 	),
			// 	false
			// );
			// $options = array(
			// 	'conditions'	=> array(
			// 		'residences.company_id'=>$companyId
			// 	),
			// 	'fields'		=> array(
			// 		'id', 'name', 'order'
			// 	),
			// 	'order'			=> array(
			// 		'order ASC'
			// 	),
			// 	'recursive'		=> 2
			// );
			// $result = $residences->find('all', $options);
			// ob_start();//ここから
			// var_dump($result);
			// $out=ob_get_contents();//ob_startから出力された内容をゲットする。
			// ob_end_clean();//ここまで
			// error_log('-----------------' . "\n", 3, 'log.txt');
			// error_log($out . "\n", 3, 'log.txt');
			// error_log('-----------------' . "\n", 3, 'log.txt');
		}


		return $result;
	}
}
?>