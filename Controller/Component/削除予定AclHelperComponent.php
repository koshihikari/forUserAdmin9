<?php

class AclHelperComponent extends Component {
	private $dataObj	= array();

	public function getDAta($userName, $controllerName, $actionName, $crudActionName) {
		return $this->Acl->check($useName, ($controllerName . '/' . $actionName), $coudActionName);
	}
}