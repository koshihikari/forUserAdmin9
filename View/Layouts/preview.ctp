<?php
/**
 *
 * PHP 5
 *
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright 2005-2012, Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright 2005-2012, Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @package       Cake.View.Layouts
 * @since         CakePHP(tm) v 0.10.0.1076
 * @license       MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

$cakeDescription = __d('cake_dev', 'CakePHP: the rapid development php framework');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Language" content="ja">
	<?php echo $this->Html->charset(($deviceName === 'featurephone' ? 'Shift_JIS' : '')); ?>
	<title>
		<?php echo $title_for_layout; ?>
	</title>
	<meta name="keywords" content="">
	<meta name="description" content="">
	<?php if ($deviceName === 'Smartphone'): ?>
		<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=0">
	<?php endif; ?>
	<?php
		if ($deviceName === 'Smartphone') {
			echo $this->Html->css(
				array(
					'../plugin/bootmetro-0.6.0/content/css/icomoon',
					'../bootstrap/css/bootstrap',
					'//fonts.googleapis.com/css?family=ABeeZee',
					'//fonts.googleapis.com/css?family=Open+Sans:300,400,600,700',
					'../plugin/bootstrap-modal-master/css/bootstrap-modal',
					'../plugin/jquery-ui-1.9.2.custom/css/ui-lightness/jquery-ui-1.9.2.custom',
					'../plugin/reveal/reveal',
					'../plugin/gridster/dist/jquery.gridster',
					'../plugin/colorpicker/css/colorpicker',
					'../plugin/colorpicker/css/layout',
					'../plugin/fontello/css/fontello',
					'../plugin/woothemes-FlexSlider-54e6d31/flexslider.css'
				)
			);
		}
	?>
	<?php
		if ($deviceName === 'Smartphone') {
			$arr = array(
				'less/general/chrome_shared2.less',

				'less/custom/common.less',
				'less/custom/adjust.less',

				'less/custom/helpers/insertImageOnWebModal.less',
				'less/custom/helpers/selectLinkPageModal.less',

				'less/custom/elements/navigationPanel.less',

				/***** ここから各画面のLess *****/
				'less/custom/contents/user/loginInUsers.less',
				'less/custom/contents/residence/catalog/onPcToSmartphone/catalogInResidence.less',
				'less/custom/contents/library_page/catalog/onPcToSmartphone/catalogInLibrary_Page.less',
				'less/custom/contents/library_page/edit/onPcToSmartphone/previewArea/previewArea.less',
				'less/custom/contents/library_page/edit/onPcToSmartphone/propertyArea/propertyArea.less',
				'less/custom/contents/library_page/edit/onPcToSmartphone/editInPage_Element.less',
				'less/custom/contents/library_page/edit/onPcToSmartphone/toolbar.less'
				/***** ここまで各画面のLess *****/
			);
			echo $this->Less->link($arr, array('minify' => false, 'combine' => false));
		}
	?>
	<?php
		if ($deviceName === 'Smartphone') {
			echo $this->Html->script(
			array(
				'../plugin/jquery-1.8.2/jquery-1.8.2.min.js',
				'../bootstrap/js/bootstrap.min',
				'../plugin/underscore-1.4.2/underscore-min.js',

				'../plugin/bootstrap-modal-master/js/bootstrap-modal.js',
				'../plugin/bootstrap-modal-master/js/bootstrap-modalmanager.js',
				'../plugin/reveal/jquery.reveal.js',
				'../plugin/gridster/dist/jquery.gridster.js',
				'../plugin/colorpicker/js/colorpicker.js',
				'../plugin/styleswitch/styleswitch.js',
				'../plugin/waypoints1.1.7/waypoints.min.js',
				'../plugin/woothemes-FlexSlider-54e6d31/jquery.flexslider.js?',

				'helper/Namespace.js?' . $modified,
				'helper/Gateway.js?' . $modified,
				'helper/Duplicater/Duplicater.js?' . $modified,
				'helper/AlertModalManager.js?' . $modified,
				'helper/Util.js?' . $modified,
				'common.js?' . $modified
			)
			);
		}
	?>

	<?php
		if ($deviceName === 'Smartphone') {
			$arr = array();
			array_push($arr, '//www.google.com/jsapi');
			array_push($arr, '//maps.google.com/maps/api/js?sensor=false&language=ja');

			array_push($arr, '../plugin/procolor-1.0/prototype.compressed.js?' . $modified);
			array_push($arr, '../plugin/procolor-1.0/procolor.js?' . $modified);
			array_push($arr, '../plugin/jquery-json/jquery.json-2.4.min.js?' . $modified);
			array_push($arr, '../plugin/jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom.js?' . $modified);
			array_push($arr, '../plugin/woothemes-FlexSlider-54e6d31/jquery.flexslider.js?' . $modified);

			array_push($arr, 'helper/gsManager.js?' . $modified);
			array_push($arr, 'helper/GsTagLibrary.js?' . $modified);
			array_push($arr, 'helper/DropUploader.js?' . $modified);
			array_push($arr, 'helper/InsertImageModalManager.js?' . $modified);
			array_push($arr, 'helper/SelectLinkPageModalManager.js?' . $modified);

			array_push($arr, 'contents/outline/edit/onPcToSmartphone/DataManager.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/RenderingManager.js?' . $modified);

			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/propertyArea/PropertyAreaManager.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/propertyArea/PropertyOfAbout.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/propertyArea/PropertyOfBg.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/propertyArea/PropertyOfBorder.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/propertyArea/PropertyOfCode.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/propertyArea/PropertyOfGallery.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/propertyArea/PropertyOfGsTag.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/propertyArea/PropertyOfIcon.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/propertyArea/PropertyOfImage.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/propertyArea/PropertyOfLayout.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/propertyArea/PropertyOfLink.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/propertyArea/PropertyOfMap.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/propertyArea/PropertyOfSize.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/propertyArea/PropertyOfSpace.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/propertyArea/PropertyOfTable.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/propertyArea/PropertyOfText.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/propertyArea/PropertyOfYoutube.js?' . $modified);

			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/previewArea/PreviewAreaManager.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/previewArea/PreviewOfAbout.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/previewArea/PreviewOfBg.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/previewArea/PreviewOfBorder.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/previewArea/PreviewOfCode.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/previewArea/PreviewOfGallery.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/previewArea/PreviewOfGsTag.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/previewArea/PreviewOfIcon.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/previewArea/PreviewOfImage.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/previewArea/PreviewOfLayout.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/previewArea/PreviewOfLink.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/previewArea/PreviewOfMap.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/previewArea/PreviewOfSize.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/previewArea/PreviewOfSpace.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/previewArea/PreviewOfTable.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/previewArea/PreviewOfText.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/previewArea/PreviewOfYoutube.js?' . $modified);

			// array_push($arr, 'contents/library_page/edit/onPcToSmartphone/AccessManager.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/DataManager.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/LayoutManager.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/ToolbarManager.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/testOnPcToSmartphone/TestInsert.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/testOnPcToSmartphone/TestDelete.js?' . $modified);
			array_push($arr, 'contents/library_page/edit/testOnPcToSmartphone/TestReorder.js?' . $modified);

			array_push($arr, 'contents/library_page/edit/onPcToSmartphone/forLibraryPageEdit.js?' . $modified);
			echo $this->Html->script($arr);
		}
	?>
</head>
<body id="displayArea" class="<?php echo strtolower($this->name); ?>">
	<?php echo $this->fetch('content'); ?>
</body>
</html>
