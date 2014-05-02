<?php

class ResidenceCompanyInfoAction extends Model {
	public $useTable = 'residences';
	
	/*
	 * 引数で指定された物件IDの企業データを取得するメソッド
	 * @param	residenceId		物件ID
	 * @return	企業データオブジェクト
	 */
	public function getCompanyInfo($residenceId) {
		$this->bindModel(
			array(
				'belongsTo'		=> array(
					'companies'			=> array(
						'foreignKey'	=> 'company_id'
					)
				)
			)
		);
		$option = array(
			'conditions'	=> array(
				'ResidenceCompanyInfoAction.id'=>$residenceId
			)
		);
		return $this->find('first', $option);
	}
}
