<?php

class Util_Smartphone_DuplicateAction extends AppModel {
	public $useTable = 'companies';

	/*
	 * 物件/ページ/ライブラリ複製メソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function duplicate($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		if ($request->isPost()) {
			// error_log("\n", 3, 'log.txt');
			// error_log("Util_Smartphone_DuplicateAction :: duplicate\n", 3, 'log.txt');
			// error_log("--------------------------\n", 3, 'log.txt');
			// error_log('user_id = ' . $request->data['user_id'] . "\n", 3, 'log.txt');
			// error_log('is_library_copy = ' . isset($request->data['is_library_copy']) . "\n", 3, 'log.txt');
			// error_log('from_company_id = ' . $request->data['from_company_id'] . "\n", 3, 'log.txt');
			// error_log('from_residence_id = ' . $request->data['from_residence_id'] . "\n", 3, 'log.txt');
			// error_log('from_page_id = ' . $request->data['from_page_id'] . "\n", 3, 'log.txt');
			// error_log('to_company_id = ' . $request->data['to_company_id'] . "\n", 3, 'log.txt');
			// error_log('to_residence_id = ' . $request->data['to_residence_id'] . "\n", 3, 'log.txt');
			if (
				isset($request->data['user_id']) &&
				isset($request->data['is_library_copy']) &&
				// isset($request->data['from_company_id']) &&
				// isset($request->data['from_residence_id']) &&
				isset($request->data['from_page_id']) &&
				// isset($request->data['to_company_id']) &&
				isset($request->data['to_residence_id'])
			) {
				$this->begin();
				$is_correct = true;
				$result = $this->_duplicatePage($request->data['user_id'], $request->data['from_page_id'], $request->data['to_residence_id']);
				$is_correct = $result['result'];
				// error_log('1 = ' . $is_correct . "\n", 3, 'log.txt');
				$isCorrect = $this->_duplicatePageElements($request->data['user_id'], $request->data['from_page_id'], $result['id']);
				// error_log('2 = ' . $isCorrect . "\n", 3, 'log.txt');
				if ($is_correct === true) {
					// $this->rollback();
					$this->commit();
					// error_log('6 = ' . $result . "\n", 3, 'log.txt');
					$json = array('result'=>true);

				} else {
					$this->rollback();
					$json = array('result'=>false, 'message'=>'ページの削除処理に失敗しました');
				}
			}
			// error_log("--------------------------\n", 3, 'log.txt');
			// error_log("\n", 3, 'log.txt');
		}
		return $json;
	}

	/*
	 * ページ複製メソッド
	 * @param	$userId				ユーザID
	 * @param	$recordId			複製するページID
	 * @param	$toResidenceId		複製先物件ID
	 * @return	オブジェクト
	 */
	private function _duplicatePage($userId, $recordId, $toResidenceId) {
		$smartphonePages = ClassRegistry::init('smartphone_pages');

		// 複製元ページデータを取得
		$options = array(
			'conditions'	=> array(
				'id'						=> $recordId
			)
		);
		$result = $smartphonePages->find('first', $options);

		// 複製先物件のページ数を取得
		$options = array(
			'conditions'	=> array(
				'residence_id'				=> $toResidenceId
			)
		);
		$count = $smartphonePages->find('count', $options);

		// 取得したページデータの物件ID、ユーザID、作成日時等を修正して保存
		$data = $result['smartphone_pages'];
		$data['residence_id'] = $toResidenceId;
		$data['order'] = ($count + 1);
		$data['user_id'] = $userId;
		$data['published_user_id'] = 0;
		$data['published'] = '0000-00-00 00:00:00';
		unset($data['id']);
		unset($data['created']);
		unset($data['modified']);
		if (is_array($smartphonePages->save($data)) === false) {
			return array('resutl'=>false);
		} else {
			return array('result'=>true,'id'=>$smartphonePages->getLastInsertID());
		}
	}

	/*
	 * ページエレメント複製メソッド
	 * @param	$user_id			ユーザID
	 * @param	$from_page_id		コピーするページエレメントが属するページのID
	 * @param	$to_page_id			コピー先ページのID
	 * @return	true or false
	 */
	private function _duplicatePageElements($userId, $fromPageId, $toPageId) {
		// error_log("\n", 3, 'log.txt');
		// error_log("Util_Smartphone_DuplicateAction :: _duplicatePageElements\n", 3, 'log.txt');
		// error_log("--------------------------\n", 3, 'log.txt');
		// error_log('user_id = ' . $user_id . "\n", 3, 'log.txt');
		// error_log('from_page_id = ' . $from_page_id . "\n", 3, 'log.txt');
		// error_log('to_page_id = ' . $to_page_id . "\n", 3, 'log.txt');
		$smartphonePageElements = ClassRegistry::init('smartphone_page_elements');

		// 複製元エレメントデータを取得
		$options = array(
			'conditions'	=> array(
				'page_id'						=> $fromPageId
			)
		);
		$result = $smartphonePageElements->find('all', $options);

		// 取得したエレメントデータのページID、ユーザID等を修正して保存
		for ($i=0,$len=count($result); $i<$len; $i++) {
			$data = $result[$i]['smartphone_page_elements'];
			$data['page_id'] = $toPageId;
			unset($data['id']);
			unset($data['created']);
			unset($data['modified']);
			$smartphonePageElements->create();
			if (is_array($smartphonePageElements->save($data)) === false) {
				return false;
			}
		}
		return true;



		/*
		$data = $result['smartphone_pages'];
		$data['residence_id'] = $toResidenceId;
		$data['order'] = ($count + 1);
		$data['user_id'] = $userId;
		$data['published_user_id'] = 0;
		$data['published'] = '0000-00-00 00:00:00';
		unset($data['id']);
		unset($data['created']);
		unset($data['modified']);
		if (is_array($smartphonePages->save($data)) === false) {
			return array('resutl'=>false);
		} else {
			return array('result'=>true,'id'=>$smartphonePages->getLastInsertID());
		}






		// element_idとparent_idを更新してオブジェクトに保存しておく
		$obj = array();
		$stamp = microtime();
		list($msec, $sec) = explode(" ", $stamp);
		$strId = 'id-' . str_replace('.', '', (string)((float)$sec + (float)$msec));
		for ($i=0,$len=count($result); $i<$len; $i++) {
			$arr = explode("_", $result[$i]['smartphone_page_elements']['element_id']);
			$convertedId = count($arr) === 1 ? $strId : implode('_', ($strId . $arr[1]));
			$obj[$result[$i]['smartphone_page_elements']['element_id']] = $convertedId;
		}
		$obj['spContent'] = 'spContent';

		// 取得したデータを挿入
		for ($i=0,$len=count($result); $i<$len; $i++) {
			$data = array(
				'page_id'						=> $to_page_id,
				'user_id'						=> $user_id,
				'element_id'					=> $obj[$result[$i]['smartphone_page_elements']['element_id']],
				'parent_id'						=> $obj[$result[$i]['smartphone_page_elements']['parent_id']],
				'smartphone_library_id'			=> $result[$i]['smartphone_page_elements']['smartphone_library_id'],
				'item_name'						=> $result[$i]['smartphone_page_elements']['item_name'],
				'order'							=> $result[$i]['smartphone_page_elements']['order'],
				'property'						=> $result[$i]['smartphone_page_elements']['property']
			);
			$smartphone_page_elements->create();
			if (is_array($smartphone_page_elements->save($data)) === false) {
				return false;
			}
		}
		error_log("--------------------------\n", 3, 'log.txt');
		error_log("\n", 3, 'log.txt');

		return true;
		*/
	}

	/*
	 * 共通パーツ複製メソッド
	 * @param	$record_id		コピーする共通パーツのID
	 * @return	コピーしてテーブルに書き込んだ共通パーツのID
	 */
	private function _DEL_duplicateLibrary($record_id, $residence_id, $user_id) {
		$smartphone_libraries = ClassRegistry::init('smartphone_libraries');
		// 複製元共通パーツのデータを取得
		$options = array(
			'conditions'	=> array(
				'id'						=> $record_id
			)
		);
		$result = $smartphone_libraries->find('first', $options);

		// 複製元共通パーツのデータを取得
		$options = array(
			'conditions'	=> array(
				'residence_id'				=> $residence_id
			)
		);
		$result2 = $smartphone_libraries->find('all', $options);

		// 取得したデータを複製したデータを挿入
		$data = array(
			'residence_id'			=> $residence_id,
			'order'					=> $result2['smartphone_libraries']['order'] + 1,
			'status_id'				=> $result['smartphone_libraries']['status_id'],
			'title'					=> $result['smartphone_libraries']['title'],
			'is_editable'			=> $result['smartphone_libraries']['is_editable'],
			'user_id'				=> $user_id,
			'property'				=> $result['smartphone_libraries']['property']
		);
		$result = $smartphone_libraries->save($data);
	}

	/*
	 * ページ複製メソッド
	 * @param	$user_id			ユーザID
	 * @param	$record_id			コピーするページのID
	 * @param	$residence_id		コピーするページが属する物件のID
	 * @return	コピーしてテーブルに書き込んだページのID
	 */
	private function _DEL_duplicatePage($user_id, $record_id, $residence_id) {
		error_log("\n", 3, 'log.txt');
		error_log("Util_Smartphone_DuplicateAction :: _duplicatePage\n", 3, 'log.txt');
		error_log("--------------------------\n", 3, 'log.txt');
		error_log('user_id = ' . $user_id . "\n", 3, 'log.txt');
		error_log('record_id = ' . $record_id . "\n", 3, 'log.txt');
		error_log('residence_id = ' . $residence_id . "\n", 3, 'log.txt');
		$smartphone_pages = ClassRegistry::init('smartphone_pages');
		// 複製元ページのデータを取得
		$options = array(
			'conditions'	=> array(
				'id'						=> $record_id
			)
		);
		$result = $smartphone_pages->find('first', $options);
		error_log('smartphone_pages = ' . $result['smartphone_pages'] . "\n", 3, 'log.txt');
		error_log('smartphone_pages.id = ' . $result['smartphone_pages']['id'] . "\n", 3, 'log.txt');

		// 複製元物件内のページでorderが一番大きいデータを取得
		$order = 1;
		$options = array(
			'conditions'	=> array(
				'residence_id'				=> $residence_id
			),
			'order'			=> 'order DESC'
		);
		$result2 = $smartphone_pages->find('all', $options);
		if (0 < count($result2)) {
			error_log('order = ' . $result2[0] . "\n", 3, 'log.txt');
			error_log('order = ' . $result2[0]['smartphone_pages'] . "\n", 3, 'log.txt');
			error_log('order = ' . $result2[0]['smartphone_pages']['order'] . "\n", 3, 'log.txt');
			$order = $result2[0]['smartphone_pages']['order'] + 1;
		}
		error_log('order = ' . $order . "\n", 3, 'log.txt');

		// 取得したデータを挿入
		$data = array(
			'residence_id'			=> $residence_id,
			'order'					=> $order,
			'status_id'				=> $result['smartphone_pages']['status_id'],
			'title'					=> $result['smartphone_pages']['title'],
			'url'					=> null,
			'path'					=> '',
			'user_id'				=> $user_id,
			'source'				=> $result['smartphone_pages']['source'],
			'property'				=> $result['smartphone_pages']['property']
		);
		error_log("--------------------------\n", 3, 'log.txt');
		error_log("\n", 3, 'log.txt');
		$smartphone_pages->create();
		if (is_array($smartphone_pages->save($data)) === false) {
			return array('resutl'=>false);
		} else {
			return array('result'=>true,'id'=>$smartphone_pages->getLastInsertID());
		}
	}

	/*
	 * ページ削除メソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _DEL_deletePage($is_correct, $request) {
		if ($is_correct === true) {
			error_log("\n", 3, 'log.txt');
			error_log("Util_Smartphone_DuplicateAction :: _deletePage\n", 3, 'log.txt');
			error_log("--------------------------\n", 3, 'log.txt');
			// コピー元ページIDに共通パーツが含まれているかチェック
			$options = array(
				'conditions'	=> array(
					'id'						=> $request->data['from_page_id'],
					'smartphone_library_id'		=> 1
				)
			);
			$library_element_count = ClassRegistry::init('smartphone_page_elements')->find('count', $options);
			error_log($library_element_count . "\n", 3, 'log.txt');

			// if ($request->data['from_residence_id'] === $requestt->data['to_residence_id']) {	// コピー元とコピー先の物件が同じ場合
				if ($library_element_count === 0) {	// コピー元ページに共通パーツが含まれていない場合
					$data = $this->_duplicatePage($request->data['user_id'], $request->data['from_page_id'], $request->data['to_residence_id']);	// ページ複製処理開始

					error_log('data.result = ' . $data['result'] . "\n", 3, 'log.txt');
					if ($data['result'] === true) {	// ページ複製処理成功時
						$is_correct = $this->_duplicatePageElements($request->data['user_id'], $request->data['from_page_id'], $data['id']);	// ページエレメント複製処理開始
					} else {	// ページ複製処理失敗時
						$is_correct = false;
					}
				} else {	// コピー元ページに共通パーツが含まれている場合

				}
			// }	// コピー元とコピー先の物件が異なる場合
			error_log("--------------------------\n", 3, 'log.txt');
			error_log("\n", 3, 'log.txt');
			return $is_correct;
		} else {
			return false;
		}
	}
}
