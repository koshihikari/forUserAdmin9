<?php

class UsersController extends AppController {
	var $layout = 'codeless_0.0.2';
	var $name = 'Users';
	var $components = array('Auth');

	public function beforeFilter() {
		$this->Auth->allow('login', 'logout', 'add');
	}

	public function login() {
		if ($this->request->isPost()) {
			if ($this->Auth->login()) {
				$this->redirect(array('controller'=>'Main', 'action'=>''));
				// $this->redirect(array('controller'=>'Residence', 'action'=>'catalog'));
			} else {
				$this->Session->setFlash('ユーザ名かパスワードが違います。', 'default', array(), 'auth');
			}
		}
		$deviceName = $this->getDeviceName('p');
		$this->set(
			array(
				'deviceName'			=> $deviceName,
				'title_for_layout'		=> 'ログイン',
				'modified'				=> filemtime("../webroot/history.html")
			)
		);
		$this->render("../Contents/User/loginInUser");
	}

	public function logout() {
		$this->Auth->logout();
		$deviceName = $this->getDeviceName('p');
		$this->set(
			array(
				'deviceName'			=> $deviceName,
				'title_for_layout'		=> 'ログアウト完了',
				'modified'				=> $this->modified
			)
		);
		$this->render("../Contents/User/logoutInUser");
	}








	/*
	 * テスト様に用意したメソッド。本番環境では削除する
	 */
	public function add() {
		if (!empty($this->data)) {
			if ($this->data) {
				$this->User->create();
				$this->User->save($this->data);
				$this->redirect(array('action'=>'login'));
			}
		} else {
			$deviceName = $this->getDeviceName('p');
			$this->set(
				array(
					'deviceName'			=> $deviceName,
					'modified'				=> $this->modified
				)
			);
			$this->render("../Contents/User/addInUser");
		}
	}






	public function edit() {
		echo 'editInUser';
		return;
	}

	public function edit_password() {
		echo 'editPasswordInUser';
		return;
	}
}
