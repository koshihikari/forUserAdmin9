<?php

class Featurephone_GetPageInfoBehavior extends ModelBehavior {

	/*
	 * ページエレメントの並び順を更新するメソッド
	 * @param	$model				Model
	 * @param	$is_correct			true===処理開始、false===処理せず終了
	 * @param	$is_library			true===smartphone_librariesを更新、false===smartphone_pagesを更新
	 * @param	$library_page_id	ライブラリ/ページID
	 * @param	$user_id			ユーザID
	 * @return	boolean
	 */
	public function getPageInfo(Model $model, $isResidenceSearch, $id) {
		$result = $this->_getPageInfo($isResidenceSearch, $id);
		return $result;
	}

	private function _getPageInfo($isResidenceSearch, $id) {
		$featurephone_pages = ClassRegistry::init('featurephone_pages');
		$featurephone_pages->bindModel(
			array(
				'belongsTo'		=> array(
					'editedUser'			=> array(
						'className'		=> 'User',
						'foreignKey'	=> 'edited_user_id'
					),
					'publishedUser'			=> array(
						'className'		=> 'User',
						'foreignKey'	=> 'published_user_id'
					),
					'mtr_statuses'			=> array(
						'foreignKey'	=> 'status_id'
					)
				)
			)
		);
		if ($isResidenceSearch === true) {
			$options = array(
				'conditions'	=> array(
					'featurephone_pages.residence_id'=>$id
				),
				'order'			=> array(
					'featurephone_pages.order ASC'
				)
			);
		} else {
			$options = array(
				'conditions'		=> array(
					'featurephone_pages.id'			=> $id
				)
			);
		}
		$result = $featurephone_pages->find('all', $options);
		// ob_start();//ここから
		// var_dump($result);
		// $out=ob_get_contents();//ob_startから出力された内容をゲットする。
		// ob_end_clean();//ここまで
		// error_log('-----------------' . "\n", 3, 'log.txt');
		// error_log($out . "\n", 3, 'log.txt');
		// error_log('-----------------' . "\n", 3, 'log.txt');



		for ($i=0,$len=count($result); $i<$len; $i++) {
			$edited = $result[$i]['featurephone_pages']['edited'];
			$published = $result[$i]['featurephone_pages']['published'];

			// 取得したデータの更新日時と書き出し日時を比較し、書きだされたページが最新かどうか判定する
			if ($edited === '0000-00-00 00:00:00' && $published === '0000-00-00 00:00:00') {
				$is_latest_page = false;
			} else {
				$is_latest_page = strtotime($edited) <= strtotime($published) ? true : false;
			}
			$result[$i]['featurephone_pages']['is_latest_page'] = $is_latest_page;

			// 取得したデータの編集日時、書き出し日時を整形する
			$result[$i]['featurephone_pages']['edited'] = $edited === '0000-00-00 00:00:00' ? '' : date("Y/m/d H:i:s",strtotime($edited) + 9 * 60 * 60);
			$result[$i]['featurephone_pages']['published'] = $published === '0000-00-00 00:00:00' ? '' : date("Y/m/d H:i:s",strtotime($published) + 9 * 60 * 60);
		}
		return $result;
	}
}
?>