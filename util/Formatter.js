jQuery.sap.declare("ZINE_II_APPROVE.util.Formatter");

jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
jQuery.sap.require("sap.ca.ui.model.format.AmountFormat");
jQuery.sap.require("sap.ca.ui.model.format.QuantityFormat");

ZINE_II_APPROVE.util.Formatter = {
	_applicationFacade: null,
	setApplicationFacade: function(a) {
		ZINE_II_APPROVE.util.Formatter._applicationFacade = a
	},
	uppercaseFirstChar: function(sStr) {
		return sStr.charAt(0).toUpperCase() + sStr.slice(1);
	},
	getResourceBundle: function() {
		return ZINE_II_APPROVE.util.Formatter.getApplicationFacade().getResourceBundle()
	},
	getApplicationFacade: function() {
		return ZINE_II_APPROVE.util.Formatter._applicationFacade
	},
	discontinuedStatusState: function(sDate) {
		return sDate ? "Error" : "None";
	},

	discontinuedStatusValue: function(sDate) {
		return sDate ? "Discontinued" : "";
	},
	_statusStateMap: {
		"P": "Success",
		"N": "Warning"
	},

	setStatusColor: function(s) {
		if (s === "Onay") {
			return sap.ui.core.ValueState.Success;
		}
		if (s === "Reddedildi" || s === "Disputed") {
			return sap.ui.core.ValueState.Error;
		}
		if (s === "Beklemede") {
			return sap.ui.core.ValueState.Warning;
		}
		return sap.ui.core.ValueState.None;
	},

	formatTotalAmount: function(t, c) {
		return sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("TOTAL_AMOUNT", [sap.ca.ui.model.format.AmountFormat.FormatAmountStandard(
			t, c), c]);
	},

	dateFormatterMaster2: function(v) {

		if (v === "" || v === null || v === undefined) return "";
		if (!(v instanceof Date)) {
			v = new Date(v);
		}
		var f = sap.ca.ui.model.format.DateFormat.getDateInstance({
			style: "short"
		});
		return f.format(v, true);
	},
	currencyValue: function(nStr) {
		if (nStr) {
			var y = nStr.replace(".", ",");
			var x = nStr;
			var parts = x.toString();

			for (var i = 0; i < parts.length; i++) {
				if (parts.lastIndexOf("0") == parts.length - 1) {
					parts = parts.substring(0, parts.length - 1);
				}
			}
			var temp = parts.split(".");

			temp[0] = temp[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
			if (temp[1] === "") {
				return temp[0];
			} else {
				return temp.join(",");
			}
		} else {
			return nStr;
		}
	},
	statusText: function(value) {
		var bundle = this.getModel("i18n").getResourceBundle();
		return bundle.getText("StatusText" + value, "?");
	},

	statusState: function(value) {
		var map = sap.ui.demo.koctas.util.Formatter._statusStateMap;
		return (value && map[value]) ? map[value] : "None";
	},
	float: function(value) {
		if (value) {
			return parseFloat(value);
		} else {
			return value;
		}
	},
	dateTime: function(value) {
		if (value) {
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "dd-MM-yyyy"
			});
			return oDateFormat.format((value));
		} else {
			return value;
		}
	},
	Date: function(v) {
		if (v) {
			return sap.ca.ui.model.format.DateFormat.getDateInstance({
				style: "short"
			}).format(v);
		} else {
			return "";
		}
	},
	currencycode: function(v) {
		if (v) {
			return sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("UNWEIGHTED_VOLUME_IN", [v]);
		} else {
			return "";
		}
	},
	statusState: function(v) {
		if (v) {
			if (v == "E0001") {
				return "None";
			}
			if (v == "E0002") {
				return "Warning";
			}
			if (v == "E0003") {
				return "Success";
			}
			if (v == "E0004") {
				return "Error";
			}
		} else return "None";
	},
	formatDateTime: function(d, t) {
		if (d instanceof Date) {
			var u = new Date(d.toUTCString());
			u.setMilliseconds(t.ms);
			var l = sap.ui.getCore().getConfiguration().getLocale();
			var D = sap.ui.core.format.DateFormat.getDateTimeInstance({
				style: "medium"
			}, l);
			return D.format(u, true);
		}
		return d;
	},

	formatQuantity: function(v, u) {
		if (v === undefined) {
			v = 0
		}
		if (!u) {
			u = ""
		}
		var q = sap.ca.ui.model.format.QuantityFormat.getInstance(null, {
			style: "standard",
		});
		var a = q.format(v);
		return ZINE_II_APPROVE.util.Formatter.getResourceBundle().getText("QUANTITY_UNIT", [a, u])
	},

	formatQuantityField: function(v) {
		if (v === null) return false;
		return true;
	},

	quantity: function(v, a) {
		var b = ZINE_II_APPROVE_II_APPROVE.util.Formatter.formatQuantityEdit(v, a);
		return b + " " + a;
	},
	formatQuantityEdit: function(v, a) {
		if (v % 1 == 0) return sap.ca.ui.model.format.QuantityFormat.FormatQuantityStandard(v, a, "0");
		else return sap.ca.ui.model.format.QuantityFormat.FormatQuantityStandard(v, a, "3");
	},
	weightedvolume: function(v, a, b) {
		var c = v * a * 1.00 / 100.00;
		return sap.ca.ui.model.format.AmountFormat.FormatAmountStandardWithCurrency(c, b);
	},
	totalexpectednetValue: function(v, a) {
		return sap.ca.ui.model.format.AmountFormat.FormatAmountStandardWithCurrency(v, a);
	},
	formatDescription: function(t, d) {
		return t + " : " + d;
	},
	concatenateNameAndId: function(t, d) {
		return t + " " + d;
	},
	volumeFormatter: function(v, c) {
		if (parseFloat(v) < 0) {
			return "";
		}
		return sap.ca.ui.model.format.AmountFormat.FormatAmountStandard(v, c);
	},
	dateFormatter: function(v) {
		if (v === "" || v === null || v === undefined) return "";
		if (!(v instanceof Date)) {
			v = new Date(v);
		}
		var f = sap.ca.ui.model.format.DateFormat.getDateInstance({
			style: "medium"
		});
		return f.format(v);
	},
	dateFormatterMaster: function(v) {
		if (v === "" || v === null || v === undefined) return "";
		if (!(v instanceof Date)) {
			v = new Date(v);
		}
		var l = new sap.ui.core.Locale(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().sLocale);
		var f = sap.ca.ui.model.format.DateFormat.getDateInstance({
			style: "medium"
		}, l);
		return sap.ca.scfld.md.app.Application.getImpl().AppI18nModel.getResourceBundle().getText('CLOSE_DATE') + ": " + f.format(v);
	},
	dateFormatter2: function(v) {
		if (v === "" || v === null || v === undefined) {
			return "";
		}
		if (!(v instanceof Date)) {
			v = new Date(v);
		}
		var f = sap.ui.core.format.DateFormat.getDateInstance({
			style: "medium"
		});
		return f.format(v, true);
	},
	texttonumber: function(v) {
		return Number(v);
	},
	infotexttonumber: function(v) {
		return Number(v) + sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PERCENTAGE_SIGN");
	},
	checkValue: function(v, a, b, c, d) {
		var e;
		var C = this.getParent().getParent().data("controller");
		var V = C.getView();
		var m = V.getModel();
		if (parseFloat(C.sBackendVersion) >= 5) {
			if (b === "I") {
				e = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("VALUE_CHANGED", [c, a]);
			} else if ((b === "U")) {
				e = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("VALUE_CHANGED_FROM", [c, v, a]);
			} else if ((b === "D")) {
				e = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("VALUE_DELETED", [c, v]);
			} else {
				if (a === "X") {
					e = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("VALUE_TURNED_ON", [b]);
				} else if ((v === "X")) {
					e = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("VALUE_TURNED_OFF", [b]);
				} else {
					if (a === " ") {
						e = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("VALUE_CHANGED_FROM_NULL", [b, a]);
					} else {
						e = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("VALUE_CHANGED_FROM", [b, v, a]);
					}
				}
			}
		}
		return e;
	},
	forecast: function(v) {
		if (v === "X") {
			return true;
		} else {
			return false;
		}
	},
	mimeTypeFormatter: function(v) {
		switch (v) {
			case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
			case 'application/vnd.ms-powerpoint':
				return 'pptx';
				break;
			case 'application/msword':
			case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
				return 'doc';
				break;
			case 'application/vnd.ms-excel':
			case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
				return 'xls';
				break;
			case 'image/jpeg':
			case 'image/png':
			case 'image/tiff':
			case 'image/gif':
				return 'jpg';
				break;
			case 'application/pdf':
				return 'pdf';
				break;
			case 'text/plain':
				return 'txt';
				break;
			default:
				return 'unknown';
		}
	},
	resetFooterContentRightZINE_II_APPROVE: function(c) {
		var p = c.getView().getContent()[0];
		var r = jQuery.sap.byId(p.getFooter().getId() + "-BarRight");
		var R = r.outerWidth(true);
		if (R > 0) {
			c.iRBWidth = R;
		}
		if (r.width() === 0 && c.iRBWidth) {
			jQuery.sap.log.info('Update footer contentRight Width=' + c.iRBWidth);
			r.width(c.iRBWidth);
		}
	},
	truncateVolume: function(v, c) {
		if (v > 0) {
			return sap.ca.ui.model.format.AmountFormat.FormatAmountShort(v, c);
		}
		return "";
	},
	getRelativePathFromURL: function(a) {
		var u = document.createElement('a');
		u.href = a;
		if (u.pathname.substring(0, 1) == "/") return u.pathname;
		else return "/" + u.pathname;
	},
	urlConverter: function(v) {
		var s = jQuery.sap.getUriParameters().get("sap-server");
		var a = jQuery.sap.getUriParameters().get("sap-host");
		var b = jQuery.sap.getUriParameters().get("sap-host-http");
		var c = jQuery.sap.getUriParameters().get("sap-client");
		var u;
		var U = URI(location.protocol + "//" + location.hostname + (location.port ? ':' + location.port : '') + cus.crm.opportunity.util.Formatter
			.getRelativePathFromURL(v));
		var C = location.protocol.replace(':', '');
		if (C !== U.protocol()) U.protocol(C);
		if (s) U.addSearch('sap-server', s);
		if (a) U.addSearch('sap-host', a);
		if (b) U.addSearch('sap-host-http', b);
		if (c) U.addSearch('sap-client', c);
		u = U.toString();
		if (u == "") {
			v = v.replace("https", "http");
			return v;
		} else {
			return U.toString();
		};
	},
	salesteamplacement: function(v) {
		return "  " + "  " + v;
	},

	formatDeleteButton: function(v) {
		if (v === null) {
			return false;
		} else {
			return true;
		}
	},
	formatProdClassification: function(v) {
		var r = sap.ca.scfld.md.app.Application.getImpl().AppI18nModel.getResourceBundle();
		if (v !== null) return r.getText('PRODUCT');
		else return r.getText('CATEGORY');
	},
	formatProductName: function(v) {
		if (v !== null) return this.getBindingContext('json').getObject().ProductName;
		return this.getBindingContext('json').getObject().ProductCategory;
	},
	formatAddMoreProductsText: function(t) {
		if (jQuery.device.is.phone) return "";
		return t;
	},
	formatParticipant: function(p) {
		var s = this.getParent().getParent().data("controller");
		var r = true;
		if (s.isOffline) {
			r = false;
		} else {
			var d = parseFloat(s.sBackendVersion);
			if (d < 2) r = false;
			var P = s.getRuleForPartnerFunction(p);
			if (P === null) {
				r = false;
			}
			if (!P.ChangeableFlag) {
				r = false;
			}
		}
		return r;
	},
	formatParticipantDelete: function(p) {
		var s = this.getParent().getParent().data("controller");
		if (parseFloat(s.sBackendVersion) < 2) return false;
		var P = s.getRuleForPartnerFunction(p);
		if (P === null) {
			return false;
		}
		if (!P.ChangeableFlag) {
			return false;
		}
		return true;
	},
	formatEmployeeRespField: function(b) {
		if (parseInt(b) < 2) {
			return false;
		}
		return true;
	},
	formatProspect: function(p, a) {
		if (p === "") return a;
		return p;
	},
	formatBusinessCardCaller: function(p, P) {
		var s = this.getParent().getParent().getParent().data("controller");
		var a = this.getBindingContext('json').getObject().PartnerFunctionCode;
		switch (a) {
			case '00000012':
			case '00000014':
				this.attachPress(s.onEmpBusCardLaunch, s);
				break;
			case '00000015':
			case '00000021':
				this.attachPress(s.onEmployeeLaunch, s);
				break;
			default:
				this.attachPress(s.onAccountBusCardLaunch, s);
		}
		return (p === "") ? P : p;
	},
	formatPhotoUrl: function(m) {
		return m ? m : "sap-icon://person-placeholder";
	},
	formatAccountF4Description: function(a, c, b) {
		var r = a;
		if (c) {
			r += " / " + c;
			if (b) {
				r += ", " + b;
			}
		} else {
			if (b) {
				r += " / " + b;
			}
		}
		return r;
	},
	getAccountF4Title: function(f) {
		var t = " ";
		if (f) {
			t = f;
		}
		return t;
	},
	removeMarginInPhone: function(i) {
		if (jQuery.device.is.phone) {
			this.addStyleClass("removeMargin");
		}
		return i;
	},
	addLayoutPadding: function(p) {
		if (p) {
			this.addStyleClass("ImagePaddingMobile");
		} else {
			this.addStyleClass("ImagePadding");
		}
		return true;
	},
	formatPartnerName: function(p, P) {
		return (p === "") ? P : p;
	},
	FormatDocHistory: function(v) {
		var s = this.getModel("controllers").getData().s3Controller;
		switch (v) {
			case "BUS2000111":
				return true;
			case "BUS2000125":
				return (!s.isOffline || s.isCrossAppSupportedInOffline("manageTasks"));
			case "BUS2000126":
				return (!s.isOffline || s.isCrossAppSupportedInOffline("myAppointments"));
			case "BUS2000108":
				return (!s.isOffline || s.isCrossAppSupportedInOffline("manageLead"));
			default:
				return false;
		}
	},
	formatForecastText: function(f) {
		if (f) {
			return sap.ca.scfld.md.app.Application.getImpl().AppI18nModel.getResourceBundle().getText("ON");
		} else {
			return sap.ca.scfld.md.app.Application.getImpl().AppI18nModel.getResourceBundle().getText("OFF");
		}
	},
	notesDateFormatter: function(v) {
		if (v === "" || v === null || v === undefined) return "";
		if (!(v instanceof Date)) {
			v = new Date(v);
		}
		v.setMinutes(v.getTimezoneOffset());
		var l = new sap.ui.core.Locale(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().sLocale);
		var f = sap.ca.ui.model.format.DateFormat.getDateInstance({
			style: "medium"
		}, l);
		return f.format(v);
	},
	formatSalesOrganization: function(S, a) {
		var b = "";
		if (a != undefined && a != "") {
			b = S + " (" + a + ")";
		}
		return b;
	},
	formatDistributionChannel: function(D, a) {
		var b = "";
		if (a != undefined && a != "") {
			b = D + " (" + a + ")";
		}
		return b;
	},
	formatDivision: function(D, a) {
		var b = "";
		if (a != undefined && a != "") {
			b = D + " (" + a + ")";
		}
		return b;
	},
	formatMobileIconVisibility: function(m) {
		if (m === "") {
			return false;
		}
		return true;
	},
	parseBpGuid: function(g) {
		if (g != undefined && g != "") {
			if (g.search(/\(/) > 0) {
				g = g.substring(g.indexOf("("));
			} else {
				g = "(guid'" + g + "')";
			}
			return g;
		}
	},
	parseOrgGuid: function(g) {
		if (g != undefined && g != "") {
			if (g.search(/'/) > 0) {
				g = g.match(/'(.*)'/)[1];
			}
			return g.replace(/-/g, '');
		}
	},
	formatHideButtonInOfflineMode: function(o) {
		return !o;
	},
	formatDisplayMode: function(o) {
		return o;
	},
	formatAccountF4Title: function(f, n, a) {
		var t = " ";
		if (f) {
			t = f;
		} else {
			if (n) {
				t = n;
			} else {
				t = a;
			}
		}
		return t;
	},

	salesteamplacement: function(v) {
		return "  " + "  " + v;
	},

	formatDeleteButton: function(v) {
		if (v === null) return false;
		return true;
	},
	formatProdClassification: function(v) {
		var r = sap.ca.scfld.md.app.Application.getImpl().AppI18nModel.getResourceBundle();
		if (v !== null) return r.getText('PRODUCT');
		else return r.getText('CATEGORY');
	},
	formatProductName: function(v) {
		if (v !== null) return this.getBindingContext('json').getObject().ProductName;
		return this.getBindingContext('json').getObject().ProductCategory;
	},
	formatAddMoreProductsText: function(t) {
		if (jQuery.device.is.phone) return "";
		return t;
	},
	formatParticipant: function(p) {
		var s = this.getParent().getParent().data("controller");
		var r = true;
		if (s.isOffline) {
			r = false;
		} else {
			var d = parseFloat(s.sBackendVersion);
			if (d < 2) r = false;
			var P = s.getRuleForPartnerFunction(p);
			if (P === null) {
				r = false;
			}
			if (!P.ChangeableFlag) {
				r = false;
			}
		}
		return r;
	},
	formatParticipantDelete: function(p) {
		var s = this.getParent().getParent().data("controller");
		if (parseFloat(s.sBackendVersion) < 2) return false;
		var P = s.getRuleForPartnerFunction(p);
		if (P === null) {
			return false;
		}
		if (!P.ChangeableFlag) {
			return false;
		}
		return true;
	},
	formatEmployeeRespField: function(b) {
		if (parseInt(b) < 2) {
			return false;
		}
		return true;
	},
	formatProspect: function(p, a) {
		if (p === "") return a;
		return p;
	},
	formatBusinessCardCaller: function(p, P) {
		var s = this.getParent().getParent().getParent().data("controller");
		var a = this.getBindingContext('json').getObject().PartnerFunctionCode;
		switch (a) {
			case '00000012':
			case '00000014':
				this.attachPress(s.onEmpBusCardLaunch, s);
				break;
			case '00000015':
			case '00000021':
				this.attachPress(s.onEmployeeLaunch, s);
				break;
			default:
				this.attachPress(s.onAccountBusCardLaunch, s);
		}
		return (p === "") ? P : p;
	},
	formatPhotoUrl: function(m) {
		return m ? m : "sap-icon://person-placeholder";
	},
	formatAccountF4Description: function(a, c, b) {
		var r = a;
		if (c) {
			r += " / " + c;
			if (b) {
				r += ", " + b;
			}
		} else {
			if (b) {
				r += " / " + b;
			}
		}
		return r;
	},
	getAccountF4Title: function(f) {
		var t = " ";
		if (f) {
			t = f;
		}
		return t;
	},
	removeMarginInPhone: function(i) {
		if (jQuery.device.is.phone) {
			this.addStyleClass("removeMargin");
		}
		return i;
	},
	addLayoutPadding: function(p) {
		if (p) {
			this.addStyleClass("ImagePaddingMobile");
		} else {
			this.addStyleClass("ImagePadding");
		}
		return true;
	},
	formatPartnerName: function(p, P) {
		return (p === "") ? P : p;
	},
	FormatDocHistory: function(v) {
		var s = this.getModel("controllers").getData().s3Controller;
		switch (v) {
			case "BUS2000111":
				return true;
			case "BUS2000125":
				return (!s.isOffline || s.isCrossAppSupportedInOffline("manageTasks"));
			case "BUS2000126":
				return (!s.isOffline || s.isCrossAppSupportedInOffline("myAppointments"));
			case "BUS2000108":
				return (!s.isOffline || s.isCrossAppSupportedInOffline("manageLead"));
			default:
				return false;
		}
	},
	formatForecastText: function(f) {
		if (f) {
			return sap.ca.scfld.md.app.Application.getImpl().AppI18nModel.getResourceBundle().getText("ON");
		} else {
			return sap.ca.scfld.md.app.Application.getImpl().AppI18nModel.getResourceBundle().getText("OFF");
		}
	},
	notesDateFormatter: function(v) {
		if (v === "" || v === null || v === undefined) return "";
		if (!(v instanceof Date)) {
			v = new Date(v);
		}
		v.setMinutes(v.getTimezoneOffset());
		var l = new sap.ui.core.Locale(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().sLocale);
		var f = sap.ca.ui.model.format.DateFormat.getDateInstance({
			style: "medium"
		}, l);
		return f.format(v);
	},
	formatSalesOrganization: function(S, a) {
		var b = "";
		if (a != undefined && a != "") {
			b = S + " (" + a + ")";
		}
		return b;
	},
	formatDistributionChannel: function(D, a) {
		var b = "";
		if (a != undefined && a != "") {
			b = D + " (" + a + ")";
		}
		return b;
	},
	formatDivision: function(D, a) {
		var b = "";
		if (a != undefined && a != "") {
			b = D + " (" + a + ")";
		}
		return b;
	},
	formatMobileIconVisibility: function(m) {
		if (m === "") {
			return false;
		}
		return true;
	},
	parseBpGuid: function(g) {
		if (g != undefined && g != "") {
			if (g.search(/\(/) > 0) {
				g = g.substring(g.indexOf("("));
			} else {
				g = "(guid'" + g + "')";
			}
			return g;
		}
	},
	parseOrgGuid: function(g) {
		if (g != undefined && g != "") {
			if (g.search(/'/) > 0) {
				g = g.match(/'(.*)'/)[1];
			}
			return g.replace(/-/g, '');
		}
	},
	formatHideButtonInOfflineMode: function(o) {
		return !o;
	},
	formatDisplayMode: function(o) {
		return o;
	},
	formatAccountF4Title: function(f, n, a) {
		var t = " ";
		if (f) {
			t = f;
		} else {
			if (n) {
				t = n;
			} else {
				t = a;
			}
		}
		return t;
	}

};