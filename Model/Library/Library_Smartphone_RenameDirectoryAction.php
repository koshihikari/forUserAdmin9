<?php

class Library_Smartphone_RenameDirectoryAction extends AppModel {
	public $useTable = 'smartphone_library_directories';

	/*
	 * ディレクトリ名変更メソッド
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function renameDirectory($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		if ($request->isPost()) {
			if (
				isset($request->data['id']) &&
				isset($request->data['name'])
			) {
				$this->begin();
				$is_correct = true;
				$is_correct = $this->_renameDirectory($is_correct, $request);
				// error_log('4 = ' . $is_correct . "\n", 3, 'log.txt');
				if ($is_correct === true) {
					$this->commit();
					$json = array('result'=>true);

				} else {
					$this->rollback();
					$json = array('result'=>false, 'message'=>'ディレクトリ名の変更に失敗しました。');
				}
			}
		}
		return $json;
	}

	/*
	 * ディレクトリ名変更メソッド
	 * @param	$is_correct		true===処理開始、false===処理せず終了
	 * @param	#request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _renameDirectory($is_correct, $request) {
		if ($is_correct === true) {
			$data = array(
				'id'		=> $request->data['id'],
				'name'		=> $request->data['name']
			);
			if (ClassRegistry::init('smartphone_library_directories')->save($data)) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
}
