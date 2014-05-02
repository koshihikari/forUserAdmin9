<?php
/**
 * Application model for Cake.
 *
 * This file is application-wide model file. You can put all
 * application-wide model-related methods here.
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
 * @package       app.Model
 * @since         CakePHP(tm) v 0.2.9
 * @license       MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

App::uses('Model', 'Model');

/**
 * Application model for Cake.
 *
 * Add your application-wide methods in the class below, your models
 * will inherit them.
 *
 * @package       app.Model
 */
class AppModel extends Model {
	var $_timezoneInit = false;

	public function beforeFind($queryData) {
		// error_log('AppModel :: beforeFind :: fields = ' . $queryData['fields'] . "\n", 3, 'log.txt');
		// error_log('AppModel :: beforeFind :: order = ' . $queryData['order'] . "\n", 3, 'log.txt');
	}
	function setDataSource($dataSource = null) {
		// error_log('AppModel :: setDataSource :: $dataSource = ' . $dataSource . ', $this->_timezoneInit = ' . $this->_timezoneInit . "\n", 3, 'log.txt');
		$r = parent::setDataSource($dataSource);
		if ($this->_timezoneInit === false) {
			// error_log('AppModel :: setDataSource :: 補正' . "\n", 3, 'log.txt');
			$db = ConnectionManager::getDataSource($this->useDbConfig);
			$db->query("SET time_zone = '+9:00'");
			$this->_timezoneInit = true;
		}
		return $r;
	}
}
