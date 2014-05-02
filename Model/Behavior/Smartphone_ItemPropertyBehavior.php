<?php 

class Smartphone_ItemPropertyBehavior extends ModelBehavior {

	/*
	 * ページエレメントの並び順を更新するメソッド
	 * @param	$model				Model
	 * @param	$is_correct			true===処理開始、false===処理せず終了
	 * @param	$is_library			true===smartphone_librariesを更新、false===smartphone_pagesを更新
	 * @param	$library_page_id	ライブラリ/ページID
	 * @param	$user_id			ユーザID
	 * @return	boolean
	 */
	public function getDefaultProperty(Model $model, $item_name) {
		switch ($item_name) {
			case 'Bg':
			case 'displayArea':
				$item_name = 'Bg';
				break;

			default:
				$item_name = '';
				break;
		}

		if ($item_name === '') {
			return array();
		}

		$action = ClassRegistry::init('mtr_sramrtphone_items');
		$action->bindModel(
			array(
				'hasAndBelongsToMany'		=> array(
					'mtr_smartphone_components'
				)
			)
		);
		$options = array(
			'conditions'		=> array(
				'mtr_sramrtphone_items.item_name'	=> $item_name
			)
		);
		$result = $action->find('all', $options);
		return $result;
	}
}
?>