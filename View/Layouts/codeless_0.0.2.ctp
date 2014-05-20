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
<?php
	if ($this->name === 'Page2') {
		$this->name = 'Page';
	}
?>
	<?php echo $this->Html->charset(); ?>
	<title>
		<?php echo $title_for_layout; ?>
	</title>
	<?php
		echo $this->Html->css(
			array(
				'../plugin/bootmetro-0.6.0/content/css/icomoon',
				// '//netdna.bootstrapcdn.com/bootstrap/3.0.0-wip/css/bootstrap.min.css',
				'../bootstrap/css/bootstrap',
				'//fonts.googleapis.com/css?family=ABeeZee',
				'//fonts.googleapis.com/css?family=Open+Sans:300,400,600,700',
				// '../plugin/bootmetro1.0.0/dist/assets/css/bootmetro',
				// '../plugin/bootmetro1.0.0/dist/assets/css/bootmetro-ui-light',
				'../plugin/bootplus1.0.3/css/bootplus',
				// '../plugin/bootplus1.0.3/css/bootplus-responsive',
				'../plugin/bootstrap-modal-master/css/bootstrap-modal',
				// '../plugin/jquery-ui-1.9.2.custom/css/ui-lightness/jquery-ui-1.9.2.custom',
				'../plugin/jquery-ui-1.10.3.custom/css/ui-lightness/jquery-ui-1.10.3.custom',
				'../plugin/reveal/reveal',
				'../plugin/gridster/dist/jquery.gridster',
				'../plugin/colorpicker/css/colorpicker',
				'../plugin/colorpicker/css/layout',
				'../plugin/bootstrap-datepicker-master/css/datepicker.css',
				'../plugin/CLEditor1_3_0/jquery.cleditor.css',
				'../plugin/sidr-package-1.1.1/stylesheets/jquery.sidr.light.css',
				'../plugin/FooTable-master0.5/css/footable-0.1.css',
				'../plugin/FooTable-master0.5/css/footable.sortable-0.1.css',
				// 'http://themergency.com/footable-demo/css/footable-0.1.css',
				// 'http://themergency.com/footable-demo/css/footable.sortable-0.1.css',
				// '../plugin/vague.js-master0.0.2/style',
				'../plugin/fontello/css/fontello'
			)
		);
		$pageName = $this->action . 'In' . $this->name;
		if ($pageName === 'editInLibrary' || $pageName === 'editInPage') {
			echo $this->Html->css(
				array(
					'../plugin/woothemes-FlexSlider-54e6d31/flexslider.css'
				)
			);
		}
	?>
	<?php
		$arr = array(
			'less/general/chrome_shared2.less',

			'less/custom/common.less',

			'less/custom/helpers/insertImageOnWebModal.less',
			'less/custom/helpers/selectLinkPageModal.less',
			'less/custom/helpers/Modal/libraryPageCopyModalManager.less',

			'less/custom/elements/sidePanel.less',
			'less/custom/elements/navigationPanel.less'
		);

		/***** ここから各画面のLess *****/
		if ($deviceName === 'Featurephone') {
			array_push($arr, 'less/custom/contents/library_page/edit/onPcToFeaturephone/editInPageElement.less');
			array_push($arr, 'less/custom/contents/library_page/catalog/onPcToFeaturephone/catalogInLibrary_Page.less');
		} else {
			array_push($arr, 'less/custom/contents/library_page/catalog/onPcToSmartphone/catalogInLibrary_Page.less');
			array_push($arr, 'less/custom/contents/library_page/edit/onPcToSmartphone/previewArea/previewArea.less');
			array_push($arr, 'less/custom/contents/library_page/edit/onPcToSmartphone/propertyArea/propertyArea.less');
			array_push($arr, 'less/custom/contents/library_page/edit/onPcToSmartphone/editInPage_Element.less');
			array_push($arr, 'less/custom/contents/library_page/edit/onPcToSmartphone/toolbar.less');

			array_push($arr, 'less/custom/contents/main/index/onPcToSmartphone/catalogInLibrary.less');

			array_push($arr, 'less/custom/contents/outline/edit/onPcToSmartphone/editInOutline.less');

			array_push($arr, 'less/custom/contents/page/detail/onPcToSmartphone/detailInPage.less');

			array_push($arr, 'less/custom/contents/residence/catalog/onPcToSmartphone/catalogInResidence.less');

			array_push($arr, 'less/custom/contents/user/loginInUsers.less');
		}
		/***** ここまで各画面のLess *****/

		echo $this->Less->link($arr, array('minify' => true, 'combine' => true));
	?>
	<?php echo $this->Html->script(
		array(
			'../plugin/jquery-1.8.2/jquery-1.8.2.min.js',
			// 'http://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js',
			// '//netdna.bootstrapcdn.com/bootstrap/3.0.0-wip/js/bootstrap.min.js',
			'../bootstrap/js/bootstrap.min',
			'../plugin/underscore-1.4.2/underscore-min.js',

			'../plugin/bootstrap-modal-master/js/bootstrap-modal.js',
			'../plugin/bootstrap-modal-master/js/bootstrap-modalmanager.js',
			'../plugin/reveal/jquery.reveal.js',
			'../plugin/gridster/dist/jquery.gridster.js',
			'../plugin/colorpicker/js/colorpicker.js',
			'../plugin/styleswitch/styleswitch.js',
			'../plugin/waypoints1.1.7/waypoints.min.js',
			'../plugin/sidr-package-1.1.1/jquery.sidr.min.js',
			'../plugin/FooTable-master0.5/js/footable.js',
			'../plugin/FooTable-master0.5/js/footable.sortable.js',
			// 'http://themergency.com/footable-demo/js/footable-0.1.js',
			// 'http://themergency.com/footable-demo/js/footable.sortable.js',
			// '../plugin/vague.js-master0.0.2/Vague.js',
			// '../plugin/animatedtablesorter-0.2.2/tsort.js',

			'helper/Namespace.js?' . $modified,
			'helper/Gateway.js?' . $modified,
			'helper/Duplicater/Duplicater.js?' . $modified,
			'helper/AlertModalManager.js?' . $modified,
			'helper/Util.js?' . $modified,
			'common.js?' . $modified
		)
	); ?>

	<?php
		$arr = array();
		$bodyId = ($this->action . 'In' . $this->name);
		switch ($bodyId) {
			case 'loginInUsers':
				array_push($arr, 'contents/users/login/onPcToSmartphone/forLogin.js?' . $modified);
				break;

			case 'indexInMain':
					array_push($arr, '//www.google.com/jsapi');
					array_push($arr, '//maps.google.com/maps/api/js?sensor=false&language=ja');

					array_push($arr, '../plugin/jquery-ui-1.10.3.custom/js/jquery-ui-1.10.3.custom.js?' . $modified);
					array_push($arr, 'helper/gsManager.js?' . $modified);
					array_push($arr, 'helper/GsTagLibrary.js?' . $modified);
					array_push($arr, 'helper/Modal/ConfirmModalManager.js?' . $modified);
					array_push($arr, 'helper/TextInputManager.js?' . $modified);

					array_push($arr, '../plugin/bootstrap-datepicker-master/js/bootstrap-datepicker.js?' . $modified);
					array_push($arr, '../plugin/bootstrap-datepicker-master/js/locales/bootstrap-datepicker.ja.js?' . $modified);

					array_push($arr, '../plugin/procolor-1.0/prototype.compressed.js?' . $modified);
					array_push($arr, '../plugin/procolor-1.0/procolor.js?' . $modified);
					array_push($arr, '../plugin/jquery-json/jquery.json-2.4.min.js?' . $modified);
					/*
					*/
					array_push($arr, '../plugin/jquery-ui-1.10.3.custom/js/jquery-ui-1.10.3.custom.js?' . $modified);
					// array_push($arr, '../plugin/jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom.js?' . $modified);
					array_push($arr, '../plugin/woothemes-FlexSlider-54e6d31/jquery.flexslider.js?' . $modified);
					/*
					*/

					array_push($arr, 'contents/main/index/onPcToSmartphone/Mediator.js?' . $modified);
					array_push($arr, 'contents/main/index/onPcToSmartphone/UtilManager.js?' . $modified);
					array_push($arr, 'contents/main/index/onPcToSmartphone/model/AppModel.js?' . $modified);
					array_push($arr, 'contents/main/index/onPcToSmartphone/view/PageView.js?' . $modified);
					array_push($arr, 'contents/main/index/onPcToSmartphone/view/ResidenceView.js?' . $modified);
					array_push($arr, 'contents/main/index/onPcToSmartphone/view/BulkEditOutlineView.js?' . $modified);
					array_push($arr, 'contents/main/index/onPcToSmartphone/view/TagView.js?' . $modified);
					// array_push($arr, 'contents/main/index/onPcToSmartphone/view/BulkEditTagView.js?' . $modified);

					array_push($arr, 'contents/library_page/edit/onPcToSmartphone/DataManager.js?' . $modified);
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

					array_push($arr, 'contents/library_page/edit/onPcToSmartphone/LayoutManager.js?' . $modified);
					array_push($arr, 'contents/library_page/edit/onPcToSmartphone/ToolbarManager.js?' . $modified);

					// array_push($arr, 'helper/ConcretePageManagerForFeaturephone.js?' . $modified);
					array_push($arr, 'helper/ConcretePageManager/SpConcretePageManager.js?' . $modified);
					array_push($arr, 'contents/library_page/edit/onPcToSmartphone/RenderingManager.js?' . $modified);
					array_push($arr, 'contents/outline/edit/onPcToSmartphone/DataManager.js?' . $modified);

					// array_push($arr, 'helper/ConcretePageManagerForFeaturephone.js?' . $modified);
					// array_push($arr, 'contents/library_page/catalog/onPcToFeaturephone/DataManager.js?' . $modified);
					// array_push($arr, 'contents/library_page/catalog/onPcToFeaturephone/PageManager.js?' . $modified);
					// array_push($arr, 'contents/library_page/catalog/onPcToFeaturephone/forLibraryPageCatalog.js?' . $modified);
					/*
					array_push($arr, 'contents/main/index/onPcToSmartphone/BaseRightElementManager.js?' . $modified);
					array_push($arr, 'contents/main/index/onPcToSmartphone/Mediator.js?' . $modified);
					array_push($arr, 'contents/main/index/onPcToSmartphone/UtilManager.js?' . $modified);
					array_push($arr, 'contents/main/index/onPcToSmartphone/DataManager.js?' . $modified);
					array_push($arr, 'contents/main/index/onPcToSmartphone/ResidenceManager.js?' . $modified);
					array_push($arr, 'contents/main/index/onPcToSmartphone/PageWrapperManager.js?' . $modified);
					array_push($arr, 'contents/main/index/onPcToSmartphone/PageManager.js?' . $modified);
					array_push($arr, 'contents/main/index/onPcToSmartphone/SmartphonePageManager.js?' . $modified);
					array_push($arr, 'contents/main/index/onPcToSmartphone/FeaturephonePageManager.js?' . $modified);
					array_push($arr, 'contents/main/index/onPcToSmartphone/ResidencePageManager.js?' . $modified);
					*/

					array_push($arr, 'contents/main/index/onPcToSmartphone/index.js?' . $modified);
				break;

			case 'editInOutline':
				array_push($arr, '../plugin/jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom.js?' . $modified);

				array_push($arr, 'helper/CustomXMLManager.js?' . $modified);
				array_push($arr, 'helper/FRKManager.js?' . $modified);
				array_push($arr, 'helper/ChangeResidenceNumModalManager.js?' . $modified);
				array_push($arr, 'helper/DropUploader.js?' . $modified);

				array_push($arr, 'contents/outline/edit/onPcToSmartphone/DataManager.js?' . $modified);
				array_push($arr, 'contents/outline/edit/onPcToSmartphone/PageManager.js?' . $modified);
				array_push($arr, 'contents/outline/edit/onPcToSmartphone/forEditInOutline.js?' . $modified);
				break;

			case 'catalogInLibrary':
				if ($deviceName === 'Smartphone') {
					array_push($arr, '../plugin/jquery-ui-1.10.3.custom/js/jquery-ui-1.10.3.custom.js?' . $modified);
					array_push($arr, 'helper/Modal/ConfirmModalManager.js?' . $modified);
					array_push($arr, 'helper/TextInputManager.js?' . $modified);
					array_push($arr, 'contents/library/catalog/onPcToSmartphone/Mediator.js?' . $modified);
					array_push($arr, 'contents/library/catalog/onPcToSmartphone/UtilManager.js?' . $modified);
					array_push($arr, 'contents/library/catalog/onPcToSmartphone/DataManager.js?' . $modified);
					array_push($arr, 'contents/library/catalog/onPcToSmartphone/DirectoryManager.js?' . $modified);
					array_push($arr, 'contents/library/catalog/onPcToSmartphone/LibraryManager.js?' . $modified);
					array_push($arr, 'contents/library/catalog/onPcToSmartphone/DirectoryLibraryManager.js?' . $modified);
					array_push($arr, 'contents/library/catalog/onPcToSmartphone/index.js?' . $modified);
				}
				break;

			case 'catalogInPage':
				array_push($arr, '//www.google.com/jsapi');
				array_push($arr, '//maps.google.com/maps/api/js?sensor=false&language=ja');

				array_push($arr, '../plugin/procolor-1.0/prototype.compressed.js?' . $modified);
				array_push($arr, '../plugin/procolor-1.0/procolor.js?' . $modified);
				array_push($arr, '../plugin/jquery-json/jquery.json-2.4.min.js?' . $modified);
				/*
				*/
				array_push($arr, '../plugin/jquery-ui-1.10.3.custom/js/jquery-ui-1.10.3.custom.js?' . $modified);
				// array_push($arr, '../plugin/jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom.js?' . $modified);
				array_push($arr, '../plugin/woothemes-FlexSlider-54e6d31/jquery.flexslider.js?' . $modified);

				array_push($arr, 'helper/gsManager.js?' . $modified);
				array_push($arr, 'helper/GsTagLibrary.js?' . $modified);
				array_push($arr, 'helper/DropUploader.js?' . $modified);
				/*
				*/
				array_push($arr, 'helper/Modal/ConfirmModalManager.js?' . $modified);
				// array_push($arr, 'helper/Modal/LibraryPageCopyModalManager.js?' . $modified);
				array_push($arr, 'helper/InsertImageModalManager.js?' . $modified);
				array_push($arr, 'helper/Modal/SelectLinkPageModalManager.js?' . $modified);

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

				array_push($arr, 'contents/library_page/edit/onPcToSmartphone/DataManager.js?' . $modified);
				array_push($arr, 'contents/library_page/edit/onPcToSmartphone/LayoutManager.js?' . $modified);
				array_push($arr, 'contents/library_page/edit/onPcToSmartphone/ToolbarManager.js?' . $modified);
				array_push($arr, 'contents/library_page/edit/testOnPcToSmartphone/TestInsert.js?' . $modified);
				array_push($arr, 'contents/library_page/edit/testOnPcToSmartphone/TestDelete.js?' . $modified);
				array_push($arr, 'contents/library_page/edit/testOnPcToSmartphone/TestReorder.js?' . $modified);
				/*
				*/

				if ($deviceName === 'Smartphone') {
					// if ($bodyId === 'catalogInPage') {
						array_push($arr, 'helper/ConcretePageManagerForSmartphone.js?' . $modified);
						array_push($arr, 'contents/library_page/catalog/onPcToSmartphone/DataManager.js?' . $modified);
						array_push($arr, 'contents/library_page/catalog/onPcToSmartphone/PageManager.js?' . $modified);
						array_push($arr, 'contents/library_page/catalog/onPcToSmartphone/forLibraryPageCatalog.js?' . $modified);

					// } else if ($bodyId === 'catalogInLibrary') {
					// 	array_push($arr, 'helper/TextInputManager.js?' . $modified);
					// 	array_push($arr, 'contents/library/catalog/onPcToSmartphone/DataManager.js?' . $modified);
					// 	array_push($arr, 'contents/library/catalog/onPcToSmartphone/DirectoryManager.js?' . $modified);
					// 	array_push($arr, 'contents/library/catalog/onPcToSmartphone/LibraryManager.js?' . $modified);
					// 	array_push($arr, 'contents/library/catalog/onPcToSmartphone/DirectoryLibraryManager.js?' . $modified);
					// 	array_push($arr, 'contents/library/catalog/onPcToSmartphone/index.js?' . $modified);
					// }
				} else if ($deviceName === 'Featurephone') {
					array_push($arr, 'helper/ConcretePageManagerForFeaturephone.js?' . $modified);
					array_push($arr, 'contents/library_page/catalog/onPcToFeaturephone/DataManager.js?' . $modified);
					array_push($arr, 'contents/library_page/catalog/onPcToFeaturephone/PageManager.js?' . $modified);
					array_push($arr, 'contents/library_page/catalog/onPcToFeaturephone/forLibraryPageCatalog.js?' . $modified);
				}
				break;

			case 'editInLibrary':
			case 'editInPage':
					array_push($arr, '//www.google.com/jsapi');
					array_push($arr, 'helper/gsManager.js?' . $modified);
					array_push($arr, 'helper/GsTagLibrary.js?' . $modified);
				if ($deviceName === 'Smartphone') {
					array_push($arr, '//maps.google.com/maps/api/js?sensor=false&language=ja');

					array_push($arr, '../plugin/procolor-1.0/prototype.compressed.js?' . $modified);
					array_push($arr, '../plugin/procolor-1.0/procolor.js?' . $modified);
					array_push($arr, '../plugin/jquery-json/jquery.json-2.4.min.js?' . $modified);
					array_push($arr, '../plugin/jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom.js?' . $modified);
					array_push($arr, '../plugin/woothemes-FlexSlider-54e6d31/jquery.flexslider.js?' . $modified);

					array_push($arr, 'helper/DropUploader.js?' . $modified);
					array_push($arr, 'helper/InsertImageModalManager.js?' . $modified);
					array_push($arr, 'helper/Modal/SelectLinkPageModalManager.js?' . $modified);

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

					array_push($arr, 'contents/library_page/edit/onPcToSmartphone/DataManager.js?' . $modified);
					array_push($arr, 'contents/library_page/edit/onPcToSmartphone/LayoutManager.js?' . $modified);
					array_push($arr, 'contents/library_page/edit/onPcToSmartphone/ToolbarManager.js?' . $modified);
					array_push($arr, 'contents/library_page/edit/testOnPcToSmartphone/TestInsert.js?' . $modified);
					array_push($arr, 'contents/library_page/edit/testOnPcToSmartphone/TestDelete.js?' . $modified);
					array_push($arr, 'contents/library_page/edit/testOnPcToSmartphone/TestReorder.js?' . $modified);

					array_push($arr, 'contents/library_page/edit/onPcToSmartphone/forLibraryPageEdit.js?' . $modified);

				} else if ($deviceName === 'Featurephone') {
					array_push($arr, '../plugin/CLEditor1_3_0/jquery.cleditor.min.js?' . $modified);
					array_push($arr, '../plugin/CLEditor1_3_0/jquery.cleditor.advancedtable.min.js?' . $modified);
					array_push($arr, 'contents/library_page/edit/onPcToFeaturephone/DataManager.js?' . $modified);
					array_push($arr, 'contents/library_page/edit/onPcToFeaturephone/Gateway.js?' . $modified);
					array_push($arr, 'contents/library_page/edit/onPcToFeaturephone/LayoutManager.js?' . $modified);
					array_push($arr, 'contents/library_page/edit/onPcToFeaturephone/PageManager.js?' . $modified);
					array_push($arr, 'contents/library_page/edit/onPcToFeaturephone/EdirotManager.js?' . $modified);
					array_push($arr, 'contents/library_page/edit/onPcToFeaturephone/forLibraryPageEdit.js?' . $modified);
				}
				break;
		}
		echo $this->Html->script($arr);
	?>
</head>
<body id="<?php echo $this->action . 'In' . $this->name; ?>" class="<?php echo strtolower($this->name);?>">

	<?php //if (($this->action . 'In' . $this->name) === 'indexInIndex' || ($this->name) === 'Users'): ?>
	<?php if (($this->name) === 'Users'): ?>
		<?php echo $this->fetch('content'); ?>
	<?php else: ?>
		<div id="contentForUserAdmin" class="commonElem">
			<?php echo $this->element('navigationPanel'); ?>
			<?php //echo $this->element('breadCrumbListForUserAdmin'); ?>
			<?php echo $this->fetch('content'); ?>
		</div>
	</div>
	<?php endif; ?>
	<?php //echo $this->element('sql_dump'); ?>
	<?php echo $this->element('sidePanel'); ?>



</body>
</html>
