<?php

class Page_Smartphone_InsertPageAction extends AppModel {
	public $useTable = 'smartphone_pages';
	public $actsAs = array('Smartphone_GetPageInfo');

	/*
	 * Elementデータ挿入メソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function insertPage($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		if ($request->isPost()) {
			// error_log("\n", 3, 'log.txt');
			// error_log("PageCreateAction :: createPage\n", 3, 'log.txt');
			// error_log('device = ' . $request->data['device'] . "\n", 3, 'log.txt');
			// error_log('residence_id = ' . $request->data['residence_id'] . "\n", 3, 'log.txt');
			// error_log('user_id = ' . $request->data['user_id'] . "\n", 3, 'log.txt');
			// error_log('device_num = ' . $request->data['device_num'] . "\n", 3, 'log.txt');
			// error_log('order = ' . $request->data['order'] . "\n", 3, 'log.txt');
			if (
				isset($request->data['residence_id']) &&
				isset($request->data['user_id']) &&
				isset($request->data['device_num'])
			) {
				$options = array(
					'conditions'	=> array(
						'residence_id'=>$request->data['residence_id']
					)
				);
				$count = $this->find('count', $options);

				$options2 = array(
					'conditions'	=> array(
						'component_name'	=> array('Bg', 'Space')
					)
				);
				$result = ClassRegistry::init('mtr_smartphone_components')->find('all', $options2);
				$property = array();
				for ($i=0,$len=count($result); $i<$len; $i++) {
					$property[$result[$i]['mtr_smartphone_components']['component_name']] = json_decode($result[$i]['mtr_smartphone_components']['property']);
				}
				$createData = array(
					'residence_id'			=> $request->data['residence_id'],
					'order'					=> $count + 1,
					'status_id'				=> 1,
					'title'					=> '新規ページ('.date('Y-m-d H_i_s').')',
					'user_id'				=> $request->data['user_id'],
					'property'				=> json_encode($property)
				);
				if (is_array($this->save($createData))) {
					$result = $this->getPageInfo(false, $this->getLastInsertID());
					$json = array('result'=>true, 'data'=>$result);

					/*
					$this->bindModel(
						array(
							'belongsTo'		=> array(
								'users'			=> array(
									'foreignKey'	=> 'user_id'
								),
								'mtr_statuses'			=> array(
									'foreignKey'	=> 'status_id'
								)
							// ),
							// 'hasOne'		=> array(
							// 	'smartphone_concrete_pages'			=> array(
							// 		'foreignKey'	=> 'page_id'
							// 	)
							)
						)
					);
					$options = array(
						'conditions'	=> array(
							'Page_Smartphone_InsertPageAction.id'	=> $this->getLastInsertID()
						)
					);
					$requestData = $this->find('first', $options);
					$requestData['Page_Smartphone_InsertPageAction']['modified'] = date("Y年m月d日 H時i分s秒",strtotime($requestData['Page_Smartphone_InsertPageAction']['modified']) + 9 * 60 * 60);
					$requestData['smartphone_pages'] = $requestData['Page_Smartphone_InsertPageAction'];
					unset($requestData['Page_Smartphone_InsertPageAction']);
					$json = array('result'=>true, 'data'=>$requestData);

					// $json = array('result'=>true, 'json_data'=>array('id'=>$this->getLastInsertID()));
					*/
				} else {
					$json = array('result'=>false, 'message'=>'ページ追加に失敗しました。');
				}
			}
/*
			*/
		}
		return $json;
	}

	/*
	 * Tableエレメントのプロパティ上書きメソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _DEL_insertPage($isCorrect, $request) {
		if ($isCorrect === true) {
			$options = array(
				'conditions'	=> array(
					// 'device_num'=>$request->data['device_num'],
					'residence_id'=>$request->data['residence_id']
				)
			);
			$count = $this->find('count', $options);

			$options2 = array(
				'conditions'	=> array(
					'component_name'	=> array('Bg', 'Space')
				)
			);
			$result = ClassRegistry::init('mtr_smartphone_components')->find('all', $options2);
			$property = array();
			for ($i=0,$len=count($result); $i<$len; $i++) {
				$property[$result[$i]['mtr_smartphone_components']['component_name']] = json_decode($result[$i]['mtr_smartphone_components']['property']);
			}

			$data = array(
				// 'device_num'			=> $request->data['device_num'],
				'residence_id'			=> $request->data['residence_id'],
				'order'					=> $count + 1,
				'status_id'				=> 1,
				'title'					=> '新規ページ('.date('Y-m-d H_i_s').')',
				'user_id'				=> $request->data['user_id'],
				// 'property'				=> $property
				'property'				=> json_encode($property)
			);
			$result = $this->save($data);
			$this->latestInsertId = $this->getLastInsertID();
			return is_array($result);
		} else {
			return false;
		}
	}
}
