$(function() {

	var toolTipData;

	$(window).resize(function() {
		adjustWidth()
	});

	function adjustWidth() {
		$("#container").css("width", $("body").width() - 80);
		$("#tableDiv").css("width", $("body").width() - 80);
		// chart.reflow();
	}

	$
			.ajax({
				type : 'POST',
				url : "/reason/getChartData",
				beforeSend : function() {
				},
				data : {
					skuId : $('#skuId').val(),
					dcId : $('#dcId').val(),
					statDate : $('#statDate').val()
				},
				success : function(data) {
					// show chart
					toolTipData = eval('(' + data.tooltip + ')');
					var chartData = eval('(' + (data.chart) + ')');
					$.extend(chartOptions, chartData);
					adjustWidth();
					new Highcharts.Chart(chartOptions);

					// show table
					var series = chartData.series;
					var seriesSize = series.length;
					var dataSize = series[0].data.length;

					var noteIndex = 0;
					// 日期行
					var dataTable = $("#dataTable")
					var tr = $("<tr style='background:rgb(250, 250, 250);height:47px;'></tr>");
					tr.appendTo(dataTable);

					for (var colIndex = 0; colIndex < dataSize; colIndex++) {
						var td = $("<td>"
								+ new Date(series[0].data[colIndex].x)
										.format("yyyy-MM-dd") + "</td>");
						td.appendTo(tr);
					}
					// 数据行
					for (var rowIndex = 0; rowIndex < seriesSize; rowIndex++) {
						var tr = $("<tr style='height:28px;background-color:#fff;'></tr>");
						tr.appendTo(dataTable);

						for (var colIndex = 0; colIndex < dataSize; colIndex++) {
							var val = series[rowIndex].data[colIndex].y;
							if (val == undefined) {
								val = "";
							}
							var td = $("<td style='text-align:right;'>" + val
									+ "</td>");
							td.appendTo(tr);
						}
					}
				},
				error : function() {
					bootbox.alert("哎呀，加载进销存数据出错了，请联系系统管理员...");
				}
			});

	// 图属性设置
	chartOptions = {
		chart : {
			renderTo : 'container'
		},
		colors : [ '#C23531', '#334B5C', '#6AB0B8', '#D48265', '#91C7AE',
				'#749F83', '#CA8622', '#BDA29A' ],
		title : {
			text : '近90日进销存数据趋势',
			style : {
				color : '#3E576F',
				fontWeight : 'bold'
			},
			x : -20
		// center
		},
		xAxis : {
			type : 'datetime',
			tickPixelInterval : 1,
			dateTimeLabelFormats : {
				day : '%Y-%m-%d'
			},
			labels : {
				rotation : 30,
				y : 30,
				"formatter" : function() {
					return Highcharts.dateFormat('%Y-%m-%d', this.value)
				}
			}
		},
		yAxis : {
			title : {
				text : 'Units',
				x : 0
			},
			plotLines : [ {
				value : 0,
				width : 2,
				color : '#808080'
			} ]
		},
		credits : {
			enabled : false
		// 去除版权信息
		},
		tooltip : {
			shared : true,
			crosshairs : [ true, true ],
			formatter : function() {
				var date = new Date(this.x);
				var year = date.getFullYear();
				var month = date.getMonth() + 1;
				var day = date.getDate();
				var dStr = year + '-' + month + '-' + day;
				return dStr + ":" + toolTipData[this.x + ''];
			}
		},
		legend : {
			layout : 'vertical',
			align : 'right',
			verticalAlign : 'middle',
			x : 20,
			borderWidth : 0
		},
		plotOptions : {
			series : {
				// stacking : 'normal'
				marker : {
					enabled : false
				}
			// 不显示点
			},
			area : {
				color : '#C4E1FF'
			}
		},

		series : []
	};

});
