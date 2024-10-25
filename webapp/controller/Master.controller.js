/*global history */
sap.ui.define([
		"zjblessons/masterDetailAppSidorovich/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/m/GroupHeaderListItem",
		"sap/ui/Device",
		"zjblessons/masterDetailAppSidorovich/model/formatter"
	], function (BaseController, JSONModel, Filter, FilterOperator, GroupHeaderListItem, Device, formatter) {
		"use strict";

		return BaseController.extend("zjblessons.masterDetailAppSidorovich.controller.Master", {

			formatter: formatter,


			onInit : function () {
				var oList = this.byId("list"),
					oViewModel = this._createViewModel(),

					iOriginalBusyDelay = oList.getBusyIndicatorDelay();


				this._oList = oList;
				this._oListFilterState = {
					aFilter : [],
					aSearch : []
				};

				this.setModel(oViewModel, "masterView");

				oList.attachEventOnce("updateFinished", function(){
					oViewModel.setProperty("/delay", iOriginalBusyDelay);
				});

				this.getView().addEventDelegate({
					onBeforeFirstShow: function () {
						this.getOwnerComponent().oListSelector.setBoundMasterList(oList);
					}.bind(this)
				});

				this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);
				this.getRouter().attachBypassed(this.onBypassed, this);
			},


			onUpdateFinished : function (oEvent) {
				this._updateListItemCount(oEvent.getParameter("total"));
				this.byId("pullToRefresh").hide();
			},


			onSearch : function (oEvent) {
				if (oEvent.getParameters().refreshButtonPressed) {

					this.onRefresh();
					return;
				}

				var sQuery = oEvent.getParameter("query");

				if (sQuery) {
					this._oListFilterState.aSearch = [new Filter("HeaderID", FilterOperator.Contains, sQuery)];
				} else {
					this._oListFilterState.aSearch = [];
				}
				this._applyFilterSearch();

			},


			onRefresh : function () {
				this._oList.getBinding("items").refresh();
			},


			onSelectionChange : function (oEvent) {
				// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
				this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
			},

			onBypassed : function () {
				this._oList.removeSelections(true);
			},


			createGroupHeader : function (oGroup) {
				return new GroupHeaderListItem({
					title : oGroup.text,
					upperCase : false
				});
			},


			onNavBack : function() {
				history.go(-1);
			},



			_createViewModel : function() {
				return new JSONModel({
					isFilterBarVisible: false,
					filterBarLabel: "",
					delay: 0,
					title: this.getResourceBundle().getText("masterTitleCount", [0]),
					noDataText: this.getResourceBundle().getText("masterListNoDataText"),
					sortBy: "HeaderID",
					groupBy: "None"
				});
			},


			_onMasterMatched :  function() {
				this.getOwnerComponent().oListSelector.oWhenListLoadingIsDone.then(
					function (mParams) {
						if (mParams.list.getMode() === "None") {
							return;
						}
						var sObjectId = mParams.firstListitem.getBindingContext().getProperty("HeaderID");
						this.getRouter().navTo("object", {objectId : sObjectId}, true);
					}.bind(this),
					function (mParams) {
						if (mParams.error) {
							return;
						}
						this.getRouter().getTargets().display("detailNoObjectsAvailable");
					}.bind(this)
				);
			},


			_showDetail : function (oItem) {
				var bReplace = !Device.system.phone;
				this.getRouter().navTo("object", {
					objectId : oItem.getBindingContext().getProperty("HeaderID")
				}, bReplace);
			},


			_updateListItemCount : function (iTotalItems) {
				var sTitle;
				if (this._oList.getBinding("items").isLengthFinal()) {
					sTitle = this.getResourceBundle().getText("masterTitleCount", [iTotalItems]);
					this.getModel("masterView").setProperty("/title", sTitle);
				}
			},


			_applyFilterSearch : function () {
				var aFilters = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter),
					oViewModel = this.getModel("masterView");
				this._oList.getBinding("items").filter(aFilters, "Application");
				if (aFilters.length !== 0) {
					oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataWithFilterOrSearchText"));
				} else if (this._oListFilterState.aSearch.length > 0) {
					oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataText"));
				}
			},


			_applyGroupSort : function (aSorters) {
				this._oList.getBinding("items").sort(aSorters);
			},


			_updateFilterBar : function (sFilterBarText) {
				var oViewModel = this.getModel("masterView");
				oViewModel.setProperty("/isFilterBarVisible", (this._oListFilterState.aFilter.length > 0));
				oViewModel.setProperty("/filterBarLabel", this.getResourceBundle().getText("masterFilterBarText", [sFilterBarText]));
			}

		});

	}
);