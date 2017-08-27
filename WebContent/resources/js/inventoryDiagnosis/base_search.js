$(function(){

//		chanageSelectData('dataAccessSelect',$('#dataAccess').val());
	var endDate = '';
	if($('#statDate') && $('#statDate').val()) {
		endDate = $('#statDate').val();
	}
	$('#statDate').datetimepicker({
		language : 'zh-CN',// 语言
		format : 'yyyy-mm-dd',// 日期格式
		ShowUpDown : true,
		weekStart : 1,// 一周从那一天开始
		todayBtn : false,// "Today" 按钮控制
		todayHighlight:false,
		autoclose : 1,
		startView : 2,// 选择器打开之后显示的视图
		minView : 3,// 选择器提供的最精确的时间视图
		forceParse : 0,
		endDate : endDate
	});
	
	$("select.selectpicker").on("change",function(){
		reloadConditionDatas($(this).attr("id"));
	});
	
	$('#queryBtn').on("click", function() {
		$('button').attr("disabled", true);
		searchData();
		$('button').attr("disabled", false);
	});
	
	$('#calendar').on('click', function() {
		$('#statDate').datetimepicker('show');
	});

	$('#queryClear').on("click", function(event) {
//		document.getElementById("conditions_form").reset();
//		$("#summaryItems").multiselect('rebuild');
		reloadConditionDatas('dataAccess', true);
		if($('#statDate') && $('#statDate').datetimepicker) {
			$('#statDate').datetimepicker('update', endDate);
		}
		searchData();
	});
	reloadConditionDatas('dataAccess');
	searchData();
	
});

function searchData() {
	
//	$('#pleaseWaitDialog').modal('show');

	var conditions = buildConditions();
	
	if(conditions.activeTab == 'overallAnalysisRequest') {
		overallAnalysisDataRequest();
	} else if(conditions.activeTab == 'stockoutAnalysisRequest') {
		if($("#stockoutstat_1").is(":visible")){
			stockoutstat_1();
		}else{
			stockoutstat_2();
		}
	} else {
		if($("#unsalablestat_1").is(":visible")){
			unsalablestat_1();
		}else{
			unsalablestat_2();
		}
	}
	
//	$('#pleaseWaitDialog').modal('hide');
}
function overallAnalysisDataRequest() {
	var queryData = buildConditions();
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
	
	initOverallAnalysisTable();		// 生成表格数据
	// 下拉框选了全选, 按空值处理
	queryData = removeSelectVal(queryData);
	
	$('#pvStockRateBtn').prop('checked',true);
	$('#stockDiv').show();
	$('#turnoverDiv').hide();
	$('#saleFluncDiv').hide();
	$('#storeDiv').hide();
	$('#supplierDiv').hide();
	handleStockBtn();
	
	// 第一次加载展示现货的chart
	queryData.chartSelected = 'pvStockRateChart';
	getOverallAnalysisChart(queryData, 'pvStockRateChart');			// 生成chart data

	if(table) {
		var visibleCols = showConditionColumn(queryData);
		visibleCols++;
		if($('#overallAnalysisTable>thead tr').length == 2) {
			$('#overallAnalysisTable>thead tr')[0].remove();
		}
		$('#overallAnalysisTable>thead').prepend(
	   	    	 "<tr><th colspan='"+visibleCols+"'></th>" +
		   	    	 "<th colspan='2' style='text-align:center'>现货水平</th>" +
		   	    	 "<th colspan='2' style='text-align:center'>周转水平</th>" + 
		   	    	 "<th colspan='2' style='text-align:center'>销售波动</th>" + 
		   	    	 "<th colspan='3' style='text-align:center'>库房收货水平</th>" +
		   	    	 "<th colspan='3' style='text-align:center'>供应商供货能力</th>" +
	   	    	 "</tr>");
	}
}
function showVendorInput(comp) {
	comp.siblings('div.btn-group').hide();
	comp.siblings('select').removeAttr("id");
	comp.siblings('input').show();
	comp.siblings('input').attr("id", "vendorCode")
}
function hideVendorInput(comp) {
	comp.siblings('div.btn-group').show();
	comp.siblings('select').attr("id", "vendorCode")
	comp.siblings('input').hide();
	comp.siblings('input').removeAttr("id");
}

function getConditionDivWidth(){
	return $("#conditionDiv").width();
}

//自动判断同步异步下载
function doDownload(){
	$('button').attr("disabled", true);
	bootbox.confirm({
		title:'提示',
		message:$('#downloadTitle').val(),
		buttons:{
			confirm:{label:'确定'},
			cancel:{label:'取消'}
		},callback:function(e){
			if(e){
				var queryData = buildConditions();
				queryData = removeSelectVal(queryData);
				if(queryData.region && queryData.region.length >0) {
					queryData.regionTemp = queryData.region;
					queryData.region = '';
				}
				if(queryData.dc && queryData.dc.length >0) {
					queryData.dcTemp = queryData.dc;
					queryData.dc = '';
				}
//				if(queryData.store && queryData.store.length >0) {
//					queryData.storeTemp = queryData.store;
//					queryData.store = '';
//				}
				
				$.ajax({
			        type : 'POST',
			        url : "/InventoryDiagnosis/toDownloadData",
			        beforeSend : function() {},
			        data :  queryData,
			        success : function(data) {
		        		if(data.success && data.filePath !=''){
		        			window.location = "/base/download?filePath=" + data.filePath;
		        		}else{
		        			bootbox.alert(data.msg);
		        		}
		        		$('button').attr("disabled", false);
			        },
			        error : function() {
			        	bootbox.alert("哎呀，加载数据出错了，请联系系统管理员..."); 
			        	$('button').attr("disabled", false);
			        }
			    });
			}
		}
	});
	$('button').attr("disabled", false);
}

function buildConditions(){
	//汇总列去重
//	var showCols = [];
//	var items = $("#summaryItems option:selected");
//	if(items.length > 0){
//		for(var i=0; i<items.length; i++){
//			var options = $(items[i]).val().split(',');
//			for(var j in options){
//				if(!showCols.includes(options[j])){ 
//					showCols.push(options[j]);
//				}
//			}
//		}
//	}
	
	var formData = //$("#conditions_form").serialize();
	{
			activeTab: getCurrentActiveTab(),
			statDate:$('input[name="statDate"]').val(),
			dataAccess:reBuildVals('dataAccess'),
			bu:reBuildVals('bu'),
			dept1:reBuildVals('dept1'),
			dept2:reBuildVals('dept2'),
			dept3:reBuildVals('dept3'),
			firstCate:reBuildVals("firstCate"),
			secondCate:reBuildVals("secondCate"),
			thirdCate:reBuildVals("thirdCate"),
			purchaser:reBuildVals('purchaser'),
			saler:reBuildVals('saler'),
			brand:reBuildVals('brand'),
			vendor:reBuildVals('vendor'),
			storeType:reBuildVals('storeType'),
			region:reBuildVals('region'),
			dc:reBuildVals('dc'),
		    store:reBuildVals('store')
	};
	return formData;
}
function reBuildVals(compId){
	var result = $('#'+compId).val();
	if($('#'+compId) && $('#'+compId).val()) {
		return $('#'+compId).val();
	}
	return '';
}

//跳转页面带过来的参数
function isLinkOptions(){
	var isLink = $('.link_statistics').length>0;
	var hasOptions = (getLinkVals('brandCode') || getLinkVals('vendorCode') || getLinkVals('thirdCateCD') || getLinkVals('secondCateCD')
			|| getLinkVals('firstCateCD') || getLinkVals('buyerCode'));
	
	if(isLink && !hasOptions){
		return true;
	}
	return false;
}
var linkRelation ={};//刷新哪些select组件包含的下拉列表
var parentRelation ={};//change的时候哪些条件带入到后台
linkRelation['all']=['dataAccess','bu','dept1','dept2','dept3','saler','purchaser','firstCate','secondCate','thirdCate','vendor','brand','storeType','region','dc','store'];
parentRelation['all']=[];
parentRelation['dataAccess']=['dataAccess'];
parentRelation['bu']=['dataAccess','bu'];
parentRelation['dept1'] = ['dataAccess','bu','dept1'];
parentRelation['dept2'] = ['dataAccess','bu','dept1','dept2']; 
parentRelation['dept3'] = ['dataAccess','bu','dept1','dept2','dept3'];
parentRelation['saler'] = ['dataAccess','bu','dept1','dept2','dept3','saler'];
parentRelation['purchaser'] = ['dataAccess','bu','dept1','dept2','dept3','purchaser'];
parentRelation['firstCate'] = ['dataAccess','bu','dept1','dept2','dept3','purchaser','firstCate'];
parentRelation['secondCate'] = ['dataAccess','bu','dept1','dept2','dept3','purchaser','firstCate','secondCate'];
parentRelation['thirdCate'] = ['dataAccess','bu','dept1','dept2','dept3','purchaser','firstCate','secondCate','thirdCate'];
parentRelation['storeType']=['dataAccess','storeType'];
parentRelation['region']=['dataAccess','storeType','region'];
parentRelation['dc']=['dataAccess','storeType','region','dc'];
var checked = {};
//联动
function reloadConditionDatas(selectName, isReset) {
	if(!parentRelation[selectName]) return;
	var conditions = {};
	$.each(parentRelation[selectName],function(i, info){
		var val = $('#'+info).val();
//		select 自己把自己变成前选择，val == '' 是请选择 ， 后边dc 、region是多选，val为null
		if( (info == selectName && val == '')  || (info == 'dc' && selectName == 'dc' && !val) || (info == 'region' && selectName == 'region' && !val)){
				val = -1;
			}
		if(val instanceof Array){
			conditions[info] = val.toString();
		}else{
			conditions[info] = val;
		}
	});
	conditions['linkRelation']= selectName;//后台需要联动的
//	console.log("conditions=" + conditions);
	$.each(linkRelation['all'], function(i, info) {
		if(! $('#'+info).val())
			checked[info] = $('#'+info).val();
	});
	if(isReset) {
		conditions['dataAccess'] = '';
	}
//	console.log( conditions);
	$.ajax({
        type : 'POST',
        async: false,// 需要同步，页面第一次查询依赖该结果作为查询条件
        url : "/base/loadConditionData",
        beforeSend : function() {},
        data : conditions,
        success : function(data) {
        		if(data && data.linkRelation) {
	        		$.each(data.linkRelation, function(i, info) {
	        			var old = $('#'+info).val();
	            		chanageSelectData( info , data[ info]);
	            		var new_val =  $('#'+info).val();
	            		if(selectName != 'dataAccess' && 
	            				((old == null && new_val )
	            						||(old == '' && (new_val == null || new_val !='') )
	            						||(old && new_val != old ))
	            		  ){  
	            			$('#'+info).change();
	            		}
	            		
	        		});
	        		if(selectName == 'dataAccess'){
            			$('#'+data.onChange).change();
            			$('#storeType').change();
            		} 
        		}
        },
        error : function() {
        	bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员..."); 
        }
    });
}


function chanageSelectData(compId, optDatas){
	
	
	
	//选中值
//	var vals = getLinkVals(compId);
//	if (!vals) {
//		vals = $('#'+compId).val();
//	}
	
	
	if(!optDatas || optDatas.length == 0){
//		console.log("remove="+ compId)
		$('#'+compId).find('option').remove();
		$('#'+compId).selectpicker('refresh');
		return;
	}
	
	$('#'+compId).find('option').remove();
	
	if(optDatas.length>1 &&  
			$.inArray(compId, [ 'dataAccess','region','dc','storeType']) == -1 ){
		$('#'+compId).prepend("<option value=''>请选择</option>");
		var tempArray=[];
		$.each(optDatas, function(i, info) {
			if(info) {
				tempArray[i] = info.code;
			}
		});
		if($.inArray(compId, [ 'store']) == -1){
			$('#'+compId).append("<option value='" + tempArray.join(',') + "'>全部</option>");	
		}
	}
	
	if($.inArray(compId, [ 'dataAccess','storeType','region']) != -1){
		$.each(optDatas, function(i, info) {
			if(info) {
				$('#'+compId).append("<option value='" + info.code + "'>" + (info.name? info.name : "-")  + "</option>");
			}
		});
	}else if(compId == 'reasonCodes'){
		$.each(optDatas, function(i, info) {
			if(info){
				$('#'+compId).append("<option value='" + info.code + "'>" + info.code + " "+ info.name + "</option>");
			}
		});
	}else{
		$.each(optDatas, function(i, info) {
			if(info){//过滤异常数据
				$('#'+compId).append("<option value='" + info.code + "'>" + (info.name? info.name : "-") + "("+ (info.code?info.code : "-") +")" + "</option>");
			}
		});
	}
	
	
	
	$('#'+compId).selectpicker('deselectAll');
	$('#'+compId).selectpicker('refresh');
	
	//显示选中值
//	if(checked[compId]){
//		$('#'+compId).selectpicker('val', checked[compId] );
//	}
	
}
//已选择的option
function getLinkVals(compId){
	var vals;
	var valStr = $('#link_'+compId).val();
	if (valStr) {
		valStr = valStr.replace("[","");
		valStr = valStr.replace("]","");
		
		if(valStr.length>0){
			vals = valStr.split(',');
			$.each(vals, function(index,obj){
				vals[index]= obj.trim();
			});
		}
	}
	return vals;
}

function getCurrentActiveTab() {
	if($('#oTab').parent().hasClass('active')==true) {
		return 'overallAnalysisRequest';
	} else if($('#sTab').parent().hasClass('active')==true) {
		return 'stockoutAnalysisRequest';
	} else if($('#tTab').parent().hasClass('active')==true) {
		return 'turnoverAnalysisRequest';
	} else {
		return 'overallAnalysisRequest';
	}
}

