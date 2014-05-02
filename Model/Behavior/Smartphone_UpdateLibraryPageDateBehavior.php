<?php

class Smartphone_UpdateLibraryPageDateBehavior extends ModelBehavior {

	/*
	 * smartphone_librariesもしくは、smartphone_pagesを更新するメソッド
	 * @param	$model				Model
	 * @param	$is_correct			true===処理開始、false===処理せず終了
	 * @param	$is_library			true===smartphone_librariesを更新、false===smartphone_pagesを更新
	 * @param	$library_page_id	ライブラリ/ページID
	 * @param	$user_id			ユーザID
	 * @return	boolean
	 */
	public function updateLibraryPageDate(Model $model, $is_correct, $is_library, $library_page_id, $user_id) {
		// error_log("\n", 3, 'log.txt');
		// error_log("Smartphone_UpdateLibraryPageDateBehavior :: updateLibraryPageDate\n", 3, 'log.txt');
		if ($is_correct === true) {
			if ($is_library === true) {
				$action = ClassRegistry::init('smartphone_libraries');
				$data = array(
					'id'		=> $library_page_id,
					'user_id'	=> $user_id
				);
				if (is_array($action->save($data)) === true) {
					return $this->_refreshRelationTable($library_page_id, $user_id);
				} else {
					return false;
				}
			} else {
				$action = ClassRegistry::init('smartphone_pages');
				$data = array(
					'id'				=> $library_page_id,
					'user_id'			=> $user_id,
					'edited'			=> date('c'),
					'edited_user_id'	=> $user_id
				);
				// $data['edited'] = date('c');
				// $data['edited_user_id'] = $user_id;
				return is_array($action->save($data));
			}
			// error_log('id = ' . $data['id'] . "\n", 3, 'log.txt');
			// error_log('user_id = ' . $data['user_id'] . "\n", 3, 'log.txt');
			// return is_array($action->save($data));
		} else {
			return false;
		}
	}

	private function _refreshRelationTable($id, $userId) {
		$smartphone_libraries = ClassRegistry::init('smartphone_libraries');
		$smartphone_libraries->bindModel(
			array(
				'hasMany'		=> array(
					'smartphone_page_elements'			=> array(
						'foreignKey'	=> 'smartphone_library_id',
						'fields'		=> array(
							'smartphone_page_elements.id', 'smartphone_page_elements.page_id'
						),
						'group'			=> array(
							'smartphone_page_elements.page_id'
						)
					)
				)
			)
		);
		// $smartphone_page_elements = ClassRegistry::init('smartphone_page_elements');
		// $smartphone_page_elements->bindModel(
		// 	array(
		// 		'belongsTo'		=> array(
		// 			'smartphone_pages'			=> array(
		// 				'foreignKey'	=> 'page_id'
		// 				,
		// 				'fields'		=> array(
		// 					'smartphone_pages.id', 'smartphone_pages.residence_id'
		// 				)
		// 			)
		// 		)
		// 	)
		// );
		$options = array(
			'conditions'	=> array(
				'smartphone_libraries.id'=>$id
			)
			// ,
			// 'recursive'		=> 2
		);

		$result = $smartphone_libraries->find('first', $options);

		// ob_start();//ここから
		// var_dump($result);
		// $out=ob_get_contents();//ob_startから出力された内容をゲットする。
		// ob_end_clean();//ここまで
		// error_log('-----------------' . "\n", 3, 'log.txt');
		// error_log($out . "\n", 3, 'log.txt');
		// error_log('-----------------' . "\n", 3, 'log.txt');


		$targetPageIdArr = array();
		for ($i=0,$len=count($result['smartphone_page_elements']); $i<$len; $i++) {
			array_push($targetPageIdArr, $result['smartphone_page_elements'][$i]['page_id']);
			// array_push($targetPageIdArr, $result['smartphone_page_elements'][$i]['smartphone_pages']['id']);
		}
		error_log('-----------------' . "\n", 3, 'log.txt');
		for ($i=0,$len=count($targetPageIdArr); $i<$len; $i++) {
			error_log($targetPageIdArr[$i] . "\n", 3, 'log.txt');
		}
		error_log('-----------------' . "\n", 3, 'log.txt');

		$action = ClassRegistry::init('smartphone_pages');
		$conditions = array(
			'smartphone_pages.id'		=> $targetPageIdArr
		);
		$data = array(
			'user_id'			=> $userId,
			'edited'			=> '"' . date('c') . '"',
			'edited_user_id'	=> $userId
		);
		// $result = $action->updateAll($data, $conditions);
		// error_log('$result = ' . $result . "\n", 3, 'log.txt');
		// error_log('is_array($result) = ' . (is_array($result) === true) . "\n", 3, 'log.txt');
		// error_log('$result === true = ' . ($result === true) . "\n", 3, 'log.txt');

		// return false;
		return $action->updateAll($data, $conditions);
		/*
		*/

	}
}
?>