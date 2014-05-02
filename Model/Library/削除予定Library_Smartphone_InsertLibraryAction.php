<?php

class Library_Smartphone_InsertLibraryAction extends AppModel {
	public $useTable = 'smartphone_libraries';
	
	/*
	 * Elementデータ挿入メソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function insertLibrary($request) {
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

				$options = array(
					'conditions'	=> array(
						'residence_id'=>$request->data['residence_id']
					)
				);
				$count = $this->find('count', $options);
				$createData = array(
					// 'device_num'			=> $request->data['device_num'],
					'residence_id'			=> $request->data['residence_id'],
					'order'					=> $count + 1,
					'status_id'				=> 5,
					'title'					=> '新規共通パーツ('.date('Y-m-d H_i_s').')',
					'is_editable'			=> 1,
					'user_id'				=> $request->data['user_id'],
					'property'				=> json_encode($property)
				);
				if (is_array($this->save($createData))) {
					$this->bindModel(
						array(
							'belongsTo'		=> array(
								'users'			=> array(
									'foreignKey'	=> 'user_id'
								),
								'mtr_statuses'			=> array(
									'foreignKey'	=> 'status_id'
								)
							)
						)
					);
					$options = array(
						'conditions'	=> array(
							'Library_Smartphone_InsertLibraryAction.id'	=> $this->getLastInsertID()
						)
					);
					$requestData = $this->find('first', $options);
					$requestData['Library_Smartphone_InsertLibraryAction']['modified'] = date("Y年m月d日 H時i分s秒",strtotime($requestData['Library_Smartphone_InsertLibraryAction']['modified']) + 9 * 60 * 60);
					$requestData['smartphone_libraries'] = $requestData['Library_Smartphone_InsertLibraryAction'];
					unset($requestData['Library_Smartphone_InsertLibraryAction']);
					$json = array('result'=>true, 'data'=>$requestData);

					// $json = array('result'=>true, 'json_data'=>array('id'=>$this->getLastInsertID()));
				} else {
					$json = array('result'=>false, 'message'=>'ページ追加に失敗しました。');
				}
			}
		}
		return $json;
	}
}
