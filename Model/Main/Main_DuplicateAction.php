<?php

class Main_DuplicateAction extends AppModel {
	public $useTable = 'featurephone_pages';
	private $deletedPageOrder = -1;
	public $duplicatedResidenceId = -1;

	/*
	 * 物件を複製するメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function duplicateResidence($request) {
		$isCorrect = false;

		if ($request->isPost()) {
			if (
				isset($request->data['company_id']) &&
				isset($request->data['is_company_site']) &&
				isset($request->data['residence_id']) &&
				isset($request->data['user_id'])
			) {
				$this->begin();
				$isCorrect = true;

				$isCorrect = $this->_duplicateResidence($isCorrect, $request);

				if ($isCorrect === true) {
					$this->commit();
				} else {
					$this->rollback();
				}
			}
		}
		return $isCorrect;
	}

	/*
	 * 物件複製メソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _duplicateResidence($isCorrect, $request) {
		if ($isCorrect === true) {
			// 複製する物件のデータを取得する
			$residences = ClassRegistry::init('residences');
			$result = $residences->find('first', array('conditions'=>array('id'=>$request->data['residence_id'])));

			// 複製後のデータ作成
			$duplicateData = $result['residences'];
			unset($duplicateData['id'], $duplicateData['created'], $duplicateData['modified']);
			$duplicateData['user_id'] = $request->data['user_id'];
			$duplicateData['name'] = 'コピー :: ' . $duplicateData['name'];
			$duplicateData['order'] = $duplicateData['order'] + 1;

			// 複製したページの並びは複製元ページ+1になるので、複製元ページのorder+1以上のページのorderを+1する
			$sql = 'UPDATE residences SET `order` = `order` + 1 WHERE company_id = ' . $request->data['company_id'] . ' AND `order` >= ' . $duplicateData['order'];

			if ($residences->query($sql) === false) {
				return false;
			}

			$residences->create();
			if (is_array($residences->save($duplicateData)) === true) {
				$masterResidenceId = $request->data['residence_id'];
				$this->duplicatedResidenceId = $residences->getLastInsertID();

				// スマホページデータも複製する
				$smartphone_pages = ClassRegistry::init('smartphone_pages');
				$options = array(
					'conditions'		=> array(
						'residence_id'			=> $masterResidenceId
					)
				);
				$result2 = $smartphone_pages->find('all', $options);
				for ($i=0,$len=count($result2); $i<$len; $i++) {
					$request->data['residence_id'] = $this->duplicatedResidenceId;
					$request->data['page_id'] = $result2[$i]['smartphone_pages']['id'];
					$request->data['device_type'] = 'sp';
					if ($this->duplicatePage($request) === false) {
						return false;
					}
				}

				// フィーチャーフォンページデータも複製する
				$featurephone_pages = ClassRegistry::init('featurephone_pages');
				$options = array(
					'conditions'		=> array(
						'residence_id'			=> $masterResidenceId
					)
				);
				$result2 = $featurephone_pages->find('all', $options);
				for ($i=0,$len=count($result2); $i<$len; $i++) {
					$request->data['residence_id'] = $this->duplicatedResidenceId;
					$request->data['page_id'] = $result2[$i]['featurephone_pages']['id'];
					$request->data['device_type'] = 'fp';
					if ($this->duplicatePage($request) === false) {
						return false;
					}
				}
				return true;
			} else {
				return false;
			}

		} else {
			return false;
		}
	}

	/*
	 * ページを複製するメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function duplicatePage($request) {
		$isCorrect = false;

		if ($request->isPost()) {
			if (
				isset($request->data['company_id']) &&
				isset($request->data['is_company_site']) &&
				isset($request->data['device_type']) &&
				isset($request->data['residence_id']) &&
				isset($request->data['page_id']) &&
				isset($request->data['user_id'])
			) {
				$this->begin();
				$isCorrect = true;

				if ($request->data['device_type'] === 'sp') {
					$isCorrect = $this->_duplicatePageOfSmartphone($isCorrect, $request);
				} else if ($request->data['device_type'] === 'fp') {
					$isCorrect = $this->_duplicatePageOfFeaturephone($isCorrect, $request);
				}

				if ($isCorrect === true) {
					$this->commit();
				} else {
					$this->rollback();
				}
			}
		}
		return $isCorrect;
	}

	/*
	 * スマートフォンページ複製メソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _duplicatePageOfSmartphone($isCorrect, $request) {
		if ($isCorrect === true) {
			// 複製するページのデータを取得する
			$smartphone_pages = ClassRegistry::init('smartphone_pages');
			$result = $smartphone_pages->find('first', array('conditions'=>array('id'=>$request->data['page_id'])));

			// 複製後のデータ作成
			$duplicateData = $result['smartphone_pages'];
			unset($duplicateData['id'], $duplicateData['created'], $duplicateData['modified']);
			$duplicateData['user_id'] = $request->data['user_id'];
			$duplicateData['title'] = 'コピー :: ' . $duplicateData['title'];

			if (0 < $request->data['residence_id']) {	// 複製先物件IDが指定されている場合
				$duplicateData['residence_id']		= $request->data['residence_id'];

			} else {	// 複製元ページと同じ物件に複製する場合
				$request->data['residence_id'] = $duplicateData['residence_id'];
				$duplicateData['order'] = $duplicateData['order'] + 1;

				// 複製したページの並びは複製元ページ+1になるので、複製元ページのorder+1以上のページのorderを+1する
				$sql = 'UPDATE smartphone_pages SET `order` = `order` + 1 WHERE residence_id = ' . $request->data['residence_id'] . ' AND `order` >= ' . $duplicateData['order'];

				if ($smartphone_pages->query($sql) === false) {
					return false;
				}
			}

			$smartphone_pages->create();
			if (is_array($smartphone_pages->save($duplicateData)) === true) {
				$latestId = $smartphone_pages->getLastInsertID();

				// パーツデータも複製する
				$smartphone_page_elements = ClassRegistry::init('smartphone_page_elements');
				$options = array(
					'conditions'		=> array(
						'page_id'			=> $request->data['page_id']
					)
				);
				$result2 = $smartphone_page_elements->find('all', $options);
				for ($i=0,$len=count($result2); $i<$len; $i++) {
					// 複製後のデータ作成
					$duplicateData = $result2[$i]['smartphone_page_elements'];
					unset($duplicateData['id'], $duplicateData['created'], $duplicateData['modified']);
					$duplicateData['page_id'] = $latestId;
					$duplicateData['user_id'] = $request->data['user_id'];

					$smartphone_page_elements->create();
					if (is_array($smartphone_page_elements->save($duplicateData)) === false) {
						return false;
					}
				}
				return true;
			} else {
				return false;
			}

		} else {
			return false;
		}
	}

	/*
	 * フィーチャーフォンページ複製メソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _duplicatePageOfFeaturephone($isCorrect, $request) {
		if ($isCorrect === true) {
			// 複製するページのデータを取得する
			$featurephone_pages = ClassRegistry::init('featurephone_pages');
			$result = $featurephone_pages->find('first', array('conditions'=>array('id'=>$request->data['page_id'])));

			// 複製後のデータ作成
			$duplicateData = $result['featurephone_pages'];
			unset($duplicateData['id'], $duplicateData['created'], $duplicateData['modified']);
			$duplicateData['user_id'] = $request->data['user_id'];
			$duplicateData['title'] = 'コピー :: ' . $duplicateData['title'];

			if (0 < $request->data['residence_id']) {	// 複製先物件IDが指定されている場合
				$duplicateData['residence_id']		= $request->data['residence_id'];

			} else {	// 複製元ページと同じ物件に複製する場合
				$request->data['residence_id'] = $duplicateData['residence_id'];
				$duplicateData['order'] = $duplicateData['order'] + 1;

				// 複製したページの並びは複製元ページ+1になるので、複製元ページのorder+1以上のページのorderを+1する
				$sql = 'UPDATE featurephone_pages SET `order` = `order` + 1 WHERE residence_id = ' . $request->data['residence_id'] . ' AND `order` >= ' . $duplicateData['order'];

				if ($featurephone_pages->query($sql) === false) {
					return false;
				}
			}

			$featurephone_pages->create();
			return is_array($featurephone_pages->save($duplicateData));

		} else {
			return false;
		}
	}
}
