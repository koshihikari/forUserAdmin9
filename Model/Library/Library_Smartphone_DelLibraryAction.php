<?php

class Library_Smartphone_DelLibraryAction extends AppModel {
	public $useTable = 'smartphone_libraries';

	/*
	 * ライブラリ削除メソッド
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function delLibrary($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		if ($request->isPost()) {
			if (
				isset($request->data['id'])
			) {
				$this->begin();
				$is_correct = true;
				$is_correct = $this->_delLibrary($is_correct, $request);
				// error_log('4 = ' . $is_correct . "\n", 3, 'log.txt');
				if ($is_correct === true) {
					$this->commit();
					$json = array('result'=>true);

				} else {
					$this->rollback();
					$json = array('result'=>false, 'message'=>'ライブラリ削除に失敗しました。');
				}
			}
		}
		return $json;
	}

	/*
	 * ライブラリ削除メソッド
	 * @param	$is_correct		true===処理開始、false===処理せず終了
	 * @param	#request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _delLibrary($is_correct, $request) {
		if ($is_correct === true) {
			$smartphone_libraries = ClassRegistry::init('smartphone_libraries');
			$result = $smartphone_libraries->find('first', array('conditions'=>array('id'=>$request->data['id'])));

			// ob_start();//ここから
			// var_dump($result);
			// $out=ob_get_contents();//ob_startから出力された内容をゲットする。
			// ob_end_clean();//ここまで
			// error_log('-----------------' . "\n", 3, 'log.txt');
			// error_log($out . "\n", 3, 'log.txt');
			// error_log('-----------------' . "\n", 3, 'log.txt');

			// 削除するレコードのorderより大きい値のレコードのorderを-1する
			$sql = 'UPDATE smartphone_libraries SET `order` = `order` - 1 WHERE smartphone_library_directory_id = ' . $request->data['directory_id'] . ' AND `order` > ' . $result['smartphone_libraries']['order'];
			$result = $smartphone_libraries->query($sql);

			// ob_start();//ここから
			// var_dump($result);
			// $out=ob_get_contents();//ob_startから出力された内容をゲットする。
			// ob_end_clean();//ここまで
			// error_log('-----------------' . "\n", 3, 'log.txt');
			// error_log($out . "\n", 3, 'log.txt');
			// error_log('-----------------' . "\n", 3, 'log.txt');

			if ($smartphone_libraries->delete($request->data['id'])) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
}
