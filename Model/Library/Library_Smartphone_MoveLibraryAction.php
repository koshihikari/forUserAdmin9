<?php

class Library_Smartphone_MoveLibraryAction extends AppModel {
	public $useTable = 'smartphone_libraries';

	/*
	 * ライブラリの親ディレクトリ変更メソッド
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function moveLibrary($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		if ($request->isPost()) {
			if (
				isset($request->data['id'])
			) {
				$this->begin();
				$is_correct = true;
				$is_correct = $this->_moveLibrary($is_correct, $request);
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
	 * ライブラリの親ディレクトリ変更メソッド
	 * @param	$is_correct		true===処理開始、false===処理せず終了
	 * @param	#request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _moveLibrary($is_correct, $request) {
		if ($is_correct === true) {
			$smartphone_libraries = ClassRegistry::init('smartphone_libraries');

			// ライブラリ移動後のorderを求める
			$options = array(
				'conditions'	=> array(
					'smartphone_library_directory_id'=>$request->data['directory_id']
				)
			);
			$order = $smartphone_libraries->find('count', $options) + 1;

			// 移動するライブラリのorderより大きい値のライブラリのorderを-1する
			$result = $smartphone_libraries->find('first', array('conditions'=>array('id'=>$request->data['id'])));
			$sql = 'UPDATE smartphone_libraries SET `order` = `order` - 1 WHERE smartphone_library_directory_id = ' . $result['smartphone_libraries']['smartphone_library_directory_id'] . ' AND `order` > ' . $result['smartphone_libraries']['order'];
			$result = $smartphone_libraries->query($sql);

			// ライブラリを移動させ、orderを更新する
			$data = array(
				'id'									=> $request->data['id'],
				'smartphone_library_directory_id'		=> $request->data['directory_id'],
				'order'									=> $order
			);
			if (is_array($smartphone_libraries->save($data))) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
}
