/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("ZINE.util.AppOfflineInterface");
jQuery.sap.require("sap.cus.crm.lib.reuse.offline.OfflineInterface");
sap.cus.crm.lib.reuse.offline.OfflineInterface.extend("ZINE.util.AppOfflineInterface", {
	constructor: function() {
		return sap.cus.crm.lib.reuse.offline.OfflineInterface.apply(this, [ZINE.util.AppOfflineInterface]);
	},
	refresh: function(c, a, s) {
		sap.cus.crm.lib.reuse.offline.OfflineInterface.prototype.refresh.apply(this, [c, a, s, ["complaints"]]);
	},
});