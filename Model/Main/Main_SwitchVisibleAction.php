<?php

class Main_SwitchVisibleAction extends Model {
	public $useTable = 'residences';
	public $actsAs = array('Smartphone_GetPageInfo');

	/*
	 * スマホ用ページのエレメントデータを取得するメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	オブジェクト
	 */
	public function switchResidenceVisible($request) {

				// 'device_name'				: 'smartphone',
				// 'device_num'				: 2,
				// 'company_id'				: prop['companyId'],
				// 'residence_id'				: residenceId,
				// 'is_visible'				: isVisible,
				// 'is_company_site'			: 0,
				// 'is_customer'
		// $json = array('result'=>false, 'message'=>'値が渡されていませんa');
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
				// 物件テーブルのデータ更新
				$isCorrect = $this->_switchResidenceVisible($isCorrect, $request);
				error_log('isCorrect = ' . $isCorrect . "\n", 3, 'log.txt');
				// スマホページテーブルのデータ更新
				// $isCorrect = $this->_switchSmartphonePageVisible($isCorrect, $request);
				// error_log('isCorrect = ' . $isCorrect . "\n", 3, 'log.txt');
				// ガラケーページテーブルのデータ更新
				// $isCorrect = $this->_switchFeaturephonePageVisible($isCorrect, $request);
				// error_log('isCorrect = ' . $isCorrect . "\n", 3, 'log.txt');

		// ob_start();//ここから
		// var_dump($request->data);
		// $out=ob_get_contents();//ob_startから出力された内容をゲットする。
		// ob_end_clean();//ここまで
		// error_log('-----------------' . "\n", 3, 'log.txt');
		// error_log($out . "\n", 3, 'log.txt');
		// error_log('is_publish = ' . $request->data['is_publish'] . "\n", 3, 'log.txt');
		// error_log('比較 = ' . ($request->data['is_publish'] === true) . "\n", 3, 'log.txt');
		// error_log('-----------------' . "\n", 3, 'log.txt');

				if ($isCorrect === true) {
					$this->commit();
				} else {
					$this->rollback();
				}



				// $result = $this->getPageInfo(true, $request->data['residence_id'], $request->data['is_customer']);
				// $json = array('result'=>true, 'data'=>$result);
			}
		}
		error_log('-----------------' . "\n", 3, 'log.txt');
		return $isCorrect;
		// return $json;
	}

	/*
	 * 物件テーブルのデータ更新メソッド
	 * @param	$isCorrect		true === 処理開始、false === 処理せず終了
	 * @param	#request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _switchResidenceVisible($isCorrect, $request) {
		if ($isCorrect === true) {
			// $targetTable = ClassRegistry::init('residences');
			$data = array(
				'id'		=> $request->data['residence_id'],
				'is_show'	=> $request->data['is_show']
			);
			$isSuccess = is_array(ClassRegistry::init('residences')->save($data));
			error_log('isSuccess1 = ' . $isSuccess . "\n", 3, 'log.txt');
			if ($isSuccess === true) {
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
				// if ($isSuccess === true) {
					$data = array(
						'featurephone_pages.is_show' => $request->data['is_show']
					);
					$conditions = array(
						'featurephone_pages.residence_id' => $request->data['residence_id']
					);
					// $isSuccess = is_array(ClassRegistry::init('featurephone_pages')->updateAll($data, $conditions));
					// error_log('isSuccess3 = ' . $isSuccess . "\n", 3, 'log.txt');
					return ClassRegistry::init('featurephone_pages')->updateAll($data, $conditions);
				}
			}
		// } else {
		// 	return false;
		}
		return false;
	}

	/*
	 * スマホページテーブルのデータ更新メソッド
	 * @param	$isCorrect		true === 処理開始、false === 処理せず終了
	 * @param	#request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _switchSmartphonePageVisible($isCorrect, $request) {
		if ($isCorrect === true) {
			$targetTable = ClassRegistry::init('smartphone_pages');
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

	/*
	 * ガラケーページテーブルのデータ更新メソッド
	 * @param	$isCorrect		true === 処理開始、false === 処理せず終了
	 * @param	#request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _switchFeaturephonePageVisible($isCorrect, $request) {
		// if ($isCorrect === true) {
		// 	$targetTable = ClassRegistry::init('smartphone_pages');
		// 	$data = array(
		// 		'id'		=> $request->data['residence_id'],
		// 		'is_show'	=> $request->data['is_show']
		// 	);
		// 	return is_array($targetTable->save($data));
		// } else {
		// 	return false;
		// }
		return $isCorrect;
	}
}
