<?php

class Device_GetSupportDeviceAction extends Model {
	public $useTable = 'residences';
	
	/*
	 * 引数で指定された企業の物件データを取得するメソッド
	 * @param	companyId		企業ID
	 * @return	物件データ
	 */
	public function getSupportDevice($residenceId) {
		$data = $this->find('first', array('conditions'=>array('Device_GetSupportDeviceAction.id'=>$residenceId)));
		$supportDevice = array(
			'isPc'				=> false,
			'isSmartphone'		=> false,
			'isTablet'			=> false,
			'isFeaturephone'	=> false
		);
		switch ($data['Device_GetSupportDeviceAction']['support_device_num']) {
			case (1):
				$supportDevice['isPc'] = true;
				break;
			case (2):
				$supportDevice['isSmartphone'] = true;
				break;
			case (3):
				$supportDevice['isPc'] = true;
				$supportDevice['isSmartphone'] = true;
				break;
			case (4):
				$supportDevice['isTablet'] = true;
				break;
			case (5):
				$supportDevice['isPc'] = true;
				$supportDevice['isTablet'] = true;
				break;
			case (6):
				$supportDevice['isSmartphone'] = true;
				$supportDevice['isTablet'] = true;
				break;
			case (7):
				$supportDevice['isPc'] = true;
				$supportDevice['isSmartphone'] = true;
				$supportDevice['isTablet'] = true;
				break;
			case (8):
				$supportDevice['isFeaturephone'] = true;
				break;
			case (9):
				$supportDevice['isPc'] = true;
				$supportDevice['isFeaturephone'] = true;
				break;
			case (10):
				$supportDevice['isSmartphone'] = true;
				$supportDevice['isFeaturephone'] = true;
				break;
			case (11):
				$supportDevice['isPc'] = true;
				$supportDevice['isSmartphone'] = true;
				$supportDevice['isFeaturephone'] = true;
				break;
			case (12):
				$supportDevice['isTablet'] = true;
				$supportDevice['isFeaturephone'] = true;
				break;
			case (13):
				$supportDevice['isPc'] = true;
				$supportDevice['isTablet'] = true;
				$supportDevice['isFeaturephone'] = true;
				break;
			case (14):
				$supportDevice['isSmartphone'] = true;
				$supportDevice['isTablet'] = true;
				$supportDevice['isFeaturephone'] = true;
				break;
			case (15):
				$supportDevice['isPc'] = true;
				$supportDevice['isSmartphone'] = true;
				$supportDevice['isTablet'] = true;
				$supportDevice['isFeaturephone'] = true;
				break;
		}
		return $supportDevice;
	}
}
