sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"

], function(Controller,UIComponent) {
	"use strict";
	var that;
	var d;
	return Controller.extend("MyExpense.controller.View1", {

		onInit: function() {
			that = this;
			if (!this.isOnline()) {

				this.offlineDialog = this.buildDialog("MyExpense.view.offline");
				this.offlineDialog.setTitle("Connection Problem");
				this.offlineDialog.open();
				this.byId("reloadButton").attachPress(function(offlineDialog) {
					if (that.isOnline()) {
						that.offlineDialog.close();
						window.removeEventListener("online");
						that.loadModelData();
					}

				});
				window.addEventListener("online", function() {
					that.offlineDialog.close();
					that.offlineDialog.destroy(true);
					that.loadModelData();
				});
			} else
				this.loadModelData();
		},
		loadModelData: function() {
			sap.ui.core.BusyIndicator.show(0);
			d = new Date();

			var oModel = new sap.ui.model.json.JSONModel();
			console.log("After Rebase");
<<<<<<< Upstream, based on 02e81b27a57e8a1b2f92f3ece33b92e506430b78
			oModel.loadData("");
			this.getView().setModel(oModel);
			oModel.attachRequestCompleted(function(oEvent) {
				//	console.log(this.oData.feed.entry);

				that.processData();
			});
		},
		isOnline: function() {
			return (navigator.onLine);
		},
		processData: function() {

			var oTable = this.byId("idTable");
			oTable.removeAllItems();
			var sum = 0;
			var data1 = this.getView().getModel().getData();
			var data = data1.feed.entry;
			for (var i = data1.feed.entry.length - 1; i >= 0; i = i - 5) {
				var columnListItemNewLine = new sap.m.ColumnListItem({
					cells: [
						new sap.m.Text({
							text: data[i - 3].gs$cell.inputValue
						}),
						new sap.m.Text({
							text: "₹ " + data[i - 2].gs$cell.inputValue
						}),
						new sap.m.Text({
							text: data[i + 0].gs$cell.inputValue
						}),
						new sap.m.Text({
							text: data[i - 1].gs$cell.inputValue
						}),

						new sap.m.Text({
							text: data[i - 4].gs$cell.inputValue
						})
					]
				});
				var d2 = new Date(data[i - 4].gs$cell.inputValue);

				oTable.addItem(columnListItemNewLine);

				if (d2.getMonth() + 1 == d.getMonth() + 1)
					sum = sum + parseInt(data[i - 2].gs$cell.inputValue);

			}
			this.byId("idSum").setText("This month expense total: ₹" + sum);
			sap.ui.core.BusyIndicator.hide();
		},

		onShowCategory: function() {
			var catExpObj;
			catExpObj = this.calculateCategoryExp(this.getView().getModel().getData().feed.entry);
			var catDialog = this.buildDialog("MyExpense.view.category");
			catDialog.setTitle(catExpObj.MonthYear);
			this.byId("idPetrol").setText(" ₹ " + catExpObj.TransportPetrol);
			this.byId("idGrocery").setText(" ₹ " + catExpObj.GroceryItems);
			this.byId("idVegetable").setText(" ₹ " + catExpObj.Vegetable);
			this.byId("idSnacks").setText(" ₹ " + catExpObj.Snacks);
			this.byId("idRgm").setText(" ₹ " + catExpObj.Others2);
			this.byId("idOthers").setText(" ₹ " + catExpObj.Others);
			this.byId("idTotal").setText(" ₹ " + catExpObj.Total);
			catDialog.open();

		},
		buildDialog: function(fragmentName) {
			var oView = this.getView();

			var oDialog = oView.byId("idDialog");
			//var oDialog;
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(oView.getId(),
					fragmentName);

				// Use addDepedent() to make sure that oEmpDialog
				// has the same lifecycle as oView
				oView.addDependent(oDialog);

				// Attach press event for CancelButton
				var oCancelButton = oView.byId("CancelButton");
				if (oCancelButton)
					oCancelButton.attachPress(function() {
						oDialog.close();
						oDialog.destroy(true);
					});
			}

			return oDialog;
		},
		calculateCategoryExp: function(data) {
			var categoryExp = {
				"TransportPetrol": 0,
				"GroceryItems": 0,
				"Vegetable": 0,
				"Snacks": 0,
				"RentGasMilk": 0,
				"Others": 0,
				"Others2": 0,
				"Total": 0,
				"MonthYear": ""
			};

			categoryExp.MonthYear = d.toDateString();
			for (var i = data.length - 1; i >= 0; i = i - 5) {
				var d2 = new Date(data[i - 4].gs$cell.inputValue);
				if ( (d2.getMonth()+1)!= (d.getMonth() + 1))
					break;
				switch (data[i - 3].gs$cell.inputValue) {
					case "Transport & Petrol":
						categoryExp.TransportPetrol += parseInt(data[i - 2].gs$cell.inputValue);

						break;
					case "Grocery items":
						categoryExp.GroceryItems += parseInt(data[i - 2].gs$cell.inputValue);

						break;
					case "Vegetable":
						categoryExp.Vegetable += parseInt(data[i - 2].gs$cell.inputValue);

						break;
					case "Snacks":
						categoryExp.Snacks += parseInt(data[i - 2].gs$cell.inputValue);

						break;
					case "Others":
						categoryExp.Others += parseInt(data[i - 2].gs$cell.inputValue);

						break;
					default:
						categoryExp.Others2 += parseInt(data[i - 2].gs$cell.inputValue);

						break;
				}
			}
			categoryExp.Total = categoryExp.TransportPetrol + categoryExp.GroceryItems + categoryExp.Others + categoryExp.Others2 + categoryExp
				.Snacks +
				categoryExp.Vegetable;
			return categoryExp;
		},
		filterData: function() {
			this.oFilterDialog = this.buildDialog("MyExpense.view.filter");
			//this.byId()
			this.oFilterDialog.setTitle("Select Date Range");
			
			this.byId("DP10").setValue((d.getMonth() + 1) + "/" + "01/" + d.getFullYear());
			this.byId("DP11").setValue((d.getMonth() + 1) + "/" + d.getDate()+"/" + d.getFullYear());
			this.oFilterDialog.open();
			this.byId("ProceedButton").attachPress(function() {
				var dateRange = {
					"from": new Date(that.byId("DP10").getValue()),
					"to": new Date(that.byId("DP11").getValue())
				};
				if(dateRange.from<dateRange.to){
					that.oFilterDialog.close();
					that.filterProcessing(dateRange);
					that.oFilterDialog.destroy(true);
				}
				else{
					alert("Invalid Date Range");
				}
			});

		},
		onFilterProceed: function() {
			var dateRange = {
				"from": new Date(this.byId("DP10").getValue()),
				"to": new Date(this.byId("DP11").getValue())
			};
			//this.processData();
			this.filterProcessing(dateRange);
		},

		filterProcessing: function(dateRange) {
			sap.ui.core.BusyIndicator.show(0);
			var oTable = this.byId("idTable");
			oTable.removeAllItems();
			var sum = 0;

			var data1 = this.getView().getModel().getData();
			var data = data1.feed.entry;
			for (var i = 5; i < data1.feed.entry.length; i = i + 5) {
				var d2 = new Date(data[i].gs$cell.inputValue);
				var d3 = new Date(data[i + 3].gs$cell.inputValue);
				if ((d2 >= dateRange.from && d2 <= dateRange.to) || (d3 >= dateRange.from && d3 <= dateRange.to)) {
					var columnListItemNewLine = new sap.m.ColumnListItem({
						cells: [
							new sap.m.Text({
								text: data[i + 1].gs$cell.inputValue
							}),
							new sap.m.Text({
								text: "₹ " + data[i + 2].gs$cell.inputValue
							}),
							new sap.m.Text({
								text: data[i + 4].gs$cell.inputValue
							}),
							new sap.m.Text({
								text: data[i + 3].gs$cell.inputValue
							}),

							new sap.m.Text({
								text: data[i].gs$cell.inputValue
							})
						]
					});

					oTable.addItem(columnListItemNewLine);

					sum = sum + parseInt(data[i + 2].gs$cell.inputValue);
				}

			}
			this.byId("idSum").setText("Expense total: ₹" + sum);
			sap.ui.core.BusyIndicator.hide();
		},
		onCreate: function(){
			window.open("");
=======
			oModel.loadData("");
			this.getView().setModel(oModel);
			oModel.attachRequestCompleted(function(oEvent) {
				//	console.log(this.oData.feed.entry);

				that.processData();
			});
		},
		isOnline: function() {
			return (navigator.onLine);
		},
		processData: function() {

			var oTable = this.byId("idTable");
			oTable.removeAllItems();
			var sum = 0;
			var data1 = this.getView().getModel().getData();
			var data = data1.feed.entry;
			for (var i = data1.feed.entry.length - 1; i >= 0; i = i - 5) {
				var columnListItemNewLine = new sap.m.ColumnListItem({
					cells: [
						new sap.m.Text({
							text: data[i - 3].gs$cell.inputValue
						}),
						new sap.m.Text({
							text: "₹ " + data[i - 2].gs$cell.inputValue
						}),
						new sap.m.Text({
							text: data[i + 0].gs$cell.inputValue
						}),
						new sap.m.Text({
							text: data[i - 1].gs$cell.inputValue
						}),

						new sap.m.Text({
							text: data[i - 4].gs$cell.inputValue
						})
					]
				});
				var d2 = new Date(data[i - 4].gs$cell.inputValue);

				oTable.addItem(columnListItemNewLine);

				if (d2.getMonth() + 1 == d.getMonth() + 1)
					sum = sum + parseInt(data[i - 2].gs$cell.inputValue);

			}
			this.byId("idSum").setText("This month expense total: ₹" + sum);
			sap.ui.core.BusyIndicator.hide();
		},

		onShowCategory: function() {
			var catExpObj;
			catExpObj = this.calculateCategoryExp(this.getView().getModel().getData().feed.entry);
			var catDialog = this.buildDialog("MyExpense.view.category");
			catDialog.setTitle(catExpObj.MonthYear);
			this.byId("idPetrol").setText(" ₹ " + catExpObj.TransportPetrol);
			this.byId("idGrocery").setText(" ₹ " + catExpObj.GroceryItems);
			this.byId("idVegetable").setText(" ₹ " + catExpObj.Vegetable);
			this.byId("idSnacks").setText(" ₹ " + catExpObj.Snacks);
			this.byId("idRgm").setText(" ₹ " + catExpObj.Others2);
			this.byId("idOthers").setText(" ₹ " + catExpObj.Others);
			this.byId("idTotal").setText(" ₹ " + catExpObj.Total);
			catDialog.open();

		},
		buildDialog: function(fragmentName) {
			var oView = this.getView();

			var oDialog = oView.byId("idDialog");
			//var oDialog;
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(oView.getId(),
					fragmentName);

				// Use addDepedent() to make sure that oEmpDialog
				// has the same lifecycle as oView
				oView.addDependent(oDialog);

				// Attach press event for CancelButton
				var oCancelButton = oView.byId("CancelButton");
				if (oCancelButton)
					oCancelButton.attachPress(function() {
						oDialog.close();
						oDialog.destroy(true);
					});
			}

			return oDialog;
		},
		calculateCategoryExp: function(data) {
			var categoryExp = {
				"TransportPetrol": 0,
				"GroceryItems": 0,
				"Vegetable": 0,
				"Snacks": 0,
				"RentGasMilk": 0,
				"Others": 0,
				"Others2": 0,
				"Total": 0,
				"MonthYear": ""
			};

			categoryExp.MonthYear = d.toDateString();
			for (var i = data.length - 1; i >= 0; i = i - 5) {
				var d2 = new Date(data[i - 4].gs$cell.inputValue);
				if ( (d2.getMonth()+1)!= (d.getMonth() + 1))
					break;
				switch (data[i - 3].gs$cell.inputValue) {
					case "Transport & Petrol":
						categoryExp.TransportPetrol += parseInt(data[i - 2].gs$cell.inputValue);

						break;
					case "Grocery items":
						categoryExp.GroceryItems += parseInt(data[i - 2].gs$cell.inputValue);

						break;
					case "Vegetable":
						categoryExp.Vegetable += parseInt(data[i - 2].gs$cell.inputValue);

						break;
					case "Snacks":
						categoryExp.Snacks += parseInt(data[i - 2].gs$cell.inputValue);

						break;
					case "Others":
						categoryExp.Others += parseInt(data[i - 2].gs$cell.inputValue);

						break;
					default:
						categoryExp.Others2 += parseInt(data[i - 2].gs$cell.inputValue);

						break;
				}
			}
			categoryExp.Total = categoryExp.TransportPetrol + categoryExp.GroceryItems + categoryExp.Others + categoryExp.Others2 + categoryExp
				.Snacks +
				categoryExp.Vegetable;
			return categoryExp;
		},
		filterData: function() {
			this.oFilterDialog = this.buildDialog("MyExpense.view.filter");
			//this.byId()
			this.oFilterDialog.setTitle("Select Date Range");
			
			this.byId("DP10").setValue((d.getMonth() + 1) + "/" + "01/" + d.getFullYear());
			this.byId("DP11").setValue((d.getMonth() + 1) + "/" + d.getDate()+"/" + d.getFullYear());
			this.oFilterDialog.open();
			this.byId("ProceedButton").attachPress(function() {
				var dateRange = {
					"from": new Date(that.byId("DP10").getValue()),
					"to": new Date(that.byId("DP11").getValue())
				};
				if(dateRange.from<dateRange.to){
					that.oFilterDialog.close();
					that.filterProcessing(dateRange);
					that.oFilterDialog.destroy(true);
				}
				else{
					alert("Invalid Date Range");
				}
			});

		},
		onFilterProceed: function() {
			var dateRange = {
				"from": new Date(this.byId("DP10").getValue()),
				"to": new Date(this.byId("DP11").getValue())
			};
			//this.processData();
			this.filterProcessing(dateRange);
		},

		filterProcessing: function(dateRange) {
			sap.ui.core.BusyIndicator.show(0);
			var oTable = this.byId("idTable");
			oTable.removeAllItems();
			var sum = 0;

			var data1 = this.getView().getModel().getData();
			var data = data1.feed.entry;
			for (var i = 5; i < data1.feed.entry.length; i = i + 5) {
				var d2 = new Date(data[i].gs$cell.inputValue);
				var d3 = new Date(data[i + 3].gs$cell.inputValue);
				if ((d2 >= dateRange.from && d2 <= dateRange.to) || (d3 >= dateRange.from && d3 <= dateRange.to)) {
					var columnListItemNewLine = new sap.m.ColumnListItem({
						cells: [
							new sap.m.Text({
								text: data[i + 1].gs$cell.inputValue
							}),
							new sap.m.Text({
								text: "₹ " + data[i + 2].gs$cell.inputValue
							}),
							new sap.m.Text({
								text: data[i + 4].gs$cell.inputValue
							}),
							new sap.m.Text({
								text: data[i + 3].gs$cell.inputValue
							}),

							new sap.m.Text({
								text: data[i].gs$cell.inputValue
							})
						]
					});

					oTable.addItem(columnListItemNewLine);

					sum = sum + parseInt(data[i + 2].gs$cell.inputValue);
				}

			}
			this.byId("idSum").setText("Expense total: ₹" + sum);
			sap.ui.core.BusyIndicator.hide();
		},
		onCreate: function(){
			window.open("");
>>>>>>> 6ebd373 changes 0.1
		},
		showDonutChart : function(){
			
			var oModel = new sap.ui.model.json.JSONModel(this.getChartData())
			sap.ui.getCore().setModel(oModel,"modelData");
			var router = UIComponent.getRouterFor(this);
			router.navTo("chartView");
		},
		
		getChartData : function() {
		   var data = this.getView().getModel().getData().feed.entry;
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
				if(chartData.items[j].amount == 0){
					chartData.items.splice(j,1);
				}
			return chartData;
		
		}

	});
});