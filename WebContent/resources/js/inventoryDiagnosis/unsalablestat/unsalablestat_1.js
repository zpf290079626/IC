var unsalableBaseOn = 0;
var dataTableDom = "<'pull-right'B><'clear'>rt<'clear'><'pull-left'l><'pull-right'p><'pull-right'i>";
var dataTableButtons = [ {extend: 'csvHtml5',text:'<button class="btn btn-primary btn-sm">下载</button>',bom:true} ];
var defineColors =[ '#C23531', '#334B5C', '#6AB0B8', '#D48265', '#91C7AE','#749F83', '#CA8622', '#BDA29A', '#6E7074', '#546570' ];

$(function(){
	$('#unsalableCon').on('shown.bs.popover', function () {
		$("input[name='unsalableBaseOn']").eq(unsalableBaseOn).attr('checked', 'true');
	})
		
	$('#unsalableCon').on('hide.bs.popover', function () {
		unsalableBaseOn = $("input[name='unsalableBaseOn']:checked").val();
	})
});
/**
 * 高周转分析
 */
function unsalablestat_1(){
	$("#unsalablestat_1").show();
	$("#unsalablestat_2").hide();
	
	 $("#stockoutAnalysisButton").hide();
	 $("#turnoverAnalysisButton").show();
	 $("#unsalablestat_1_1_tab .active").click()
	console.log("unsalablestat_1");
	 
	var conditions = buildUnsalableCondition();
//	console.log(conditions);
	$.ajax({
        type : 'POST',
        async: true,
        url : "/unsalablestat/getReasonType",
        beforeSend : function() {},
        data : conditions,
        success : function(data) {
        	console.log(data);
        	$("#reason_type_2300_percent").text(data.reason_type_2300_percent?data.reason_type_2300_percent:'0%');
        	$("#reason_type_2301_percent").text(data.reason_type_2301_percent?data.reason_type_2301_percent:'0%');
        	$("#reason_type_2302_percent").text(data.reason_type_2302_percent?data.reason_type_2302_percent:'0%');
        	$("#reason_type_2304_percent").text(data.reason_type_2304_percent?data.reason_type_2304_percent:'0%');
        	$("#reason_type_2300_num").text(data.reason_type_2300_num>0?data.reason_type_2300_num:'0');
        	$("#reason_type_2301_num").text(data.reason_type_2301_num>0?data.reason_type_2301_num:'0');
        	$("#reason_type_2302_num").text(data.reason_type_2302_num>0?data.reason_type_2302_num:'0');
        	$("#reason_type_2304_num").text(data.reason_type_2304_num>0?data.reason_type_2304_num:'0');
        },
        error : function() {
        	bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
        }
    });
	
}
function buildUnsalableCondition(){
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
//	conditions['statDate']='2017-08-02';
	conditions['baseOn']= $("input[name='unsalableBaseOn']:checked").val()?$("input[name='unsalableBaseOn']:checked").val():unsalableBaseOn;
	return conditions;
}
/**
 * 补货决策
 */
function unsalablestat_1_1(){
	console.log("unsalablestat_1_1");
	var conditions = buildUnsalableCondition();
	conditions['reasonTypeCode'] = 2302; // TODO guoxobo 2302
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
		                    	 link_unsalable_graph_2(conditions);
		                    	 link_unsalable_graph_3(conditions);
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
       url : "/unsalablestat/getReasonCode2",
       beforeSend : function() {},
       data : conditions,
       success : function(data) {
//	    	console.log(data);
	    	highchar1.series[0].data=eval(data);
//	    	console.log(highchar1);
	    	$('#unsalable_graph_1').highcharts(highchar1);
	    	conditions['reasonCode2'] = 2215; //非销量波动
	    	conditions['graph_title'] = '非销量波动';
	    	link_unsalable_graph_2(conditions);
	    	link_unsalable_graph_3(conditions);
       },
       error : function() {
       	bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
       }
   });
	
}

function link_unsalable_graph_2(conditions){
	 var highchar1 = {
		        chart: {
		            plotBackgroundColor: null,
		            plotBorderWidth: null,
		            plotShadow: false
		        },
		        colors:defineColors,
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
	       url : "/unsalablestat/getCate",
	       beforeSend : function() {},
	       data : conditions,
	       success : function(data) {
		    	highchar1.series[0].data=eval( data);
		    	$('#unsalable_graph_2').highcharts(highchar1);
	       },
	       error : function() {
	       	bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
	       }
	   });
}

function link_unsalable_graph_3(conditions){
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
	       url : "/unsalablestat/getDC",
	       beforeSend : function() {},
	       data : conditions,
	       success : function(data) {
		    	highchar2.series[0].data=eval(data.seriesData);
		    	highchar2.xAxis.categories=eval(data.xAxis);//数组
//		    	console.log(highchar2);
		    	$('#unsalable_graph_3').highcharts(highchar2);
	       },
	       error : function(){
	       	bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
	       }
	   });
}
/**
 * 运营执行
 */
function unsalablestat_1_2(){
	console.log("unsalablestat_1_2");
	var conditions = buildUnsalableCondition();
	conditions['reasonTypeCode'] = 2300;// TODO guoxobo2300
	
	$.ajax({
	       type : 'POST',
	       async: true,
	       url : "/unsalablestat/getReasonParty",
	       beforeSend : function() {},
	       data : conditions,
	       success : function(data) {
	    	   
	    	   $("#unsalable_table_1 tbody tr").remove();
	    	   $.each(data,function(i, info){
	    		   $("#unsalable_table_1 tbody").append("<tr reasonParty=" + info.reasonParty + "><td>" + (i+1) + "</td><td>" + info.reasonPartyNote + "</td><td>" + info.percent + "</td></tr>");
	    		});
	    	   
	    	   $("#unsalable_table_1 tbody tr").removeClass("success");
	    	   $("#unsalable_table_1 tbody tr:eq(0)").addClass("success");
    		   conditions['reasonParty'] = $("#unsalable_table_1 tbody tr:eq(0)").attr("reasonParty");
    		   link_unsalable_table_2(conditions);
    		   link_unsalable_table_3(conditions);
    		   
	    	   $("#unsalable_table_1 tbody tr").bind("click",function(event){
	    		   $("#unsalable_table_1 tbody tr").removeClass("success");
	    		   $(this).addClass("success");
	    		   conditions['reasonParty'] = $(this).attr("reasonParty");
	    		   link_unsalable_table_2(conditions);
	    		   link_unsalable_table_3(conditions);
	    	   });
	       },
	       error : function(){
	       	bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
	       }
	   });
	
	
	
}

function link_unsalable_table_2(conditions){
	console.log(conditions)
	$.ajax({
		type : 'POST',
		async: true,
		url : "/unsalablestat/getReasonCode1And2",
		beforeSend : function() {},
		data : conditions,
		success : function(data) {
//			console.log(data);
			$("#unsalable_table_2 tbody tr").remove();
			$.each(data,function(i, info){
				$("#unsalable_table_2 tbody").append("<tr><td>" + info.reasonNote1 + "</td><td>" + info.reasonNote2 + "</td><td>" + info.sum + "</td><td>" + info.percent + "</td></tr>");
//	    			conditions[info] = $('#'+info).val();
			});
//		    	$('#unsalable_graph_3').highcharts(highchar2);
		},
		error : function(){
			bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
		}
	});
}

function link_unsalable_table_3(conditions){
	if(!conditions){
		conditions = buildUnsalableCondition();
		conditions['reasonTypeCode'] = 2300;
	}
	conditions['reasonParty'] = $("#unsalable_table_1 tbody .success").attr("reasonParty");
	conditions['reasonLevel']= $("input[name='unsalablestatReasonLevel']:checked").val();
	
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
        url : "/unsalablestat/getReason1And2AndTarget",
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
    	    	$('#unsalable_table_3').empty(); 
    	    }
    	    table=  $('#unsalable_table_3').DataTable(options);
        },
        error : function() {
        	bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
        }
    });
	
}

/**
 * 货物流转
 */
function unsalablestat_1_3(){
	console.log("unsalablestat_1_3");
	var conditions = buildUnsalableCondition();
	conditions['reasonTypeCode'] = 2301;// TODO guoxobo 2301
	
	$.ajax({
	       type : 'POST',
	       async: true,
	       url : "/unsalablestat/getReasonCode1",
	       beforeSend : function() {},
	       data : conditions,
	       success : function(data) {
	    	   
	    	   $("#unsalable_table_31 tbody tr").remove();
	    	   $.each(data,function(i, info){
	    		   $("#unsalable_table_31 tbody").append("<tr reasonCode1=" + info.reasonCode1 + "><td>" + (i+1) + "</td><td>" + info.reasonNote1 + "</td><td>" + info.percent + "</td></tr>");
	    		});
	    	   
	    	   $("#unsalable_table_31 tbody tr").removeClass("success");
	    	   $("#unsalable_table_31 tbody tr:eq(0)").addClass("success");
    		   conditions['reasonCode1'] = $("#unsalable_table_31 tbody tr:eq(0)").attr("reasonCode1");
    		   link_unsalable_graph_31(conditions);
    		   link_unsalable_table_33(conditions);
    		   
	    	   $("#unsalable_table_31 tbody tr").bind("click",function(event){
	    		   $("#unsalable_table_31 tbody tr").removeClass("success");
	    		   $(this).addClass("success");
	    		   conditions['reasonCode1'] = $(this).attr("reasonCode1");
	    		   link_unsalable_graph_31(conditions);
	    		   link_unsalable_table_33(conditions);
	    	   });
	    	   
	       },
	       error : function(){
	       	bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
	       }
	   });
	
	
	

}

function link_unsalable_graph_31(conditions){
//	conditions['reasonLevel']= $("input[name='reasonLevel2']:checked").val();
	var highchar1 = {
	        chart: {
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false
	        },
	        title: {
	            text: '责任对象分布'
	        },
	        colors: defineColors,
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
	
	$.ajax({
		type : 'POST',
		async: true,
		url : "/unsalablestat/getReasonTargetForPie",
		beforeSend : function() {},
		data : conditions,
		success : function(data) {
//			console.log(data);
			highchar1.series[0].data= data;
			$('#unsalable_graph_31').highcharts(highchar1);
		},
		error : function(){
			bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
		}
	});
}

function link_unsalable_table_33(conditions){
	
	if(!conditions){
		conditions = buildStockoutCondition();
		conditions['reasonTypeCode'] = 2301;
	}
	conditions['reasonCode1'] = $("#unsalable_table_31 tbody .success").attr("reasonCode1");
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
        async: true,
        url : "/unsalablestat/getReason1And2AndTarget",
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
    	    	$('#unsalable_table_33').empty(); 
    	    }
    	    table=  $('#unsalable_table_33').DataTable(options);
        },
        error : function() {
        	bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
        }
    });
	
//	$.ajax({
//		type : 'POST',
//		async: true,
//		url : "/unsalablestat/getReason1And2AndTarget",
//		beforeSend : function() {},
//		data : conditions,
//		success : function(data) {
//			
//			$("#unsalable_table_33 thead th").remove();
//			$("#unsalable_table_33 tbody tr").remove();
//			
//			$.each(data["cols"],function(i, info){
//				$("#unsalable_table_33 thead tr").append("<th>" + info + "</th>");
//			});
//		
//			$.each(data["values"],function(i, info){
//				 var tr = $("<tr><td>" + (i+1) + "</td></tr>");
//				$.each(info,function(i, value){
//					tr.append("<td>" +value + "</td>");	
//				});
//				$("#unsalable_table_33 tbody").append(tr);
//			});
//			
//		},
//		error : function(){
//			bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
//		}
//	});
}


/**
 * 销量异常-断货
 */
function unsalablestat_1_4(){
	console.log("unsalablestat_1_4");
	var conditions = buildUnsalableCondition();
	conditions['reasonTypeCode'] = 2304; // TODO guoxobo 2304
//	console.log(conditions);
	link_unsalable_graph_41(conditions);
	link_unsalable_graph_42(conditions);
}

function link_unsalable_graph_41(conditions){
	 var highchar1 = {
		        chart: {
		            plotBackgroundColor: null,
		            plotBorderWidth: null,
		            plotShadow: false
		        },
		        colors:defineColors,
		        title: {
		            text:conditions['graph_title']
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
	       url : "/unsalablestat/getCate",
	       beforeSend : function() {},
	       data : conditions,
	       success : function(data) {
		    	highchar1.series[0].data=eval( data);
		    	$('#unsalable_graph_41').highcharts(highchar1);
	       },
	       error : function() {
	       	bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
	       }
	   });
}

function link_unsalable_graph_42(conditions){
	var highchar2 = {
	        chart: {
	        	type: 'column'
	        },
	        title: {
	            text: '区域分布'
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
	       url : "/unsalablestat/getDC",
	       beforeSend : function() {},
	       data : conditions,
	       success : function(data) {
		    	highchar2.series[0].data=eval(data.seriesData);
		    	highchar2.xAxis.categories=eval(data.xAxis);//数组
//		    	console.log(highchar2);
		    	$('#unsalable_graph_42').highcharts(highchar2);
	       },
	       error : function(){
	       	bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
	       }
	   });
}

function unsalablestatModal(){
	var conditions = buildUnsalableCondition();
//	conditions['reasonTypeCode'] = 2302;
	var highchar1 =  {
	    title: {
	        text: '30天归因趋势图',
	        x: -20
	    },
	    subtitle: {
	        text: '数据来源',
	        x: -20
	    },
	    xAxis: {
//	        categories: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
	    },
	    colors : defineColors,
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
	        url : "/unsalablestat/getReasonTypeByDate",
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


function unsalablestatTrend(){

	var conditions = buildUnsalableCondition();
	conditions["reasonTypeCode"] = $("#unsalablestat_1_1_tab .active").attr("reasonTypeCode");
//	conditions['reasonTypeCode'] = 2302;
	var highchar1 =  {
	    title: {
	        text: '30天归因趋势图',
	        x: -20
	    },
	    subtitle: {
	        text: '数据来源',
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
	        url : "/unsalablestat/getReasonPartyByDate",
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
	 console.log("unsalablestatTrend()");
	 $("#graphModal").modal("toggle");
}
