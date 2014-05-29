<?php
/**
 * Application level Controller
 *
 * This file is application-wide controller file. You can put all
 * application-wide controller-related methods here.
 *
 * PHP 5
 *
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright 2005-2012, Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright 2005-2012, Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @package       app.Controller
 * @since         CakePHP(tm) v 0.2.9
 * @license       MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

App::uses('Controller', 'Controller');

/**
 * Application Controller
 *
 * Add your application-wide methods in the class below, your controllers
 * will inherit them.
 *
 * @package       app.Controller
 * @link http://book.cakephp.org/2.0/en/controllers.html#the-app-controller
 */
class AppController extends Controller {
	public $helpers = array('Html', 'Form', 'Less.Less');
	public $components = array('Auth', 'Session');
	public $modified = -1;
	// public $layout = 'custom';
//	public $layout = 'default';
	public $autoRender = false;
//	public $autoLayout = false;
	var $ext = '.html';
	var $isEnable = array();
	var $permissions = array();
	var $userType = '';
	// var $errorMessage = '';
//	var $ext = '.ctp';
	private $urls = array(
		'forStatic'		=> 'http://localhost/primex/px/cms/workspace/cms/forResidence2/'
	);




	public function showError($errorMessage) {
		// debug($errorMessage);
		$this->set(
			array(
				// 'errorMessage'			=> 'あいうえお',
				'errorMessage'			=> $errorMessage,
				'device'				=> 's',
				'deviceName'			=> 'sp',
				'modified'				=> $this->modified

			)
		);
		$this->render("../Contents/Error/indexInError");
		return;
	}
	public function beforeFilter() {
		// parent::beforeFilter();
		// $this->modified = '012345';
		$this->modified = filemtime("../webroot/history.html");

		$this->isEnable = array(
			'LibraryCatalog'		=> $this->isAdmin() === true || $this->isMember() === true ? true : false,
			'OutlineEdit'			=> $this->isAdmin() === true || $this->isMember() === true || $this->isGuest() === true ? true : false,

			'Page'					=> $this->isAdmin() === true || $this->isMember() === true ? true : false,
			'PageCatalog'			=> $this->isAdmin() === true || $this->isMember() === true ? true : false,

			'ResidenceCatalog'			=> $this->isAdmin() === true || $this->isMember() === true || $this->isGuest() === true ? true : false
		);
		$this->set(
			array(
				'isAdmin' 				=> $this->isAdmin(),
				'isCustomer'		 	=> $this->isCustomer(),
				'userData' 				=> $this->Auth->user(),
				'isEnable'				=> $this->isEnable
			)
		);
		// $this->printInfo();
	}

	public function isAdmin() {
		// return $this->userType === 'admin';
		return (int)$this->Auth->user('group_id') === 1 ? true : false;
	}
	public function isMember() {
		// return $this->userType === 'member';
		return (int)$this->Auth->user('group_id') === 2 ? true : false;
	}
	public function isGuest() {
		// return $this->userType === 'guest';
		return (int)$this->Auth->user('group_id') === 3 ? true : false;
	}
	public function isCustomer() {
		// return $this->userType === 'guest';
		return (int)$this->Auth->user('group_id') === 4 ? true : false;
	}
	// public function isRegistUser() {
	// 	return $this->userType !== '';
	// }
	public function printInfo() {
		$userData = $this->Auth->user();
		/*
		$this->permissions = array();
		if (isset($userData['id'])) {
			$actions = array('create', 'read', 'update', 'delete');
			// $acoName = $this->name;
			// $acoName = 'Residence->catalog';
			$acoName = $this->name . '->' . $this->action;
			$acoName = 'Outline->edit';
			foreach ($actions as $value) {
				// $this->permissions[$value] = $this->Acl->check("5", $acoName, $value);
				$this->permissions[$value] = $this->Acl->check($userData['id'], $acoName, $value);
			}
			$options = array(
				'conditions'		=> array(
					'alias'			=> $userData['id']
				)
			);
			$result = ClassRegistry::init('aros')->find('first', $options);
			switch ($result['aros']['parent_id']) {
				case 1:
					$this->userType = 'admin';
					break;
				case 2:
					$this->userType = 'member';
					break;
				case 3:
					$this->userType = 'guest';
					break;
				default:
					$this->userType = '';
					break;
			}
		}
		*/

		echo '<br />';
		echo '<br />';
		/*
		foreach ($this->permissions as $key => $value) {
			echo '$this->permissions[' . $key . '] = ' . $value;
			echo '<br />';
		}
		*/
		$userData = $this->Auth->user();
		foreach ($userData as $key => $value) {
			echo '$userData[' . $key . '] = ' . $value;
			echo '<br />';
		}
		echo 'isAdmin = ' . $this->isAdmin();
		echo '<br />';
		echo 'isMember = ' . $this->isMember();
		echo '<br />';
		echo 'isGuest = ' . $this->isGuest();
		echo '<br />';
		// echo 'isRegistUser = ' . $this->isRegistUser();
		// echo '<br />';
		echo 'name = ' . $this->name;
		echo '<br />';
		echo 'action = ' . $this->action;
		echo '<br />';
		echo 'fin';
	}

	// public function isEnable($actionName) {
	// 	$flg = false;
	// 	$groupId = $this->Auth->user('group_id');

	// 	switch($actionName) {
	// 		case 'Page->catalog':
	// 			$flg = $groupId === 1 || $groupId === 2 ? true : false;
	// 			return;
	// 	}
	// 	return $flg;
	// }

	public function getUrl($key) {
	//	error_log('getUrl' ."\n", 3, 'log.txt');
		return $this->urls[$key];
	}

	public function getDeviceName($device) {
		$deviceNameStr = 'pc';
		switch ($device) {
			case 'p':
				$deviceNameStr = 'Pc';
				break;

			case 's':
				$deviceNameStr = 'Smartphone';
				break;

			case 't':
				$deviceNameStr = 'Tablet';
				break;

			case 'f':
				$deviceNameStr = 'Featurephone';
				break;
		}

		return $deviceNameStr;
	}

	//UTF8でレンダリングされたHTMLデータをSJISに変換
	public function convert_output_encode(){
		$this->response->body(mb_convert_encoding($this->response->body(), 'Shift_JIS', 'UTF-8'));
	}

	//POSTされたデータをSJISからUTF8へ変換
	public function convert_input_encode(){
		if( !empty($this->data) ){
			mb_convert_variables('UTF-8', 'SJIS-win', $this->data);
		}
	}
}
