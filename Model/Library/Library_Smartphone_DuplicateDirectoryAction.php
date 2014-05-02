<?php

class Library_Smartphone_DuplicateDirectoryAction extends AppModel {
	public $useTable = 'smartphone_libraries';
	public $actsAs = array('Smartphone_DuplicateDirectoryLibrary');

	/*
	 * ライブラリを複製するメソッド
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function duplicateDirectory($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');
		if ($request->isPost()) {
			if (
				isset($request->data['user_id']) &&
				isset($request->data['company_id']) &&
				isset($request->data['directory_id'])
			) {
				$this->begin();
				$isCorrect = $this->duplicateDirectoryAction($request->data['directory_id'], $request->data['user_id']);
				// error_log('4 = ' . $is_correct . "\n", 3, 'log.txt');
				if ($isCorrect === true) {
					$this->commit();
					$json = array('result'=>true);

				} else {
					$this->rollback();
					$json = array('result'=>false, 'message'=>'ディレクトリの複製に失敗しました。');
				}
			}
		}
		return $json;
	}
}
