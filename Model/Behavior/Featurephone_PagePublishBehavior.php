<?php

class Featurephone_PagePublishBehavior extends ModelBehavior {

	/*
	 * 本番用フィーチャーフォンページを書き出すメソッド
	 * @param	$model				Model
	 * @param	$data				ユーザID
	 * @return	boolean
	 */
	public function fpPublish(Model $model, $data) {
		if (
			isset($data['page_id']) &&
			isset($data['user_id'])
		) {
			error_log('-----------------' . "\n", 3, 'log.txt');
			error_log('Featurephone_PagePublishBehavior :: fpPublish :: FPページパブリッシュ開始' . "\n", 3, 'log.txt');
			$featurephone_pages = ClassRegistry::init('featurephone_pages');
			$featurephone_pages->begin();


			// error_log("\n", 3, 'log.txt');
			// error_log($result['Page_Featurephone_PublishConcretePageAction']['preview_source'] . "\n", 3, 'log.txt');

			$saveData = array(
				'id'				=> $data['page_id'],
				'published'			=> date('c'),
				'published_user_id'	=> $data['user_id'],
				'user_id'			=> $data['user_id']
			);
			if (isset($data['residence_id']) && $data['residence_id']) {
				$saveData['residence_id'] = $data['residence_id'];
			}
			if (isset($data['title']) && $data['title']) {
				$saveData['title'] = $data['title'];
			}
			if (isset($data['path']) && $data['path']) {
				$saveData['path'] = $data['path'];
			}
			if (isset($data['edited_user_id']) && $data['edited_user_id']) {
				$saveData['edited_user_id'] = $data['edited_user_id'];
			}
			if (isset($data['edited']) && $data['edited']) {
				$saveData['edited'] = $data['edited'];
			}

			// プレビューソースが渡されたら、プレビューソースと本番ソースを両方上書きする
			if (isset($data['preview_source']) && $data['preview_source']) {
				$saveData['preview_source'] = $data['preview_source'];
				$saveData['concrete_source'] = $data['preview_source'];
				$saveData['edited_user_id'] = $data['user_id'];
				$saveData['edited'] = date('c');
			// プレビューソースが渡されていなければ、プレビューソースを検索して本番ソースを上書きする
			} else {
				$options = array(
					'conditions'	=> array(
						'id'			=> $data['page_id']
					)
				);
				$result = $featurephone_pages->find('first', $options);
				$saveData['concrete_source'] = $result['featurephone_pages']['preview_source'];
			}

			if (is_array($featurephone_pages->save($saveData)) === true) {
				$featurephone_pages->commit();
				error_log('Featurephone_PagePublishBehavior :: fpPublish :: FPページパブリッシュ成功' . "\n", 3, 'log.txt');
				error_log('-----------------' . "\n", 3, 'log.txt');
				return true;
			} else {
				$featurephone_pages->rollback();
				error_log('Featurephone_PagePublishBehavior :: fpPublish :: FPページパブリッシュ失敗' . "\n", 3, 'log.txt');
				error_log('-----------------' . "\n", 3, 'log.txt');
				return false;
			}
		} else {
			error_log('Featurephone_PagePublishBehavior :: fpPublish :: FPページパブリッシュ大失敗' . "\n", 3, 'log.txt');
			error_log('-----------------' . "\n", 3, 'log.txt');
			return false;
		}
	}
}
?>