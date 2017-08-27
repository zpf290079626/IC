var table = null;
var overallAnalysisChart;
var chartData = null;
$(function() {
});

function getOverallAnalysisChart(conditions, selectedChartName) {
	$.ajax({
		type : 'POST',
		url : "/InventoryDiagnosis/chartDate",
		dataType : 'json',
		beforeSend : function() {
		},
		data : conditions,
		async : true,
		success : function(data) {
			if (data && data.chartMap) {
				chartData =  data.chartMap;
				if(selectedChartName) {
					var obj = chartData[selectedChartName];
					rebuildChart(obj);
				}
			}
		},
		error : function() {
			bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员...");
		}
	});
}

function initOverallAnalysisTable() {
	if (table) {
		$("#overallAnalysisTable").dataTable().fnDestroy();
	} else {
		$("#overallAnalysisTable").show();
	}

	table = $("#overallAnalysisTable").DataTable({
		"bPaginate":false,   	// 翻页功能
		"bInfo":false,			// 页脚信息
		"bLengthChange" : false,// 改变每页显示数据数量
		"sPaginationType" : "full_numbers",
		"iDisplayLength" : 50,// 每页显示50条数据
		"bAutoWidth" : false, // 自动宽度
		"searching" : false,
		"bSort" : false,
		"bJQueryUI" : false,
		"sAjaxSource" : "/InventoryDiagnosis/search", // 给服务器发请求的url,
		"fnServerData" : retrieveData, // 与后台交互获取数据的处理函数
		"oLanguage" : {// 下面是一些汉语翻译
			// "sSearch": "搜索",
			"sLengthMenu" : "每页显示 _MENU_ 条记录",
			"sZeroRecords" : "没有检索到数据",
			"sInfoEmpty" : "",
			"sInfo" : "显示 _START_ 至 _END_ 条 &nbsp;&nbsp;共 _TOTAL_ 条",
			"sInfoFiltered" : "(筛选自 _MAX_ 条数据)",
			"sInfoEmtpy" : "没有数据",
			"sProcessing" : "正在加载数据...",
			"oPaginate" : {
				"sFirst" : "首页",
				"sPrevious" : "前一页",
				"sNext" : "后一页",
				"sLast" : "末页"
			}
		},
		"bProcessing" : true, // 开启读取服务器数据时显示正在加载中……特别是大数据量的时候，开启此功能比较好
		"bServerSide" : true, // 开启服务器模式，使用服务器端处理配置datatable。注意：sAjaxSource参数也必须被给予为了给datatable源代码来获取所需的数据对于每个画。
		// 这个翻译有点别扭。开启此模式后，你对datatables的每个操作
		// 每页显示多少条记录、下一页、上一页、排序（表头）、搜索，这些都会传给服务器相应的值。
		"columnDefs" : [ {
			"searchable" : true,
			"orderable" : true,
			"targets" : 0
		} ],
		"order" : [ [ 1, 'asc' ] ],
		"aoColumns" : [ // 这个属性下的设置会应用到所有列，按顺序没有是空
			{
				"mDataProp": 'region',
				"sDefaultContent" : "",
				"bVisible" : false
			},{
				"mDataProp" : 'dcName',
				"fnCreatedCell" : function(nTd, sData, oData, iRow, iCol) {
					if(!oData.dcName || oData.dcName == '') {
						var displayVal = '\\';
						return $(nTd).html(displayVal);
					}
					
				}
			},{
				"mDataProp": 'bu',
				"sDefaultContent" : "",
				"bVisible" : false
			},{
				"mDataProp": 'dept1',
				"sDefaultContent" : "",
				"bVisible" : false
			},{
				"mDataProp": 'dept2',
				"sDefaultContent" : "",
				"bVisible" : false
			},{
				"mDataProp": 'dept3',
				"sDefaultContent" : "",
				"bVisible" : false
			},{
				"mDataProp": 'firstCate',
				"sDefaultContent" : "",
				"bVisible" : false
			},{
				"mDataProp": 'secondCate',
				"sDefaultContent" : "",
				"bVisible" : false
			},{
				"mDataProp": 'thirdCate',
				"sDefaultContent" : "",
				"bVisible" : false
			},{
				"mDataProp": 'purchaser',
				"sDefaultContent" : "",
				"bVisible" : false
			},{
				"mDataProp": 'saler',
				"sDefaultContent" : "",
				"bVisible" : false
			},{
				"mDataProp": 'brand',
				"sDefaultContent" : "",
				"bVisible" : false
			},{
				"mDataProp": 'vendor',
				"sDefaultContent" : "",
				"bVisible" : false
			},{
				"mDataProp": 'storeType',
				"sDefaultContent" : "",
				"bVisible" : false
			},{
				"mDataProp": 'store',
				"sDefaultContent" : "",
				"bVisible" : false
			},{
				"mDataProp" : 'pvStockRate',
				"fnCreatedCell" : function(nTd, sData, oData, iRow, iCol) {
					if(oData.pvStockRate) {
						var displayVal = oData.pvStockRate + '%';
						return $(nTd).html(displayVal);
					}
					
				}
			}, {
				"mDataProp" : 'bandStockRate',
				"fnCreatedCell" : function(nTd, sData, oData, iRow, iCol) {
					if(oData.bandStockRate) {
						var displayVal = oData.bandStockRate + '%';
						return $(nTd).html(displayVal);
					}
				}
			}, {
				"mDataProp" : 'numTurnover'
			}, {
				"mDataProp" : 'overstockRate',
				"fnCreatedCell" : function(nTd, sData, oData, iRow, iCol) {
					if(oData.overstockRate) {
						var displayVal = oData.overstockRate + '%';
						return $(nTd).html(displayVal);
					}
				}
			}, {
				"mDataProp" : 'saleNum'
			}, {
				"mDataProp" : 'saleVariance'
			}, {
				"mDataProp" : 'arrive2shelvesTime'
			}, {
				"mDataProp" : 'inspTimeRate',
				"fnCreatedCell" : function(nTd, sData, oData, iRow, iCol) {
					if(oData.inspTimeRate) {
						var displayVal = oData.inspTimeRate + '%';
						return $(nTd).html(displayVal);
					}
				}
			}, {
				"mDataProp" : 'noInspPoRate',
				"fnCreatedCell" : function(nTd, sData, oData, iRow, iCol) {
					if(oData.noInspPoRate) {
						var displayVal = oData.noInspPoRate + '%';
						return $(nTd).html(displayVal);
					}
				}
			}, {
				"mDataProp" : 'check2inspTime'
			}, {
				"mDataProp" : 'booknumRate',
				"fnCreatedCell" : function(nTd, sData, oData, iRow, iCol) {
					if(oData.booknumRate) {
						var displayVal = oData.booknumRate + '%';
						return $(nTd).html(displayVal);
					}
				}
			}, {
				"mDataProp" : 'vendorDeleteRate',
				"fnCreatedCell" : function(nTd, sData, oData, iRow, iCol) {
					if(oData.vendorDeleteRate) {
						var displayVal = oData.vendorDeleteRate + '%';
						return $(nTd).html(displayVal);
					}
				}
			},{
				"mDataProp": 'dcNum',
				"sDefaultContent" : "",
				"bVisible" : false
			} ],
		"fnInitComplete" : function(oSettings, json) { // 表格初始化完成后调用
			// tableJosn = json;
			// $("#example1_filter").hide();// 隐藏搜索框
		}
	});
}

function retrieveData(sSource, aoData, fnCallback) {

	// 查询条件称加入参数数组
	var queryData = buildConditions();
	queryData.activeTab = 'overallAnalysisRequest'
	queryData = removeSelectVal(queryData);
	
	if(queryData.region && queryData.region.length >0) {
		queryData.regionTemp = queryData.region;
		queryData.region = '';
	}
	if(queryData.dc && queryData.dc.length >0) {
		queryData.dcTemp = queryData.dc;
		queryData.dc = '';
	}
//	if(queryData.store && queryData.store.length >0) {
//		queryData.storeTemp = queryData.store;
//		queryData.store = '';
//	}
	
//	queryData.pageCount = pageCount;
//	queryData.pageStart = pageStart;
	jQuery.ajax({
		url : sSource,
		type : 'POST',
		data : queryData,
		dataType : 'json',
		async: false,
		success : function(data) {
			$("#chkAll").prop("checked", false);
			count = 0
			if(data && data.aaData) {
				count = data.aaData.length;
			}
			fnCallback(data); // 服务器端返回的对象的returnObject部分是要求的格式
		}
	});
}

function clearStyle() {
	var buttons = $('#btnParent button');
	for(var i = 0; i < buttons.length; i++) {
		var btn = $(buttons[i]);
		btn.removeClass('active');
		btn.css("background-color", "");
		btn.css("color", "");
	}
}

function handleStockBtn() {
	clearStyle();
	$('#stockLevelBtn').addClass("active");
	$('#stockLevelBtn').css("background-color", "#C23531");
	$('#stockLevelBtn').css("color", "#F9F9F9");
}

function handleTurnoverBtn() {
	clearStyle();
	$('#turnoverLevelBtn').addClass("active");
	$('#turnoverLevelBtn').css("background-color", "#CA8622");
	$('#turnoverLevelBtn').css("color", "#F9F9F9");
}

function handleSaleFluncBtn() {
	clearStyle();
	$('#saleFluncBtn').addClass("active");
	$('#saleFluncBtn').css("background-color", "#6AB0B8");
	$('#saleFluncBtn').css("color", "#F9F9F9");
}

function handleStoreBtn() {
	clearStyle();
	$('#storeLevelBtn').addClass("active");
	$('#storeLevelBtn').css("background-color", "#D48265");
	$('#storeLevelBtn').css("color", "#F9F9F9");
}

function handleSupplierBtn() {
	clearStyle();
	$('#supplierLevelBtn').addClass("active");
	$('#supplierLevelBtn').css("background-color", "#91C7AE");
	$('#supplierLevelBtn').css("color", "#F9F9F9");
}

// 可以优化, 使用jQuery统一方法
$('#pvStockRateBtn').click(function() {
	var chartQuery = buildQuery();
	chartQuery.chartSelected = 'pvStockRateChart';
	getOverallAnalysisChart(chartQuery, 'pvStockRateChart');
	
	handleStockRateBtn();
})

$('#bandStockRateBtn').click(function() {
	var chartQuery = buildQuery();
	chartQuery.chartSelected = 'bandStockRateChart';
	getOverallAnalysisChart(chartQuery, 'bandStockRateChart');
	
	handleStockRateBtn();
})

$('#numTurnoverBtn').click(function() {
	var chartQuery = buildQuery();
	chartQuery.chartSelected = 'numTurnoverChart';
	getOverallAnalysisChart(chartQuery, 'numTurnoverChart');
	
	handleTurnoverBtn();
})

$('#overstockRateBtn').click(function() {
	var chartQuery = buildQuery();
	chartQuery.chartSelected = 'overstockRateChart';
	getOverallAnalysisChart(chartQuery, 'overstockRateChart');
	$('#stockLevelBtn').removeClass("active");
	$('#stockLevelBtn').css("background-color", "");
	
	handleTurnoverBtn();
})

$('#saleNumBtn').click(function() {
	var chartQuery = buildQuery();
	chartQuery.chartSelected = 'saleNumChart';
	getOverallAnalysisChart(chartQuery, 'saleNumChart');
	
	handleSaleFluncBtn();
})

$('#saleVarianceBtn').click(function() {
	var chartQuery = buildQuery();
	chartQuery.chartSelected = 'saleVarianceChart';
	if(table && table.rows().data()) {
		var saleVarianceVal ='';
		for(var i = 0; i < table.rows().data().length; i++) {
			var rowData = table.rows().data()[i];
			if(rowData.dcNum) {
				saleVarianceVal += 'dcNum-'+rowData.dcNum + "-" + rowData.saleVariance;
			} else if(rowData.region) {
				saleVarianceVal += 'region-'+rowData.region + "-" + rowData.saleVariance;
			} else {
				saleVarianceVal += rowData.saleVariance;
			}
			if(i != table.rows().data().length - 1) {
				saleVarianceVal += ",";
			}
		}
		chartQuery.saleVarianceVal = saleVarianceVal;
	}
	getOverallAnalysisChart(chartQuery, 'saleVarianceChart');
	
	handleSaleFluncBtn();
})

$('#arrive2shelvesTimeBtn').click(function() {
	var chartQuery = buildQuery();
	chartQuery.chartSelected = 'arrive2shelvesTimeChart';
	getOverallAnalysisChart(chartQuery, 'arrive2shelvesTimeChart');

	handleStoreBtn();
})

$('#inspTimeRateBtn').click(function() {
	var chartQuery = buildQuery();
	chartQuery.chartSelected = 'inspTimeRateChart';
	getOverallAnalysisChart(chartQuery, 'inspTimeRateChart');

	handleStoreBtn();
})

$('#noInspPoRateBtn').click(function() {
	var chartQuery = buildQuery();
	chartQuery.chartSelected = 'noInspPoRateChart';
	getOverallAnalysisChart(chartQuery, 'noInspPoRateChart');

	handleStoreBtn();
})

$('#check2inspTimeBtn').click(function() {
	var chartQuery = buildQuery();
	chartQuery.chartSelected = 'check2inspTimeChart';
	getOverallAnalysisChart(chartQuery, 'check2inspTimeChart');

	handleSupplierBtn();
})

$('#booknumRateBtn').click(function() {
	var chartQuery = buildQuery();
	chartQuery.chartSelected = 'booknumRateChart';
	getOverallAnalysisChart(chartQuery, 'booknumRateChart');

	handleSupplierBtn();
})

$('#vendorDeleteRateBtn').click(function() {
	var chartQuery = buildQuery();
	chartQuery.chartSelected = 'vendorDeleteRateChart';
	getOverallAnalysisChart(chartQuery, 'vendorDeleteRateChart');

	handleSupplierBtn();
})


// 为下载按钮绑定事件
$('#over_downloadBtn').on("click", function(event) {
	// TODO zpf 查询前的校验
	doDownload();
});

function rebuildChart(obj) {
	if(overallAnalysisChart) {
		overallAnalysisChart.destroy();
	}
	if(obj == null || obj == 'undefined') {
		return;
	}
	var yAxisName = obj.yAxisName;
	var xAxis = obj.xAxis;
	var series = [];
	for(var i = 0; i < obj.listSeries.length;i++) {
		var temp = obj.listSeries[i];
		var sObj = {};
		
		sObj.name = temp.name;
		var dArr = [];
		for(var j = 0; j < temp.data.length; j++) {
			dArr[j] = Number(temp.data[j]);
		}
		sObj.data = dArr;
		series.push(sObj);
	}
	
	overallAnalysisChart = Highcharts.chart('overallAnalysisChart', {
		credits : {
			enabled : false
		},
		title : {
			text : ''
		},
		colors : [ '#C23531', '#334B5C', '#6AB0B8', '#D48265', '#91C7AE',
			'#749F83', '#CA8622', '#BDA29A', '#6E7074', '#546570' ],
		yAxis : {
			title : {
				text : yAxisName
			}
		},
		legend : {
			layout : 'vertical',
			align : 'right',
			verticalAlign : 'middle'
		},
		tooltip: {
			shared : true,
			crosshairs: [{
	                width: 1,
	                color: 'grey'
	            }],
			formatter : function() {
				var s = [];
				
				s.push('<span>'+this.x+'</span><br/>');
				
				$.each(this.points, function(i, point){
					var color = point.color;
					var name = point.series.name;
					var y = point.y
					s.push('<span style="color:'+color+'">'+name+'</span>: <b>'+y+'</b><br/>');
				});
				return s;
			}
//		, 
//			shared : true
	    },

		xAxis: {
	        categories: xAxis
	    },

		series : series
	});
}

function showConditionColumn(conditions) {
	var visibleCnt = 0;
	if(conditions.regionTemp && conditions.regionTemp != 'undefined') {
		table.column(0).visible(true);
		visibleCnt++;
	} else {
		table.column(0).visible(false);
	}
	
	if(conditions.bu && conditions.bu != 'undefined') {
		table.column(2).visible(true);
		visibleCnt++;
	} else {
		table.column(2).visible(false);
	}
	
	if(conditions.dept1 && conditions.dept1 != 'undefined') {
		table.column(3).visible(true);
		visibleCnt++;
	} else {
		table.column(3).visible(false);
	}
	
	if(conditions.dept2 && conditions.dept2 != 'undefined') {
		table.column(4).visible(true);
		visibleCnt++;
	} else {
		table.column(4).visible(false);
	}
	
	if(conditions.dept3 && conditions.dept3 != 'undefined') {
		table.column(5).visible(true);
		visibleCnt++;
	} else {
		table.column(5).visible(false);
	}
	
	if(conditions.firstCate && conditions.firstCate != 'undefined') {
		table.column(6).visible(true);
		visibleCnt++;
	} else {
		table.column(6).visible(false);
	}
	
	if(conditions.secondCate && conditions.secondCate != 'undefined') {
		table.column(7).visible(true);
		visibleCnt++;
	} else {
		table.column(7).visible(false);
	}
	
	if(conditions.thirdCate && conditions.thirdCate != 'undefined') {
		table.column(8).visible(true);
		visibleCnt++;
	} else {
		table.column(8).visible(false);
	}
	
	if(conditions.purchaser && conditions.purchaser != 'undefined') {
		table.column(9).visible(true);
		visibleCnt++;
	} else {
		table.column(9).visible(false);
	}
	
	if(conditions.saler && conditions.saler != 'undefined') {
		table.column(10).visible(true);
		visibleCnt++;
	} else {
		table.column(10).visible(false);
	}
	
	if(conditions.brand && conditions.brand != 'undefined') {
		table.column(11).visible(true);
		visibleCnt++;
	} else {
		table.column(11).visible(false);
	}
	
	if(conditions.vendor && conditions.vendor != 'undefined') {
		table.column(12).visible(true);
		visibleCnt++;
	} else {
		table.column(12).visible(false);
	}
	
	if(conditions.storeType && conditions.storeType != 'undefined') {
		table.column(13).visible(true);
		visibleCnt++;
	} else {
		table.column(13).visible(false);
	}
	
	if(conditions.store && conditions.store != 'undefined') {
		table.column(14).visible(true);
		visibleCnt++;
	} else {
		table.column(14).visible(false);
	}
	return visibleCnt++;
}

$('#stockLevelBtn').click(function() {
	var chartQuery = buildQuery();
	chartQuery.chartSelected = 'pvStockRateChart';
	getOverallAnalysisChart(chartQuery, 'pvStockRateChart');
	
	$('#stockDiv').show();
	$('#pvStockRateBtn').prop('checked',true);
	$('#turnoverDiv').hide();
	$('#saleFluncDiv').hide();
	$('#storeDiv').hide();
	$('#supplierDiv').hide();
	
	handleStockBtn();
})
$('#turnoverLevelBtn').click(function() {
	var chartQuery = buildQuery();
	chartQuery.chartSelected = 'numTurnoverChart';
	getOverallAnalysisChart(chartQuery, 'numTurnoverChart');
	
	$('#stockDiv').hide();
	$('#turnoverDiv').show();
	$('#numTurnoverBtn').prop('checked',true);
	$('#saleFluncDiv').hide();
	$('#storeDiv').hide();
	$('#supplierDiv').hide();
	
	handleTurnoverBtn();
})
$('#saleFluncBtn').click(function() {
	var chartQuery = buildQuery();
	chartQuery.chartSelected = 'saleNumChart';
	getOverallAnalysisChart(chartQuery, 'saleNumChart');
	
	$('#stockDiv').hide();
	$('#turnoverDiv').hide();
	$('#saleFluncDiv').show();
	$('#saleNumBtn').prop('checked',true);
	$('#storeDiv').hide();
	$('#supplierDiv').hide();
	
	handleSaleFluncBtn();
})
$('#storeLevelBtn').click(function() {
	var chartQuery = buildQuery();
	chartQuery.chartSelected = 'arrive2shelvesTimeChart';
	getOverallAnalysisChart(chartQuery, 'arrive2shelvesTimeChart');
	
	$('#stockDiv').hide();
	$('#turnoverDiv').hide();
	$('#saleFluncDiv').hide();
	$('#storeDiv').show();
	$('#arrive2shelvesTimeBtn').prop('checked',true);
	$('#supplierDiv').hide();
	
	handleStoreBtn();
})
$('#supplierLevelBtn').click(function() {
	var chartQuery = buildQuery();
	chartQuery.chartSelected = 'check2inspTimeChart';
	getOverallAnalysisChart(chartQuery, 'check2inspTimeChart');
	
	$('#stockDiv').hide();
	$('#turnoverDiv').hide();
	$('#saleFluncDiv').hide();
	$('#storeDiv').hide();
	$('#supplierDiv').show();
	$('#check2inspTimeBtn').prop('checked',true);
	
	handleSupplierBtn();
})

function buildQuery() {
	var conditions = buildConditions();
	
	var queryData = conditions;
	if(queryData.region && queryData.region.length >0) {
		queryData.regionTemp = queryData.region;
		queryData.region = '';
	}
	if(queryData.dc && queryData.dc.length >0) {
		queryData.dcTemp = queryData.dc;
		queryData.dc = '';
	}
//	if(queryData.store && queryData.store.length >0) {
//		queryData.storeTemp = queryData.store;
//		queryData.store = '';
//	}
	removeSelectVal(queryData);
	return queryData;
}

//如果选了全部, 按空值处理
function removeSelectVal(queryData) {
	$.each(queryData, function(k, v) {
		// 区域, dc按正常处理
		if(k != 'region' || k != 'dc') {
			if(v && v.indexOf(',') > 0) {
				queryData[k] = '';
			}
		}
	})
	return queryData;
}