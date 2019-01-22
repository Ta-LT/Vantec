var btn_close_setting = $("#btn_close_setting");
var btn_open_setting_count_type = $("#btn_open_setting_count_type");
var btn_open_setting_count_method = $("#btn_open_setting_count_method");
function settingInit(){
    var settingInfo = loginJson.Result.mMobileSet;
    
    // set click event method
    $(".rb_setting_direction").click(function(){
        //set value for direction
        var mode = $(".rb_setting_direction").index($(this)) + 1
        settingInfo.Horizontal = mode;
        //call device method
        if(window.webkit)
        {
          window.webkit.messageHandlers.ChangeRotation({key:"mode",value:""+mode+""});
        }
    });
    if(settingInfo.Horizontal != undefined){
        $(".rb_setting_direction").removeClass("active");
        $(".rb_setting_direction").eq(settingInfo.Horizontal - 1).click();
    }
    settingCountTypeInit(settingInfo);
    settingCountMethodInit(settingInfo);
}
$(function () {
	//go back to top page
	btn_close_setting.click(function(e){
        // save settings to local data for current user
        if(window.webkit){
            var userId = loginJson.Result.mAccount.Id;
            var settingsInfo = JSON.stringify(loginJson.Result.mMobileSet);
            window.webkit.messageHandlers.SettingsChanged({"userId":""+userId+"","settingsInfo":""+settingsInfo+""});
        }
		pageNavigation("page_setting",getTopPage());
	});
	//open count type setting page
	btn_open_setting_count_type.click(function(e){
		pageNavigation("page_setting","page_setting_count_type");
	});
	//open count method setting page
	btn_open_setting_count_method.click(function(e){
		pageNavigation("page_setting","page_setting_count_method");
	});

})
