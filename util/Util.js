/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("ZINE_II_APPROVE.util.Util");
ZINE_II_APPROVE.util.Util = {
	refreshHeaderETag: function(p, c) {
		var m = c.oModel;
		if (m.getContext("/" + p)) {
			m.deleteCreatedEntry(m.getContext("/" + p));
		}
		m.createBindingContext("/" + p, null, function(C) {
			var d = C.getObject();
			var o = c.getView().getModel("controllers");
			var s = o.getProperty("/s3Controller");
			if (s) {
				s.bindS3Header(d);
			}
		}, true);
	},
	show412ErrorDialog: function(c, o) {
		sap.ca.ui.message.showMessageBox({
			type: sap.ca.ui.message.Type.ERROR,
			message: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('MSG_CONFLICTING_DATA')
		}, o);
	},
	initMaxHitModel: function(c) {
		c.oApplicationFacade.setApplicationModel("MaxHit", new sap.ui.model.json.JSONModel({}));
	},
	initBackModel: function(c) {
		c.oApplicationFacade.setApplicationModel("Back", new sap.ui.model.json.JSONModel({}));
	},
	setDatePicker: function(v, d, t, f) {
		var D = v.byId(d);
		var T = v.byId(t);
		D.setValueState(sap.ui.core.ValueState.None);
		T.setValueState(sap.ui.core.ValueState.None);
		var n = D.getDateValue() || D.getValue() || D._lastValue;
		if (n) {
			D.setValue(f.format(n));
		}
	},
	date : function (value) {
		if (value) {
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "dd-MM-YYYY"}); 
			return oDateFormat.format(new Date(value));
		} else {
			return value;
		}
	},
	isIntentSupported: function(s, a, p) {
		if (!(s && a)) {
			jQuery.sap.log.error("Util.isIntentSupported called without semantic object or action: (" + s + ", " + a + ")");
			return false;
		}
		var i = "#" + s + "-" + a;
		if (p) {
			i += "?" + p;
		}
		var d = jQuery.Deferred();
		sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported([i]).done(function(c) {
			if (c[i].supported === false) {
				d.resolve(false);
			} else {
				d.resolve(true);
			}
		});
		return d;
	},
	getAppOfflineInterface: function() {
		if (new ZINE_II_APPROVE.util.AppOfflineInterface().isOffline()) {
			jQuery.sap.require("ZINE_II_APPROVE.util.AppOfflineInterface");
			return new ZINE_II_APPROVE.util.AppOfflineInterface();
		}
	}
};