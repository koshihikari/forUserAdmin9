<?php

class Outline_GetOutlineAction extends AppModel {
	public $useTable = 'outlines';


	private function _merge($mtr_outlines_data, $outlines_data) {
		// 全ての必須入力項目が$ooutlines_dataに存在するか調べる

	}
	/*
	 * FRKのデータを更新するメソッド
	 * @param	request		postで渡されたデータ
	 * @return	json
	 */
	public function getOutline($residence_id, $user_id) {
		// parent_category_id === 0がカテゴリデータ
		// parent_category_id !== 0がアイテムデータ

		$options = array(
			'conditions'		=> array(
				'outlines.residence_id'			=> $residence_id
			),
			'order'				=> array(
				'outlines.order ASC'
			)
		);
		$outlines_result = ClassRegistry::init('outlines')->find('all', $options);

		// $outlines_resultからカテゴリとアイテムを分離する。
		$outlines_array = array();
		$items_array = array();
		$category_id_array = array();
		$mtr_outline_id_array = array();
		// debug($outlines_result);
		for ($i=0,$len=count($outlines_result); $i<$len; $i++) {
			if ($outlines_result[$i]['outlines']['parent_category_id'] === '0') {
				$index = (int) $outlines_result[$i]['outlines']['order'] - 1;
				$outlines_array[$index] = isset($outlines_array[$index]) ? $outlines_array[$index] : array();
				$outlines_array[$index]['category'] = $outlines_result[$i]['outlines'];
				$category_id_array['parent_category_id_' . $outlines_result[$i]['outlines']['id']] = $index;
			} else {
				array_push($items_array, $outlines_result[$i]['outlines']);
				array_push($mtr_outline_id_array, $outlines_result[$i]['outlines']['mtr_outline_id']);
			}
		}

		// ob_start();//ここから
		// var_dump($items_array);
		// $out=ob_get_contents();//ob_startから出力された内容をゲットする。
		// ob_end_clean();//ここまで
		// error_log('-----------------' . "\n", 3, 'log.txt');
		// error_log($out . "\n", 3, 'log.txt');
		// error_log('-----------------' . "\n", 3, 'log.txt');

		// debug($mtr_outline_id_array);
		// debug($category_id_array);
		// 分離したアイテムをカテゴリ毎に配列に代入する。
		$deleteIdArr = array();
		for ($i=0,$len=count($items_array); $i<$len; $i++) {
			if (isset($category_id_array['parent_category_id_' . $items_array[$i]['parent_category_id']])) {
				$parent_category_index = $category_id_array['parent_category_id_' . $items_array[$i]['parent_category_id']];
				$item_index = (int) $items_array[$i]['order'] - 1;
				// $item_index = (int) $outlines_result[$i]['outlines']['order'] - 1;
				$outlines_array[$parent_category_index] = isset($outlines_array[$parent_category_index]) ? $outlines_array[$parent_category_index] : array();
				$outlines_array[$parent_category_index]['items'] = isset($outlines_array[$parent_category_index]['items']) ? $outlines_array[$parent_category_index]['items'] : array();
				$outlines_array[$parent_category_index]['items'][$item_index] = $items_array[$i];
			} else {
				array_push($deleteIdArr, $items_array[$i]['id']);	// 親カテゴリーのレコードが存在しないアイテムのIDを配列に代入
			}
		}

		// 親カテゴリーのレコードが存在しないアイテムのレコードを削除する
		$conditions = array(
			'id'		=> $deleteIdArr
		);
		ClassRegistry::init('outlines')->deleteAll($conditions);

		// debug($items_array);
		// debug($mtr_outline_id_array);
		// debug($outlines_array);

		// outlinesテーブルに存在していなかったアイテムをmtr_outlinesテーブルから取得する
		$options = array(
			'conditions'		=> array(
				'mtr_outlines.id NOT'		=> $mtr_outline_id_array,
				'mtr_outlines.parent_category_id NOT'		=> '0'
			),
			'order'				=> array(
				'mtr_outlines.order ASC'
			)
		);
		$mtr_outlines_result = ClassRegistry::init('mtr_outlines')->find('all', $options);

		// outlinesテーブルに存在していなかったアイテムがmtr_outlinesテーブルに存在していれば、
		// そのデータを$outlines_arrayの先頭に挿入し、outlinesテーブルに書き込む
		if (0 < count($mtr_outlines_result)) {
			$insert_array = array(
				'category'		=> array(
					'id'					=> 0,
					'mtr_outline_id'		=> 0,
					'residence_id'			=> $residence_id,
					'user_id'				=> $user_id,
					'key'					=> '不足していたアイテム',
					'val'					=> '',
					'is_required'			=> 0,
					'frk_index'				=> '',
					'order'					=> 1,
					'parent_category_id'	=> 0
				),
				'items'			=> array()
			);
			for ($i=0,$len=count($mtr_outlines_result); $i<$len; $i++) {
				$array = array(
					'id'					=> 0,
					'mtr_outline_id'		=> $mtr_outlines_result[$i]['mtr_outlines']['id'],
					'residence_id'			=> $residence_id,
					'user_id'				=> $user_id,
					'key'					=> $mtr_outlines_result[$i]['mtr_outlines']['key'],
					'val'					=> $mtr_outlines_result[$i]['mtr_outlines']['val'],
					'is_required'			=> $mtr_outlines_result[$i]['mtr_outlines']['is_required'],
					'frk_index'				=> $mtr_outlines_result[$i]['mtr_outlines']['frk_index'],
					'order'					=> $i + 1,
					'parent_category_id'	=> 0
				);
				array_push($insert_array['items'], $array);
			}
			array_unshift($outlines_array, $insert_array);

			// カテゴリとアイテムのorderを修正
			for ($i=0,$len=count($outlines_array); $i<$len; $i++) {
				$outlines_array[$i]['category']['order'] = $i + 1;
				for ($j=0,$len2=count($outlines_array[$i]['items']); $j<$len2; $j++) {
					$outlines_array[$i]['items'][$j]['order'] = $j + 1;
				}
			}

			// outlinesテーブルにデータ書き込み
			$action = ClassRegistry::init('outlines');
			$is_correct = false;
			// $count = 0;
			$action->begin();
			for ($i=0,$len=count($outlines_array); $i<$len; $i++) {
				/*
				$data = $outlines_array[$count]['category'];
				if ($outlines_array[$count]['category']['id'] === 0) {
					*/
				$data = $outlines_array[$i]['category'];
				if ($outlines_array[$i]['category']['id'] === 0) {
					unset($data['id']);
				}
				$action->create();
				$is_correct = is_array($action->save($data));
				$parent_category_id = $action->getLastInsertID();
				/*
				if ($is_correct === true && $outlines_array[$count]['category']['id'] === 0) {
					$outlines_array[$count]['category']['id'] = $parent_category_id;
					*/
				if ($is_correct === true && $outlines_array[$i]['category']['id'] === 0) {
					$outlines_array[$i]['category']['id'] = $parent_category_id;
				}

				if ($is_correct === true) {
					/*
					for ($j=0,$len2=count($outlines_array[$count]['items']); $j<$len2; $j++) {
						if ($outlines_array[$count]['items'][$j]['parent_category_id'] === 0) {
							$outlines_array[$count]['items'][$j]['parent_category_id'] = $parent_category_id;
						}
						$data = $outlines_array[$count]['items'][$j];
						if ($outlines_array[$count]['items'][$j]['id'] === 0) {
							unset($data['id']);
						}
						$action->create();
						$is_correct = is_array($action->save($data));
						if ($is_correct === true && $outlines_array[$count]['items'][$j]['id'] === 0) {
							$outlines_array[$count]['items'][$j]['id'] = $action->getLastInsertID();
							*/
					for ($j=0,$len2=count($outlines_array[$i]['items']); $j<$len2; $j++) {
						if ($outlines_array[$i]['items'][$j]['parent_category_id'] === 0) {
							$outlines_array[$i]['items'][$j]['parent_category_id'] = $parent_category_id;
						}
						$data = $outlines_array[$i]['items'][$j];
						if ($outlines_array[$i]['items'][$j]['id'] === 0) {
							unset($data['id']);
						}
						$action->create();
						$is_correct = is_array($action->save($data));
						if ($is_correct === true && $outlines_array[$i]['items'][$j]['id'] === 0) {
							$outlines_array[$i]['items'][$j]['id'] = $action->getLastInsertID();
						} else {
							break;
						}
					}
					if ($is_correct === false) {
						break;
					}
				} else {
					break;
				}
				$count++;
			}
			if ($is_correct === true) {
				$action->commit();
			} else {
				$action->rollback();
			}
		}

		$fixedOutlinesArray = array();
		foreach ($outlines_array as $key => $val) {
			// if (isset($outlines_array[$key]['items']) && isset($outlines_array[$key]['category'])) {
				array_push($fixedOutlinesArray, $outlines_array[$key]);
			// }
		}

		return array(
			'outlines'					=> $fixedOutlinesArray
			// 'outlines'					=> $outlines_array
		);
	}
}
