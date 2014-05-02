<?php

class Library_Smartphone_AddDirectoryAction extends AppModel {
	public $useTable = 'smartphone_library_directories';

	/*
	 * ディレクトリ追加メソッド
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function addDirectory($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		if ($request->isPost()) {
			if (
				isset($request->data['user_id']) &&
				isset($request->data['company_id'])
			) {
				$this->begin();
				$is_correct = true;
				$is_correct = $this->_addDirectory($is_correct, $request);
				// error_log('4 = ' . $is_correct . "\n", 3, 'log.txt');
				if ($is_correct === true) {
					$this->commit();
					$json = array('result'=>true);

				} else {
					$this->rollback();
					$json = array('result'=>false, 'message'=>'ディレクトリ追加に失敗しました。');
				}
			}
		}
		return $json;
	}

	/*
	 * ディレクトリ追加メソッド
	 * @param	$is_correct		true===処理開始、false===処理せず終了
	 * @param	#request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _addDirectory($is_correct, $request) {
		if ($is_correct === true) {
			$smartphone_library_directories = ClassRegistry::init('smartphone_library_directories');
			$options = array(
				'conditions'	=> array(
					'company_id'=>$request->data['company_id']
				)
			);
			$count = $smartphone_library_directories->find('count', $options);

			$createData = array(
				'user_id'				=> $request->data['user_id'],
				'name'					=> '新規フォルダ('.date('Y-m-d H_i_s').')',
				'order'					=> $count + 1,
				'company_id'			=> $request->data['company_id']
			);
			$smartphone_library_directories->create();
			if (is_array($smartphone_library_directories->save($createData))) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
}
