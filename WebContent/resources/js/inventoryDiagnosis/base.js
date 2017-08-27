$(function(){
	 $('[data-toggle="popover"]').popover()
//	$("#stockoutAnalysis_li").click(function(){
//	});
});
function overallAnalysis(){
	console.log("overallAnalysis");
	$("#stockoutAnalysisButton").hide();
	$("#turnoverAnalysisButton").hide();
	overallAnalysisDataRequest();
}
