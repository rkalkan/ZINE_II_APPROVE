jQuery.sap.require("ZINE_II_APPROVE.util.Formatter");
jQuery.sap.require("ZINE_II_APPROVE.util.Util");
sap.ui.controller("ZINE_II_APPROVE.view.MasterList", {

	desc: undefined,
	bIsAfterCreate: false,

	list: function() {
		return this.getView().byId("list");
	},

	onInit: function() {
		this.onInitValue = true;
		var oEventBus = sap.ui.getCore().getEventBus();
		this.getObjectID();
		this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		this.oView = this.getView();
	},

	attachRoutePatternMatched: function(e) {
		if (e.getParameter("name") === "MasterList") {
			var that = this;
			that.objectId = undefined;
			this.oModel = that.getView().getModel();
			this.createdObjectId = undefined;
		}
	},

	handleOpenDialogFilter: function() {
		this.getFilterDialog().open("filter");
	},

	getFilterDialog: function() {
		if (!this._oDialog) {
			this._oDialog = sap.ui.xmlfragment("idViewSettingsFragment", "ZINE_II_APPROVE.view.Dialog", this);
			this.getView().addDependent(this._oDialog);
		}
		return this._oDialog;
	},

	getObjectID: function(channelId, eventId, data) {
		this.createdObjectId = data;
		var that = this;
		var b = that.getFilters();
		var f = [];
		if (this.createdObjectId) {
			f.push(new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.EQ, this.createdObjectId));
		} else {
			f = b;
		}
		// if (f !== undefined) {
		// 	that.list().getBinding("items").filter(f);
		// } else {
		// 	that.list().getBinding("items");
		// }
		this.byId("toolbarInfo").setVisible(true);
		this.byId("labelInfo").setText('Tüm Faturalar');
		this.createdObjectId = undefined;
	},

	handleSearch: function(e) {
		var t = e.getParameter("query");
		if (t) {
			var i = new sap.ui.model.Filter("ObjectID", sap.ui.model.FilterOperator.Contains, t),
				a = [i];
			this.list().getBinding("items").filter(new sap.ui.model.Filter(a, !1));
		} else {
			this.list().getBinding("items").filter();
		}
	},

	_handleSelect: function(e) {
		this.context = e.getParameter("listItem");
		this.showDetail(this.context, "Detail");
	},

	showDetail: function(e, t) {
		var i = e.getBindingContext().getObject();
		this._oRouter.navTo(t, {
			ObjectID: i.ObjectID
		});
	},
	getFilters: function() {
		var f = [];
		if (undefined !== this.objectId === undefined) {
			f.push(new sap.ui.model.Filter("ObjectID", sap.ui.model.FilterOperator.EQ, this.objectId));
		}
		return f;
	},

	handleViewSettings: function() {
		this._oDialog.open();
	},

	onUpdateFinished: function() {
		var oEventBus = sap.ui.getCore().getEventBus();
		if (oEventBus._mChannels.Num_Create !== undefined) {
			var x = oEventBus._mChannels.Num_Create.mEventRegistry.getObjectID;
			for (var i = 0; i < x.length; i++) {
				if (x[i].oData !== undefined) {
					var object = x[i].oData;
				}
			}
		}
		if (object !== undefined) {
			var item = this.getView().byId("list").getItems();
			for (var i = 0; i < item.length; i++) {
				var list = this.getView().byId("list").getItems()[i].oBindingContexts.undefined.sPath.substr(12);
				var pathId = list.substr(0, 7);
				if (pathId === object) {
					list = this.getView().byId("list").getItems()[i];
					list.setSelected(true);
					this.showDetail(list, "Detail");
				}
			}
		} else {
			var oEventBus = sap.ui.getCore().getEventBus();
			if (oEventBus._mChannels.Num_Edit !== undefined) {
				var x = oEventBus._mChannels.Num_Edit.mEventRegistry.getObjectID;
				for (var i = 0; i < x.length; i++) {
					if (x[i].oData !== undefined) {
						var object = x[i].oData;
					}

					if (object !== undefined) {
						var t = this;
						var item = this.getView().byId("list").getItems();
						for (var i = 0; i < item.length; i++) {
							var list = this.getView().byId("list").getItems()[i].oBindingContexts.undefined.sPath.substr(12);
							var pathId = list.substr(0, 7);
							if (pathId === object) {
								list = this.getView().byId("list").getItems()[i];
								list.setSelected(true);
								this.showDetail(list, "Detail");
							}
						}
					}
				}
			} else {
				var firstItem = this.getView().byId("list").getItems()[0];
				if (firstItem != undefined) {
					firstItem.setSelected(true);
					this.showDetail(firstItem, "Detail");
				}
			}

		}
		oEventBus._mChannels = {};
	},
	handleConfirm: function(oEvent) {
		var that = this;
		var oView = that.getView();
		var mParams = oEvent.getParameters();
		that.oBinding = that.list().getBinding("items");

		// apply grouping
		var aSorters = [];
		if (mParams.groupItem) {
			var sPath = mParams.groupItem.getKey();
			var bDescending = mParams.groupDescending;
			aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
		}

		// apply sorter
		var sPath = mParams.sortItem.getKey();
		var bDescending = mParams.sortDescending;
		aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
		that.oBinding.sort(aSorters);
	},

	showFilterBar: function(k) {
		if (k === "VIEW_ALL") {
			this.getView().byId("infoBarToolbar").setVisible(false);
		} else {
			this.getView().byId("infoBarToolbar").setVisible(true);
			this.getView().byId("infoBarFilter").setText('TEST');
		}
	}

	// addNumune: function(evt) {
	// 	this._oRouter.navTo("Num_Create", {
	// 		from: "MasterList",
	// 		entity: "",
	// 		tab: null
	// 	}, true);
	// }
});