<?php

class Library_Smartphone_AddLibraryAction extends AppModel {
	public $useTable = 'smartphone_library_directories';

	/*
	 * ライブラリ追加メソッド
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function addLibrary($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		if ($request->isPost()) {
			if (
				isset($request->data['user_id']) &&
				isset($request->data['company_id'])
			) {
				$this->begin();
				$is_correct = true;
				$is_correct = $this->_addLibrary($is_correct, $request);
				// error_log('4 = ' . $is_correct . "\n", 3, 'log.txt');
				if ($is_correct === true) {
					$this->commit();
					$json = array('result'=>true);

				} else {
					$this->rollback();
					$json = array('result'=>false, 'message'=>'ライブラリ追加に失敗しました。');
				}
			}
		}
		return $json;
	}

	/*
	 * ライブラリ追加メソッド
	 * @param	$is_correct		true===処理開始、false===処理せず終了
	 * @param	#request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _addLibrary($is_correct, $request) {
		if ($is_correct === true) {
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

			$options = array(
				'conditions'	=> array(
					'smartphone_library_directory_id'=>$request->data['directory_id']
				)
			);
			$smartphone_libraries = ClassRegistry::init('smartphone_libraries');
			$count = $smartphone_libraries->find('count', $options);
			$createData = array(
				// 'device_num'			=> $request->data['device_num'],
				'smartphone_library_directory_id'			=> $request->data['directory_id'],
				'order'										=> $count + 1,
				'status_id'									=> 5,
				'title'										=> '新規共通パーツ('.date('Y-m-d H_i_s').')',
				'is_editable'								=> 1,
				'user_id'									=> $request->data['user_id'],
				'property'									=> json_encode($property)
			);
			if (is_array($smartphone_libraries->save($createData))) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
}
