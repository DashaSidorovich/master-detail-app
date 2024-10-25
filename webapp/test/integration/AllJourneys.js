/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 zjblessons_base_Items in the list

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
		"zjblessons/masterDetailAppSidorovich/test/integration/MasterJourney",
		"zjblessons/masterDetailAppSidorovich/test/integration/NavigationJourney",
		"zjblessons/masterDetailAppSidorovich/test/integration/NotFoundJourney",
		"zjblessons/masterDetailAppSidorovich/test/integration/BusyJourney"
	], function () {
		QUnit.start();
	});
});