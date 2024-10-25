/*global history */
sap.ui.define([
		"zjblessons/masterDetailAppSidorovich/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/m/GroupHeaderListItem",
		"sap/ui/Device",
		"sap/ui/model/Sorter",
		"zjblessons/masterDetailAppSidorovich/model/formatter"
	], function (BaseController, JSONModel, Filter, FilterOperator, GroupHeaderListItem, Device, Sorter, formatter) {
		"use strict";

		return BaseController.extend("zjblessons.masterDetailAppSidorovich.controller.Master", {

			formatter: formatter,


			onInit: function () {
			this.oView = this.getView();
			this._bDescendingSort = false;
			this.oTable = this.oView.byId("idTable");
			this.oRouter = this.getOwnerComponent().getRouter();
			},


			onUpdateFinished : function (oEvent) {
				this._updateListItemCount(oEvent.getParameter("total"));
				this.byId("pullToRefresh").hide();
			},


			onSort: function () {
			this._bDescendingSort = !this._bDescendingSort;
			var oBinding = this.oTable.getBinding("items"),
				oSorter = new Sorter("ItemID", this._bAscendingSort);

				oBinding.sort(oSorter);
			},
		
			onSearch : function (oEvent) {
				if (oEvent.getParameters().refreshButtonPressed) {

					this.onRefresh();
					return;
				}
				var oTableSearchState = [];
				var sQuery = oEvent.getParameter("query");

				if (sQuery) {
					oTableSearchState = [new Filter("ItemID", FilterOperator.Contains, sQuery)];
				} else {
					oTableSearchState = [];
				}
				this.oTable.getBinding("items").filter(oTableSearchState, "Application");

			},
			

			onRefresh : function () {
				this._oList.getBinding("items").refresh();
			},



			onBypassed : function () {
				this._oList.removeSelections(true);
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




		});

	}
);