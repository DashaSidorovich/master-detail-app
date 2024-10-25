/* global document */
sap.ui.define([
		"sap/ui/core/UIComponent",
		"sap/ui/Device",
		"zjblessons/masterDetailAppSidorovich/model/models",
		"zjblessons/masterDetailAppSidorovich/controller/ListSelector",
		"zjblessons/masterDetailAppSidorovich/controller/ErrorHandler",
		'sap/f/FlexibleColumnLayoutSemanticHelper',
		'sap/f/library'

	], function (UIComponent, Device, models, ListSelector, ErrorHandler, FlexibleColumnLayoutSemanticHelper, fioriLibrary) {
		"use strict";

		return UIComponent.extend("zjblessons.masterDetailAppSidorovich.Component", {

			metadata : {
				manifest : "json"
			},


			init : function () {
				this.oListSelector = new ListSelector();
				this._oErrorHandler = new ErrorHandler(this);

				this.setModel(models.createDeviceModel(), "device");

				UIComponent.prototype.init.apply(this, arguments);

				this.getRouter().initialize();
			},


			destroy : function () {
				this.oListSelector.destroy();
				this._oErrorHandler.destroy();
				UIComponent.prototype.destroy.apply(this, arguments);
			},


			getContentDensityClass : function() {
				if (this._sContentDensityClass === undefined) {
					if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
						this._sContentDensityClass = "";
					} else if (!Device.support.touch) { 
						this._sContentDensityClass = "sapUiSizeCompact";
					} else {
						this._sContentDensityClass = "sapUiSizeCozy";
					}
				}
				return this._sContentDensityClass;
			},
		
			getHelper: function () {
			return this._getFcl().then(function(oFCL) {
				var oSettings = {
					defaultTwoColumnLayoutType: fioriLibrary.LayoutType.TwoColumnsMidExpanded,
					defaultThreeColumnLayoutType: fioriLibrary.LayoutType.ThreeColumnsMidExpanded,
					initialColumnsCount: 2,
					maxColumnsCount: 2
				};
				return (FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings));
			 });
		},

		_onBeforeRouteMatched: function(oEvent) {
			var oModel = this.getModel(),
				sLayout = oEvent.getParameters().arguments.layout,
				oNextUIState;
			if (!sLayout) {
				this.getHelper().then(function(oHelper) {
					oNextUIState = oHelper.getNextUIState(0);
					oModel.setProperty("/layout", oNextUIState.layout);
				});
				return;
			}

			oModel.setProperty("/layout", sLayout);
		},

		_getFcl: function () {
			return new Promise(function(resolve, reject) {
				var oFCL = this.getRootControl().byId('flexibleColumnLayout');
				if (!oFCL) {
					this.getRootControl().attachAfterInit(function(oEvent) {
						resolve(oEvent.getSource().byId('flexibleColumnLayout'));
					}, this);
					return;
				}
				resolve(oFCL);

			}.bind(this));
		}

		});

	}
);