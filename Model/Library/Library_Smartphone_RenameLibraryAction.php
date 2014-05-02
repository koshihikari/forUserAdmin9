<?php

class Library_Smartphone_RenameLibraryAction extends AppModel {
	public $useTable = 'smartphone_libraries';

	/*
	 * ライブラリ名変更メソッド
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function renameLibrary($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		if ($request->isPost()) {
			if (
				isset($request->data['id']) &&
				isset($request->data['title'])
			) {
				$this->begin();
				$is_correct = true;
				$is_correct = $this->_renameLibrary($is_correct, $request);
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
	 * ライブラリ名変更メソッド
	 * @param	$is_correct		true===処理開始、false===処理せず終了
	 * @param	#request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _renameLibrary($is_correct, $request) {
		if ($is_correct === true) {
			$data = array(
				'id'		=> $request->data['id'],
				'title'		=> $request->data['title']
			);
			if (ClassRegistry::init('smartphone_libraries')->save($data)) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
}
