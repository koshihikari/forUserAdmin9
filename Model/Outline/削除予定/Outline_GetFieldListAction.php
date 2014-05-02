<?php

class Outline_GetFieldListAction extends Model {
	public $useTable = 'outlines';
	
	/*
	 * スマホ用ページのエレメントデータを取得するメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function getFieldList($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		// error_log('$request->isPost() = ' . $request->isPost() . "\n", 3, 'log.txt');
		if ($request->isPost()) {
			// error_log('isset($request->data[residence_id]) = ' . isset($request->data['residence_id']) . "\n", 3, 'log.txt');
			if (
				isset($request->data['residence_id'])
			) {
				// $isError = false;
				// error_log('スマホページ用エレメントデータ取得処理開始' . "\n", 3, 'log.txt');

				$this->bindModel(
					array(
						'belongsTo'		=> array(
							'mtr_outlines'			=> array(
								'foreignKey'	=> 'mtr_outline_id'
							)
						)
					)
				);
				$option = array(
					'conditions'	=> array(
						'Outline_GetFieldListAction.residence_id'=>$request->data['residence_id'],
						'Outline_GetFieldListAction.mtr_status_id'=>7
					),
					'order'			=> array(
						'Outline_GetFieldListAction.order ASC'
					)
				);
				
				$requestData = $this->find('all', $option);

				for ($i=0,$len=count($requestData); $i<$len; $i++) {
					$requestData[$i]['Outline_GetFieldListAction']['modified'] = date("Y年m月d日 H時i分s秒",strtotime($requestData[$i]['Outline_GetFieldListAction']['modified']) + 9 * 60 * 60);
					$requestData[$i]['outlines'] = $requestData[$i]['Outline_GetFieldListAction'];
					unset($requestData[$i]['Outline_GetFieldListAction']);
				}
				$json = array('result'=>true, 'data'=>$requestData);
				// error_log($result . "\n", 3, 'log.txt');
			}
		}
		return $json;
	}
}
