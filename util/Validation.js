jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.declare("ZINE_II_APPROVE.util.Validation");
ZINE_II_APPROVE.util.Validation = {
		showError : function(oData){
            var messageErr = JSON.parse(oData.response.body);
            sap.m.MessageBox.alert(messageErr.error.message.value,
                   {
                       icon: sap.m.MessageBox.Icon.WARNING,
                       title: "Uyarı"
                   });
       },
       showMsgBox : function(msg, msgType, action){
    	   if(msgType === "S"){
				this.icon = sap.m.MessageBox.Icon.SUCCESS;
				this.title = "Başarılı";
			}
			else if(msgType === "W"){
				this.icon = sap.m.MessageBox.Icon.WARNING;
				this.title = "Uyarı";
			}
			else{
				this.icon = sap.m.MessageBox.Icon.ERROR;
				this.title = "Hata";
			}
    	   sap.m.MessageBox.alert(msg,
                   {
                       icon: this.icon,
                       title: this.title
                   });}
};