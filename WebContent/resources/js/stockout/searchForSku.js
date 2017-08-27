var vendorConditionIsvalid = true;// 供应商输入是否合法
var skuConditionIsvalid = true;// SKU输入是否合法
var isShowVendorInput = false;// 重置执行前，供应商显示的控件是否是输入框
var currentOperaType = $('#operaType').val(); // 当前选中的操作类型（缺货、高周转）
$(function() {

	// 设置select样式
	$("#conditions_form select[multiple].search").multiselect({
		allSelectedText : '选择全部',
		nonSelectedText : "请选择",
		enableCaseInsensitiveFiltering : true,
		enableFiltering : true,
		filterPlaceholder : '请输入',
		filterBehavior : 'both',
		buttonWidth : $('input[name="statDate"]').width() + 60,
		maxHeight : 200
	});

	$("#conditions_form select").multiselect({
		allSelectedText : '选择全部',
		nonSelectedText : "请选择",
		buttonWidth : $('input[name="statDate"]').width() + 60,
		maxHeight : 200
	});

	$('#statDate').datetimepicker({
		language : 'zh-CN',// 语言
		format : 'yyyy-mm-dd',// 日期格式
		ShowUpDown : true,
		weekStart : 1,// 一周从那一天开始
		todayBtn : 2,// "Today" 按钮控制
		autoclose : 1,
		todayHighlight : 1,
		startView : 2,// 选择器打开之后显示的视图
		minView : 3,// 选择器提供的最精确的时间视图
		forceParse : 0
	});
	$('#stockoutStartDate').datetimepicker({
		language : 'zh-CN',// 语言
		format : 'yyyy-mm-dd',// 日期格式
		ShowUpDown : true,
		weekStart : 1,// 一周从那一天开始
		todayBtn : 2,// "Today" 按钮控制
		clearBtn : true,//
		autoclose : 1,
		todayHighlight : 1,
		startView : 2,// 选择器打开之后显示的视图
		minView : 3,// 选择器提供的最精确的时间视图
		forceParse : 0
	});
	$('#unsalableStartDate').datetimepicker({
		language : 'zh-CN',// 语言
		format : 'yyyy-mm-dd',// 日期格式
		ShowUpDown : true,
		weekStart : 1,// 一周从那一天开始
		todayBtn : 2,// "Today" 按钮控制
		clearBtn : true,//
		autoclose : 1,
		todayHighlight : 1,
		startView : 2,// 选择器打开之后显示的视图
		minView : 3,// 选择器提供的最精确的时间视图
		forceParse : 0
	});

	$("#vendorSwitch").toggle(function() {
		showVendorInput($(this))
	}, function() {
		hideVendorInput($(this))
	});

	$(".vendorInput").on(
			"change",
			function() {
				$(this).css("color", "black");
				vendorConditionIsvalid = true;
				$(this).attr("title", "可以填写多个供应商编码，请勿超过200个，用逗号或空格隔开");

				// 替换分隔符为 英文,
				var vals = $(this).val();
				vals = $.trim(vals);
				vals = vals.replace(/(\n)|(\s+)|(\t)|(\')|(')|(，)/g, ",");
				if (vals == "") {
					return;
				}
				// 变小写
				vals = vals.toLowerCase();
				// 去重，判断是否有效
				var valArray = vals.split(",");
				var allvals = [];// 去重后所有
				var invalid_vals = [];// 无效
				var reg = /^\w+$/; // 由数字、26个英文字母或者下划线组成的字符串
				valArray.forEach(function(val, i) {
					if (val && val.length > 0) {
						if (!val.match(reg)) {
							if ($.inArray(val, invalid_vals) == -1) {// 去重
								invalid_vals.push(val);
							}
						}
						if ($.inArray(val, allvals) == -1) {// 去重
							allvals.push(val);
						}
					}
				});

				var titlePlus = "提示：共识别到  " + allvals.length + " 个的供应商编码 ";
				if (invalid_vals.length > 0) {
					vendorConditionIsvalid = false;
					$(this).css("color", "red");

					titlePlus = titlePlus + "\r\n有 " + invalid_vals.length
							+ " 个无效供应商编码 【" + invalid_vals.join() + "】，请更正";
				}
				if (allvals.length > 200) {
					vendorConditionIsvalid = false;
					$(this).css("color", "red");
					titlePlus = titlePlus + "\r\n一次性只可以查询200个编码，请调整"
				}

				$(this).val(allvals);
				$(this).attr("title", titlePlus);
			});

	$("#skuId").on(
			"change",
			function() {
				$(this).css("color", "black");
				skuConditionIsvalid = true;
				$(this).attr("title", "");

				var wids = $(this).val();
				wids = $.trim(wids);
				wids = wids.replace(/(\n)|(\s+)|(\t)|(\')|(')|(，)/g, ",");
				if (wids == "") {
					return;
				}

				var num = wids.split(",");
				var valid_wids = [];// 有效SKU
				var invalid_wid = [];// 无效SKU
				for (var i = 0, size = num.length; i < size; i++) {
					temp_wid = num[i];
					if (temp_wid && temp_wid.length > 0) {
						if (isNaN(temp_wid)) {
							// 非有效SKU
							if ($.inArray(temp_wid, invalid_wid) == -1) {// 去重
								invalid_wid.push(temp_wid);
							}
						} else {
							if ($.inArray(temp_wid, valid_wids) == -1) {// 去重
								valid_wids.push(temp_wid);
							}
						}
					}
				}

				wids = valid_wids.join();
				$(this).val(wids);

				var titlePlus = "提示：共识别到  " + valid_wids.length + " 个有效SKU ";
				if (invalid_wid.length > 0) {
					$(this).css("color", "red");
					titlePlus = titlePlus + "\r\n已剔除 " + invalid_wid.length
							+ " 个无效SKU 【" + invalid_wid.join() + "】";
				}
				if (valid_wids.length > 200) {
					$(this).css("color", "red");
					skuConditionIsvalid = false;
					titlePlus = titlePlus + "\r\n一次性只可以查询200个SKU，请调整";
				}

				$(this).attr("title", titlePlus);
			});

	$('#queryBtn').on("click", function() {
		$('button').attr("disabled", true);
		searchData();
		$('button').attr("disabled", false);
	});

	$('#queryClear').on("click", function(event) {
		// document.getElementById("conditions_form").reset();
		$('#skuId').val('');
		$('input[name="vendor"]').val('');
		$('#reasonTarget').val('');
		reloadOptionDatas();
		reloadConditionDatas('dataAccess');
	});

	$('#downloadBtn').on("click", function(event) {
		// // 数据权限通过加载查询条件控制，当【部门(bu)】为空时，不允许查询
		// var buValue = reBuildVals("bu");
		// if (buValue.length == 0 || buValue[0] == '') {
		// bootbox.alert("请选择【事业部】查询条件！");
		// return;
		// }
		doDownload();
	});

	var addChangeFunction = new Array("dataAccess", "bu", "dept1", "dept2",
			"dept3", "purchaser", "saler", "firstCate", "secondCate",
			"thirdCate", "region", "dc");
	for ( var item in addChangeFunction) {
		$('#' + addChangeFunction[item]).on("change", function() {
			reloadConditionDatas($(this).attr("id"));
		});
	}

	// 加载权限相关的下拉列表和普通下拉列表
	// 页面初始化会执行查询操作，因此最先加载权限信息
	reloadOptionDatas();
	reloadConditionDatas('dataAccess');

	// 生成jqGrid
	dataTData.initJqGrid();

	$('#operaType').on("change", function() {
		currentOperaType = $(this).val();
		if ("0" == currentOperaType) { // 缺货
			$("#suggestDiv").show();
			$("#unsalableStartDateDiv").hide();
			$("#stockoutStartDateDiv").show();

			// 高周转与缺货对应的归因不同
			$("#stockoutReasonPartyDiv").show();
			$("#stockoutReasonCode1Div").show();
			$("#stockoutReasonCode2Div").show();
			$("#stockoutReasonTypeCodeDiv").show();
			$("#statisticsScopeDiv").show();
			$("#unsalableReasonPartyDiv").hide();
			$("#unsalableReasonCode1Div").hide();
			$("#unsalableReasonCode2Div").hide();
			$("#unsalableReasonTypeCodeDiv").hide();

			// 显示或隐藏的列
			$("#data-table").jqGrid("hideCol", "unsalableStartDate");
			$("#data-table").jqGrid("hideCol", "unsalableNum");
			$("#data-table").jqGrid("hideCol", "sourceType");
			$("#data-table").jqGrid("showCol", "suggest");
			$("#data-table").jqGrid("showCol", "stockoutStartDate");
			$("#data-table").jqGrid("showCol", "stockoutloss");
			$("#data-table").setGridParam({
				url : "/reason/getStockOutData"
			});
		} else if ("1" == currentOperaType) { // 高周转
			$("#suggestDiv").hide();
			$("#stockoutStartDateDiv").hide();
			$("#unsalableStartDateDiv").show();

			// 高周转与缺货对应的归因不同
			$("#stockoutReasonPartyDiv").hide();
			$("#stockoutReasonCode1Div").hide();
			$("#stockoutReasonCode2Div").hide();
			$("#stockoutReasonTypeCodeDiv").hide();
			$("#statisticsScopeDiv").hide();
			$("#unsalableReasonPartyDiv").show();
			$("#unsalableReasonCode1Div").show();
			$("#unsalableReasonCode2Div").show();
			$("#unsalableReasonTypeCodeDiv").show();

			// 显示或隐藏的列
			$("#data-table").jqGrid("showCol", "unsalableStartDate");
			$("#data-table").jqGrid("showCol", "unsalableNum");
			$("#data-table").jqGrid("showCol", "sourceType");
			$("#data-table").jqGrid("hideCol", "suggest");
			$("#data-table").jqGrid("hideCol", "stockoutStartDate");
			$("#data-table").jqGrid("hideCol", "stockoutloss");
			$("#data-table").setGridParam({
				url : "/reason/getHighItoData"
			});
		}
		dataTData.initJqGrid();

	});

	// 处理跳转的链接传递的查询条件
	var linkConditions = eval('(' + $('#link_conditions').val() + ')');
	if ($('#isLink').val()) {

		var linkColumn = new Array("dataAccess", "bu", "dept1", "dept2",
				"dept3", "firstCate", "secondCate", "thirdCate", "purchaser",
				"saler", "brand", "vendor", "region", "dc", "store");
		var linkReasonColumn = new Array(); // 归因分为缺货和高周转，使用的不是同一套维表，因此需要单独处理
		var linkReasonKey = new Array("reasonParty", "reasonCode1",
				"reasonCode2", "reasonTypeCode");
		if (linkConditions['dataType'] == '0') {
			linkReasonColumn.push("stockoutReasonParty", "stockoutReasonCode1",
					"stockoutReasonCode2", "stockoutReasonTypeCode");
		} else if (linkConditions['dataType'] == '1') {
			linkReasonColumn.push("unsalableReasonParty",
					"unsalableReasonCode1", "unsalableReasonCode2",
					"unsalableReasonTypeCode");
		}
		var compId;
		for (compId in linkColumn) {
			compId = linkColumn[compId];
			var keyList = linkConditions[compId];
			if (keyList != null && keyList.length > 0) {

				var value;
				for (value in keyList) {
					value = keyList[value];
					$('#' + compId).multiselect('select', value);
				}
				$('#' + compId).multiselect('rebuild');
				// 触发onChange事件
				$('#' + compId).change();
			}
		}
		// 单独 处理归因相关
		for (var index = 0; index < linkReasonColumn.length; index++) {
			compId = linkReasonColumn[index];
			var keyList = linkConditions[linkReasonKey[index]];
			if (keyList != null && keyList.length > 0) {

				var value;
				for (value in keyList) {
					value = keyList[value];
					$('#' + compId).multiselect('select', value);
				}
				$('#' + compId).multiselect('rebuild');
			}
		}

		// 非下拉列表（责任对象）
		var rt = linkConditions['reasonTarget'];
		if (rt) {
			$('#reasonTarget').val(rt);
		}

		// 处理统计类型
		if (linkConditions['dataType'] == '0') { // 只有缺货存在统计类型
			if (linkConditions['stockFlag'] == "1") {
				$("#statisticsScope").multiselect("select", "stockFlag");
			}
			if (linkConditions['pvFlag'] == "1") {
				$("#statisticsScope").multiselect("select", "pvFlag");
			}
			$("#statisticsScope").multiselect('rebuild');
		}

		// 判断链接来的数据的类型
		if (linkConditions['dataType'] != currentOperaType) {
			$('#operaType').multiselect('select', linkConditions['dataType']);
			$('#operaType').multiselect('rebuild');
			$('#operaType').change();
		} else {
			// 执行初次查询
			dataTData.initJqGrid();
		}

	} else {
		// 执行初次查询
		dataTData.initJqGrid();
	}

});

function showVendorInput(comp) {
	comp.siblings('div.btn-group').hide();
	comp.siblings('select').removeAttr("id");
	comp.siblings('input').show();
	comp.siblings('input').attr("id", "vendor")
	isShowVendorInput = true;
}
function hideVendorInput(comp) {
	comp.siblings('div.btn-group').show();
	comp.siblings('select').attr("id", "vendor")
	comp.siblings('input').hide();
	comp.siblings('input').removeAttr("id");
	isShowVendorInput = false;
}

function getConditionDivWidth() {
	return $("#conditionDiv").width();
}

// 自动判断同步异步下载
function doDownload() {
	$('button').attr("disabled", true);
	bootbox.confirm({
		title : '提示',
		message : $('#downloadTitle').val(),
		buttons : {
			confirm : {
				label : '确定'
			},
			cancel : {
				label : '取消'
			}
		},
		callback : function(e) {
			if (e) {
				var conditionData = buildConditions();
				$.ajax({
					type : 'POST',
					url : "/reason/toDownloadData",
					beforeSend : function() {
					},
					data : conditionData,
					success : function(data) {
						if (data.success && data.filePath != '') {
							window.location = "/base/download?filePath="
									+ data.filePath;
						} else {
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

// 页面选择是否异步下载
function toDownload() {
	$('button').attr("disabled", true);
	bootbox.confirm({
		title : '提示',
		message : "请选择下载方式",
		buttons : {
			confirm : {
				label : '同步下载'
			},
			cancel : {
				label : '异步下载'
			}
		},
		callback : function(e) {
			// 同步 true,异步 false
			conditionData["syncDownload"] = e;
			var conditionData = buildConditions();
			$.ajax({
				type : 'POST',
				url : urlTag + "/toDownloadData",
				beforeSend : function() {
				},
				data : conditionData,
				success : function(data) {
					if (e) {
						if (data.success && data.filePath != '') {
							window.location = "/base/download?filePath="
									+ data.filePath;
						} else {
							bootbox.alert(data.msg);
						}
					} else {
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
	});
	$('button').attr("disabled", false);
}

function searchData() {
	// // 数据权限通过加载查询条件控制，当【部门(bu)】为空时，不允许查询
	// var buValue = reBuildVals("bu");
	// if (buValue.length == 0 || buValue[0] == '') {
	// bootbox.alert("请选择【事业部】查询条件！");
	// return;
	// }
	if (!vendorConditionIsvalid) {
		bootbox.alert("【供应商】查询条件有误，鼠标放到对应查询栏可查看错误提示，请调整后重试！");
		return;
	}
	if (!skuConditionIsvalid) {
		bootbox.alert("【SKU】查询条件有误，鼠标放到对应查询栏可查看错误提示，请调整后重试！");
		return;
	}

	// 保存当前数据的查询时间，采购未到货明细查询用
	$('#modal_statDate').val($('#statDate').val());
	dataTData.initJqGrid();
}

function buildConditions() {
	var formData = // $("#conditions_form").serialize();
	{
		dataAccess : reBuildVals("dataAccess"),
		statDate : $('input[name="statDate"]').val(),
		bu : reBuildVals("bu"),
		dept1 : reBuildVals("dept1"),
		dept2 : reBuildVals("dept2"),
		dept3 : reBuildVals("dept3"),
		purchaser : reBuildVals("purchaser"),
		saler : reBuildVals("saler"),
		purcControlErp : reBuildVals("purcControlErp"),
		skuId : $('input[name="skuId"]').val(),
		firstCateCD : reBuildVals("firstCateCD"),
		secondCateCD : reBuildVals("secondCateCD"),
		thirdCateCD : reBuildVals("thirdCateCD"),
		brand : reBuildVals("brand"),
		vendor : reBuildVals("vendor"),
		skuStatusCD : reBuildVals("skuStatusCD"),
		region : reBuildVals("region"),
		dc : reBuildVals("dc"),
		store : reBuildVals("store"),
		stockoutStartDate : $('input[name="stockoutStartDate"]').val(),
		unsalableStartDate : $('input[name="unsalableStartDate"]').val(),
		reasonTarget : $('#reasonTarget').val(),
		operaType : $("#operaType").val()
	};

	if ("0" == currentOperaType) { // 缺货
		formData["suggest"] = reBuildVals("suggest");
		formData["reasonParty"] = reBuildVals("stockoutReasonParty");
		formData["reasonCode1"] = reBuildVals("stockoutReasonCode1");
		formData["reasonCode2"] = reBuildVals("stockoutReasonCode2");
		formData["reasonTypeCode"] = reBuildVals("stockoutReasonTypeCode");
		// 统计类型
		var statisticsScope = $('#statisticsScope').val();
		if (statisticsScope == 'stockFlag') {
			formData['stockFlag'] = '1';
			formData['pvFlag'] = '';
		} else if (statisticsScope == 'pvFlag') {
			formData['pvFlag'] = '1';
			formData['stockFlag'] = '';
		} else {
			formData['stockFlag'] = '';
			formData['pvFlag'] = '';
		}
	}
	if ("1" == currentOperaType) { // 高周转
		formData["reasonParty"] = reBuildVals("unsalableReasonParty");
		formData["reasonCode1"] = reBuildVals("unsalableReasonCode1");
		formData["reasonCode2"] = reBuildVals("unsalableReasonCode2");
		formData["reasonTypeCode"] = reBuildVals("unsalableReasonTypeCode");
	}

	return formData;
}
function reBuildVals(compId) {
	var vals = $('#' + compId).val();
	if (!vals) {
		vals = [];
	}

	return vals.toString();
}

// 联动
var linkRelation = {};// 刷新哪些select组件包含的下拉列表
var parentRelation = {};// change的时候哪些条件带入到后台
linkRelation['all'] = [ 'dataAccess', 'bu', 'dept1', 'dept2', 'dept3', 'saler',
		'purchaser', 'firstCate', 'secondCate', 'thirdCate', 'vendor', 'brand',
		'storeType', 'region', 'dc', 'store' ];
parentRelation['all'] = [];
parentRelation['dataAccess'] = [ 'dataAccess' ];
parentRelation['bu'] = [ 'dataAccess', 'bu' ];
parentRelation['dept1'] = [ 'dataAccess', 'bu', 'dept1' ];
parentRelation['dept2'] = [ 'dataAccess', 'bu', 'dept1', 'dept2' ];
parentRelation['dept3'] = [ 'dataAccess', 'bu', 'dept1', 'dept2', 'dept3' ];
parentRelation['saler'] = [ 'dataAccess', 'bu', 'dept1', 'dept2', 'dept3',
		'saler' ];
parentRelation['purchaser'] = [ 'dataAccess', 'bu', 'dept1', 'dept2', 'dept3',
		'purchaser' ];
parentRelation['firstCate'] = [ 'dataAccess', 'bu', 'dept1', 'dept2', 'dept3',
		'purchaser', 'firstCate' ];
parentRelation['secondCate'] = [ 'dataAccess', 'bu', 'dept1', 'dept2', 'dept3',
		'purchaser', 'firstCate', 'secondCate' ];
parentRelation['thirdCate'] = [ 'dataAccess', 'bu', 'dept1', 'dept2', 'dept3',
		'purchaser', 'firstCate', 'secondCate', 'thirdCate' ];
parentRelation['storeType'] = [ 'dataAccess', 'storeType' ];
parentRelation['region'] = [ 'dataAccess', 'storeType', 'region' ];
parentRelation['dc'] = [ 'dataAccess', 'storeType', 'region', 'dc' ];
function reloadConditionDatas(selectName) {

	if (!parentRelation[selectName])
		return;
	var conditions = {};

	$.each(parentRelation[selectName], function(i, info) {
		var val = $('#' + info).val();
		// select 自己把自己变成前选择，val == '' 是请选择 ， 后边dc 、region是多选，val为null
		if ((info == selectName && val == '')
				|| (info == 'dc' && selectName == 'dc' && !val)
				|| (info == 'region' && selectName == 'region' && !val)) {
			val = -1;
		}
		if (val instanceof Array) {
			conditions[info] = val.toString();
		} else {
			conditions[info] = val;
		}
	});

	conditions['linkRelation'] = selectName;// 后台需要联动的

	$
			.ajax({
				type : 'POST',
				async : false,
				url : "/base/loadConditionData",
				beforeSend : function() {
				},
				data : conditions,
				success : function(data) {
					// 在清除操作前先显示 vendor
					var isShowVendorInputTmep = isShowVendorInput;
					hideVendorInput($("#vendorSwitch"));
					isShowVendorInput = isShowVendorInputTmep;

					if (data && data.linkRelation) {
						$
								.each(
										data.linkRelation,
										function(i, info) {
											var old = $('#' + info).val();
											chanageSelectData(info, data[info]);
											var new_val = $('#' + info).val();

											if (selectName != "dataAccess"
													&& ((old == null && new_val)
															|| (old == '' && (new_val == null || new_val != '')) || (old && new_val != old))) {
												$('#' + info).change();
											}

										});
						if (selectName == 'dataAccess') {
							$('#' + data.onChange).change();
							$('#storeType').change();
						}
					}

					if (isShowVendorInput) {
						showVendorInput($("#vendorSwitch"));
					}
				},
				error : function() {
					bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员...");
				}
			});

}

function chanageSelectData(compId, optDatas) {

	// 增加【请选择】选项
	var addOption = new Array("bu", "dept1", "dept2", "dept3", "saler",
			"purchaser", "firstCate", "secondCate", "thirdCate", "store",
			"statisticsScope");

	// option的key和value之间拼接空格
	var addOptionBlank = new Array("stockoutReasonParty",
			"stockoutReasonCode1", "stockoutReasonCode2",
			"stockoutReasonTypeCode", "unsalableReasonParty",
			"unsalableReasonCode1", "unsalableReasonCode2",
			"unsalableReasonTypeCode");

	// 记录不需要将key和value在界面上显示的下拉列表
	if (!optDatas) {
		// 清空
		$('#' + compId).find('option').remove();
		$('#' + compId).multiselect('rebuild');
		return;
	}

	// 选中值
	// var vals = $('#' + compId).val();

	$('#' + compId).find('option').remove();
	if ($.inArray(compId, addOption) >= 0 && optDatas.length > 1) {
		$('#' + compId).prepend("<option value=''>请选择</option>");
	}

	// 什么都不拼接；如果value不存在，则拼接【-】
	if (compId == 'skuStatusCD' || compId == 'dataAccess'
			|| compId == 'statisticsScope') {
		$.each(optDatas, function(i, info) {
			if (info) {
				$('#' + compId).append(
						"<option value='" + info.code + "'>"
								+ (info.name ? info.name : "-") + "</option>");
			}

		});
	}
	// key和value之间拼接空格
	else if ($.inArray(compId, addOptionBlank) > 0) {
		$.each(optDatas, function(i, info) {
			if (info) {
				$('#' + compId).append(
						"<option value='" + info.code + "'>" + info.code + " "
								+ info.name + "</option>");

			}
		});
	}
	// key和value之间拼接括号
	else {
		$.each(optDatas, function(i, info) {
			if (info) {// 过滤异常数据
				if (compId == 'region') {
					$('#' + compId).append(
							"<option value='" + info.code + "'>" + info.code
									+ "</option>");
				} else {
					$('#' + compId).append(
							"<option value='" + info.code + "'>"
									+ (info.name ? info.name : "-") + "("
									+ (info.code ? info.code : "-") + ")"
									+ "</option>");
				}

			}
		});
	}

	$('#' + compId).multiselect('rebuild');
	// 如果岗位下只有一个事业部，直接带出该事业部
	if (optDatas.length == 1 && optDatas[0]) {
		$('#' + compId).multiselect('select', optDatas[0].code);
	}
	$('#' + compId).multiselect('rebuild');
	// // 显示选中值
	// if (vals) {
	// $('#' + compId).multiselect('select', vals);
	// }
}

// 非联动下拉列表
function reloadOptionDatas() {
	var conditions = {};
	conditions["linkRelation"] = "stockoutReasonParty_stockoutReasonCode1_stockoutReasonCode2_stockoutReasonTypeCode_"
			+ "unsalableReasonParty_unsalableReasonCode1_unsalableReasonCode2_unsalableReasonTypeCode_"
			+ "skuStatusCD_purcControlErp_suggest_statisticsScope";
	$.ajax({
		type : 'POST',
		async : false,
		url : "/option/init",
		beforeSend : function() {
		},
		data : conditions,
		success : function(data) {

			if (data && data.linkRelation) {
				$.each(data.linkRelation, function(i, info) {
					chanageSelectData(info, data[info]);
				});
			}
		},
		error : function() {
			bootbox.alert("哎呀，加载数据出错了，请刷新后重试，如有问题请联系系统管理员...");
		}
	});
}
