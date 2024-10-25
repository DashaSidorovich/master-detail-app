/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"zjblessons/masterDetailAppSidorovich/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"zjblessons/masterDetailAppSidorovich/test/integration/pages/App",
	"zjblessons/masterDetailAppSidorovich/test/integration/pages/Browser",
	"zjblessons/masterDetailAppSidorovich/test/integration/pages/Master",
	"zjblessons/masterDetailAppSidorovich/test/integration/pages/Detail",
	"zjblessons/masterDetailAppSidorovich/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "zjblessons.masterDetailAppSidorovich.view."
	});

	sap.ui.require([
		"zjblessons/masterDetailAppSidorovich/test/integration/NavigationJourneyPhone",
		"zjblessons/masterDetailAppSidorovich/test/integration/NotFoundJourneyPhone",
		"zjblessons/masterDetailAppSidorovich/test/integration/BusyJourneyPhone"
	], function () {
		QUnit.start();
	});
});