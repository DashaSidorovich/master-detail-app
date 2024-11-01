/*global history */
sap.ui.define([
		"zjblessons/masterDetailAppSidorovich/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/m/GroupHeaderListItem",
		"sap/ui/Device",
		"sap/ui/model/Sorter",
		"sap/m/MessageBox",
		"sap/m/MessageToast",
		"zjblessons/masterDetailAppSidorovich/model/formatter",
		"sap/ui/core/Fragment"

	], function (BaseController, JSONModel, Filter, FilterOperator, GroupHeaderListItem, Device, Sorter, MessageBox, MessageToast, formatter, Fragment) {
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
			
			onCreate: function(){
				this._loadCreateDialog();
			},
			
			_loadCreateDialog: async function() {
			    this._oDialog ??= await Fragment.load({
			        name: "zjblessons.masterDetailAppSidorovich.view.fragment.CreateDialog",
			        controller: this, 
			        id: "createDialog"
			    }).then(oDialog => {
			    	this.getView().addDependent(this.oDialog);
			    	oDialog.setModel(this.getView().getModel("i18n"), "i18n");
			    	return oDialog;
				});
				this._oDialog.open();
			},
			
			onDialogBeforeOpen: function(oEvent){

				const oDialog = oEvent.getSource();
				const oParams = {
					Created: new Date(),
					Modified: new Date()
				},
				oEntry=this.getModel().createEntry('/zjblessons_base_Items', {
					properties: oParams
				});
				oDialog.setBindingContext(oEntry);
				oDialog.setModel(this.getModel()); 
			},
			
			onPressSave: function(oEvent){
				const oContext = this._oDialog.getBindingContext();
			    console.log(oContext.getObject());

				this.getModel().submitChanges({
					success: () => {
						var msg = this.getResourceBundle().getText("successCreate");
						MessageToast.show(msg);
						console.log(oContext.getObject());
						this._bindTable();
					}
				});
				this._oDialog.close();
			},
			
			onPressCancel: function(){
				this.getModel().resetChanges();
				this._oDialog.close();
			},
			
			onRefresh : function () {
				this._oList.getBinding("items").refresh();
			},



			onBypassed : function () {
				this._oList.removeSelections(true);
			},

			onListItemPress: function (oEvent) {
			    var oItem = oEvent.getSource();
			    var sItemId = oItem.getBindingContext().getProperty("ItemID");
			    var sHeaderId = oItem.getBindingContext().getProperty("HeaderID");
				var sMaterialId = oItem.getBindingContext().getProperty("MaterialID");
				var sGroupId = oItem.getBindingContext().getProperty("GroupID");

			    if (sItemId && sHeaderId && sMaterialId && sGroupId) {
			        var bReplace = !Device.system.phone;
			        this.getRouter().navTo("object", {
			            objectId: sItemId,
			            headerId: sHeaderId,
			            materialId: sMaterialId,
			            groupId: sGroupId
			        }, bReplace);
			    } 
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






		});

	}
);