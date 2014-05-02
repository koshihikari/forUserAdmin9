<?php

class Main_SetPageTagDataAction extends AppModel {
	public $useTable = 'smartphone_library_directories';
	public $editTagId = -1;

	/*
	 * ページタグ設定メソッド
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function setPageTagData($request) {
		$isCorrect = false;

		if ($request->isPost()) {
			if (
				isset($request->data['user_id']) &&
				isset($request->data['tag_data'])
			) {
				$this->begin();
				$isCorrect = true;
				$isCorrect = $this->_setPageTagData($isCorrect, $request);
				if ($isCorrect === true) {
					$this->commit();
				} else {
					$this->rollback();
				}
			}
		}
		return $isCorrect;
	}

	/*
	 * ページタグ設定メソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _setPageTagData($isCorrect, $request) {
		if ($isCorrect === true) {
			$isSuccess = true;
			$page_tags = ClassRegistry::init('page_tags');

			$data = array();
			for ($i=0,$len=count($request->data['tag_data']['edit']); $i<$len; $i++) {
				$tmp = $request->data['tag_data']['edit'][$i];
				if ($tmp['id'] === 0) {
					unset($tmp['id']);
				}
				$tmp['user_id'] = $request->data['user_id'];
				array_push($data, $tmp);
			}
			// ob_start();//ここから
			// var_dump($data);
			// $out=ob_get_contents();//ob_startから出力された内容をゲットする。
			// ob_end_clean();//ここまで
			// error_log('-----------------' . "\n", 3, 'log.txt');
			// error_log($out . "\n", 3, 'log.txt');
			// error_log('-----------------' . "\n", 3, 'log.txt');
			if (0 < count($data)) {
				$options = array(
					'validate'		=> false,
					'atomic'		=> true,
					'deep'			=> false
				);
				error_log('一括保存' . "\n", 3, 'log.txt');
				error_log('-----------------' . "\n", 3, 'log.txt');
				$isSuccess = $page_tags->saveMany($data, $options);
			}
			error_log('$isSuccess = ' . $isSuccess . "\n", 3, 'log.txt');
			error_log('-----------------' . "\n", 3, 'log.txt');

			// 指定されたデータ削除
			if ($isSuccess === true && isset($request->data['tag_data']['del']) && 0 < count($request->data['tag_data']['del'])) {
				$conditions = array(
					'id'		=> $request->data['tag_data']['del']
				);
				error_log('一括削除' . "\n", 3, 'log.txt');
				error_log('-----------------' . "\n", 3, 'log.txt');
				$isSuccess = $page_tags->deleteAll($conditions, false);
			}
			error_log('$isSuccess = ' . $isSuccess . "\n", 3, 'log.txt');
			error_log('-----------------' . "\n", 3, 'log.txt');
			return $isSuccess;
		} else {
			return false;
		}
	}
}
