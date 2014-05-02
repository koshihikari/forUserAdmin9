<?php

class Main_DelAction extends AppModel {
	public $useTable = 'featurephone_pages';
	private $deletedPageOrder = -1;

	/*
	 * 物件を削除するメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function delResidence($request) {
		$isCorrect = false;

		if ($request->isPost()) {
			if (
				isset($request->data['company_id']) &&
				isset($request->data['is_company_site']) &&
				isset($request->data['residence_id'])
			) {
				$this->begin();
				$isCorrect = true;

				$isCorrect = $this->_delResidence($isCorrect, $request);

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
	 * 物件削除メソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _delResidence($isCorrect, $request) {
		if ($isCorrect === true) {
			$residences = ClassRegistry::init('residences');

			// residencesから、id === $request->data['residence_id']のレコードを取得(削除後、orderを修正するのに必要)
			$result = $residences->find('first', array('conditions'=>array('id'=>$request->data['residence_id'])));

			// residencesから、id === $request->data['residence_id']のレコードを削除
			if ($residences->delete($request->data['residence_id'])) {
				// 削除したレコードのorderより大きい値のレコードのorderを-1する
				$sql = 'UPDATE residences SET `order` = `order` - 1 WHERE company_id = ' . $result['residences']['company_id'] . ' AND `order` > ' . $result['residences']['order'] . ';';
				if ($residences->query($sql) !== false) {
					// スマホページデータも削除する
					$smartphone_pages = ClassRegistry::init('smartphone_pages');
					$options = array(
						'conditions'		=> array(
							'residence_id'			=> $request->data['residence_id']
						)
					);
					$result2 = $smartphone_pages->find('all', $options);
					for ($i=0,$len=count($result2); $i<$len; $i++) {
						$request->data['page_id'] = $result2[$i]['smartphone_pages']['id'];
						$request->data['device_type'] = 'sp';
						if ($this->delPage($request) === false) {
							return false;
						}
					}

					// フィーチャーフォンページデータも削除する
					$featurephone_pages = ClassRegistry::init('featurephone_pages');
					$options = array(
						'conditions'		=> array(
							'residence_id'			=> $request->data['residence_id']
						)
					);
					$result2 = $featurephone_pages->find('all', $options);
					for ($i=0,$len=count($result2); $i<$len; $i++) {
						$request->data['page_id'] = $result2[$i]['featurephone_pages']['id'];
						$request->data['device_type'] = 'fp';
						if ($this->delPage($request) === false) {
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
		} else {
			return false;
		}
	}

	/*
	 * ページを削除するメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function delPage($request) {
		$isCorrect = false;

		if ($request->isPost()) {
			if (
				isset($request->data['company_id']) &&
				isset($request->data['is_company_site']) &&
				isset($request->data['device_type']) &&
				isset($request->data['residence_id']) &&
				isset($request->data['page_id'])
			) {
				$this->begin();
				$isCorrect = true;

				if ($request->data['device_type'] === 'sp') {
					$isCorrect = $this->_delPageOfSmartphone($isCorrect, $request);
				} else if ($request->data['device_type'] === 'fp') {
					$isCorrect = $this->_delPageOfFeaturephone($isCorrect, $request);
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
	 * スマートフォンページ削除メソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _delPageOfSmartphone($isCorrect, $request) {
		if ($isCorrect === true) {
			$smartphone_pages = ClassRegistry::init('smartphone_pages');

			// smartphone_pagesから、id === $request->data['page_id']のレコードを取得(削除後、orderを修正するのに必要)
			$result = $smartphone_pages->find('first', array('conditions'=>array('id'=>$request->data['page_id'])));

			// smartphone_pagesから、id === $request->data['page_id']のレコードを削除
			if ($smartphone_pages->delete($request->data['page_id'])) {
				// 削除したレコードのorderより大きい値のレコードのorderを-1する
				$sql = 'UPDATE smartphone_pages SET `order` = `order` - 1 WHERE residence_id = ' . $result['smartphone_pages']['residence_id'] . ' AND `order` > ' . $result['smartphone_pages']['order'] . ';';
				if ($smartphone_pages->query($sql) !== false) {
					// smartphone_page_elementsから、page_id === $request->data['page_id']のレコードを削除
					$conditions = array(
						'page_id'	=> $request->data['page_id']
					);
					return ClassRegistry::init('smartphone_page_elements')->deleteAll($conditions);

				} else {
					return false;
				}

			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	/*
	 * フィーチャーフォンページ削除メソッド
	 * @param	$isCorrect		true===処理開始、false===処理せず終了
	 * @param	$request		ブラウザから送信されたデータ
	 * @return	boolean
	 */
	private function _delPageOfFeaturephone($isCorrect, $request) {
		if ($isCorrect === true) {
			$featurephone_pages = ClassRegistry::init('featurephone_pages');

			// featurephone_pagesから、id === $request->data['page_id']のレコードを取得(削除後、orderを修正するのに必要)
			$result = $featurephone_pages->find('first', array('conditions'=>array('id'=>$request->data['page_id'])));

			// featurephone_pagesから、id === $request->data['page_id']のレコードを削除
			if ($featurephone_pages->delete($request->data['page_id'])) {
				// 削除したレコードのorderより大きい値のレコードのorderを-1する
				$sql = 'UPDATE featurephone_pages SET `order` = `order` - 1 WHERE residence_id = ' . $result['featurephone_pages']['residence_id'] . ' AND `order` > ' . $result['featurephone_pages']['order'] . ';';
				return $featurephone_pages->query($sql) === false ? false : true;
			} else {
				return false;
			}

		} else {
			return false;
		}
	}
}
