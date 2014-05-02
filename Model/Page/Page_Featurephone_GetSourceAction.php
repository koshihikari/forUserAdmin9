<?php

class Page_Featurephone_GetSourceAction extends AppModel {
	public $useTable = 'featurephone_pages';

	/*
	 * フィーチャーフォンページのソースを返すメソッド
	 * @param	request		ブラウザから送信されたデータ
	 * @return	json
	 */
	public function getSource($userId, $pageId) {
		$outlineSource = '';

		if ($userId && $pageId) {
			$options = array(
				'conditions'	=> array(
					'id'				=> $pageId
				)
			);
			$result = ClassRegistry::init('featurephone_pages')->find('first', $options);
			preg_match_all('/<!-- OutlineTableBigin,(.+?)-->/s', $result['featurephone_pages']['preview_source'], $matches, PREG_PATTERN_ORDER);

			// $splits = preg_split('/<!-- OutlineTableBigin,(.+?)-->(.+?)<!-- OutlineTableEnd(.+?)-->/s', $result['featurephone_pages']['preview_source']);

			// ob_start();//ここから
			// var_dump($result);
			// $out=ob_get_contents();//ob_startから出力された内容をゲットする。
			// ob_end_clean();//ここまで
			// error_log('-----------------' . "\n", 3, 'log.txt');
			// error_log('count = ' . count($result) . "\n", 3, 'log.txt');
			// error_log($out . "\n", 3, 'log.txt');
			// error_log(($matches[0]) . "\n", 3, 'log.txt');
			// error_log('check = ' . ($matches[0] === '') . "\n", 3, 'log.txt');
			// error_log('count = ' . (count($matches[0])) . "\n", 3, 'log.txt');
			// error_log('preview_source = ' . ($result['featurephone_pages']['preview_source']) . "\n", 3, 'log.txt');
			// error_log('-----------------' . "\n", 3, 'log.txt');

			if (0 < count($matches) && $matches[0] && 0 < count($matches[0])) {	// 物件概要ページの場合
				$residenceId = $result['featurephone_pages']['residence_id'];
				$result2 = ClassRegistry::init('Outline_GetOutlineAction')->getOutline($residenceId, $userId);

				// ページソースに記述されている物件概要パーツのプロパティをオブジェクトに変換
				$matches[1][0] = preg_replace('/\s\s+|\n|\s$/', '', $matches[1][0]);
				// $matches[1][0] = preg_replace('/+|^¥n/', '', $matches[1][0]);
				$outlineConfig = explode(',', $matches[1][0]);
				// $words = preg_split('/<!-- OutlineTableBigin(.+?)--\>/', $result['featurephone_pages']['preview_source']);
				$config = array();
				for ($i=0,$len=count($outlineConfig); $i<$len; $i++) {
					$tmp = explode('=', $outlineConfig[$i]);
					$config[$tmp[0]] = $tmp[1];
				}

				// 物件概要オブジェクトと物件概要データから物件概要パーツのコードを作成
				$sourceArr = array();
				$outlineArr = $result2['outlines'];
			// ob_start();//ここから
			// var_dump($outlineArr);
			// $out=ob_get_contents();//ob_startから出力された内容をゲットする。
			// ob_end_clean();//ここまで
			// error_log('-----------------' . "\n", 3, 'log.txt');
			// error_log($out . "\n", 3, 'log.txt');
			// error_log('-----------------' . "\n", 3, 'log.txt');
				for($i=0,$len=count($outlineArr); $i<$len; $i++) {
					if ($outlineArr[$i]['items'] && 0 < count($outlineArr[$i]['items'])) {
						$tmpSourceArr = array();
						array_push($tmpSourceArr, '<!-- OutlineTableBigin,');
						array_push($tmpSourceArr, 'categoryFontSize=' . $config['categoryFontSize'] . ',');
						array_push($tmpSourceArr, 'categoryFontColor=' . $config['categoryFontColor'] . ',');
						array_push($tmpSourceArr, 'categoryBgColor=' . $config['categoryBgColor'] . ',');
						array_push($tmpSourceArr, 'keyFontSize=' . $config['keyFontSize'] . ',');
						array_push($tmpSourceArr, 'keyFontColor=' . $config['keyFontColor'] . ',');
						array_push($tmpSourceArr, 'keyBgColor=' . $config['keyBgColor'] . ',');
						array_push($tmpSourceArr, 'valFontSize=' . $config['valFontSize'] . ',');
						array_push($tmpSourceArr, 'valFontColor=' . $config['valFontColor'] . ',');
						array_push($tmpSourceArr, 'valBgColor=' . $config['valBgColor'] . ',');
						array_push($tmpSourceArr, 'cellSpacing=' . $config['cellSpacing'] . ',');
						array_push($tmpSourceArr, 'cellPadding=' . $config['cellPadding'] . ',');
						array_push($tmpSourceArr, 'border=' . $config['border'] . ' -->');
						// array_push($tmpSourceArr, '<!-- OutlineTableBigin -->');
						// array_push($tmpSourceArr, '<!-- categoryFontSize=' . $config['categoryFontSize'] . ' -->');
						// array_push($tmpSourceArr, '<!-- categoryFontColor=' . $config['categoryFontColor'] . ' -->');
						// array_push($tmpSourceArr, '<!-- categoryBgColor=' . $config['categoryBgColor'] . ' -->');
						// array_push($tmpSourceArr, '<!-- keyFontSize=' . $config['keyFontSize'] . ' -->');
						// array_push($tmpSourceArr, '<!-- keyFontColor=' . $config['keyFontColor'] . ' -->');
						// array_push($tmpSourceArr, '<!-- keyBgColor=' . $config['keyBgColor'] . ' -->');
						// array_push($tmpSourceArr, '<!-- valFontSize=' . $config['valFontSize'] . ' -->');
						// array_push($tmpSourceArr, '<!-- valFontColor=' . $config['valFontColor'] . ' -->');
						// array_push($tmpSourceArr, '<!-- valBgColor=' . $config['valBgColor'] . ' -->');
						// array_push($tmpSourceArr, '<!-- cellSpacing=' . $config['cellSpacing'] . ' -->');
						// array_push($tmpSourceArr, '<!-- cellPadding=' . $config['cellPadding'] . ' -->');
						// array_push($tmpSourceArr, '<!-- border=' . $config['border'] . ' -->');
						array_push($tmpSourceArr, '<table width="100%" border="' . $config['border'] . '" cellpadding="' . $config['cellPadding'] . '" cellspacing="' . $config['cellSpacing'] . '">');
						array_push($tmpSourceArr, '<tr><td bgcolor="' . $config['categoryBgColor'] . '"><font size="' . $config['categoryFontSize'] . '" color="' . $config['categoryFontColor'] . '">' . $outlineArr[$i]['category']['key'] . '</font></td></tr>');
						for ($j=0,$len2=count($outlineArr[$i]['items']); $j<$len2; $j++) {
							array_push($tmpSourceArr, '<tr>');
							array_push($tmpSourceArr, '<td bgcolor="' . $config['keyBgColor'] . '"><font size="' . $config['keyFontSize'] . '" color="' . $config['keyFontColor'] . '">■' . $outlineArr[$i]['items'][$j]['key'] . '</font></td>');
							array_push($tmpSourceArr, '</tr>');
							array_push($tmpSourceArr, '<tr>');
							array_push($tmpSourceArr, '<td bgcolor="' . $config['valBgColor'] . '"><font size="' . $config['valFontSize'] . '" color="' . $config['valFontColor'] . '">' . $outlineArr[$i]['items'][$j]['val'] . '</font></td>');
							array_push($tmpSourceArr, '</tr>');
						}
						array_push($tmpSourceArr, '</table>');
						array_push($tmpSourceArr, '<!-- OutlineTableEnd -->');
						array_push($sourceArr, implode("\n", $tmpSourceArr));
					}
				}
				$tmpSource = implode("<br />\n", $sourceArr);
				// $outlineSource = implode("<br />\n", $sourceArr);

				// error_log('-----------------' . "\n", 3, 'log.txt');
				// error_log('-----------------' . "\n", 3, 'log.txt');
				// error_log($tmpSource . "\n", 3, 'log.txt');
				// error_log('-----------------' . "\n", 3, 'log.txt');
				// error_log('-----------------' . "\n", 3, 'log.txt');


				$outlineSource = preg_split('/<!-- OutlineTableEnd(.+?)-->/s', $tmpSource);
				// ob_start();//ここから
				// var_dump($outlineSource);
				// $out=ob_get_contents();//ob_startから出力された内容をゲットする。
				// ob_end_clean();//ここまで
				// error_log('-----------------' . "\n", 3, 'log.txt');
				// error_log($out . "\n", 3, 'log.txt');
				// error_log('count = ' . (count($outlineSource)) . "\n", 3, 'log.txt');
				// error_log('-----------------' . "\n", 3, 'log.txt');
				$outlineSource = preg_replace('/<!-- OutlineTableBigin,(.+?)-->(.+?)<!-- OutlineTableEnd(.+?)-->/', $tmpSource, $result['featurephone_pages']['preview_source']);
				// $outlineSource = preg_replace('/<!-- OutlineTableBigin,(.+?)-->(.+?)<!-- OutlineTableEnd(.+?)-->/s', $tmpSource, $result['featurephone_pages']['preview_source']);
				// $splits = preg_split('/<!-- OutlineTableBigin,(.+?)-->(.+?)<!-- OutlineTableEnd(.+?)-->/s', $result['featurephone_pages']['preview_source']);


				// ob_start();//ここから
				// var_dump($matches);
				// $out=ob_get_contents();//ob_startから出力された内容をゲットする。
				// ob_end_clean();//ここまで
				// error_log('-----------------' . "\n", 3, 'log.txt');
				// error_log('count = ' . count($matches) . "\n", 3, 'log.txt');
				// error_log($out . "\n", 3, 'log.txt');
				// error_log('-----------------' . "\n", 3, 'log.txt');

				// ob_start();//ここから
				// var_dump($outlineConfig);
				// $out=ob_get_contents();//ob_startから出力された内容をゲットする。
				// ob_end_clean();//ここまで
				// error_log('-----------------' . "\n", 3, 'log.txt');
				// error_log($out . "\n", 3, 'log.txt');
				// error_log('-----------------' . "\n", 3, 'log.txt');

				// ob_start();//ここから
				// var_dump($config);
				// $out=ob_get_contents();//ob_startから出力された内容をゲットする。
				// ob_end_clean();//ここまで
				// error_log('-----------------' . "\n", 3, 'log.txt');
				// error_log($out . "\n", 3, 'log.txt');
				// error_log('-----------------' . "\n", 3, 'log.txt');

				error_log('-----------------' . "\n", 3, 'log.txt');
				error_log($outlineSource . "\n", 3, 'log.txt');
				error_log('-----------------' . "\n", 3, 'log.txt');
			} else {
				$outlineSource = $result['featurephone_pages']['preview_source'];
			}
		}
		return $outlineSource;
	}
}
