var stockoutBaseOn = 0;
var pvFlag = 0;
var stockFlag =1;

var yunYingZhiXing = 1300;
var huoWuLiuZhuan = 1301;

var table;
var defineColors =[ '#C23531', '#334B5C', '#6AB0B8', '#D48265', '#91C7AE','#749F83', '#CA8622', '#BDA29A', '#6E7074', '#546570' ];
var dataTableDom = "<'pull-right'B><'clear'>rt<'clear'><'pull-left'l><'pull-right'p><'pull-right'i>";
var dataTableButtons = [ {extend: 'csvHtml5',text:'<button class="btn btn-primary btn-sm">下载</button>',bom:true} ];

$(function(){
	
	$('#stockoutCon').on('shown.bs.popover', function () {
		$("input[name='stockoutBaseOn']").eq(stockoutBaseOn).attr('checked', 'true');
		$("input[name='statFlag']").eq(stockFlag?stockFlag:0).attr('checked', 'true');
	});
		
	$('#stockoutCon').on('hide.bs.popover', function () {
		stockoutBaseOn = $("input[name='stockoutBaseOn']:checked").val();
		stockFlag= $("input[name='statFlag']:checked").val();
		pvFlag = $("input[name='statFlag']:checked").val() == 0? 1:0;
	});
});
/**
 * 缺货分析
 */
function stockoutstat_1(){
	
	$("#stockoutstat_1").show();
	$("#stockoutstat_2").hide();
	 $("#stockoutAnalysisButton").show();
	 $("#turnoverAnalysisButton").hide();
	 $("#stockoutstat_1_1_tab .active").click();
//	console.log("stockoutstat_1");
	 
	var conditions = buildStockoutCondition();
//	console.log(conditions);
	$.ajax({
        type : 'POST',
        async: true,
        url : "/stockoutstat/getReasonType",
        beforeSend : function() {},
        data : conditions,
        success : function(data) {
//        	console.log(data);
        	$("#reason_type_1300_percent").text(data.reason_type_1300_percent?data.reason_type_1300_percent:'0%');
        	$("#reason_type_1301_percent").text(data.reason_type_1301_percent?data.reason_type_1301_percent:'0%');
        	$("#reason_type_1302_percent").text(data.reason_type_1302_percent?data.reason_type_1302_percent:'0%');
        	$("#reason_type_1300_num").text(data.reason_type_1300_num>0?data.reason_type_1300_num:'0');
        	$("#reason_type_1301_num").text(data.reason_type_1301_num>0?data.reason_type_1301_num:'0');
        	$("#reason_type_1302_num").text(data.reason_type_1302_num>0?data.reason_type_1302_num:'0');
        },
        error : function() {
        	bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
        }
    });
	
}
function buildStockoutCondition(){
	var conditions = {};
	$.each(linkRelation['all'],function(i, info){
		var val = $('#'+info).val();
		if(val instanceof Array){
			conditions[info] = val.toString();
		}else{
			conditions[info] = val;
		}
	});
	conditions['statDate']=$('input[name="statDate"]').val();
// conditions['statDate']='2017-08-02';
	
	conditions['baseOn']= $("input[name='stockoutBaseOn']:checked").val()?$("input[name='stockoutBaseOn']:checked").val():stockoutBaseOn;
//	conditions['pvFlag']= $("input[name='statFlag']:checked").val() == 0?1:($("input[name='statFlag']:checked").val() == 1?0:pvFlag);
//	conditions['stockFlag']= $("input[name='statFlag']:checked").val()?$("input[name='statFlag']:checked").val():stockFlag;
	var temp = $("input[name='statFlag']:checked").val()?$("input[name='statFlag']:checked").val():stockFlag;
	if(temp == 1 ){
		conditions['stockFlag'] = 1;
	}else{
		conditions['pvFlag'] = 1;
	}
//	console.log(conditions);
	return conditions;
}
/**
 * 补货决策
 */
function stockoutstat_1_1(){
	console.log("stockoutstat_1_1");
	var conditions = buildStockoutCondition();
	conditions['reasonTypeCode'] = 1302;
//	console.log(conditions);
	 var highchar1 = {
		        chart: {
		            plotBackgroundColor: null,
		            plotBorderWidth: null,
		            plotShadow: false
		        },
		        colors: defineColors,
		        title: {
		            text: '商品分布'
		        },
		        credits: {
		            enabled: false//去除版权信息
		        },
		        tooltip: {
		        	 pointFormat: '数值:<b>{point.y:.1f}</b><br/>占比:<b>{point.percentage:.1f}%</b>'
		        },
		        plotOptions: {
		            pie: {
		                allowPointSelect: true,
		                cursor: 'pointer',
		                dataLabels: {
		                    enabled: true
		                },
		                showInLegend: true,
		                events: {
		                    click: function (event) {
		                    	 conditions['reasonCode2'] = event.point.reasonCode2;
		                    	 conditions['graph_title']= event.point.name;
		                    	 link_stock_out_graph_2(conditions);
		                    	 link_stock_out_graph_3(conditions);
		                    }
		                }
		            }
		        },
		        series:[{
		            type: 'pie',
		            name: ''
		        }]
		    };
	 
	$.ajax({
       type : 'POST',
       async: true,
       url : "/stockoutstat/getReasonCode2",
       beforeSend : function() {},
       data : conditions,
       success : function(data) {
//	    	console.log(data);
	    	highchar1.series[0].data=eval(data);
//	    	console.log(highchar1);
	    	$('#stock_out_graph_1').highcharts(highchar1);
	    	conditions['reasonCode2'] = 1240; //非销量波动
	    	conditions['graph_title'] = '非销量波动';
	    	link_stock_out_graph_2(conditions);
	    	link_stock_out_graph_3(conditions);
       },
       error : function() {
       	bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
       }
   });
	
}

function link_stock_out_graph_2(conditions){
	 var highchar1 = {
		        chart: {
		            plotBackgroundColor: null,
		            plotBorderWidth: null,
		            plotShadow: false
		        },
		        colors: defineColors,
		        title: {
		            text:'类目分布-' + conditions['graph_title']
		        },
		        credits: {
		            enabled: false//去除版权信息
		        },
		        tooltip: {
		        	 pointFormat: '数值:<b>{point.y:.1f}</b><br/>占比:<b>{point.percentage:.1f}%</b>'
		        },
		        plotOptions: {
		            pie: {
		                allowPointSelect: true,
		                cursor: 'pointer',
		                dataLabels: {
		                    enabled: true
		                },
		                showInLegend: true
		            }
		        },
		        series:[{
		            type: 'pie',
		            name: ''
		        }]
		    };
//	console.log(conditions);
	$.ajax({
	       type : 'POST',
	       async: true,
	       url : "/stockoutstat/getCate",
	       beforeSend : function() {},
	       data : conditions,
	       success : function(data) {
		    	highchar1.series[0].data=eval( data);
		    	$('#stock_out_graph_2').highcharts(highchar1);
	       },
	       error : function() {
	       	bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
	       }
	   });
}

function link_stock_out_graph_3(conditions){
	var highchar2 = {
	        chart: {
	        	type: 'column'
	        },
	        title: {
	            text: '区域分布-' + conditions['graph_title']
	        },
	        credits: {
	            enabled: false//去除版权信息
	        },
	        tooltip: {
				formatter : function() {
					var s = [];
					s.push('<span>'+this.x+'</span><br/>');
					var sum = 0;
					$.each(this.point.series.yData, function(i, value){
						sum = sum + value;
					});
					var percent = 	(this.point.y/sum*100).toFixed(2)  + '%'  ;
					s.push(' <b>' + this.point.y +  ' </b>('+percent+')<br/>');
					return s;
				}
	        },
	        colors: defineColors,
	        plotOptions: {
	        	column: {
	                pointPadding: 0.2,
	                borderWidth: 0
	            }
	        },
	        xAxis: {
	            crosshair: true
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: '数值'
	            }
	        },
	        series: [{
	            name: '配送中心'
	        }]
	    };
	
	$.ajax({
	       type : 'POST',
	       async: true,
	       url : "/stockoutstat/getDC",
	       beforeSend : function() {},
	       data : conditions,
	       success : function(data) {
		    	highchar2.series[0].data=eval(data.seriesData);
		    	highchar2.xAxis.categories=eval(data.xAxis);//数组
//		    	console.log(highchar2);
		    	$('#stock_out_graph_3').highcharts(highchar2);
	       },
	       error : function(){
	       	bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
	       }
	   });
}
/**
 * 运营执行
 */
function stockoutstat_1_2(){
	console.log("stockoutstat_1_2");
	var conditions = buildStockoutCondition();
	conditions['reasonTypeCode'] = yunYingZhiXing;
	
	$.ajax({
	       type : 'POST',
	       async: true,
	       url : "/stockoutstat/getReasonParty",
	       beforeSend : function() {},
	       data : conditions,
	       success : function(data) {
	    	   
	    	   $("#stock_out_table_1 tbody tr").remove();
	    	   $.each(data,function(i, info){
	    		   $("#stock_out_table_1 tbody").append("<tr reasonParty=" + info.reasonParty + "><td>" + (i+1) + "</td><td>" + info.reasonPartyNote + "</td><td>" + info.percent + "</td></tr>");
	    		});
	    	   
	    	   $("#stock_out_table_1 tbody tr").removeClass("success");
	    	   $("#stock_out_table_1 tbody tr:eq(0)").addClass("success");
    		   conditions['reasonParty'] = $("#stock_out_table_1 tbody tr:eq(0)").attr("reasonParty");
    		   link_stock_out_table_2(conditions);
    		   link_stock_out_table_3(conditions);
    		  
	    	   $("#stock_out_table_1 tbody tr").bind("click",function(event){
	    		   $("#stock_out_table_1 tbody tr").removeClass("success");
	    		   $(this).addClass("success");
	    		   conditions['reasonParty'] = $(this).attr("reasonParty");
	    		   link_stock_out_table_2(conditions);
	    		   link_stock_out_table_3(conditions);
	    	   });
	       },
	       error : function(){
	       	bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
	       }
	   });
	
	
	
}

function link_stock_out_table_2(conditions){
	console.log(conditions);
	$.ajax({
		type : 'POST',
		async: true,
		url : "/stockoutstat/getReasonCode1And2",
		beforeSend : function() {},
		data : conditions,
		success : function(data) {
//			console.log(data);
			$("#stock_out_table_2 tbody tr").remove();
			$.each(data,function(i, info){
				$("#stock_out_table_2 tbody").append("<tr><td>" + info.reasonNote1 + "</td><td>" + info.reasonNote2 + "</td><td>" + info.sum + "</td><td>" + info.percent + "</td></tr>");
//	    			conditions[info] = $('#'+info).val();
			});
			mergeTableCell('stock_out_table_2',1);
//		    	$('#stock_out_graph_3').highcharts(highchar2);
		},
		error : function(){
			bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
		}
	});
}

//合并内容相同单元格  
function mergeTableCell(table_id, table_colnum) {  
   var _w_table_firsttd = "";  
   var _w_table_currenttd = "";  
   var _w_table_SpanNum = 0;  
   var  _w_table_Obj = $("#" + table_id + " tr td:nth-child(" + table_colnum + ")");  
    _w_table_Obj.each(function(i) {  
        if (i == 0) {  
            _w_table_firsttd = $(this);  
            _w_table_SpanNum = 1;  
        } else {  
            _w_table_currenttd = $(this);  
            if (_w_table_firsttd.text() == _w_table_currenttd.text()) {  
                _w_table_SpanNum++;  
                _w_table_currenttd.hide();  
                _w_table_firsttd.attr("rowSpan", _w_table_SpanNum);  
            } else {  
                _w_table_firsttd = $(this);  
                _w_table_SpanNum = 1;  
            }  
        }  
    });  
}  
function link_stock_out_table_3(conditions){
	if(!conditions){
		conditions = buildStockoutCondition();
		conditions['reasonTypeCode'] = yunYingZhiXing;
	}
	
	console.log(	$("input[name='reasonLevel']:checked").val());
	conditions['reasonParty'] = $("#stock_out_table_1 tbody .success").attr("reasonParty");
	conditions['reasonLevel']= $("input[name='stockOutReasonLevel']:checked").val();
	
    var dataSet = [];
	var column = [];
 
//	var dataSet = 
	var options = {
		dom : dataTableDom,
		paging : true,
		stateSave : true,
		deferRender : true,
		retrieve: true,
		"processing" : true,
		"paging" : true,
		"ordering" : false,
		"searching" : false,
//		"lengthMenu" : [ [ 20, 50, 100 ], [ 20, 50, 100 ] ],
		"language" : { // 汉化
			 "processing": "处理中...",
//			"processing" : " <div class='loading-sm'/>",
			"lengthMenu" : "显示 _MENU_ 项结果",
			"zeroRecords" : "没有匹配结果",
			"info" : "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
			"infoEmpty" : "显示第 0 至 0 项结果，共 0 项",
			"infoFiltered" : "(由 _MAX_ 项结果过滤)",
			"infoPostFix" : "",
			"search" : "搜索:",
			"url" : "",
			"emptyTable" : "<center>表中数据为空</center>",
			"loadingRecords" : "载入中...",
			"thousands" : ",",
			"paginate" : {
				"first" : "首页",
				"previous" : "上页",
				"next" : "下页",
				"last" : "末页"
			}
		},
		 buttons: dataTableButtons
	};


	$.ajax({
        type : 'POST',
        async: false,
        url : "/stockoutstat/getReason1And2AndTarget",
        beforeSend : function() {},
        data : conditions,
        success : function(data) {
        	dataSet =  data.dataSet ;
    	    $.each(data.head,function(i, info){
    		   column.push({"title":  info });
    		});
    	    
    	    options.columns = column;
    	    options.data = dataSet;
    	    if(table){
    	    	table.destroy();
    	    	$('#stock_out_table_3').empty(); 
    	    }
    	    if(conditions["reasonLevel"] == 2){
    	    	options.scrollX= true;
    	    }
    	    table=  $('#stock_out_table_3').DataTable(options);
        },
        error : function() {
        	bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
        }
    });
}

/**
 * 货物流转
 */
function stockoutstat_1_3(){
	console.log("stockoutstat_1_3");
	var conditions = buildStockoutCondition();
	conditions['reasonTypeCode'] = huoWuLiuZhuan; //货物流转
	
	$.ajax({
	       type : 'POST',
	       async: true,
	       url : "/stockoutstat/getReasonCode1",
	       beforeSend : function() {},
	       data : conditions,
	       success : function(data) {
	    	   
	    	   $("#stock_out_table_31 tbody tr").remove();
	    	   $.each(data,function(i, info){
	    		   $("#stock_out_table_31 tbody").append("<tr reasonCode1=" + info.reasonCode1 + "><td>" + (i+1) + "</td><td>" + info.reasonNote1 + "</td><td>" + info.percent + "</td></tr>");
	    		});
	    	   
	    	   $("#stock_out_table_31 tbody tr").removeClass("success");
	    	   $("#stock_out_table_31 tbody tr:eq(0)").addClass("success");
    		   conditions['reasonCode1'] = $("#stock_out_table_31 tbody tr:eq(0)").attr("reasonCode1");
    		   link_stock_out_graph_31(conditions);
    		   link_stock_out_table_33(conditions);
    		   
	    	   $("#stock_out_table_31 tbody tr").bind("click",function(event){
	    		   $("#stock_out_table_31 tbody tr").removeClass("success");
	    		   $(this).addClass("success");
	    		   conditions['reasonCode1'] = $(this).attr("reasonCode1");
	    		   link_stock_out_graph_31(conditions);
	    		   link_stock_out_table_33(conditions);
	    	   });
	    	   
	       },
	       error : function(){
	       	bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
	       }
	   });
	
	
	

}

function link_stock_out_graph_31(conditions){
//	conditions['reasonLevel']= $("input[name='stockOutReasonLevel2']:checked").val();
	var highchar1 = {
	        chart: {
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false
	        },
	        title: {
	            text: '责任对象分布'
	        },
	        credits: {
	            enabled: false//去除版权信息
	        },
	        tooltip: {
	        	 pointFormat: '数值:<b>{point.y:.1f}</b><br/>占比:<b>{point.percentage:.1f}%</b>'
	        },
	        colors : defineColors,
	        plotOptions: {
	            pie: {
	                allowPointSelect: true,
	                cursor: 'pointer',
	                dataLabels: {
	                    enabled: true
	                },
	                showInLegend: true
	            }
	        },
	        series:[{
	            type: 'pie',
	            name: ''
	        }]
	    };
	
	$.ajax({
		type : 'POST',
		async: true,
		url : "/stockoutstat/getReasonTargetForPie",
		beforeSend : function() {},
		data : conditions,
		success : function(data) {
//			console.log(data);
			highchar1.series[0].data= data;
			$('#stock_out_graph_31').highcharts(highchar1);
		},
		error : function(){
			bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
		}
	});
}

function link_stock_out_table_33(conditions){
	
	if(!conditions){
		conditions = buildStockoutCondition();
		conditions['reasonTypeCode'] = huoWuLiuZhuan;
	}
	
//	console.log(	$("input[name='reasonLevel']:checked").val());
	conditions['reasonCode1'] = $("#stock_out_table_31 tbody .success").attr("reasonCode1");
	conditions['reasonLevel']= 2;
	
    var dataSet = [];
	var column = [];
 
//	var dataSet = 
	var options = {
		dom : dataTableDom,
		paging : true,
		stateSave : true,
		deferRender : true,
		"bAutoWidth":true,   
		retrieve: true,
		"processing" : true,
		"paging" : true,
		"ordering" : false,
		"searching" : false,
//		"lengthMenu" : [ [ 20, 50, 100 ], [ 20, 50, 100 ] ],
		"language" : { // 汉化
			 "processing": "处理中...",
//			"processing" : " <div class='loading-sm'/>",
			"lengthMenu" : "显示 _MENU_ 项结果",
			"zeroRecords" : "没有匹配结果",
			"info" : "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
			"infoEmpty" : "显示第 0 至 0 项结果，共 0 项",
			"infoFiltered" : "(由 _MAX_ 项结果过滤)",
			"infoPostFix" : "",
			"search" : "搜索:",
			"url" : "",
			"emptyTable" : "<center>表中数据为空</center>",
			"loadingRecords" : "载入中...",
			"thousands" : ",",
			"paginate" : {
				"first" : "首页",
				"previous" : "上页",
				"next" : "下页",
				"last" : "末页"
			}
		},
		 buttons: dataTableButtons
	};


	$.ajax({
        type : 'POST',
        async: false,
        url : "/stockoutstat/getReason1And2AndTarget",
        beforeSend : function() {},
        data : conditions,
        success : function(data) {
        	dataSet =  data.dataSet ;
    	    $.each(data.head,function(i, info){
    		   column.push({"title":  info });
    		});
    	    
    	    options.columns = column;
    	    options.data = dataSet;
    	    if(table){
    	    	table.destroy();
    	    	$('#stock_out_table_33').empty(); 
    	    }
    	    table=  $('#stock_out_table_33').DataTable(options);
        },
        error : function() {
        	bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
        }
    });
}

function stockoutModal(){
	
	
	var conditions = buildStockoutCondition();
	var highchar1 =  {
	    title: {
	        text: '30天归因趋势图',
	        x: -20
	    },
	    xAxis: {
//	        categories: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
	    },
	    yAxis: {
	        title: {
	            text: '数值'
	        },
	        plotLines: [{
	            value: 0,
	            width: 1,
	            color: '#808080'
	        }]
	    },
	    colors : defineColors,
	    credits: {
            enabled: false//去除版权信息
        },
        tooltip: {
			shared : true,
			crosshairs: [{ //十字准星
	                width: 1,
	                color: 'grey'
	            }],
			formatter : function() {
				var s = [];
				
				s.push('<span>'+this.x+'</span><br/>');
				
				var sum = 0;
				$.each(this.points, function(i, point){
					sum = sum + point.y;
				});
				
				$.each(this.points, function(i, point){
					var color = point.color;
					var name = point.series.name;
					var percent = 	(point.y/sum*100).toFixed(2)  + '%'  ;
					s.push('<span style="color:'+color+'">'+name+'</span>: <b>' + point.y +  ' </b>('+percent+')<br/>');
				});
				return s;
			}
        },
	    legend: {
	        layout: 'vertical',
	        align: 'right',
	        verticalAlign: 'middle',
	        borderWidth: 0
	    }
	};
	 $.ajax({
	        type : 'POST',
	        async: true,
	        url : "/stockoutstat/getReasonTypeByDate",
	        beforeSend : function() {},
	        data : conditions,
	        success : function(data) {
	        	console.log(data);
	        	highchar1.series = data.seriesList;
	        	highchar1.xAxis.categories = data.xAxis;
	        	$('#distributeChart').highcharts(highchar1);
	        },
	        error : function() {
	        	bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
	        }
	    });
	 console.log("stockoutModal()");
	 $("#graphModal").modal("toggle");
}


function stockoutTrend(){
	 console.log("stockoutTrend()");
	var conditions = buildStockoutCondition();
	conditions["reasonTypeCode"] = $("#stockoutstat_1_1_tab .active").attr("reasonTypeCode");
//	conditions['reasonTypeCode'] = 2302;
	var highchar1 =  {
	    title: {
	        text: '30天归因趋势图',
	        x: -20
	    },
	    xAxis: {
	    },
	    yAxis: {
	        title: {
	            text: '数值'
	        },
	        plotLines: [{
	            value: 0,
	            width: 1,
	            color: '#808080'
	        }]
	    },
	    colors : defineColors,
	    credits: {
            enabled: false//去除版权信息
        },
        tooltip: {
			shared : true,
			crosshairs: [{ //十字准星
	                width: 1,
	                color: 'grey'
	            }],
			formatter : function() {
				var s = [];
				
				s.push('<span>'+this.x+'</span><br/>');
				
				var sum = 0;
				$.each(this.points, function(i, point){
					sum = sum + point.y;
				});
				
				$.each(this.points, function(i, point){
					var color = point.color;
					var name = point.series.name;
					var percent = 	(point.y/sum*100).toFixed(2)  + '%'  ;
					s.push('<span style="color:'+color+'">'+name+'</span>: <b>' + point.y +  ' </b>('+percent+')<br/>');
				});
				return s;
			}
        },
	    legend: {
	        layout: 'vertical',
	        align: 'right',
	        verticalAlign: 'middle',
	        borderWidth: 0
	    }
	};
	 $.ajax({
	        type : 'POST',
	        async: true,
	        url : "/stockoutstat/getReasonPartyByDate",
	        beforeSend : function() {},
	        data : conditions,
	        success : function(data) {
	        	console.log(data);
	        	highchar1.series = data.seriesList;
	        	highchar1.xAxis.categories = data.xAxis;
	        	$('#distributeChart').highcharts(highchar1);
	        },
	        error : function() {
	        	bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
	        }
	    });
	
	 $("#graphModal").modal("toggle");
}

function vendorVltTrend(vendor){
	if(!vendor) return;
	var conditions = buildQuery();
	conditions['vendor'] = vendor;
	conditions['chartSelected'] = 'check2inspTimeChart';
	$.ajax({
		type : 'POST',
		url : "/InventoryDiagnosis/chartDate",
		dataType : 'json',
		beforeSend : function() {},
		data : conditions,
		async : true,
		success : function(data) {
			if (data && data.chartMap) {
				chartData =  data.chartMap;
				var obj = chartData['check2inspTimeChart'];
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
				};
				
				Highcharts.chart('distributeChart', {
					credits : {
						enabled : false
					},
					title : {
						text : ''
					},
					colors : defineColors,
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
								s.push('<span style="color:'+color+'">'+name+'</span>: <b>'+y+'</b>(天)<br/>');
							});
							return s;
						}
				    },
					xAxis: {
				        categories: xAxis
				    },

					series : series
				});
				 $("#graphModal").modal("toggle");
			}
		},
		error : function() {
			bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员...");
		}
	});
	
}


function storeTimeTrend(store){
	if(!store) return;
	var conditions = buildQuery();
	conditions['store'] = store;
	conditions['chartSelected'] = 'arrive2shelvesTimeChart';
	$.ajax({
		type : 'POST',
		url : "/InventoryDiagnosis/chartDate",
		dataType : 'json',
		beforeSend : function() {},
		data : conditions,
		async : true,
		success : function(data) {
			if (data && data.chartMap) {
				chartData =  data.chartMap;
				var obj = chartData['arrive2shelvesTimeChart'];
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
				};
				
				Highcharts.chart('distributeChart', {
					credits : {
						enabled : false
					},
					title : {
						text : ''
					},
					colors : defineColors,
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
								var y = point.y;
								s.push('<span style="color:'+color+'">'+name+'</span>: <b>'+y+'</b>(小时)<br/>');
							});
							return s;
						}
				    },
					xAxis: {
				        categories: xAxis
				    },

					series : series
				});
				 $("#graphModal").modal("toggle");
			}
		},
		error : function() {
			bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员...");
		}
	});
}

function goSkuDetail(reasonCode, reasonLevel, target){
	var conditions = buildStockoutCondition();
	if(reasonLevel == 1){
		conditions["reasonCode1"] = reasonCode;
	}else{
		conditions["reasonCode2"] = reasonCode;
	}
	conditions["reasonTarget"] = target;

	conditions["reasonTypeCode"] = $("#stockoutstat_1_1_tab .active").attr("reasonTypeCode");
	if(conditions["reasonTypeCode"]  == yunYingZhiXing){ //运营执行
		conditions['reasonParty'] = $("#stock_out_table_1 tbody .success").attr("reasonParty");
	}
	if(conditions["reasonTypeCode"]  == huoWuLiuZhuan){ //货物流转
		conditions['reasonCode1'] = $("#stock_out_table_31 tbody .success").attr("reasonCode1");
	}
	if($("#stockoutstat_1").is(":visible")){
		conditions['dataType'] = '0';//缺货
	}
	if($("#unsalablestat_1").is(":visible")){
		conditions['dataType'] = '1';//缺货
	}
	$.StandardPost("/reason/sku",conditions);
}