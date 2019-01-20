var btn_close_setting_count_method = $("#btn_close_setting_count_method");
function settingCountTypeInit(settingInfo){
    if(settingInfo.InputType != undefined){
        $(".btn_setting_count_type").removeClass("select");
        $(".btn_setting_count_type").eq(settingInfo.InputType-1).addClass("select");
    }
    // set click event method
    $(".btn_setting_count_type").click(function(){
        $(".btn_setting_count_type").removeClass("select");
        $(this).addClass("select");
        //set value for input tyoe
        var value = $(".btn_setting_count_type").index($(".btn_setting_count_type.select"))
        settingInfo.InputType = value+1;
    });
}
$(function () {
	//go back to settings page
	btn_close_setting_count_method.click(function(e){
		pageNavigation("page_setting_count_method","page_setting");
	});
})
