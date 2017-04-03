jQuery.sap.require("ZINE_II_APPROVE.util.Formatter");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.declare("ZINE_II_APPROVE.util.Validation");
jQuery.sap.require("ZINE_II_APPROVE.Component");
sap.ui.controller("ZINE_II_APPROVE.view.Detail", {

	sco_detailPageId: function() {
		return this.getView().byId("sco_detailPageId");
	},
	productTab_Table: function() {
		return this.getView().byId("Product_Tab");
	},

	oFormatter: ZINE_II_APPROVE.util.Formatter,
	onInit: function() {
		this._oRouter = sap.ui.core.UIComponent.getRouterFor(this), this._oRouter.attachRouteMatched(this.attachRouteMatched, this);

	},

	handleNavBack: function(evt) {
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.navTo("SCO_SPLIT", true);
	},

	attachRouteMatched: function(e) {
		if (e.getParameter("name") === "Detail") {
			var r = this;
			r.ObjectID = e.getParameter("arguments").ObjectID;
			var o = r.getView().getModel();
			if (this.busyIndcator == undefined) {
				this.busyIndcator = new sap.m.BusyDialog();
			}
			this.busyIndcator.open();

			o.read("/InvoiceMasterSet('" + r.ObjectID + "')", {
				filters: null,
				sorters: null,
				async: true,
				success: function(e) {
					r.orderHeaderModel = e;
					r.RefNo = e.RefNo;
					r.updateDetailPageWithNewModel();
					r.updateDetailFormWithNewModel();
					r.productTableWithNewModel();
					// r.noteTableWithNewModel();
					// r.partnerFunctionWithNewModel();

					if (r.busyIndcator !== undefined) {
						r.busyIndcator.close();
					}
				},
				error: function(err) {
					if (r.busyIndcator !== undefined) {
						r.busyIndcator.close();
					}
					var oErr = JSON.parse(err.response.body);
					sap.m.MessageBox.show(oErr.error.message.value, {
						icon: sap.m.MessageBox.Icon.ERROR,
						title: "HATA",
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function() {}
					});
				}
			});
		}

	},

	updateDetailPageWithNewModel: function() {
		var that = this;
		that.objectHeaderId = that.getView().byId("objectHeaderId");
		var e = {
				InvoiceMasterSet: that.orderHeaderModel
			},
			r = new sap.ui.model.json.JSONModel(e);
		that.objectHeaderId.setModel(r), that.objectHeaderId.bindElement("/InvoiceMasterSet/");
	},

	updateDetailFormWithNewModel: function() {
		var that = this;
		that.so_DetailForm = that.getView().byId("so_DetailForm");
		var e = {
				InvoiceMasterSet: that.orderHeaderModel
			},
			r = new sap.ui.model.json.JSONModel(e);
		that.so_DetailForm.setModel(r), that.so_DetailForm.bindElement("/InvoiceMasterSet/");

	},

	productTableWithNewModel: function() {
		var that = this;
		that.tableModel = new sap.ui.model.json.JSONModel();
		var o = that.getView().getModel();
		o.read("/InvoiceMasterSet('" + that.RefNo + "')/Item", {
			filters: null,
			sorters: null,
			async: true,
			success: function(e) {
				that.tableModel.setData({
					ItemSet: e.results
				});
				that.productTab_Table().setModel(that.tableModel);
				that.productTab_Table().bindElement("/");
				var aItems = that.productTab_Table().getItems();
				for (var i = 0; i < aItems.length; i++) {

					var unit = aItems[i].getBindingContext().getObject().SampleUnit;

					switch (unit) {
						case 'ST':
							aItems[i].getBindingContext().getObject().SampleUnit = "ADT";
							that.byId(aItems[i].getCells()[3].sId).setSelectedKey(aItems[i].getBindingContext().getObject().SampleUnit);
							break;
						case 'TO':
							aItems[i].getBindingContext().getObject().SampleUnit = "TON";
							that.byId(aItems[i].getCells()[3].sId).setSelectedKey(aItems[i].getBindingContext().getObject().SampleUnit);
							break;
						case 'KAR':
							aItems[i].getBindingContext().getObject().SampleUnit = "KARTON";
							that.byId(aItems[i].getCells()[3].sId).setSelectedKey(aItems[i].getBindingContext().getObject().SampleUnit);
							break;
					}
				}
			},
			error: function(e) {
				var o = JSON.parse(e.response.body);
				ZINE_II_APPROVE.util.Validation.showMsgBox(o.error.message.value, "E");
			}

		});

	},

	getPrint: function() {
		var t = this;
		var o = t.getView().getModel();
		var filters = new Array();
		var i = new sap.ui.model.Filter("ObjectID", sap.ui.model.FilterOperator.EQ, t.orderHeaderModel.ObjectID);
		filters.push(i);
		var a = new sap.ui.model.Filter("RefNo", sap.ui.model.FilterOperator.EQ, t.orderHeaderModel.RefNo);
		filters.push(a);
		o.read("/PrintSet", {
			filters: filters,
			sorters: null,
			async: true,
			success: function(e) {
				var url = e.results[0].Url;
				console.log(url);
				window.open(url, "_blank");
			},
			error: function(err) {}
		});
	},

	ApproveButton: function() {
		var t = this;
		var o = t.getView().getModel();
		var filters = new Array();
		var i = new sap.ui.model.Filter("ObjectID", sap.ui.model.FilterOperator.EQ, t.orderHeaderModel.ObjectID);
		filters.push(i);
		var a = new sap.ui.model.Filter("RefNo", sap.ui.model.FilterOperator.EQ, t.orderHeaderModel.RefNo);
		filters.push(a);
		o.read("/InvoiceApproveSet", {
			filters: filters,
			sorters: null,
			async: false,
			success: function(e) {
				var Log = e.results[0].Log;
				if (Log === 'OK') {
					t.updataDetailPage();
					Log = t.ObjectID + ' ' +
						'Numaralı fatura onaylandı';
					sap.m.MessageBox.show(Log, {
						icon: sap.m.MessageBox.Icon.INFORMATION,
						title: "Bilgilendirme",
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function() {}
					});
				} else {
					sap.m.MessageToast.show('Bir hata oluştu kontrol ediniz!');
				}
			},
			error: function(err) {
				sap.m.MessageToast.show('Bir hata oluştu kontrol ediniz!');
				console.log(err);
			}
		});
	},

	RejectButton: function() {
		var t = this;
		var o = t.getView().getModel();
		var filters = new Array();
		var i = new sap.ui.model.Filter("ObjectID", sap.ui.model.FilterOperator.EQ, t.orderHeaderModel.ObjectID);
		filters.push(i);
		var a = new sap.ui.model.Filter("RefNo", sap.ui.model.FilterOperator.EQ, t.orderHeaderModel.RefNo);
		filters.push(a);
		o.read("/InvoiceRejectSet", {
			filters: filters,
			sorters: null,
			async: false,
			success: function(e) {
				var Log = e.results[0].Log;
				if (Log === 'OK') {
					t.updataDetailPage();
					Log = t.ObjectID + ' ' +
						'Numaralı fatura reddedildi';
					sap.m.MessageBox.show(Log, {
						icon: sap.m.MessageBox.Icon.INFORMATION,
						title: "Bilgilendirme",
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function() {}
					});
				} else {
					sap.m.MessageToast.show('Bir hata oluştu kontrol ediniz!');
				}
			},
			error: function(err) {
				sap.m.MessageToast.show('Bir hata oluştu kontrol ediniz!');
				console.log(err);
			}
		});
	},

	getCaution: function() {

		var s = this;
		var Msj;
		var e = this.getCaution.arguments[0].oSource.mProperties.type;

		if (e === 'Reject') {
			Msj = s.ObjectID + '  ' + "Numaralı Fatura Reddedilecek, Onaylıyor musun ?";
		} else if (e === 'Accept') {
			Msj = s.ObjectID + '  ' + "Numaralı Fatura Onaylanacak, Onaylıyor musun ?";
		}

		s.dialog = new sap.m.Dialog({
			title: "UYARI",
			type: 'Standard',
			state: 'Warning',
			content: new sap.m.Text({
				text: Msj
			}),
			beginButton: new sap.m.Button({
				text: "Evet",
				press: function() {
					s.dialog.close();

					if (e === 'Reject') {
						s.RejectButton();
					} else {
						s.ApproveButton();
					}
					s.dialog.close();

				}

			}),
			endButton: new sap.m.Button({
				text: "Hayır",
				press: function() {
					s.dialog.close();
				}
			}),
			afterClose: function() {
				s.dialog.destroy();
			}
		});

		s.dialog.open();
	},

	updataDetailPage: function() {
		var t = this;
		var o = t.getView().getModel();
		o.read("/InvoiceMasterSet('" + t.ObjectID + "')", {
			filters: null,
			sorters: null,
			async: false,
			success: function(e) {
				t.orderHeaderModel = e;
				t.RefNo = e.RefNo;
				t.updateDetailPageWithNewModel();
				t.updateDetailFormWithNewModel();
			},
			error: function(err) {
				console.debug(err);
			}
		});
	}

});