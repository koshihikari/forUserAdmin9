<?php

class OutlineController extends AppController {
	var $layout = 'codeless_0.0.2';
	// var $layout = 'codeless_0.0.2a';
	var $components = array('Auth', 'RequestHandler');

	public function beforeFilter() {
		parent::beforeFilter();
		$this->Auth->allow('getFieldList');
	}

	public function edit($residence_id) {
		$device = 's';
		// echo 'aaa';
		// return;
		$device_name = $this->getDeviceName($device);
		$user_data = $this->Auth->user();

		// if ($device === 's') {
			$residences = ClassRegistry::init('residences')->find('first', array('conditions'=>array('id'=>$residence_id)));
			$mtr_outlines = ClassRegistry::init('mtr_outlines')->find('all', array('order'=>'order'));
			$fixed_mtr_outlines = array();
			for($i=0,$len=count($mtr_outlines); $i<$len; $i++) {
				array_push($fixed_mtr_outlines, $mtr_outlines[$i]['mtr_outlines']);
			}
			$result = ClassRegistry::init('Outline_GetOutlineAction')->getOutline($residence_id, $user_data['id']);
			$support_device = ClassRegistry::init('Device_GetSupportDeviceAction')->getSupportDevice($residence_id);
			// debug($result['mtr_statuses']);
			// debug($result['residences']['residences']);
			// return;
			$this->set(
				array(
					'device'				=> $device,
					'deviceName'			=> $device_name,
					'residenceId'			=> $residence_id,
					'targetDeviceName'		=> 'Smartphone',
					'title_for_layout'		=> '【' . $residences['residences']['name'] . '】物件概要編集',
					'companyId'				=> $user_data['company_id'],
					'userData' 				=> $user_data,
					'supportDevice'			=> $support_device,
					'mtr_outlines'			=> json_encode($fixed_mtr_outlines),
					'result'				=> $result,
					'residences'			=> $residences,
					// 'userId'				=> $userInfo['id'],
					// 'data'					=> $result['fields'],
					// 'visibilityId'			=> $result['visibilityId'],
					// 'statuses'				=> $result['mtr_statuses'],
					// 'residences'			=> $result['residences']['residences'],
					'modified'				=> $this->modified
				)
			);
		// }

		$this->render("../Contents/Outline/editInOutlineOnPcToSmartPhone");
	}



	/*********************************************************************
	 * ここからeditページ用ajax
	 *********************************************************************/
	/*
	 * データ並び替えメソッド
	 * @param	void
	 * @return	json
	 */
	public function reorder() {
		$this->autoRender = false;
		$this->autoLayout = false;

		$action = ClassRegistry::init('Outline_ReorderAction');
		$json = $action->reorder($this->request);

		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');

		return new CakeResponse(array('body' => json_encode($json)));
	}
	/*
	 * 物件データ更新メソッド
	 * @param	void
	 * @return	json
	 */
	public function updateResidence() {
		$this->autoRender = false;
		$this->autoLayout = false;

		$action = ClassRegistry::init('Outline_UpdateResidenceAction');
		$json = $action->updateResidence($this->request);

		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');

		return new CakeResponse(array('body' => json_encode($json)));
	}
	/*
	 * カテゴリ追加メソッド
	 * @param	void
	 * @return	json
	 */
	public function addCategory() {
		$this->autoRender = false;
		$this->autoLayout = false;

		$action = ClassRegistry::init('Outline_AddCategoryAction');
		$json = $action->addCategory($this->request);

		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');

		// $json = array('result'=>true);
		return new CakeResponse(array('body' => json_encode($json)));
	}
	/*
	 * カテゴリ削除メソッド
	 * @param	void
	 * @return	json
	 */
	public function delCategory() {
		$this->autoRender = false;
		$this->autoLayout = false;

		$action = ClassRegistry::init('Outline_DelCategoryAction');
		$json = $action->delCategory($this->request);

		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');

		// $json = array('result'=>true);
		return new CakeResponse(array('body' => json_encode($json)));
	}
	/*
	 * カテゴリー更新メソッド
	 * @param	void
	 * @return	json
	 */
	public function updateCategory() {
		$this->autoRender = false;
		$this->autoLayout = false;

		$action = ClassRegistry::init('Outline_UpdateCategoryAction');
		$json = $action->updateCategory($this->request);

		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');

		return new CakeResponse(array('body' => json_encode($json)));
	}

	/*
	 * アイテム追加メソッド
	 * @param	void
	 * @return	json
	 */
	public function addItem() {
		$this->autoRender = false;
		$this->autoLayout = false;

		$action = ClassRegistry::init('Outline_AddItemAction');
		$json = $action->addItem($this->request);

		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');

		return new CakeResponse(array('body' => json_encode($json)));
	}
	/*
	 * アイテム削除メソッド
	 * @param	void
	 * @return	json
	 */
	public function delItem() {
		$this->autoRender = false;
		$this->autoLayout = false;

		$action = ClassRegistry::init('Outline_DelItemAction');
		$json = $action->delItem($this->request);

		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');

		return new CakeResponse(array('body' => json_encode($json)));
	}
	/*
	 * アイテム更新メソッド
	 * @param	void
	 * @return	json
	 */
	public function updateItem() {
		$this->autoRender = false;
		$this->autoLayout = false;

		$action = ClassRegistry::init('Outline_UpdateItemAction');
		$json = $action->updateItem($this->request);

		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');

		return new CakeResponse(array('body' => json_encode($json)));
	}
	/*
	 * 全データ差し替えメソッド
	 * @param	void
	 * @return	json
	 */
	public function replaceData() {
		$this->autoRender = false;
		$this->autoLayout = false;

		$action = ClassRegistry::init('Outline_ReplaceDataAction');
		$json = $action->replaceData($this->request);

		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');

		return new CakeResponse(array('body' => json_encode($json)));
	}









	/*
	 * Fieldデータ挿入メソッド
	 * @param	void
	 * @return	json
	 */
	/*
	public function insertField() {
		$this->autoRender = false;
		$this->autoLayout = false;

		$action = ClassRegistry::init('Outline_InsertFieldAction');
		$json = $action->insertField($this->request);

		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');

		return new CakeResponse(array('body' => json_encode($json)));
	}
	*/

	/*
	 * Fieldデータ削除メソッド
	 * @param	void
	 * @return	json
	 */
	/*
	public function deleteField() {
		$this->autoRender = false;
		$this->autoLayout = false;

		$action = ClassRegistry::init('Outline_DeleteFieldAction');
		$json = $action->deleteField($this->request);

		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');

		return new CakeResponse(array('body' => json_encode($json)));
	}
	*/

	/*
	 * Fieldデータ並び替えメソッド
	 * @param	void
	 * @return	json
	 */
	/*
	public function reorderField() {
		$this->autoRender = false;
		$this->autoLayout = false;

		$action = ClassRegistry::init('Outline_ReorderFieldAction');
		$json = $action->reorderField($this->request);

		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');

		return new CakeResponse(array('body' => json_encode($json)));
	}
	*/

	/*
	 * Fieldデータ更新メソッド
	 * @param	void
	 * @return	json
	 */
	/*
	public function updateField() {
		$this->autoRender = false;
		$this->autoLayout = false;

		$action = ClassRegistry::init('Outline_UpdateFieldAction');
		$json = $action->updateField($this->request);

		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');

		return new CakeResponse(array('body' => json_encode($json)));
	}

	/*
	 * Fieldデータ更新メソッド
	 * @param	void
	 * @return	json
	 */
	/*
	public function saveFRK() {
		$this->autoRender = false;
		$this->autoLayout = false;

		$action = ClassRegistry::init('Outline_SaveFRKAction');
		$json = $action->saveFRK($this->request);

		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');

		return new CakeResponse(array('body' => json_encode($json)));
	}
	*/



	/*********************************************************************
	 * ここからeditInPageページ用ajax
	 *********************************************************************/
	/*
	 * Fieldリスト取得メソッド
	 * @param	void
	 * @return	json
	 */
	public function getFieldList() {
		$this->autoRender = false;
		$this->autoLayout = false;

		$action = ClassRegistry::init('Outline_GetFieldListAction');
		$json = $action->getFieldList($this->request);

		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');

		return new CakeResponse(array('body' => json_encode($json)));
	}
}
