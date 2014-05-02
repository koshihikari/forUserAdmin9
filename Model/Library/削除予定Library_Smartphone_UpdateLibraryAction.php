<?php

class Library_Smartphone_UpdateLibraryAction extends Model {
	public $useTable = 'smartphone_libraries';
	
	/*
	 * ページデータを削除するメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function updateLibrary($request) {
		$json = array('result'=>false, 'message'=>'値が渡されていません');

		if ($request->isPost()) {
			error_log("\n", 3, 'log.txt');
			error_log("PageUpdateAction :: updatePage\n", 3, 'log.txt');
			error_log('updateData = ' . $request->data['updateData'] . "\n", 3, 'log.txt');
			// error_log('updateData = ' . count($request->data['updateData']) . "\n", 3, 'log.txt');
			if (
				isset($request->data['updateData'])
				// isset($request->data['updateData']) &&
				// count($request->data['updateData'])
			) {
				if (is_array($request->data['updateData']) && isset($request->data['updateData'][0])) {
					$isCorrectSave = true;
					$this->begin();
					for ($i=0,$len=count($request->data['updateData']); $i<$len; $i++) {
						error_log('	' . $i . ', id = ' . $request->data['updateData'][$i]['id'] . "\n", 3, 'log.txt');
						if (!is_array($this->save($request->data['updateData'][$i]))) {
							$isCorrectSave = false;
							break;
						}
					}
					if ($isCorrectSave === true) {
						$this->commit();
						$json = array('result'=>true);
					} else {
						$this->rollback();
						$json = array('result'=>false, 'message'=>'ページデータの更新に失敗しました。');
					}
				} else {
					$this->begin();
					if (is_array($this->save($request->data['updateData']))) {
						$this->commit();
						$json = array('result'=>true);
					} else {
						$this->rollback();
						$json = array('result'=>false, 'message'=>'ページデータの更新に失敗しました。');
					}
				}
				// $isCorrectSave = true;
				// for ($i=0,$len=count($request->data['updateData']); $i<$len; $i++) {
				// 	error_log('	' . $i . ', id = ' . $request->data['updateData'][$i]['id'] . "\n", 3, 'log.txt');
				// 	if (!is_array($this->save($request->data['updateData'][$i]))) {
				// 		$isCorrectSave = false;
				// 		break;
				// 	}
				// }
				// if ($isCorrectSave === true) {
				// 	$json = array('result'=>true);
				// } else {
				// 	$json = array('result'=>false, 'message'=>'ページ削除に失敗しました。');
				// }
			}
		}
		return $json;
	}
}
