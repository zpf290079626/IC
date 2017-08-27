$(function () {
	$('#myTab').find('li').live("click",function(){
		
		$("[tabName]").removeClass("active");
		
		var tabName = $(this).attr("tabName");
		$("[tabName='"+tabName+"']").addClass("active");
		
	});
	
	
});
