<?php

class Smartphone_UpdateElementOrderBehavior extends ModelBehavior {

	/*
	 * ページエレメントの並び順を更新するメソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	#request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	public function updateElementOrder(Model $model, $is_correct, $update_data_arr) {
		// error_log("\n", 3, 'log.txt');
		// error_log("Smartphone_UpdateElementOrderBehavior :: updateElementOrder\n", 3, 'log.txt');
		if ($is_correct === true) {
			$update_data_arr = json_decode($update_data_arr, true);
			$update_data_arr = json_decode($update_data_arr['elements'], true);
			if (0 < count($update_data_arr)) {



				// error_log('count($update_data_arr) = ' . count($update_data_arr) . "\n", 3, 'log.txt');
				for ($i=0,$len=count($update_data_arr); $i<$len; $i++) {
					list($id, $order) = explode(":", $update_data_arr[$i]);
					// error_log('		$i = ' . $i . ' :: $update_data_arr[$i] = ' . $update_data_arr[$i] . "\n", 3, 'log.txt');
					// error_log('		$id = ' . $id . ', $order = ' . $order . "\n", 3, 'log.txt');
					$data = array(
						'id'		=> $id,
						'order'		=> $order
					);
					if (!$model->save($data)) {
						$is_correct = false;
						break;
					}
				}
				/*
				$update_data_arr = json_decode($update_data_arr, true);
				foreach ($update_data_arr as $key => $value) {
					$update_data_arr[$key] = json_decode($update_data_arr[$key], true);
					error_log('$key = ' . $key . "\n", 3, 'log.txt');
					error_log('count($update_data_arr[' . $key . ']) = ' . count($update_data_arr[$key]) . "\n", 3, 'log.txt');
					for ($i=0,$len=count($update_data_arr[$key]); $i<$len; $i++) {
						list($id, $order) = explode(":", $update_data_arr[$key][$i]);
						error_log('		$i = ' . $i . ' :: $update_data_arr[$key][$i] = ' . $update_data_arr[$key][$i] . "\n", 3, 'log.txt');
						error_log('		$id = ' . $id . ', $order = ' . $order . "\n", 3, 'log.txt');

						$data = array(
							'id'		=> $id,
							'order'		=> $order
						);
						if (!$model->save($data)) {
							$is_correct = false;
							break;
						}
					}
				}
				*/
				/*
				for ($i=0,$len=count($update_data_arr); $i<$len; $i++) {
					if (
						(
							isset($update_data_arr[$i]['smartphone_page_element_id']) &&
							isset($update_data_arr[$i]['smartphone_library_element_id']) &&
							isset($update_data_arr[$i]['order'])
						)
						&&
						(
							$update_data_arr[$i]['smartphone_page_element_id'] !== '0'
							||
							$update_data_arr[$i]['smartphone_library_element_id'] !== '0'
						)
						&&
						$update_data_arr[$i]['order'] != '0'
					) {
						$data = array(
							'id'		=> $update_data_arr[$i]['smartphone_page_element_id'] !== '0' ? $update_data_arr[$i]['smartphone_page_element_id'] : $update_data_arr[$i]['smartphone_library_element_id'],
							'order'		=> $update_data_arr[$i]['order']
						);
						// error_log('id = ' . $data['id'] . "\n", 3, 'log.txt');
						// error_log('order = ' . $data['order'] . "\n", 3, 'log.txt');
						// error_log("\n", 3, 'log.txt');
						if (!$model->save($data)) {
							$is_correct = false;
							break;
						}
					}
				}
				*/
			}
			return $is_correct;
		} else {
			return false;
		}
	}
}
?>