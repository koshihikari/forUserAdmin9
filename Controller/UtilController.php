<?php

class UtilController extends AppController {
	var $layout = 'codeless_0.0.2';
	var $components = array('Auth', 'Acl', 'RequestHandler');

	public function beforeFilter() {
		parent::beforeFilter();
		$this->Auth->allow('setAcl', 'editARO', 'output', 'sample');
	}


	public function setAcl() {
		return;
		$this->autoRender = false;
		$this->autoLayout = false;
		$this->makeARO();

		$options = array(
			'fields'		=> array('id')
		);
		$result = ClassRegistry::init('users')->find('all', $options);
		$userIds = array();
		for ($i=0,$len=count($result); $i<$len; $i++) {
			array_push($userIds, $result[$i]['users']['id']);
		}
		ob_start();//ここから
		var_dump($userIds);
		$out=ob_get_contents();//ob_startから出力された内容をゲットする。
		ob_end_clean();//ここまで
		error_log('-----------------' . "\n", 3, 'log.txt');
		error_log($out . "\n", 3, 'log.txt');
		error_log('-----------------' . "\n", 3, 'log.txt');
		$this->makeARO2($userIds, 1);
		// $this->makeARO2($userIds, 2);
		// $this->makeARO2($userIds, 1);

		$acoNames = array(
			'Library->catalog'
			, 'Library->edit'
			, 'Library->_doMethod'
			, 'Library->getLibraryList'
			, 'Library->addDirectory'
			, 'Library->duplicateDirectory'
			, 'Library->delDirectory'
			, 'Library->reorderDirectory'
			, 'Library->renameDirectory'
			, 'Library->addLibrary'
			, 'Library->duplicateLibrary'
			, 'Library->delLibrary'
			, 'Library->reorderLibrary'
			, 'Library->renameLibrary'
			, 'Library->moveLibrary'

			, 'Outline->reorder'
			, 'Outline->updateResidence'
			, 'Outline->addCategory'
			, 'Outline->delCategory'
			, 'Outline->updateCategory'
			, 'Outline->addItem'
			, 'Outline->delItem'
			, 'Outline->updateItem'
			, 'Outline->replaceData'
			, 'Outline->getFieldList'
			, 'Outline->edit'

			, 'Page->catalog'
			, 'Page->edit'
			, 'Page->detail'
			, 'Page->preview'
			, 'Page->getPageList'
			, 'Page->insertPage'
			, 'Page->deletePage'
			, 'Page->updatePage'
			, 'Page->getElementList'
			, 'Page->insertElement'
			, 'Page->deleteElement'
			, 'Page->updateElement'
			, 'Page->reorderElement'
			, 'Page->updatePageProperty'
			, 'Page->editTableElement'
			, 'Page->getPageListOfCompany'
			, 'Page->publishConcretePage'
			, 'Page->setPageSource'

			, 'Residence->catalog'
			, 'Residence->updateResidenceData'

			, 'User->login'
			, 'User->logout'
			, 'User->add'

			, 'Util->setAcl'
			, 'Util->makeARO'
			, 'Util->makeARO2'
			, 'Util->makePermission'
			, 'Util->tagrefresh'
		);
		$this->makeACO($acoNames);
		$this->makePermission($acoNames);

		// $this->printInfo();
		echo 'fin';
	}
	private function _makeARO() {
		$aro = new ARO();
		$groups = array(
			array('alias' => 'admin'),
			array('alias' => 'member'),
			array('alias' => 'guest')
			// 1 => array('alias' => 'admin'),
			// 2 => array('alias' => 'member'),
			// 3 => array('alias' => 'guest')
		);
		foreach ($groups as $data) {
			$aro->create();
			$aro->save($data);
		}
	}
	private function _makeARO2($userIds, $parentId) {
		$aro = new ARO();
		// $result = ClassRegistry::init('users')->find('all', $options);
		foreach ($userIds as $userId) {
			$aro->create();
			$aro->save(array('alias' => $userId, 'parent_id' => $parentId));
		}
	}
	public function editARO() {
		return;
		$aro = new ARO();
		$aro->save(array('id' => 23, 'alias' => '22', 'parent_id' => 3));
		echo 'fin';
	}
	private function _makeACO($acoNames) {
		$aco = new ACO();
		// $acos = ClassRegistry::init('acos');
		foreach ($acoNames as $acoName) {
			// if (0 === $acos->find('count', array('conditions'=>array('alias'=>$acoName)))) {
				$aco->create();
				$aco->save(array('alias' => $acoName));
			// }
		}
	}
	private function _makePermission($acoNames) {
		foreach ($acoNames as $acoName) {
			$this->Acl->allow('admin', $acoName);
			$this->Acl->allow('member', $acoName);
			$this->Acl->deny('member', $acoName, 'create');
			$this->Acl->deny('member', $acoName, 'delete');
			$this->Acl->deny('guest', $acoName);
			$this->Acl->allow('guest', $acoName, 'read');
		}
	}
	/*
	 * 物件/ページ/ライブラリ複製メソッド
	 * @param	void
	 * @return	json
	 */
	public function duplicate() {
		$this->autoRender = false;
		$this->autoLayout = false;
		$json = array('result'=>false, 'message'=>'値が渡されていません');
		if (
			$this->request->isPost() &&
			isset($this->request->data['device_num'])
		) {
			if ($this->request->data['device_num'] === '2') {
				$Action = ClassRegistry::init('Util_Smartphone_DuplicateAction');
				$json = $Action->duplicate($this->request);
			// } else if ($this->request->data['device_num'] === '8') {
			// 	$Action = ClassRegistry::init('Page_Featurephone_GetPageListAction');
			// 	$json = $Action->getPageList($this->request);
			}
		}
		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');

		return new CakeResponse(array('body' => json_encode($json)));
	}


	/*
	 * 指定された企業のページID、URL、タイトル等出力メソッド
	 * @param	void
	 * @return	json
	 */
	public function output() {
		$Action = ClassRegistry::init('Util_OutputAction');
		$data = $Action->getPageInfo($this->request);

		$this->set(
			array(
				'title_for_layout'	=> 'codeless作成済みページデータ出力ページ',
				'data'				=> $data,
				'is_summarize'		=> isset($this->request->data['is_summarize']) ? $this->request->data['is_summarize'] : 0
			)
		);

		$this->render("../Contents/Util/output", "output");
	}


	/*
	 * 指定された企業のページID、URL、タイトル等出力メソッド
	 * @param	void
	 * @return	json
	 */
	public function tagrefresh() {
		$this->autoRender = false;
		$this->autoLayout = false;
		$Action = ClassRegistry::init('Util_TagRefreshAction');
		$data = $Action->tagrefresh($this->request);

		if ($data['result'] === true) {
			echo 'ok';
			debug($data['data']);
		} else {
			echo 'error';
		}
	}


	public function sample() {
		$this->autoRender = false;
		$this->autoLayout = false;
		$this->RequestHandler->setContent('json');
		$this->RequestHandler->respondAs('application/json; charset=UTF-8');
		$json = array(
			'result'		=> true,
			'data'			=> ClassRegistry::init('smartphone_library_directories')->find('all')
		);
		return new CakeResponse(array('body' => json_encode($json)));
	}
}
