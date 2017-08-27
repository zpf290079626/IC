var dataTableDom = "<'pull-right'B><'clear'>rt<'clear'><'pull-left'l><'pull-right'p><'pull-right'i>";
var dataTableButtons = [ {extend: 'csvHtml5',text:'<button class="btn btn-primary btn-sm">下载</button>',bom:true} ];
$(function() {
	
});
/**
 * 缺货分析
 */
var table ;
function stockoutstat_2() {
	console.log("stockoutstat_2");
	$("#stockoutstat_1").hide();
	$("#stockoutstat_2").show();
	$("#stockoutstat_2_tab .active").click();
}
function stockoutstat_2_all() {
	var conditions = buildStockoutCondition();
	var dataSet = [];
	var column = [];
 
//	var dataSet = 
	var options = {
		dom :dataTableDom ,
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
			"lengthMenu" : "显示_MENU_项结果",
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
//		,
//		data : [["家电 事业部","家电事业部"],["家电 事业部","家电事业部"],["家电 事业部","家电事业部"],["家电 事业部","家电事业部"]],
//		columns :[]
	};


	$.ajax({
        type : 'POST',
        async: false,
        url : "/stockoutstat/getReasonTypeForTable",
        beforeSend : function() {},
        data : conditions,
        success : function(data) {
        	dataSet =  data.dataSet ;
    	    $.each(data.head,function(i, info){
    		   column.push({"title":  info });
    		});
    	    console.log(dataSet);
//    	    column.push({"title":"事业部"});
//    	    column.push({"title":"一级部门"});
    	    options.columns = column;
    	    options.data = dataSet;
    	    if(table){
    	    	table.destroy();
    	    	$('#stockoutstat_2_table_all').empty(); 
    	    }
    	    table=  $('#stockoutstat_2_table_all').DataTable(options);
        },
        error : function() {
        	bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
        }
    });
}
function stockoutstat_2_1() {
	console.log("stockoutstat_2_1");
	
	var conditions = buildStockoutCondition();
	conditions["reasonTypeCode"] = "1302";
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
//		,
//		data : [["家电 事业部","家电事业部"],["家电 事业部","家电事业部"],["家电 事业部","家电事业部"],["家电 事业部","家电事业部"]],
//		columns :[]
	};
	
	$.ajax({
		type : 'POST',
		async: false,
		url : "/stockoutstat/getReasonCode2ForTable",
		beforeSend : function() {},
		data : conditions,
		success : function(data) {
			dataSet =  data.dataSet ;
			$.each(data.head,function(i, info){
				column.push({"title":  info });
			});
			console.log(dataSet);
//    	    column.push({"title":"事业部"});
//    	    column.push({"title":"一级部门"});
			options.columns = column;
			options.data = dataSet;
			if(table){
				table.destroy();
				$('#stockoutstat_2_table_1').empty(); 
			}
			table=  $('#stockoutstat_2_table_1').DataTable(options);
		},
		error : function() {
			bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
		}
	});
}

function stockoutstat_2_2() {
	console.log("stockoutstat_2_2");
	
	var conditions = buildStockoutCondition();
	conditions["reasonTypeCode"] = "1300";
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
//		,
//		data : [["家电 事业部","家电事业部"],["家电 事业部","家电事业部"],["家电 事业部","家电事业部"],["家电 事业部","家电事业部"]],
//		columns :[]
	};
	
	$.ajax({
		type : 'POST',
		async: false,
		url : "/stockoutstat/getReasonPartyForTable",
		beforeSend : function() {},
		data : conditions,
		success : function(data) {
			dataSet =  data.dataSet ;
			$.each(data.head,function(i, info){
				column.push({"title":  info });
			});
			console.log(dataSet);
//    	    column.push({"title":"事业部"});
//    	    column.push({"title":"一级部门"});
			options.columns = column;
			options.data = dataSet;
			if(table){
				table.destroy();
				$('#stockoutstat_2_table_2').empty(); 
			}
			table=  $('#stockoutstat_2_table_2').DataTable(options);
		},
		error : function() {
			bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
		}
	});
}


function stockoutstat_2_3() {
	console.log("stockoutstat_2_3");
	
	var conditions = buildStockoutCondition();
	conditions["reasonTypeCode"] = "1301";
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
//		,
//		data : [["家电 事业部","家电事业部"],["家电 事业部","家电事业部"],["家电 事业部","家电事业部"],["家电 事业部","家电事业部"]],
//		columns :[]
	};
	
	$.ajax({
		type : 'POST',
		async: false,
		url : "/stockoutstat/getReasonCode1ForTable",
		beforeSend : function() {},
		data : conditions,
		success : function(data) {
			dataSet =  data.dataSet ;
			$.each(data.head,function(i, info){
				column.push({"title":  info });
			});
			console.log(dataSet);
//    	    column.push({"title":"事业部"});
//    	    column.push({"title":"一级部门"});
			options.columns = column;
			options.data = dataSet;
			if(table){
				table.destroy();
				$('#stockoutstat_2_table_3').empty(); 
			}
			table=  $('#stockoutstat_2_table_3').DataTable(options);
		},
		error : function() {
			bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
		}
	});
}