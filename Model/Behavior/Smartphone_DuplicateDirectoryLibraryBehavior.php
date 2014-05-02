<?php

class Smartphone_DuplicateDirectoryLibraryBehavior extends ModelBehavior {

	/*
	 * ディレクトリを複製するメソッド
	 * @param	$model				Model
	 * @param	$directoyrId		複製するディレクトリID
	 * @param	$userId				ユーザID
	 * @return	boolean
	 */
	public function duplicateDirectoryAction(Model $model, $directoyrId, $userId) {
		$smartphone_library_directories = ClassRegistry::init('smartphone_library_directories');
		$options = array(
			'conditions'		=> array(
				'id'				=> $directoyrId
			)
		);
		$result = $smartphone_library_directories->find('first', $options);

		if (count($result) === 1) {
			$smartphone_library_directories->begin();
			$options = array(
				'conditions'		=> array(
					'company_id'		=> $result['smartphone_library_directories']['company_id']
				)
			);
			$data = $result['smartphone_library_directories'];
			$data['name']			= 'コピー :: ' . $data['name'];
			$data['user_id']		= $userId;
			$data['order']			= $smartphone_library_directories->find('count', $options) + 1;
			unset($data['id'], $data['created'], $data['modified']);
			$smartphone_library_directories->create();
			if (is_array($smartphone_library_directories->save($data))) {
				$targetDirectoryId = $smartphone_library_directories->getLastInsertID();
				$options = array(
					'conditions'	=> array(
						'smartphone_library_directory_id'		=> $directoyrId
					)
				);
				$smartphone_libraries = ClassRegistry::init('smartphone_libraries');
				$result = $smartphone_libraries->find('all', $options);
				for ($i=0,$len=count($result); $i<$len; $i++) {
					if ($this->duplicateLibraryAction($model, $result[$i]['smartphone_libraries']['id'], $userId, $targetDirectoryId) === false) {
						$smartphone_library_directories->rollback();
						return false;
					}
				}
				$smartphone_library_directories->commit();
				return true;
			} else {
				return false;
			}
		}
		return false;
	}

	/*
	 * ライブラリを複製するメソッド
	 * @param	$model				Model
	 * @param	$libraryId			複製するライブラリID
	 * @param	$userId				ユーザID
	 * @param	$directoryId		複製先ディレクトリID(空の場合、複製元ライブラリと同じディレクトリに複製する)
	 * @return	boolean
	 */
	public function duplicateLibraryAction(Model $model, $libraryId, $userId, $directoryId=null) {
		$smartphone_libraries = ClassRegistry::init('smartphone_libraries');
		$options = array(
			'conditions'		=> array(
				'id'				=> $libraryId
			)
		);
		$result = $smartphone_libraries->find('first', $options);

		if (count($result) === 1) {
			$data = $result['smartphone_libraries'];
			unset($data['id'], $data['created'], $data['modified']);

			if ($directoryId) {	// 異なるディレクトリに複製する場合
				$data['smartphone_library_directory_id']		= $directoryId;
				$data['user_id']								= $userId;

			} else {	// 複製元ライブラリと同じディレクトリに複製する場合
				$options = array(
					'conditions'		=> array(
						'smartphone_library_directory_id'		=> $result['smartphone_libraries']['smartphone_library_directory_id']
					)
				);
				$data['title']			= 'コピー :: ' . $data['title'];
				$data['user_id']		= $userId;
				$data['order']			= $smartphone_libraries->find('count', $options) + 1;
			}
			$smartphone_libraries->create();
			if (is_array($smartphone_libraries->save($data))) {
				return $this->duplicateLibraryElementAction($model, $libraryId, $userId, $smartphone_libraries->getLastInsertID());
			} else {
				return false;
			}
		}
		return false;
	}

	/*
	 * ライブラリエレメントを複製するメソッド
	 * @param	$model				Model
	 * @param	$libraryId			複製するライブラリエレメントが所属するライブラリID
	 * @param	$userId				ユーザID
	 * @param	$newLibraryId		複製したライブラリエレメントが所属するライブラリID(空の場合、複製元ライブラリエレメントと同じライブラリに複製する)
	 * @return	boolean
	 */
	public function duplicateLibraryElementAction(Model $model, $libraryId, $userId, $newLibraryId) {
		$smartphone_library_elements = ClassRegistry::init('smartphone_library_elements');
		$options = array(
			'conditions'		=> array(
				'smartphone_library_id'				=> $libraryId
			)
		);
		$result = $smartphone_library_elements->find('all', $options);

		if (0 < count($result)) {		// 複製するライブラリエレメントが存在する場合
			for ($i=0,$len=count($result); $i<$len; $i++) {
				$data = $result[$i]['smartphone_library_elements'];
				$data['user_id'] = $userId;
				if ($newLibraryId) {
					$data['smartphone_library_id'] = $newLibraryId;
				}
				unset($data['id'], $data['created'], $data['modified']);
				$smartphone_library_elements->create();
				if (!is_array($smartphone_library_elements->save($data))) {
					return false;
				}
			}

		} else {		// 複製するライブラリエレメントが存在しない場合
			return true;
		}

		return true;
	}
}
?>