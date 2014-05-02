<?php

class ResidenceController extends AppController {
	var $layout = 'codeless_0.0.2';
	var $components = array('Auth', 'RequestHandler');

	public function beforeFilter() {
		parent::beforeFilter();
	}
	/*
	 * ページ一覧ページ表示メソッド
	 * @param	void
	 * @return	json
	 */
	public function catalog($device="p") {
		$deviceName = $this->getDeviceName($device);
		$userData = $this->Auth->user();
		// $this->printInfo();
		$catalog = ClassRegistry::init('Residence_ResidenceCatalogAction')->getResidenceCatalog($userData['company_id']);
		$this->set(
			array(
				'device'				=> $device,
				'deviceName'			=> $deviceName,
				'forStaticUrl'			=> $this->getUrl('forStatic'),
				'title_for_layout'		=> $catalog['residenceSites'][0]['companies']['name'] . '様の物件一覧',
				'userData' 				=> $userData,
				'catalog'				=> $catalog,
				'companySites'			=> $catalog['companySites'],
				'residenceSites'		=> $catalog['residenceSites'],
				'modified'				=> $this->modified
			)
		);
		$this->render("../Contents/Residence/catalogInResidence");
	}



	/*********************************************************************
	 * ここからeditページ用ajax
	 *********************************************************************/
	/*
	 * 物件番号変更メソッド
	 * @param	void
	 * @return	json
	 */
	public function updateResidenceData() {
		$this->autoRender = false;
		$this->autoLayout = false;

		$Action = ClassRegistry::init('Residence_UpdateResidenceDataAction');
		$json = $Action->updateResidenceData($this->request);

		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');

		return new CakeResponse(array('body' => json_encode($json)));
	}
}
