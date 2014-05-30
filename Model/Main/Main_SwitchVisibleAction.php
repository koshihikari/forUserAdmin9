<?php

class Main_SwitchVisibleAction extends Model {
	public $useTable = 'residences';
	public $actsAs = array('Smartphone_GetPageInfo');

	/*
	 * 物件の表示/非表示を切り替えるメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	オブジェクト
	 */
	public function switchResidenceVisible($request) {
		error_log('-----------------' . "\n", 3, 'log.txt');
		$isCorrect = false;

		if ($request->isPost()) {
			if (
				isset($request->data['company_id']) &&
				isset($request->data['residence_id']) &&
				isset($request->data['is_show']) &&
				isset($request->data['is_customer']) &&
				$request->data['is_customer'] === '0'
			) {
				error_log('処理開始' . "\n", 3, 'log.txt');
				$this->begin();
				$isCorrect = true;
				$isCorrect = $this->_switchResidenceVisible($isCorrect, $request);
				error_log('isCorrect = ' . $isCorrect . "\n", 3, 'log.txt');

				if ($isCorrect === true) {
					$this->commit();
				} else {
					$this->rollback();
				}
			}
		}
		error_log('-----------------' . "\n", 3, 'log.txt');
		return $isCorrect;
	}

	/*
	 * ページの表示/非表示を切り替えるメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	オブジェクト
	 */
	public function switchPageVisible($request) {
		error_log('-----------------' . "\n", 3, 'log.txt');
		$isCorrect = false;

		if ($request->isPost()) {
			if (
				isset($request->data['company_id']) &&
				isset($request->data['residence_id']) &&
				isset($request->data['page_id']) &&
				isset($request->data['device_type']) &&
				isset($request->data['is_show']) &&
				isset($request->data['is_customer']) &&
				$request->data['is_customer'] === '0'
			) {
				error_log('処理開始' . "\n", 3, 'log.txt');
				$this->begin();
				$isCorrect = true;
				$isCorrect = $this->_switchPageVisible($isCorrect, $request);
				error_log('isCorrect = ' . $isCorrect . "\n", 3, 'log.txt');

				if ($isCorrect === true) {
					$this->commit();
				} else {
					$this->rollback();
				}
			}
		}
		error_log('-----------------' . "\n", 3, 'log.txt');
		return $isCorrect;
	}

	/*
	 * 物件テーブルのデータ更新メソッド
	 * @param	$isCorrect		true === 処理開始、false === 処理せず終了
	 * @param	#request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _switchResidenceVisible($isCorrect, $request) {
		if ($isCorrect === true) {
			// データ更新
			$data = array(
				'id'		=> $request->data['residence_id'],
				'is_show'	=> $request->data['is_show']
			);
			$isSuccess = is_array(ClassRegistry::init('residences')->save($data));
			error_log('isSuccess1 = ' . $isSuccess . "\n", 3, 'log.txt');

			if ($isSuccess === true) {
				// 部件IDがresidence_idのスマホページの表示/非表示も切り替える
				$data = array(
					'smartphone_pages.is_show' => $request->data['is_show']
				);
				$conditions = array(
					'smartphone_pages.residence_id' => $request->data['residence_id']
				);
				$result = ClassRegistry::init('smartphone_pages')->updateAll($data, $conditions);
				// ob_start();//ここから
				// var_dump($result);
				// $out=ob_get_contents();//ob_startから出力された内容をゲットする。
				// ob_end_clean();//ここまで
				// error_log('-----------------' . "\n", 3, 'log.txt');
				// error_log($out . "\n", 3, 'log.txt');
				// error_log('is_publish = ' . $request->data['is_publish'] . "\n", 3, 'log.txt');
				// error_log('比較 = ' . ($request->data['is_publish'] === true) . "\n", 3, 'log.txt');
				// error_log('-----------------' . "\n", 3, 'log.txt');
				// $isSuccess = true;
				// $isSuccess = is_array(ClassRegistry::init('smartphone_pages')->updateAll($data, $conditions));
				// error_log('isSuccess2 = ' . $isSuccess . "\n", 3, 'log.txt');
				if (ClassRegistry::init('smartphone_pages')->updateAll($data, $conditions) === true) {
					// 部件IDがresidence_idのガラケーページの表示/非表示も切り替える
					$data = array(
						'featurephone_pages.is_show' => $request->data['is_show']
					);
					$conditions = array(
						'featurephone_pages.residence_id' => $request->data['residence_id']
					);
					return ClassRegistry::init('featurephone_pages')->updateAll($data, $conditions);
				}
			}
		// } else {
		// 	return false;
		}
		return false;
	}

	/*
	 * ページテーブルのデータ更新メソッド
	 * @param	$isCorrect		true === 処理開始、false === 処理せず終了
	 * @param	#request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _switchPageVisible($isCorrect, $request) {
		if ($isCorrect === true) {
			// device_typeに基づいて更新するテーブルを指定する
			$tableName = $request->data['device_type'] === 'sp' ? 'smartphone_pages' : 'featurephone_pages';
			$targetTable = ClassRegistry::init($tableName);

			// スマホorガラケーページの表示/非表示を切り替える
			$data = array(
				'id'		=> $request->data['page_id'],
				'is_show'	=> $request->data['is_show']
			);
			$isSuccess = is_array($targetTable->save($data));
			error_log('isSuccess1 = ' . $isSuccess . "\n", 3, 'log.txt');

			if ($isSuccess === true) {
				// 物件IDがresidence_idのスマホページの内、表示中のページ数を数える
				$spOptions = array(
					'conditions'	=> array(
						'residence_id'		=> $request['data']['residence_id'],
						'is_show'		=> 1
					)
				);
				$spPageCount = ClassRegistry::init('smartphone_pages')->find('count', $spOptions);

				// 物件IDがresidence_idのガラケーページの内、表示中のページ数を数える
				$fpOptions = array(
					'conditions'	=> array(
						'residence_id'		=> $request['data']['residence_id'],
						'is_show'		=> 1
					)
				);
				$fpPageCount = ClassRegistry::init('featurephone_pages')->find('count', $fpOptions);

				error_log('spPageCount = ' . $spPageCount . "\n", 3, 'log.txt');
				error_log('fpPageCount = ' . $fpPageCount . "\n", 3, 'log.txt');

				/*
				// スマホページかガラケーページの内、表示中のページが1つであれば物件を表示中にする
				if (0 < $spPageCount || 0 < $fpPageCount) {

				// スマホページとガラケーページで表示中のページが1つもない場合、物件を非表示にする
				} else if (0 === $spPageCount && 0 === $fpPageCount) {
				*/
				$isResidenceShow = 1;
				// スマホページとガラケーページで表示中のページが1つもない場合、物件を非表示にする
				if (0 === $spPageCount && 0 === $fpPageCount) {
					$isResidenceShow = 0;
				}
				$data = array(
					'id'		=> $request->data['residence_id'],
					'is_show'	=> $isResidenceShow
				);
				return is_array(ClassRegistry::init('residences')->save($data));
			} else {
				return false;
			}
		// 	$data = array(
		// 		'id'		=> $request->data['residence_id'],
		// 		'is_show'	=> $request->data['is_show']
		// 	);
		// 	return is_array($targetTable->save($data));
		} else {
			return false;
		}
		return $isCorrect;
	}
}
