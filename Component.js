jQuery.sap.declare("ZINE_II_APPROVE.Component");
jQuery.sap.require("sap.ui.core.routing.Router");
jQuery.sap.require("ZINE_II_APPROVE.Router");
sap.ui.core.UIComponent.extend("ZINE_II_APPROVE.Component", {
	metadata: {
		name: "ZINE_II_APPROVE",
		version: "1.0",
		includes: ["css/salesorder.css"],
		dependencies: {
			libs: [
				"sap.m",
				"sap.ui.layout"
			],
			components: []
		},
		rootView: "ZINE_II_APPROVE.view.SCO_ROOT",
		config: {
			"resourceBundle": "i18n/messageBundle.properties",
			"serviceConfig": {
				"name": "ZINE_ODATA_GL_ONAY_SRV",
				"serviceUrl": "/sap/opu/odata/sap/ZINE_ODATA_GL_ONAY_SRV/"
			}
		},
		routing: {
			config: {
				routerClass: "ZINE_II_APPROVE.Router",
				viewType: "XML",
				viewPath: "ZINE_II_APPROVE.view",
				targetAggregation: "pages"
			},
			routes: [{
				pattern: "",
				name: "SCO_SPLIT",
				view: "SCO_SPLIT",
				targetAggregation: "pages",
				targetControl: "idAppControlA",
				// transition: "slide", //slide,
				subroutes: [{
					pattern: "",
					name: "MasterList",
					view: "MasterList",
					//										preservePageInSplitContainer : true,
					targetAggregation: "masterPages",
					targetControl: "idSplitAppA",
					// transition: "flip", //slide,
					subroutes: [{
						pattern: "Detail/" + "InvoiceDetail(" + "ObjectID={ObjectID})",
						name: "Detail",
						view: "Detail",
						targetAggregation: "detailPages",
						clearTarget: false //transition: "flip" //slide
					}]
				}]
			}]
		}
	},
	init: function() {
		// initializes createContent
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
		var mConfig = this.getMetadata().getConfig();
		var rootPath = jQuery.sap.getModulePath("ZINE_II_APPROVE");
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl: [
				rootPath,
				mConfig.resourceBundle
			].join("/")
		});
		this.setModel(i18nModel, "i18n");
		var sServiceUrl = mConfig.serviceConfig.serviceUrl;
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
		oModel.setCountSupported(false);
		this.setModel(oModel);
		var deviceModel = new sap.ui.model.json.JSONModel({
			isTouch: sap.ui.Device.support.touch,
			isNoTouch: !sap.ui.Device.support.touch,
			isPhone: sap.ui.Device.system.phone,
			isNoPhone: !sap.ui.Device.system.phone,
			listMode: sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
			listItemType: sap.ui.Device.system.phone ? "Active" : "Inactive"
		});
		deviceModel.setDefaultBindingMode("TwoWay");
		this.setModel(deviceModel, "device");
		$(document)[0].title = "Innova E-Fatura";
		//					    try {  sap.ui.getCore().byId("shell").setHeaderHiding(false); }  
		//				        catch(notInFioriLaunchPad){ } 
		this.getRouter().initialize();
	}
});