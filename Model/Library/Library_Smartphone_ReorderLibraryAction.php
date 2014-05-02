<?php

class Library_Smartphone_ReorderLibraryAction extends AppModel {
	public $useTable = 'smartphone_libraries';

	/*
	 * ライブラリ並び替えメソッド
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function reorderLibrary($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		if ($request->isPost()) {
			if (
				isset($request->data['id'])
			) {
				$this->begin();
				$is_correct = true;
				$is_correct = $this->_reorderLibrary($is_correct, $request);
				// error_log('4 = ' . $is_correct . "\n", 3, 'log.txt');
				if ($is_correct === true) {
					$this->commit();
					$json = array('result'=>true);

				} else {
					$this->rollback();
					$json = array('result'=>false, 'message'=>'ライブラリ並び替えに失敗しました。');
				}
			}
		}
		return $json;
	}

	/*
	 * ディレクトリ並び替えメソッド
	 * @param	$is_correct		true===処理開始、false===処理せず終了
	 * @param	#request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _reorderLibrary($is_correct, $request) {
		if ($is_correct === true) {
			// 並び替え前のレコードのorderを取得
			$smartphone_libraries = ClassRegistry::init('smartphone_libraries');
			$result = $smartphone_libraries->find('first', array('conditions'=>array('id'=>$request->data['id'])));
			$beforeOrder = (int)$result['smartphone_libraries']['order'];
			$afterOrder = (int)$request->data['order'];

			// ob_start();//ここから
			// var_dump($result);
			// $out=ob_get_contents();//ob_startから出力された内容をゲットする。
			// ob_end_clean();//ここまで
			// error_log('-----------------' . "\n", 3, 'log.txt');
			// error_log($out . "\n", 3, 'log.txt');
			// error_log('-----------------' . "\n", 3, 'log.txt');

			if ($beforeOrder < $afterOrder) {
				// 並び替えるレコードのorderより大きい値のレコードのorderを-1する
				$sql = 'UPDATE smartphone_libraries SET `order` = `order` - 1 WHERE smartphone_library_directory_id = ' . $request->data['directory_id'] . ' AND `order` > ' . $beforeOrder . ' AND `order` <= ' . $afterOrder;
			} else if ($afterOrder < $beforeOrder) {
				// 並び替えるレコードのorderより小さい値のレコードのorderを+1する
				$sql = 'UPDATE smartphone_libraries SET `order` = `order` + 1 WHERE smartphone_library_directory_id = ' . $request->data['directory_id'] . ' AND `order` >= ' . $afterOrder . ' AND `order` < ' . $beforeOrder;
			} else {
				return false;
			}
			$result = $smartphone_libraries->query($sql);

			// ob_start();//ここから
			// var_dump($result);
			// $out=ob_get_contents();//ob_startから出力された内容をゲットする。
			// ob_end_clean();//ここまで
			// error_log('-----------------' . "\n", 3, 'log.txt');
			// error_log($out . "\n", 3, 'log.txt');
			// error_log('-----------------' . "\n", 3, 'log.txt');

			$data = array(
				'id'		=> $request->data['id'],
				'order'		=> $afterOrder
			);
			if ($smartphone_libraries->save($data)) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
}
