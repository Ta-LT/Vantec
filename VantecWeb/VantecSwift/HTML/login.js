function showMsg(form, type, msg,time) {
	var alert = $('<div class="m-alert m-alert--outline alert alert-' + type + ' alert-dismissible" role="alert">\
		<span></span>\
	</div>').css("display","none");

	//
	alert.prependTo(form);
	//alert.animateClass('fadeIn animated');
	alert.find('span').html(msg);
    alert.show()
    alert.fadeOut(time,function(){
        form.find('.alert-' + type).remove();
    });
}
function login(e) {
	var btn = $(e);
	var form = $(e).closest('form');
	var id = $("#txt_userid").val();
	var password = $("#txt_password").val();
	setTimeout(function() {
		form.validate({
			rules: {
				id: {
					required: true
				},
				password: {
					required: true
				}
			},
			messages: {
				 id: {
					required: "IDは必須項目です。"
				 },
				 password: {
					required: "Passwordは必須項目です。"
				 }
		   }
		});

        if (!form.valid()) {
            btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
            return;
        }else{
            //get data from server
            var userInfo = {
               "UserId":id,
               "Password":password
            }
            if(window.webkit)
            {
               window.webkit.messageHandlers.LoginClick.postMessage(JSON.stringify(userInfo));
               window.webkit.messageHandlers.RememberID.postMessage({"userName":""+id+"","rememberIdFlg":""+$("#cb_login_remember_id").is(":checked")+""});
            }
//            getLocalSettingsInfo(loginJson);
//            init("");
        }
	},500);
}
function loginClicked(isTimedout){
    if(isTimedout){
        showMessage("Login failed.Please try again.");
    }
    $("#txt_userid").blur();
    $("#txt_password").blur();
    $('#m_login_signin_submit').removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
}
function logout(){
    if(!$("#cb_login_remember_id").is(":checked")){
        $("#txt_userid").val("");
    }
    $("#txt_password").val("");
//    $('#dp_login_worktime').datepicker("setDate", new Date());
    pageNavigation(currentPage,"page_login");
    $('body').stopTime ('restTimer');
    $('body').stopTime ('loginTimer');
    delete loginJson.LoginTime;
    //destroy results
    currentResult = undefined;
    currentCustomer = undefined;
    tempScanResultList = [];
    //call device method
    window.webkit.messageHandlers.LogoutClick.postMessage({key:"key",value:"value"});
}
var tempTransmission
var tempScanTime
//var tempScanMaxLength
function getLocalSettingsInfo(loginInfo){
    loginClicked();
    if(loginInfo.ReturnCode == 3)
    {
        showMsg($('#m_login_signin_submit').closest('form'), 'danger', loginInfo.Message),3000;
        return;
    }
    loginJson = loginInfo;
    tempTransmission = loginJson.Result.mMobileSet.Transmission;
    tempScanTime = loginJson.Result.mMobileSet.ScanTime;
    //tempScanMaxLength = loginJson.Result.mMobileSet.Digit;
    if(window.webkit){
        var userId = loginJson.Result.mAccount.Id;
        var token = loginJson.Token;
        window.webkit.messageHandlers.GetLocalSettings.postMessage({"userId":JSON.stringify(userId),"token":token});
    }
}
function init(localSettingsInfo){
    //start to init pages and settings
    if(localSettingsInfo && localSettingsInfo != ""){
        loginJson.Result.mMobileSet = localSettingsInfo;
    }
    loginJson.Result.mMobileSet.Transmission = tempTransmission;
    loginJson.Result.mMobileSet.ScanTime = tempScanTime;
    //loginJson.Result.mMobileSet.Digit = tempScanMaxLength;
    workDate = getTime().split(" ")[0];
    //saveCurrentResult();
    languageInit();
    customerInit();
    customerEditInit();
    //topInit();
    //topEditInit();
    settingInit();
    //restTimeInit();
    loginTimeInit();
    practicalsInit(dpd_count_numtype_practical.empty(),btn_count_numtype_practical);
    practicalsInit(dpd_count_tabtype_practical.empty(), btn_count_tabtype_practical);
    practicalsInit(dpd_count_tabtype_edit_practical.empty(),btn_count_tabtype_edit_practical);
    practicalsInit(dpd_count_numtype_edit_practical.empty(),btn_count_numtype_edit_practical);
    alarmsInit(dpd_setting_count_method_alarm.empty(),btn_setting_count_method_alarm);
    
    if(loginJson.Result.mAccount.MultiKBN == 2 && loginJson.Result.mAccount.CheckFlg == 1&&!currentResult){
        //to show customer page
        pageNavigation("page_login","page_customer");
    }else{
        //to show top page
        pageNavigation("page_login",getTopPage());
    }
    if(currentResult){
        setTopBgColor(currentResult.mWorkKbn_Id);
        //set customer clicked
        $(".btn_customer[mCustomer_Id="+currentResult.mCustomer_Id+"]").click();
    }
    $("#m_login_signin_submit").removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
}
jQuery(document).ready(function() {
	$("#id").keyup(function(){
		$('.alert').remove();
	});
	$("#password").keyup(function(){
		$('.alert').remove();
	});
    $("#txt_userid").keydown(function(){
        if(event.keyCode == 13){
            $("#txt_password").focus();
            return false;
        }
    });
	
	$('#m_login_signin_submit').click(function(e) {
		login(this);
	});
//    $('#dp_login_worktime').datepicker({
//        format: "yyyy-mm-dd",
//        todayHighlight: true,
//        orientation: "top left",
//        templates: {
//            leftArrow: '<i class="la la-angle-left"></i>',
//            rightArrow: '<i class="la la-angle-right"></i>'
//        },
//        autoclose: true
//    });
//    $('#dp_login_worktime').datepicker("setDate", new Date());
//    $('#dp_login_worktime').focus(function(){$(this).blur()})
});
