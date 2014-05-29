<?php

class Page_Smartphone_PublishConcretePageAction extends AppModel {
	public $useTable = 'smartphone_pages';
	public $data = array();
	public $actsAs = array('Smartphone_GetPageInfo');
	// public $useTable = 'smartphone_concrete_pages';

	/*
	 * 本番ページ書き出しメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function publishConcretePage($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		if ($request->isPost()) {
			if (
				// isset($request->data['residence_id']) &&
				isset($request->data['id']) &&
				isset($request->data['company_id']) &&
				isset($request->data['residence_id']) &&
				isset($request->data['user_id']) &&
				// isset($request->data['path']) &&
				// isset($request->data['title']) &&
				isset($request->data['source'])
			) {
				/*
				file_put_contents($this->_getFileName($request), $this->_getPageSource($request));
				$json = array('result'=>true);
				*/
				$this->begin();
				$isCorrect = true;
				$isCorrect = $this->_setPageSource($isCorrect, $request);
				if ($isCorrect === true) {
					$this->commit();
					$result = $this->getPageInfo(false, $request->data['id'], '0');
					$json = array('result'=>true, 'data'=>$result);

					// $data = $this->_getPageData($request->data['id']);
					// $json = array('result'=>true, 'data'=>$data);

				} else {
					$this->rollback();
					$json = array('result'=>false, 'message'=>'データ追加に失敗しました。');
				}
			}
		}
		return $json;
	}

	/*
	 * 指定されたIDのページデータを取得するメソッド
	 * @param	$pageId		ページID
	 * @return	ページデータ
	 */
	/*
	private function _DEL_getPageData($pageId) {
		// smartphone_pageからid === $pageIdのデータを取得
		$smartphone_pages = ClassRegistry::init('smartphone_pages');
		$options = array(
			'conditions'		=> array(
				'smartphone_pages.id'			=> $pageId
			)
		);
		$result = $smartphone_pages->find('first', $options);

		// 取得したデータの編集日時、書き出し日時を変数に代入する(編集日時が存在しなければ、編集日時は更新日時とする)
		// (書き出し日時が存在せず、ページが書きだされている場合、書き出し日時は更新日時とする)
		// $edited = $result['smartphone_pages']['edited'] === '0000-00-00 00:00:00' ? $result['smartphone_pages']['modified'] : $result['smartphone_pages']['edited'];
		// $published = $result['smartphone_pages']['published'] === '0000-00-00 00:00:00' && $result['smartphone_pages']['source'] !== '' ? $result['smartphone_pages']['modified'] : $result['smartphone_pages']['published'];
		$edited = $result['smartphone_pages']['edited'];
		$published = $result['smartphone_pages']['published'];

		// 取得したデータの更新日時と書き出し日時を比較し、書きだされたページが最新かどうか判定する
			if ($edited === '0000-00-00 00:00:00' && $published === '0000-00-00 00:00:00') {
				$is_latest_page = false;
			} else {
				$is_latest_page = strtotime($edited) <= strtotime($published) ? true : false;
			}
		$result['smartphone_pages']['is_latest_page'] = $is_latest_page;

		// 取得したデータの編集日時、書き出し日時を整形する
		$result['smartphone_pages']['edited'] = $edited === '0000-00-00 00:00:00' ? '' : date("Y/m/d H:i:s",strtotime($edited) + 9 * 60 * 60);
		$result['smartphone_pages']['published'] = $published === '0000-00-00 00:00:00' ? '' : date("Y/m/d H:i:s",strtotime($published) + 9 * 60 * 60);

		// 取得したデータの編集ユーザIDと書き出しユーザIDを変数に代入する(編集ユーザが存在しなければ、編集ユーザは更新ユーザとする)
		$editedUserId = $result['smartphone_pages']['edited_user_id'] === '0' ? $result['smartphone_pages']['user_id'] : $result['smartphone_pages']['edited_user_id'];
		$publishedUserID = $result['smartphone_pages']['published_user_id'];

		// 編集ユーザIDと書き出しユーザIDのユーザ名を取得し、配列に代入する
		$users = ClassRegistry::init('users');
		$options = array(
			'conditions'		=> array(
				'users.id'			=> array($editedUserId, $publishedUserID)
			)
		);
		$result2 = $users->find('all', $options);
		$usersData = array();
		for ($i=0,$len=count($result2); $i<$len; $i++) {
			$usersData['userId_' . $result2[$i]['users']['id']] = $result2[$i]['users']['name'];
		}

		// 編集ユーザIDと書き出しユーザIDをユーザ名に変換して代入する
		$result['smartphone_pages']['edited_user_name'] = $usersData['userId_' . $editedUserId];
		$result['smartphone_pages']['published_user_name'] = $usersData['userId_' . $publishedUserID];

		return $result['smartphone_pages'];
	}
	*/

	/*
	 * 指定されたソースを書き込むメソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	#request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _setPageSource($isCorrect, $request) {
		if ($isCorrect === true) {
			// error_log("----- _setPageSource -----\n", 3, 'log.txt');
			/*
			$options = array(
				'conditions'		=> array(
					'id'			=> $request->data['company_id']
				)
			);
			$companyInfo = ClassRegistry::init('companies')->find('first', $options);
			$base_url = preg_replace('/\/$/', '', $companyInfo['companies']['url']) . '/';
			error_log("companyInfo.url = " . $companyInfo['companies']['url'] . "\n", 3, 'log.txt');
			error_log("base_url = " . $base_url . "\n", 3, 'log.txt');

			$options2 = array(
				'conditions'		=> array(
					'id'			=> $request->data['residence_id']
				)
			);
			$residenceInfo = ClassRegistry::init('residences')->find('first', $options2);
			$base_path = preg_replace("/^\/(.*)\/$/", "$1", $residenceInfo['residences']['path']);
			error_log("residences.path = " . $residenceInfo['residences']['path'] . "\n", 3, 'log.txt');
			error_log("base_path = " . $base_path . "\n", 3, 'log.txt');
			$base_path = $base_path === '' ? $base_path : $base_path . '/';
			error_log("base_path = " . $base_path . "\n", 3, 'log.txt');
			error_log("request.path = " . $request->data['path'] . "\n", 3, 'log.txt');

			$path = preg_replace('/^\//', '', $request->data['path']);
			$url = $base_url . $base_path . $path;
			*/

			// smartphone_pages.sourceに書きだされたソースと保存済みのキーワード、デスクリプションを書き込む
			$this->bindModel(
				array(
					'hasMany'		=> array(
						'page_tags'			=> array(
							'foreignKey'	=> 'page_id',
							'conditions'	=> array(
								'page_tags.device_num'		=> 2
							),
							'order'			=> 'page_tags.order ASC'
						)
					)
				)
			);
			$options = array(
				'conditions'		=> array(
					'Page_Smartphone_PublishConcretePageAction.id'			=> $request->data['id']
				)
			);
			$result = $this->find('first', $options);
			// var_dump($result);
			$tagsArr = array();
			for ($i=0,$len=count($result['page_tags']); $i<$len; $i++) {
				array_push($tagsArr, $result['page_tags'][$i]['tag_code']);
			}
			$source = array(
				'source'			=> $request->data['source'],
				'keywords'			=> $result['Page_Smartphone_PublishConcretePageAction']['keywords'],
				'description'		=> $result['Page_Smartphone_PublishConcretePageAction']['description'],
				'tag_code'			=> implode($tagsArr, "\n")
			);

			// error_log("url = " . $url . "\n", 3, 'log.txt');
			// error_log("----- _setPageSource -----\n", 3, 'log.txt');

			$data = array(
			// $this->data = array(
				'id'						=> $request->data['id'],
				'user_id'					=> $request->data['user_id'],
				'published'					=> date('c'),
				'published_user_id'			=> $request->data['user_id'],
				// 'url'				=> $url,
				// 'path'						=> $request->data['path'],
				// 'title'						=> $request->data['title'],
				'source'					=> json_encode($source)
				// 'source'			=> $request->data['source']
			);
			if (isset($data->request['path']) === true) {
				$data['path'] = $data->request['path'];
			}
			if (isset($data->request['title']) === true) {
				$data['title'] = $data->request['title'];
			}
			// $this->data = $data
			// $isCorrect = is_array($this->save($data));
			// return array('isCorrect'=>$isCorrect, 'data'=>$data);
			return is_array($this->save($data));
			// return is_array($this->save($this->data));
		} else {
			return false;
		}
	}
}
