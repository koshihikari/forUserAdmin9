<?php

class Library_GetLibraryListAction extends Model {
	public $useTable = 'smartphone_libraries';
	
	/*
	 * スマホ用ページのエレメントデータを取得するメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function getLibraryList($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		if ($request->isPost()) {
			if (
				isset($request->data['residence_id'])
			) {
				// $isError = false;
				// error_log('スマホページ用エレメントデータ取得処理開始' . "\n", 3, 'log.txt');

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
				$option = array(
					'conditions'	=> array(
						'Library_GetLibraryListAction.residence_id'=>$request->data['residence_id']
					),
					'order'			=> array(
						'Library_GetLibraryListAction.order ASC'
					)
				);
				
				$requestData = $this->find('all', $option);

				for ($i=0,$len=count($requestData); $i<$len; $i++) {
					$requestData[$i]['Library_GetLibraryListAction']['modified'] = date("Y年m月d日 H時i分s秒",strtotime($requestData[$i]['Library_GetLibraryListAction']['modified']) + 9 * 60 * 60);
					$requestData[$i]['smartphone_libraries'] = $requestData[$i]['Library_GetLibraryListAction'];
					unset($requestData[$i]['Library_GetLibraryListAction']);
				}
				$json = array('result'=>true, 'data'=>$requestData);
				// error_log($result . "\n", 3, 'log.txt');
			}
		}
		return $json;
	}
}
