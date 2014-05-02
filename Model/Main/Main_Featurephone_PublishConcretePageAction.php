<?php

class Main_Featurephone_PublishConcretePageAction extends AppModel {
	public $useTable = 'featurephone_pages';
	public $actsAs = array('Featurephone_PagePublish');

	/*
	 * 本番ページ書き出しメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function publishFpPage($request) {
		return $this->fpPublish($request->data);



		/*
		$isCorrect = false;
		// $json = array('result'=>false, 'message'=>'値が渡されていません');

		if ($request->isPost()) {
			if (
				isset($request->data['page_id']) &&
				isset($request->data['user_id'])
				// isset($request->data['title']) &&
				// isset($request->data['path']) &&
				// isset($request->data['company_id']) &&
				// isset($request->data['residence_id'])
			) {
				// $this->begin();
				$isCorrect = true;
				// $isCorrect = $this->_setPageSource($isCorrect, $request);
				$isCorrect = $this->fpPublish($request->data);
				// if ($isCorrect === true) {
				// 	$this->commit();
					// $result = $this->getPageInfo(true, $request->data['residence_id']);
					// $json = array('result'=>true, 'data'=>$result);

				// } else {
				// 	$this->rollback();
					// $json = array('result'=>false, 'message'=>'データ追加に失敗しました。');
				// }
			}
		}
		return $isCorrect;
		// return $json;
		*/
	}

	/*
	 * 指定されたソースを書き込むメソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	#request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	/*
	private function _setPageSource($isCorrect, $request) {
		if ($isCorrect === true) {
			*/
			/*
			// error_log("----- _setPageSource -----\n", 3, 'log.txt');
			$options = array(
				'conditions'		=> array(
					'id'			=> $request->data['company_id']
				)
			);
			$companyInfo = ClassRegistry::init('companies')->find('first', $options);
			$base_url = preg_replace('/\/$/', '', $companyInfo['companies']['url']) . '/';
			// error_log("companyInfo.url = " . $companyInfo['companies']['url'] . "\n", 3, 'log.txt');
			// error_log("base_url = " . $base_url . "\n", 3, 'log.txt');

			$options2 = array(
				'conditions'		=> array(
					'id'			=> $request->data['residence_id']
				)
			);
			$residenceInfo = ClassRegistry::init('residences')->find('first', $options2);
			$base_path = preg_replace("/^\/(.*)\/$/", "$1", $residenceInfo['residences']['path']);
			// error_log("residences.path = " . $residenceInfo['residences']['path'] . "\n", 3, 'log.txt');
			// error_log("base_path = " . $base_path . "\n", 3, 'log.txt');
			$base_path = $base_path === '' ? $base_path : $base_path . '/';
			// error_log("base_path = " . $base_path . "\n", 3, 'log.txt');
			// error_log("request.path = " . $request->data['path'] . "\n", 3, 'log.txt');

			$path = preg_replace('/^\//', '', $request->data['path']);
			$url = $base_url . $base_path . $path;
			*/

			/*
			// error_log("url = " . $url . "\n", 3, 'log.txt');
			// error_log("----- _setPageSource -----\n", 3, 'log.txt');
			$options = array(
				'conditions'	=> array(
					'id'			=> $request->data['page_id']
				)
			);
			$result = ClassRegistry::init('featurephone_pages')->find('first', $options);

			// error_log("\n", 3, 'log.txt');
			// error_log($result['Page_Featurephone_PublishConcretePageAction']['preview_source'] . "\n", 3, 'log.txt');

			$data = array(
				'id'				=> $request->data['page_id'],
				// 'residence_id'		=> $request->data['residence_id'],
				// 'title'				=> $request->data['title'],
				// 'url'				=> $url,
				// 'path'				=> $request->data['path'],
				'published'			=> date('c'),
				'published_user_id'	=> $request->data['user_id'],
				'user_id'			=> $request->data['user_id'],
				'concrete_source'	=> $result['featurephone_pages']['preview_source']
			);
			if (isset($request->data['residence_id']) && $request->data['residence_id']) {
				$data['residence_id'] = $request->data['residence_id'];
			}
			if (isset($request->data['title']) && $request->data['title']) {
				$data['title'] = $request->data['title'];
			}
			if (isset($request->data['path']) && $request->data['path']) {
				$data['path'] = $request->data['path'];
			}
			return is_array(ClassRegistry::init('featurephone_pages')->save($data));
		} else {
			return false;
		}
	}
	*/
}
