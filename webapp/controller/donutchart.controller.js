sap.ui.define([
	"sap/ui/core/mvc/Controller",
	 'sap/viz/ui5/format/ChartFormatter',
	 "sap/ui/core/routing/History"

], function(Controller,ChartFormatter,History) {
	"use strict";
	var d;

	return Controller.extend("MyExpense.controller.donutchart", {

		onInit: function() {
			sap.ui.core.BusyIndicator.show(0);
			var data = sap.ui.getCore().getModel("modelData").getData();
		//	d = new Date();
		//	this.feedData(data.feed.entry);
			var oModel = new sap.ui.model.json.JSONModel(data);
			this.getView().setModel(oModel);
			var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
			 var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            sap.ui.core.BusyIndicator.hide();
            var oChart = this.getView().byId("idVizFrame");    
			var asyncChartUpdate = function() {
    		oChart.setVizProperties({
        	title: {
            	text: "My Expense Chart"
        	}
    });
};
setTimeout(asyncChartUpdate, 0);
           // oPopOver.setFormatString(ChartFormatter.DefaultPattern.STANDARDFLOAT);
		},

		feedData: function(data) {
		
		   var chartData = {
		   	"items": [
		   		{
			   		"categoryName" : "Transport and Petrol",
			   		"amount":0
				},
					{
			   		"categoryName" : "Grocery Items",
			   		"amount":0
				},
					{
			   		"categoryName" : "Vegetables",
			   		"amount":0
				},
					{
			   		"categoryName" : "Snacks",
			   		"amount":0
				},
				
					{
			   		"categoryName" : "Others",
			   			"amount":0
				},
					{
			   		"categoryName" : "Others2",
			   		"amount":0
				}
				
		   ]};

		
			for (var i = data.length - 1; i >= 0; i = i - 5) {
				var d2 = new Date(data[i - 4].gs$cell.inputValue);
				if ( (d2.getMonth() + 1)!= (d.getMonth() + 1))
					break;
				switch (data[i - 3].gs$cell.inputValue) {
					case "Transport & Petrol":
						chartData.items[0].amount += parseInt(data[i - 2].gs$cell.inputValue);

						break;
					case "Grocery items":
							chartData.items[1].amount  += parseInt(data[i - 2].gs$cell.inputValue);

						break;
					case "Vegetable":
						chartData.items[2].amount  += parseInt(data[i - 2].gs$cell.inputValue);

						break;
					case "Snacks":
							chartData.items[3].amount  += parseInt(data[i - 2].gs$cell.inputValue);

						break;
					case "Others":
							chartData.items[4].amount  += parseInt(data[i - 2].gs$cell.inputValue);

						break;
					default:
						chartData.items[5].amount  += parseInt(data[i - 2].gs$cell.inputValue);

						break;
				}
			}
			for(var j=0;j<chartData.items.length;j++)
				if(chartData.items[j].amount==0)
					chartData.items.splice(j,1);
			var oModel = new sap.ui.model.json.JSONModel(chartData);
			this.getView().setModel(oModel);
			// categoryExp.Total = categoryExp.TransportPetrol + categoryExp.GroceryItems + categoryExp.Others + categoryExp.Others2 + categoryExp
			// 	.Snacks +
			// 	categoryExp.Vegetable;
			
		},
		onDatasetSelected : function(oEvent){
            var datasetRadio = oEvent.getSource();
            if (this.oVizFrame && datasetRadio.getSelected()){
                var bindValue = datasetRadio.getBindingContext().getObject();
                var dataModel = new JSONModel(this.dataPath + bindValue.value);
                this.oVizFrame.setModel(dataModel);
                var that = this;
                this.oVizFrame.getModel().attachRequestCompleted(function() {
                    that.dataSort(this.getData());
                });
            }
        },
        onNavBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} 
		}
	});

});