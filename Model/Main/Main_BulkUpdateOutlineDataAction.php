<?php

class Main_BulkUpdateOutlineDataAction extends Model {
	public $useTable = 'residences';
	public $actsAs = array('GetOutlinePageIds', 'Featurephone_PagePublish', 'Featurephone_GetPageInfo');
	public $outlineSpPageInfo = array();

	/*
	 * 物件概要一括更新メソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	オブジェクト
	 */
	public function bulkUpdateOutlineData($request) {
		$isCorrect = false;

		if ($request->isPost()) {
			if (
				isset($request->data['company_id']) &&
				isset($request->data['user_id']) &&
				isset($request->data['residence_ids']) &&
				isset($request->data['modified']) &&
				isset($request->data['next_modified']) &&
				isset($request->data['is_publish'])
			) {
				$request->data['is_publish'] = $request->data['is_publish'] === 'true' ? true : false;
				$this->begin();
				$isCorrect = true;
				// 物件概要テーブルのデータ更新
				$isCorrect = $this->_updateOutlines($isCorrect, $request);

		// ob_start();//ここから
		// var_dump($request->data);
		// $out=ob_get_contents();//ob_startから出力された内容をゲットする。
		// ob_end_clean();//ここまで
		// error_log('-----------------' . "\n", 3, 'log.txt');
		// error_log($out . "\n", 3, 'log.txt');
		// error_log('is_publish = ' . $request->data['is_publish'] . "\n", 3, 'log.txt');
		// error_log('比較 = ' . ($request->data['is_publish'] === true) . "\n", 3, 'log.txt');
		// error_log('-----------------' . "\n", 3, 'log.txt');
				// スマホ用ページテーブル更新
				$isCorrect = $this->_bulkUpdateSpPage($isCorrect, $request);
				// ガラケー用ページテーブル更新
				$isCorrect = $this->_bulkUpdateFpPage($isCorrect, $request);

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
	 * 物件概要テーブルのデータを更新するメソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	Boolean
	 */
	private function _updateOutlines($isCorrect, $request) {
		if ($isCorrect === true) {
			$outlines = ClassRegistry::init('outlines');


			// $residenceIds = array();
			// for ($i=0,$len=count($request->data['residence_ids']); $i<$len; $i++) {
			// 	array_push($residenceIds, $request->data['residence_ids'][$i]);
			// }

			// 更新日更新(updateAllではmodifiedが更新されなかったので、手動更新)
			if ($request->data['modified'] !== null) {
				$data = array(
					'val'				=> "'" . $request->data['modified'] . "'",
					'user_id'			=> $request->data['user_id'],
					'modified'			=> "'" . date('c') . "'"
				);
				$conditions = array(
					'residence_id'		=> $request->data['residence_ids'],
					// 'residence_id'		=> $residenceIds,
					'mtr_outline_id'	=> 23
				);
				/*
		ob_start();//ここから
		var_dump($request->data);
		$out=ob_get_contents();//ob_startから出力された内容をゲットする。
		ob_end_clean();//ここまで
		error_log('-----------------' . "\n", 3, 'log.txt');
		error_log($out . "\n", 3, 'log.txt');
		error_log('-----------------' . "\n", 3, 'log.txt');
		ob_start();//ここから
		var_dump($data);
		$out=ob_get_contents();//ob_startから出力された内容をゲットする。
		ob_end_clean();//ここまで
		error_log('-----------------' . "\n", 3, 'log.txt');
		error_log($out . "\n", 3, 'log.txt');
		error_log('-----------------' . "\n", 3, 'log.txt');
		ob_start();//ここから
		var_dump($conditions);
		$out=ob_get_contents();//ob_startから出力された内容をゲットする。
		ob_end_clean();//ここまで
		error_log('-----------------' . "\n", 3, 'log.txt');
		error_log($out . "\n", 3, 'log.txt');
		error_log('-----------------' . "\n", 3, 'log.txt');
		*/
				if ($outlines->updateAll($data, $conditions) === false) {
					return false;
				}
			}

			// 次回更新日更新(updateAllではmodifiedが更新されなかったので、手動更新)
			if ($request->data['next_modified'] !== null) {
				$data = array(
					'val'				=> "'" . $request->data['next_modified'] . "'",
					'user_id'			=> $request->data['user_id'],
					'modified'			=> "'" . date('c') . "'"
				);
				$conditions = array(
					'residence_id'		=> $request->data['residence_ids'],
					// 'residence_id'		=> $residenceIds,
					'mtr_outline_id'	=> 24
				);
				if ($outlines->updateAll($data, $conditions) === false) {
					return false;
				}
			}
			return true;
		} else {
			return false;
		}
	}

	/*
	 * スマホページテーブルのデータを更新するメソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	Boolean
	 */
	private function _bulkUpdateSpPage($isCorrect, $request) {
		if ($isCorrect === true) {
			// 物件概要パーツが含まれるスマホページIDを取得
			// $this->outlineSpPageIds = $this->getOutlinePageIdsForSp($request->data['residence_ids']);
			$this->outlineSpPageInfo = $this->getOutlinePageIdsForSp($request->data['residence_ids']);

			$outlinePageIds = array();
			for ($i=0,$len=count($this->outlineSpPageInfo); $i<$len; $i++) {
				array_push($outlinePageIds, $this->outlineSpPageInfo[$i]['pageId']);
			}

			// 物件概要パーツが含まれるページのedited_user_idとeditedを更新(updateAllではmodifiedが更新されなかったので、手動更新)
			$data = array(
				'edited_user_id'		=> $request->data['user_id'],
				'edited'				=> "'" . date('c') . "'",
				'modified'				=> "'" . date('c') . "'"
			);
			$conditions = array(
				'id'	=> $outlinePageIds
			);
			return ClassRegistry::init('smartphone_pages')->updateAll($data, $conditions);
		} else {
			return false;
		}
	}

	/*
	 * ガラケーページテーブルのデータを更新するメソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	Boolean
	 */
	private function _bulkUpdateFpPage($isCorrect, $request) {
		if ($isCorrect === true) {
			$featurephone_pages = ClassRegistry::init('featurephone_pages');

			// 指定された物件IDのサイト内で、物件概要ページのIDを抽出
			$options = array(
				'conditions'		=> array(
					'preview_source like'	=> '%OutlineTableBigin%',
					'residence_id'			=> $request->data['residence_ids']
				)
			);
			$result = $featurephone_pages->find('all', $options);

			for ($i=0,$len=count($result); $i<$len; $i++) {
				$pageSource = ClassRegistry::init('Page_Featurephone_GetSourceAction')->getSource($request->data['user_id'], $result[$i]['featurephone_pages']['id']);

				if ($request->data['is_publish'] === true) {
					$updateData = array(
						'page_id'				=> $result[$i]['featurephone_pages']['id'],
						'user_id'				=> $request->data['user_id'],
						'preview_source'		=> $pageSource
					);
					$tmp = $this->fpPublish($updateData);
					error_log('-----------------' . "\n", 3, 'log.txt');
					error_log('Main_BulkUpdateOutlineDataAction :: _bulkUpdateFpPage :: FPページパブリッシュ結果 = ' . $tmp . "\n", 3, 'log.txt');
					error_log('-----------------' . "\n", 3, 'log.txt');
					if ($tmp === false) {
					// if ($this->fpPublish($request->data) === false) {
						return false;
					}
				} else {
					$data = array(
						'id'					=> $result[$i]['featurephone_pages']['id'],
						'edited_user_id'		=> $request->data['user_id'],
						'edited'				=> "'" . date('c') . "'",
						'preview_source'		=> $pageSource,
						'user_id'				=> $request->data['user_id']
					);
					if (is_array($featurephone_pages->save($data)) === false) {
						error_log($i . ' :: a失敗' . "\n", 3, 'log.txt');
						error_log('-----------------' . "\n", 3, 'log.txt');
						return false;
					} else {
						error_log($i . ' :: a成功' . "\n", 3, 'log.txt');
						error_log('-----------------' . "\n", 3, 'log.txt');
					}
				}
			}
			// ob_start();//ここから
			// var_dump($result);
			// $out=ob_get_contents();//ob_startから出力された内容をゲットする。
			// ob_end_clean();//ここまで
			// error_log('-----------------' . "\n", 3, 'log.txt');
			// error_log($out . "\n", 3, 'log.txt');
			// error_log('-----------------' . "\n", 3, 'log.txt');
			return true;
		} else {
			return false;
		}
	}
}
