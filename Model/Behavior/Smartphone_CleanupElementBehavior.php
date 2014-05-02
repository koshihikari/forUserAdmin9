<?php

class Smartphone_CleanupElementBehavior extends ModelBehavior {

	/*
	 * $leave_data_arrで指定されたレコード以外のデータを削除するメソッドメソッド
	 * @param	$model				Model
	 * @param	$is_correct			true===処理開始、false===処理せず終了
	 * @param	$is_library			true===smartphone_librariesを更新、false===smartphone_pagesを更新
	 * @param	$leave_data_arr		テーブルに残すレコードのIDが含まれる配列
	 * @param	$library_page_id	ライブラリ/ページID
	 * @return	boolean
	 */
	public function cleanupElement(Model $model, $is_correct, $is_library, $leave_data_arr, $library_page_id) {
		// error_log("\n", 3, 'log.txt');
		// error_log("Smartphone_CleanupElementBehavior :: cleanupElement\n", 3, 'log.txt');
		if ($is_correct === true) {
			$leave_data_arr = json_decode($leave_data_arr, true);
			$leave_data_arr = json_decode($leave_data_arr['elements'], true);
			if (0 < count($leave_data_arr)) {
				$exclusion_id_arr = array();

				// error_log('count($leave_data_arr) = ' . count($leave_data_arr) . "\n", 3, 'log.txt');
				for ($i=0,$len=count($leave_data_arr); $i<$len; $i++) {
					list($id, $order) = explode(":", $leave_data_arr[$i]);
					// error_log('		$i = ' . $i . ' :: $leave_data_arr[$i] = ' . $leave_data_arr[$i] . "\n", 3, 'log.txt');
					// error_log('		$id = ' . $id . ', $order = ' . $order . "\n", 3, 'log.txt');
					array_push($exclusion_id_arr, $id);
				}

				/*
				foreach ($leave_data_arr as $key => $value) {
					$leave_data_arr[$key] = json_decode($leave_data_arr[$key], true);
					// error_log('$key = ' . $key . "\n", 3, 'log.txt');
					// error_log('count($leave_data_arr[' . $key . ']) = ' . count($leave_data_arr[$key]) . "\n", 3, 'log.txt');
					for ($i=0,$len=count($leave_data_arr[$key]); $i<$len; $i++) {
						list($id, $order) = explode(":", $leave_data_arr[$key][$i]);
						// error_log('		$i = ' . $i . ' :: $leave_data_arr[$key][$i] = ' . $leave_data_arr[$key][$i] . "\n", 3, 'log.txt');
						// error_log('		$id = ' . $id . ', $order = ' . $order . "\n", 3, 'log.txt');
						array_push($exclusion_id_arr, $id);
					}
				}
				*/
				/*
				for ($i=0,$len=count($leave_data_arr); $i<$len; $i++) {
					if (
						$leave_data_arr[$i]['smartphone_page_element_id'] !== '0'
						||
						$leave_data_arr[$i]['smartphone_library_element_id'] !== '0'
					) {
						$id = $leave_data_arr[$i]['smartphone_page_element_id'] !== '0' ? $leave_data_arr[$i]['smartphone_page_element_id'] : $leave_data_arr[$i]['smartphone_library_element_id'];
						array_push($exclusion_id_arr, $id);
						error_log('削除しないID = ' . $id . "\n", 3, 'log.txt');
					}
				}
				*/

				// error_log('count($exclusion_id_arr) = ' . count($exclusion_id_arr) . "\n", 3, 'log.txt');
				if (1 === count($exclusion_id_arr)) {
					$conditions = array(
						'id NOT '			=> $exclusion_id_arr[0]
					);
					if ($is_library === true) {
						$conditions['smartphone_library_id'] = $library_page_id;
					} else {
						$conditions['page_id'] = $library_page_id;
					}
					return $model->deleteAll($conditions);
				} else if (0 < count($exclusion_id_arr)) {
				// if (0 < count($exclusion_id_arr)) {
					$conditions = array(
						'id NOT '			=> $exclusion_id_arr
					);
					if ($is_library === true) {
						$conditions['smartphone_library_id'] = $library_page_id;
					} else {
						$conditions['page_id'] = $library_page_id;
					}
					return $model->deleteAll($conditions);
				} else {
					return true;
				}
			} else {
				if ($is_library === true) {
					$conditions['smartphone_library_id'] = $library_page_id;
				} else {
					$conditions['page_id'] = $library_page_id;
				}
				return $model->deleteAll($conditions);
			}
		} else {
			return false;
		}
	}
}
?>