<?php

class Main_GetOutlinePageIdsAction extends AppModel {
	public $useTable = 'smartphone_library_directories';
	public $actsAs = array('GetOutlinePageIds');

	/*
	 * 物件概要パーツが含まれるスマホページIDを返すメソッド
	 * @param	$residenceIds		物件ID配列(この配列に指定されている物件IDのページから物件概要パーツが含まれるページIDを返す)
	 * @return	物件概要パーツが含まれるページID配列
	 */
	public function getOutlineSpPageIds($residenceIds) {
		return $this->getOutlinePageIdsForSp($residenceIds);
	}
}
