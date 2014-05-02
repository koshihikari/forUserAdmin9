<?php

class ErrorController extends AppController {
	var $layout = 'codeless_0.0.2';
	var $components = array('Auth', 'RequestHandler');

	public function beforeFilter() {
		parent::beforeFilter();
		$this->Auth->allow('*');
	}


	public function index($errorMessage) {
		$this->set(
			array(
				'errorMessage'			=> ''
			)
		);
		$this->render("../Contents/Error/indexInError");
	}
}
