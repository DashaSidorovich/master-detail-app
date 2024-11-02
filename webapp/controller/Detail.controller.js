/*global location */
sap.ui.define([
		"zjblessons/masterDetailAppSidorovich/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"zjblessons/masterDetailAppSidorovich/model/formatter",
		"sap/m/MessageBox",
		"sap/m/MessageToast"

	], function (BaseController, JSONModel, formatter, MessageBox, MessageToast) {
		"use strict";

		return BaseController.extend("zjblessons.masterDetailAppSidorovich.controller.Detail", {

			formatter: formatter,

			onInit : function () {
			
				var oViewModel = new JSONModel({
					busy : false,
					delay : 0
				});

				this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

				this.setModel(oViewModel, "detailView");

				this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
			},






			_onObjectMatched: function (oEvent) {
			    var sObjectId = oEvent.getParameter("arguments").objectId;
			    var sHeaderId = oEvent.getParameter("arguments").headerId;
			    var sMaterialId = oEvent.getParameter("arguments").materialId;
			    var sGroupId = oEvent.getParameter("arguments").groupId;

			    this.getModel().metadataLoaded().then(function() {
			        var sObjectPath = this.getModel().createKey("zjblessons_base_Items", {
			            ItemID: sObjectId,
			            HeaderID: sHeaderId
			        });

			        var sHeaderPath = "/zjblessons_base_Headers('" + sHeaderId + "')";
			        this.getModel().read(sHeaderPath, {
			            success: function(oData) {
			                var oDocumentNumber = this.getView().byId("documentNumber");
			                oDocumentNumber.setText(oData.DocumentNumber);
			                
			                var oDocumentDate = this.getView().byId("documentDate");
			                oDocumentDate.setText(oData.DocumentDate);
			            }.bind(this),
			            error: function(oError) {
			            }
			        });
			        
			        var sMaterialPath = "/zjblessons_base_Materials('" + sMaterialId + "')";
			        this.getModel().read(sMaterialPath, {
			            success: function(oData) {
			                var oMaterialText = this.getView().byId("materialText");
			                oMaterialText.setText(oData.MaterialText);
			                
			                var oMaterialDescription = this.getView().byId("materialDescription");
			                oMaterialDescription.setText(oData.MaterialDescription);
			            }.bind(this),
			            error: function(oError) {
			            }
			        });
			        
			        var sGroupPath = "/zjblessons_base_Groups('" + sGroupId + "')";
			        this.getModel().read(sGroupPath, {
			            success: function(oData) {
			                var oGroupText = this.getView().byId("groupText");
			                oGroupText.setText(oData.GroupText);
			                
			                var oGroupDescription = this.getView().byId("groupDescription");
			                oGroupDescription.setText(oData.GroupDescription);
			            }.bind(this),
			            error: function(oError) {
			            }
			        });
						
					this._bindView("/" + sObjectPath);
					}.bind(this));
			},
			


			onDelete: function (oEvent){
				var oBindingContext = oEvent.getSource().getBindingContext(),
				key = this.getModel().createKey('/tItems',
				{
					ID: oBindingContext.getProperty('ItemID'),
					HeaderID: oBindingContext.getProperty('HeaderID'),
					Instance: "1000000"
				});
				MessageBox.confirm(this.getResourceBundle().getText("deleteMessage"), {
				title: this.getResourceBundle().getText("deleteConfirm"),                                    
    			actions: [sap.m.MessageBox.Action.OK,
            	sap.m.MessageBox.Action.CANCEL],         
    			emphasizedAction: sap.m.MessageBox.Action.OK,
    			onClose: function(oAction){
					if(oAction === sap.m.MessageBox.Action.OK) {
						this.getModel().remove(key,
						{
							success: function(oData){
							var msg = this.getResourceBundle().getText("successDelete");
							MessageToast.show(msg);
							}.bind(this)
						});
					}
				}.bind(this)
				});
			},


			_bindView : function (sObjectPath) {
				var oViewModel = this.getModel("detailView");

				oViewModel.setProperty("/busy", false);

				this.getView().bindElement({
					path : sObjectPath,
					events: {
						change : this._onBindingChange.bind(this),
						dataRequested : function () {
							oViewModel.setProperty("/busy", true);
						},
						dataReceived: function () {
							oViewModel.setProperty("/busy", false);
						}
					}
				});
			},

			_onBindingChange : function () {
				var oView = this.getView(),
					oElementBinding = oView.getElementBinding();

				if (!oElementBinding.getBoundContext()) {
					this.getRouter().getTargets().display("detailObjectNotFound");

					this.getOwnerComponent().oListSelector.clearMasterListSelection();
					return;
				}

			},

			_onMetadataLoaded : function () {
				var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
					oViewModel = this.getModel("detailView");


				oViewModel.setProperty("/delay", 0);

				oViewModel.setProperty("/busy", true);
				oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
			}

		});

	}
);