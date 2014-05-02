<?php

class FixecForSmartphoneElementsBehavior extends ModelBehavior {
	private $_elementData = array();
	// private $_tmp = '';

	/*
	 * パーツの並び順を正規化し、連番になっていないorderをなくすメソッド
	 * @param	$model				Model
	 * @param	#elementData		パーツデータ
	 * @return	正規化したパーツデータ
	 */
	public function fixed(Model $model, $elementData) {
		$this->_elementData = $elementData;
		// error_log('--------------' . "\n", 3, 'log.txt');
		// foreach ($elementData as $element_id => $obj) {
		// 	error_log('$elementData[' . $element_id . '][parentId] = ' . $elementData[$element_id]['parentId'] . "\n", 3, 'log.txt');
		// 	error_log("\n", 3, 'log.txt');
		// }
		// error_log('--------------' . "\n", 3, 'log.txt');
		$retArray = $this->_fixedOrderOfElementData('spContent');
		// foreach ($retArray as $elemnetId => $obj) {
		// 	error_log($elemnetId . "\n", 3, 'log.txt');
		// 	error_log('	smartphoneLibraryElementId = ' . $obj['smartphoneLibraryElementId'] . "\n", 3, 'log.txt');
		// 	error_log('	order = ' . $obj['order'] . "\n", 3, 'log.txt');
		// }
		// error_log("\n", 3, 'log.txt');
		$isSuccess = $this->_update($retArray);
		if (isset($this->_elementData['displayArea'])) {
			$retArray['displayArea'] = $this->_elementData['displayArea'];
		}
		// return $isSuccess;
		if ($isSuccess === true) {
			return array('result'=>true, 'data'=>$retArray);
			// return true;
		} else {
			// return false;
			return array('result'=>false, 'message'=>$this->_tmp);
		}
		// return $retArray;
		/*
		*/
	}

	private function _update($elements) {
		$isSuccess = true;
		$actionForPageElement = ClassRegistry::init('smartphone_page_elements');
		$actionForLibraryElement = ClassRegistry::init('smartphone_library_elements');

		$actionForPageElement->begin();
		$actionForLibraryElement->begin();
		foreach ($elements as $elementId => $val) {
			if (
				$elements[$elementId]['smartphonePageElementId'] === 0
				&&
				$elements[$elementId]['smartphoneLibraryElementId'] !== 0
			) {
				$data = array(
					'smartphone_library_elements' => array(
						'id'	=> $elements[$elementId]['smartphoneLibraryElementId'],
						'order'	=> $elements[$elementId]['order']
					)
				);
				if (!is_array($actionForLibraryElement->save($data))) {
					$actionForPageElement->rollback();
					$actionForLibraryElement->rollback();
					$isSuccess = false;
					// $this->_tmp = 'ライブラリの更新失敗(' . $elementId . ')';
					break;
				}
			} else {
				$data = array(
					'smartphone_page_elements' => array(
						'id'	=> $elements[$elementId]['smartphonePageElementId'],
						'order'	=> $elements[$elementId]['order']
					)
				);
				if (!is_array($actionForPageElement->save($data))) {
					$actionForPageElement->rollback();
					$actionForLibraryElement->rollback();
					$isSuccess = false;
					// $this->_tmp = 'パーツの更新失敗(' . $elementId . ')';
					break;
				}
			}
		}
		if ($isSuccess === true) {
			// $actionForPageElement->rollback();
			// $actionForLibraryElement->rollback();
			$actionForPageElement->commit();
			$actionForLibraryElement->commit();
		}
		return $isSuccess;
	}

	private function _fixedOrderOfElementData($parentId) {
		$targetElementData = $this->_getChildElementData($parentId);
		// if ($parentId === 'id-1367304539813_580') {
			// error_log('_fixedOrderOfElementData :: $parentId = ' . $parentId . "\n", 3, 'log.txt');
			// error_log('_fixedOrderOfElementData :: $parentId = ' . $parentId . "\n", 3, 'log.txt');
		// }
		$retArr = array();
		$order = 1;
		$tmpArr = array();
		$cloneArr = $this->_elementData;
		for ($i=0,$len=count($targetElementData); $i<$len; $i++) {
			$elementId = $targetElementData[$i]['elementId'];
			// error_log('	$i= ' . $i . "\n", 3, 'log.txt');
			// error_log('		$elementId= ' . $elementId . "\n", 3, 'log.txt');
			// error_log('		$itemName= ' . $targetElementData[$i]['itemName'] . "\n", 3, 'log.txt');
			if ($targetElementData[$i]['itemName'] === 'Td' || $targetElementData[$i]['itemName'] === 'AboutCategory') {
			// if ($targetElementData[$i]['itemName'] === 'Td') {
				$targetElementData[$i]['order'] = 1;
				// if ($parentId === 'id-1367304539813_580') {
					// error_log('		tdの子2' . "\n", 3, 'log.txt');
				// }
			} else {
				$pieces = explode('_', $targetElementData[$i]['parentId']);
				// if ($parentId === 'id-1367304539813_580') {
					// error_log('		$parentId = ' . $targetElementData[$i]['parentId'] . "\n", 3, 'log.txt');
					// error_log('		count($pieces) = ' . count($pieces) . "\n", 3, 'log.txt');
				// }
				// if (isset($cloneArr[$targetElementData[$i]['parentId']])) {
				// 	error_log('		$elementId = ' . $cloneArr[$elementId]['itemName'] . "\n", 3, 'log.txt');
				// 	error_log('		parentItemName = ' . $cloneArr[$targetElementData[$i]['parentId']]['itemName'] . "\n", 3, 'log.txt');
				// }
				if (count($pieces) === 2 && isset($cloneArr[$targetElementData[$i]['parentId']]) && $cloneArr[$targetElementData[$i]['parentId']]['itemName'] === 'Td') {
					if (!isset($tmpArr[$targetElementData[$i]['parentId']])) {
						$tmpArr[$targetElementData[$i]['parentId']] = 0;
					}
					// if ($parentId === 'id-1367304539813_580') {
						// error_log('		tdの子' . "\n", 3, 'log.txt');
					// }
					// array_ush($tmpArr, $elementId);
					// $targetElementData[$i]['order'] = count($tmpArr);
					$targetElementData[$i]['order'] = ++$tmpArr[$targetElementData[$i]['parentId']];
				} else {
					$targetElementData[$i]['order'] = $order ++;
				}
				// if ($parentId === 'id-1367304539813_580') {
					// error_log("\n", 3, 'log.txt');
				// }
			}
			$retArr[$elementId] = $targetElementData[$i];
			$receiveData = $this->_fixedOrderOfElementData($elementId);
			if ($receiveData) {
				foreach ($receiveData as $tmpElementId => $val) {
					$retArr[$tmpElementId] = $receiveData[$tmpElementId];
				}
			}
		}
		// if ($parentId === 'id-1367304539813_580') {
			// error_log('-----------------' . "\n\n", 3, 'log.txt');
		// }
		return $retArr;
	}

	private function _getChildElementData($parentId) {
		// if ($parentId === 'id-1367304539813_580') {
			// error_log('_getChildElementData :: $parentId = ' . $parentId . "\n", 3, 'log.txt');
		// }
		$tmpArr = array();
		$cloneArr = $this->_elementData;
		foreach ($cloneArr as $elementId => $val) {
			$pieces = explode('_', $cloneArr[$elementId]['parentId']);
			$fixedParentId = $pieces[0];
			$pieces2 = explode('_', $elementId);
			$fixedElementId = $pieces2[0];
			// if ($cloneArr[$elementId]['itemName'] === 'Td') {
			// 	error_log('	$cloneArr[' . $elementId . '][itemName] = ' . $cloneArr[$elementId]['itemName'] . "\n", 3, 'log.txt');
			// 	error_log('	$fixedParentId = ' . $fixedParentId . "\n", 3, 'log.txt');
			// 	error_log('	$fixedElementId = ' . $fixedElementId . "\n", 3, 'log.txt');
			// 	error_log('	$elementId = ' . $elementId . "\n", 3, 'log.txt');
			// 	error_log('	parentId = ' . $cloneArr[$elementId]['parentId'] . "\n", 3, 'log.txt');
			// }
			if (
					$cloneArr[$elementId]['parentId'] === $parentId
					// $fixedParentId === $parentId
					||
					(
						$parentId === $fixedElementId
						&&
						// $cloneArr[$elementId]['parentId'] === ''
						// &&
						(
						$cloneArr[$elementId]['itemName'] === 'AboutCategory' ||
						$cloneArr[$elementId]['itemName'] === 'Td'
						)
					)
			) {
				// if ($cloneArr[$elementId]['itemName'] === 'Td') {
				// 	error_log('	挿入' . "\n", 3, 'log.txt');
				// }
				$cloneArr[$elementId]['elementId'] = $elementId;
				array_push($tmpArr, $cloneArr[$elementId]);
			}
			// error_log("\n", 3, 'log.txt');
		}
		return $tmpArr;
	}
}
?>