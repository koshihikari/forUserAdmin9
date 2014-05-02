<?php

class Page_Smartphone_GetPageListOfCompanyAction extends AppModel {
	public $useTable = 'smartphone_pages';

	/*
	 * 指定された企業のサイト別ページリスト取得メソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function getPageListOfCompany($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		if ($request->isPost()) {
			if (
				isset($request->data['companyId'])
			) {
				$result = $this->_getPageListOfCompany($request);
				$json = array('result'=>true, 'data'=>$result);
			}
		}
		return $json;
	}

	/*
	 * 指定された企業のサイト別ページリスト取得メソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	private function _getPageListOfCompany($request) {
		$model = ClassRegistry::init('residences');
		$model->bindModel(
			array(
				'hasMany'		=> array(
					'smartphone_pages'			=> array(
						'foreignKey'	=> 'residence_id',
						'order'			=> 'order ASC'
					)
				)
			)
		);
		$options = array(
			'conditions'	=> array(
				'residences.company_id'=>$request->data['companyId']
			),
			'order'			=> array(
				'residences.order ASC'
			)
		);

		$requestData = $model->find('all', $options);
		return $requestData;
	}
}
