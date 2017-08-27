$(window).resize(function() {
	adjustTableWidth();
});

function adjustTableWidth() {
	// 根据滚动条调整table宽度
	// $("body").scrollTop(10);//控制滚动条下移10px
	// if( $("body").scrollTop()>0 ){
	// $("#data-table").jqGrid('setGridWidth', getConditionDivWidth()-20);
	// }else{
	$("#data-table").jqGrid('setGridWidth', getConditionDivWidth());
	// }
	// $("body").scrollTop(0);//滚动条返回顶部
}

var urlTag = "/reason/getStockOutData";

var dataTData = {
	tableId : '#data-table',
	pageId : '#data-jqGridPager',
	actionUrl : urlTag,
	pageSize : 5,
	jqGridDom : null,
	initJqGrid : function() {
		var formData = buildConditions();
		if (this.jqGridDom) {
			jqGridDom = $(this.tableId).jqGrid("setGridParam", {
				datatype : 'json',
				postData : formData,
				page : 1
			}).trigger("reloadGrid");
		} else {

			var colModel = [ {
				width : 100,
				align : 'center',
				sortable : false,
				label : "SKU编码",
				name : 'skuId',
				formatter : skuFormatter
			}, {
				width : 150,
				align : 'center',
				sortable : true,
				label : "SKU名称",
				name : 'skuName'
			}, {
				width : 70,
				align : 'center',
				sortable : false,
				label : "上下柜状态",
				name : 'skuStatusNote'
			}, {
				width : 80,
				align : 'center',
				sortable : false,
				label : "是否售完即止",
				name : 'saleNo',
				formatter : saleNoFormatter
			}, {
				width : 70,
				align : 'center',
				sortable : false,
				label : "区域",
				name : 'region'
			}, {
				width : 80,
				align : 'center',
				sortable : false,
				label : "配送中心",
				name : 'dcName'
			}, {
				width : 120,
				align : 'center',
				sortable : false,
				label : "库房",
				name : 'storeName'
			}, {
				width : 70,
				align : 'center',
				sortable : false,
				label : "责任方",
				name : 'reasonPartyNote'
			}, {
				width : 70,
				align : 'center',
				sortable : false,
				label : "责任对象",
				name : 'reasonTarget'
			}, {
				width : 130,
				align : 'left',
				sortable : false,
				label : "一级原因",
				name : 'reasonNote1',
				formatter : reasonFormatter1
			}, {
				width : 130,
				align : 'left',
				sortable : false,
				label : "二级原因",
				name : 'reasonNote2',
				formatter : reasonFormatter2
			}, {
				width : 130,
				align : 'left',
				sortable : false,
				label : "归因分类",
				name : 'reasonTypeNote',
				formatter : reasonFormatter3
			}, {
				width : 130,
				align : 'left',
				sortable : false,
				label : "建议",
				name : 'suggest',
				formatter : suggestFormatter
			}, {
				width : 100,
				align : 'center',
				sortable : false,
				label : "断货开始日期",
				name : 'stockoutStartDate'
			}, {
				width : 80,
				align : 'right',
				sortable : false,
				label : "缺货损失",
				name : 'stockoutloss'
			}, {
				width : 100,
				align : 'center',
				sortable : false,
				label : "高周转开始日期",
				name : 'unsalableStartDate',
				hidden : true
			}, {
				width : 80,
				align : 'right',
				sortable : false,
				label : "滞销件数",
				name : 'unsalableNum',
				hidden : true
			}, {
				width : 100,
				align : 'center',
				sortable : false,
				label : "一级部门",
				name : 'deptName1'
			}, {
				width : 100,
				align : 'center',
				sortable : false,
				label : "二级部门",
				name : 'deptName2'
			}, {
				width : 100,
				align : 'center',
				sortable : false,
				label : "三级部门",
				name : 'deptName3'
			}, {
				width : 100,
				align : 'center',
				sortable : false,
				label : "一级类目",
				name : 'firstCateName'
			}, {
				width : 100,
				align : 'center',
				sortable : false,
				label : "二级类目",
				name : 'secondCateName'
			}, {
				width : 100,
				align : 'center',
				sortable : false,
				label : "三级类目",
				name : 'thirdCateName'
			}, {
				width : 120,
				align : 'center',
				sortable : false,
				label : "品牌",
				name : 'brandName'
			}, {
				width : 70,
				align : 'center',
				sortable : false,
				label : "采购员",
				name : 'purcUserName'
			}, {
				width : 70,
				align : 'center',
				sortable : false,
				label : "销售员",
				name : 'sellsUserName'
			}, {
				width : 70,
				align : 'center',
				sortable : false,
				label : "采控员",
				name : 'purcControlErp'
			}, {
				width : 80,
				align : 'right',
				sortable : false,
				label : "erp现货库存",
				name : 'stockQtty'
			}, {
				width : 70,
				align : 'right',
				sortable : false,
				label : "可用库存",
				name : 'availableStock'
			}, {
				width : 70,
				align : 'right',
				sortable : false,
				label : "采购未到货",
				name : 'purNonIntoWhQtty',
				formatter : purNonIntoWhQttyFormatter
			}, {
				width : 70,
				align : 'right',
				sortable : false,
				label : "近28日销量",
				name : 'saleQtty28d'
			}, {
				width : 100,
				align : 'center',
				sortable : false,
				label : "最晚下单日",
				name : 'lastOrderDate',
				hidden : true
			}, {
				width : 100,
				align : 'center',
				sortable : false,
				label : "岗位类型",
				name : 'sourceType',
				hidden : true,
				formatter : sourceTypeFormatter
			} ];

			this.jqGridDom = $(this.tableId).jqGrid({
				url : this.actionUrl,
				postData : formData,
				mtype : "post",
				datatype : "local",
				colModel : colModel,
				// caption:"高周转SKU",
				// hidegrid:false,
				emptyrecords : "查询数据结果为空",
				rownumbers : true,
				forceFit : true,
				shrinkToFit : false,
				multiselect : false,
				autowidth : true,
				autoheight : true,
				height : 'auto',
				rowList : [ 5, 10, 20, 30, 50 ],
				rowNum : 10,
				pager : this.pageId,
				viewrecords : true,
				recordpos : 'left',// 此属性不要随意切换和自定义分页有关系
				recordtext : "共 {2} 条记录", // 共字前是全角空格
				pgtext : "当前页 {0} 共 {1} 页",
				pgfirst : "首页",
				pglast : "末页",
				pgnext : "下一页",
				pgprev : "上一页",
				pgrecs : "每页记录数",
				prmNames : {
					page : 'currPage',
					rows : 'pageCount'
				// sort: '',//用于排序的列名
				// order: '', //排序的方式desc/asc
				// search:'_search',//是否是搜索请求
				// nd:'nd', //已经发送的请求的次数
				// npage:null
				},
				jsonReader : {
					root : "dataList",
					page : "currPage",
					total : "totalPage",
					records : "totalRows",
					userdata : "userdata"
				},

				beforeProcessing : function() {
					// 将原来的rowNum属性保留下来待展示数据后重新变回去（待刷新页面 后任然 保持原来的rowNum）
					this.pageSize = $(this.tableId).getGridParam('rowNum'); // rows

					// 在展示数据前强制将rowNum属性变为-1 （rowNum为-1将展示查询出全部的数据）
					$(this.tableId).jqGrid("setGridParam", {
						rowNum : -1
					});
				},

				gridComplete : function() {
				},

				loadComplete : function() {
					adjustTableWidth();
				}
			});

			// $(this.tableId).jqGrid('setFrozenColumns');
		}
		if (formData.skuId != '') {
			// 缺货或高周转
			var operaType = $('#operaType').val();
			var alterTitle = '';
			var queryUrl = '';
			if ('0' == operaType) {
				alterTitle = '以下sku不缺货:';
				queryUrl = '/reason/getNotOutOfStock';
			} else if ('1' == operaType) {
				alterTitle = '以下sku没有高周转:';
				queryUrl = '/reason/getNotOutOfHighIto';
			}
			$
					.ajax({
						type : "POST",
						url : queryUrl,
						data : formData,
						success : function(msg) {
							if (msg != '') {
								bootbox
										.alert({
											message : "<div style='width:90%;word-wrap:break-word;'>"
													+ msg + "</div>",
											title : alterTitle,
										});
							}
						}
					});
		}
	}
};

function skuFormatter(cellvalue, options, rowObject) {

	var skuId = rowObject.skuId;
	var dcId = rowObject.dcId;
	var statDate = rowObject.statDate;
	var lastOrderDate = rowObject.lastOrderDate;
	if (lastOrderDate == null) {
		lastOrderDate = "";
	}
	var reasonCode1 = rowObject.reasonCode1;
	if (reasonCode1 == null) {
		reasonCode1 = "";
	}
	var reasonCode2 = rowObject.reasonCode2;
	if (reasonCode2 == null) {
		reasonCode2 = "";
	}
	var reasonParty = rowObject.reasonParty;
	if (reasonParty == null) {
		reasonParty = "";
	}

	// 高周转或缺货
	var dataType = currentOperaType;

	if (skuId && dcId && statDate) {
		return "<a href=\"javascript:window.open('" + basePath
				+ "/reason/toAnalysisDetail?skuId=" + skuId + "&dcId=" + dcId
				+ "&statDate=" + statDate + "&lastOrderDate=" + lastOrderDate
				+ "&reasonParty=" + reasonParty + "&reasonCode1=" + reasonCode1
				+ "&reasonCode2=" + reasonCode2 + "&dataType=" + dataType
				+ "');void(0);\" " + " title='查看详细分析结果' >" + cellvalue + "</a>";
	} else {
		return "<font title='该条数据有误，请反馈给系统运维人员，谢谢！'>" + cellvalue + "</font>";
	}

}

// 一级原因
function reasonFormatter1(cellvalue, options, rowObject) {
	var reasonCode1 = rowObject.reasonCode1;
	var reasonNote1 = rowObject.reasonNote1;

	if (reasonCode1) {
		return reasonNote1;
	} else {
		return "-";
	}

}

// 二级原因
function reasonFormatter2(cellvalue, options, rowObject) {
	var reasonCode2 = rowObject.reasonCode2;
	var reasonNote2 = rowObject.reasonNote2;

	if (reasonCode2) {
		return reasonNote2;
	} else {
		return "-";
	}

}

// 归因分类
function reasonFormatter3(cellvalue, options, rowObject) {
	var reasonTypeCode = rowObject.reasonTypeCode;
	var reasonTypeNote = rowObject.reasonTypeNote;

	if (reasonTypeCode) {
		return reasonTypeNote;
	} else {
		return "-";
	}
}

// 建议
function suggestFormatter(cellvalue, options, rowObject) {
	var suggest = rowObject.suggest;

	if ("0" == suggest) {
		return "催在途";
	} else if ("1" == suggest) {
		return "建议补货";
	} else {
		return "-";
	}
}

// 岗位类型
function sourceTypeFormatter(cellvalue, options, rowObject) {
	var sourceType = rowObject.sourceType;

	if ("0" == sourceType) {
		return "采销员";
	} else if ("1" == sourceType) {
		return "仓储";
	} else {
		return "-";
	}
}

function saleNoFormatter(cellvalue, options, rowObject) {
	return cellvalue == null ? "" : (cellvalue == 0 ? "否" : "是");
}

// 采购未到货
function purNonIntoWhQttyFormatter(cellvalue, options, rowObject) {
	var purNonIntoWhQtty = rowObject.purNonIntoWhQtty;
	var skuId = rowObject.skuId;
	var dcId = rowObject.dcId;
	if (purNonIntoWhQtty && purNonIntoWhQtty > 0) {
		// 暂存【配送中心】
		$('#modal_dcName').attr("value", rowObject.dcName);
		return "<a href='javascript:void(0)' onclick='purNonIntoWhQttyClick("
				+ skuId + "," + dcId + ")'>" + cellvalue + "</a>";
	} else {
		return cellvalue;
	}
}

// 显示采购未到货明细
function purNonIntoWhQttyClick(skuId, dcId) {
	var dt = $('#modal_statDate').val();
	var dcName = $('#modal_dcName').val();

	var dataTable = $("#purchaseOnthewayTable");
	dataTable.empty();

	var tr = $("<tr style='background:rgb(250, 250, 250);'></tr>");
	tr.appendTo(dataTable);
	var firstRowTd = $("<td style='text-align:center;'>配送中心</td>"
			+ "<td style='text-align:center;'>采购单号</td>"
			+ "<td style='text-align:center;'>商品数量</td>"
			+ "<td style='text-align:center;'>创建时间</td>"
			+ "<td style='text-align:center;'>采购单状态</td>");
	firstRowTd.appendTo(tr);
	// 显示明细框
	$('#purchaseOnthewayModal').modal('show');

	// 执行查询
	$.ajax({
		type : 'POST',
		url : "/reason/getPurchaseOnthewayData",
		beforeSend : function() {
		},
		data : {
			skuId : skuId,
			dcId : dcId,
			statDate : $('#modal_statDate').val()
		},
		success : function(data) {

			if (null == data || undefined == data || data.length == 0) {
				bootbox.alert("哎呀，未查询到明细数据，请确认数据是否加工完毕......");
				return;
			}
			var queryData = data;
			var dataSize = queryData.length;
			// 数据行
			for (var rowIndex = 0; rowIndex < dataSize; rowIndex++) {
				var val = queryData[rowIndex];
				if (val == null || val == undefined) {
					continue;
				}
				var tr = $("<tr style='background-color:#fff;'></tr>");
				tr.appendTo(dataTable);
				var td = $("<td style='width:150px;text-align:right;'>"
						+ dcName + "</td>"
						+ "<td style='width:150px;text-align:right;'>"
						+ val.poid + "</td>"
						+ "<td style='width:150px;text-align:right;'>"
						+ val.planPurQtty + "</td>"
						+ "<td style='width:150px;text-align:right;'>"
						+ val.createTm + "</td>"
						+ "<td style='width:150px;text-align:right;'>"
						+ val.purAgmtStatusCd + "</td>");
				td.appendTo(tr);
			}
		},
		error : function() {
			bootbox.alert("哎呀，加载进销存数据出错了，请联系系统管理员...");
		}
	});
}

// 当modal显示时调用
$('#purchaseOnthewayModal')
		.on(
				'show.bs.modal',
				function(e) {
					$(this)
							.find('.modal-dialog')
							.css(
									{
										'margin-top' : function() {
											var modalHeight = $(
													'#purchaseOnthewayModal')
													.find('.modal-dialog')
													.height();
											return ($(window).height() / 2 - (modalHeight / 2));
										}
									});
				});
