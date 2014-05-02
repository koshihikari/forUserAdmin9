<?php

class Library_Smartphone_DelDirectoryAction extends AppModel {
	public $useTable = 'smartphone_library_directories';

	/*
	 * ディレクトリ削除メソッド
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function delDirectory($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		if ($request->isPost()) {
			if (
				isset($request->data['id'])
			) {
				$this->begin();
				$is_correct = true;
				$is_correct = $this->_delDirectory($is_correct, $request);
				// error_log('4 = ' . $is_correct . "\n", 3, 'log.txt');
				if ($is_correct === true) {
					$this->commit();
					$json = array('result'=>true);

				} else {
					$this->rollback();
					$json = array('result'=>false, 'message'=>'ディレクトリ削除に失敗しました。');
				}
			}
		}
		return $json;
	}

	/*
	 * ディレクトリ削除メソッド
	 * @param	$is_correct		true===処理開始、false===処理せず終了
	 * @param	#request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _delDirectory($is_correct, $request) {
		if ($is_correct === true) {
			$smartphone_library_directories = ClassRegistry::init('smartphone_library_directories');
			$result = $smartphone_library_directories->find('first', array('conditions'=>array('id'=>$request->data['id'])));

			// ob_start();//ここから
			// var_dump($result);
			// $out=ob_get_contents();//ob_startから出力された内容をゲットする。
			// ob_end_clean();//ここまで
			// error_log('-----------------' . "\n", 3, 'log.txt');
			// error_log($out . "\n", 3, 'log.txt');
			// error_log('-----------------' . "\n", 3, 'log.txt');

			// 削除するレコードのorderより大きい値のレコードのorderを-1する
			$sql = 'UPDATE smartphone_library_directories SET `order` = `order` - 1 WHERE company_id = ' . $request->data['company_id'] . ' AND `order` > ' . $result['smartphone_library_directories']['order'];
			$result = $smartphone_library_directories->query($sql);

			// 削除したディレクトリに属するライブラリを削除する
			$smartphone_libraries = ClassRegistry::init('smartphone_libraries');
			$conditions = array(
				'smartphone_library_directory_id'			=> $request->data['id']
			);
			if (!$smartphone_libraries->deleteAll($conditions)) {
				return false;
			}

			// ob_start();//ここから
			// var_dump($result);
			// $out=ob_get_contents();//ob_startから出力された内容をゲットする。
			// ob_end_clean();//ここまで
			// error_log('-----------------' . "\n", 3, 'log.txt');
			// error_log($out . "\n", 3, 'log.txt');
			// error_log('-----------------' . "\n", 3, 'log.txt');

			if ($smartphone_library_directories->delete($request->data['id'])) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
}
