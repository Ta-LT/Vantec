var txt_setting_count_method_time = $("#txt_setting_count_method_time");
var btn_close_setting_count_type = $("#btn_close_setting_count_type");
var btn_setting_count_method_alarm = $("#btn_setting_count_method_alarm");
var dpd_setting_count_method_alarm = $("#dpd_setting_count_method_alarm");
function settingCountMethodInit(settingInfo){
    //計測方法の初期化
    if(settingInfo.MeasureMode != undefined){
        $(".btn_setting_count_method").removeClass("select");
        $(".btn_setting_count_method").eq(settingInfo.MeasureMode - 1).addClass("select");
    }
    //時間設定の初期化
    if(settingInfo.Time != undefined){
        txt_setting_count_method_time.val(settingInfo.Time)
    }
    //通知音の初期化
    if(settingInfo.Notice != undefined){
        $(".rb_setting_count_method_notice").removeClass("active");
        $(".rb_setting_count_method_notice").eq(settingInfo.Notice).addClass("active");
    }
    if(settingInfo.alarm){
        btn_setting_count_method_alarm.val(settingInfo.alarm.code);
        btn_setting_count_method_alarm.text(settingInfo.alarm.name);
    }
    //パイプの初期化
    if(settingInfo.Pipe != undefined){
        $(".rb_setting_count_method_pipe").removeClass("active");
        $(".rb_setting_count_method_pipe").eq(settingInfo.Pipe).addClass("active");
    }
    // set click event method
    $(".btn_setting_count_method").click(function(){
        $(".btn_setting_count_method").removeClass("select");
        $(this).addClass("select");
        //set value for 計測方法
        settingInfo.MeasureMode = $(".btn_setting_count_method").index($(".btn_setting_count_method.select")) + 1;
    });
    $(".rb_setting_count_method_notice").click(function(){
        //set value for notice
        var value = $(".rb_setting_count_method_notice").index($(this))
        settingInfo.Notice = value;
    });
    $(".rb_setting_count_method_pipe").click(function(){
        //set value for direction
        var value = $(".rb_setting_count_method_pipe").index($(this))
        settingInfo.Pipe = value;
    });
    txt_setting_count_method_time.change(function(){
        // set value for time
        settingInfo.Time = txt_setting_count_method_time.val();
    })
}
$(function () {
	txt_setting_count_method_time.TouchSpin({
		buttondown_class: 'btn btn-secondary',
		buttonup_class: 'btn btn-secondary',

		min: 0,
		max: 1000000000,
		stepinterval: 50,
		maxboostedstep: 10000000,
		postfix: '分'
	});
	//go back to setting page
	btn_close_setting_count_type.click(function(e){
		pageNavigation("page_setting_count_type","page_setting");
	});
})
