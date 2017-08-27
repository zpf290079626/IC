var dataTableDom = "<'pull-right'B><'clear'>rt<'clear'><'pull-left'l><'pull-right'p><'pull-right'i>";
var dataTableButtons = [ {extend: 'csvHtml5',text:'<button class="btn btn-primary btn-sm">下载</button>',bom:true} ];
$(function() {
	
});
/**
 * 高周转
 */
var unsalablestatTable ;
function unsalablestat_2() {
	console.log("unsalablestat_2");
	$("#unsalablestat_1").hide();
	$("#unsalablestat_2").show();
	$("#unsalablestat_2_tab .active").click();
}

function unsalablestat_2_all() {	
	var conditions = buildUnsalableCondition();
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
        url : "/unsalablestat/getReasonTypeForTable",
        beforeSend : function() {},
        data : conditions,
        success : function(data) {
        	dataSet =  data.dataSet ;
    	    $.each(data.head,function(i, info){
    		   column.push({"title":  info });
    		});
    	    
    	    options.columns = column;
    	    options.data = dataSet;
    	    if(unsalablestatTable){
    	    	unsalablestatTable.destroy();
    	    	$('#unsalablestat_2_table_all').empty(); 
    	    }
    	    unsalablestatTable=  $('#unsalablestat_2_table_all').DataTable(options);
        },
        error : function() {
        	bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
        }
    });
}

function unsalablestat_2_1() {
	console.log("unsalablestat_2_1");
	
	var conditions = buildUnsalableCondition();
	conditions["reasonTypeCode"] = "2302";
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
		url : "/unsalablestat/getReasonCode2ForTable",
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
			if(unsalablestatTable){
				unsalablestatTable.destroy();
				$('#unsalablestat_2_table_1').empty(); 
			}
			unsalablestatTable=  $('#unsalablestat_2_table_1').DataTable(options);
		},
		error : function() {
			bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
		}
	});
}

function unsalablestat_2_2() {
	console.log("unsalablestat_2_2");
	
	var conditions = buildUnsalableCondition();
	conditions["reasonTypeCode"] = "2300";
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
		url : "/unsalablestat/getReasonPartyForTable",
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
			if(unsalablestatTable){
				unsalablestatTable.destroy();
				$('#unsalablestat_2_table_2').empty(); 
			}
			unsalablestatTable=  $('#unsalablestat_2_table_2').DataTable(options);
		},
		error : function() {
			bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
		}
	});
}


function unsalablestat_2_3() {
	console.log("unsalablestat_2_3");
	
	var conditions = buildUnsalableCondition();
	conditions["reasonTypeCode"] = "2301";
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
		url : "/unsalablestat/getReasonCode1ForTable",
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
			if(unsalablestatTable){
				unsalablestatTable.destroy();
				$('#unsalablestat_2_table_3').empty(); 
			}
			unsalablestatTable=  $('#unsalablestat_2_table_3').DataTable(options);
		},
		error : function() {
			bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
		}
	});
}
function unsalablestat_2_4() {
	console.log("unsalablestat_2_4");
	
	var conditions = buildUnsalableCondition();
	conditions["reasonTypeCode"] = "2304";
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
		url : "/unsalablestat/getReasonSaleForTable",
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
			if(unsalablestatTable){
				unsalablestatTable.destroy();
				$('#unsalablestat_2_table_4').empty(); 
			}
			unsalablestatTable=  $('#unsalablestat_2_table_4').DataTable(options);
		},
		error : function() {
			bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
		}
	});
}