<?php

class DataManagerComponent extends Component {
	private $dataObj	= array();

	public function getDAta($key) {
		return $this->dataObj[$key];
	}

	public function setData($key, $data) {
		$this->dataObj[$key] = $data;
	}
}