function showMsg(form, type, msg, time) {
    var alert = $('<div class="m-alert m-alert--outline alert alert-' + type + ' alert-dismissible" role="alert">\
		<span></span>\
	</div>').css("display", "none");

    //
    alert.prependTo(form);
    //alert.animateClass('fadeIn animated');
    alert.find('span').html(msg);
    alert.show()
    alert.fadeOut(time, function () {
        form.find('.alert-' + type).remove();
    });
}
function login(e) {
    var btn = $(e);
    var form = $(e).closest('form');
    var id = $("#txt_userid").val();
    var password = $("#txt_password").val();
    setTimeout(function () {
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
        } else {
            //get data from server
            var userInfo = {
                "UserId": id,
                "Password": password
            }
            if (window.webkit) {
                window.webkit.messageHandlers.LoginClick(JSON.stringify(userInfo));
                window.webkit.messageHandlers.RememberID({ "userName": "" + id + "", "rememberIdFlg": "" + $("#cb_login_remember_id").is(":checked") + "" });
            }
            //            getLocalSettingsInfo(loginJson);
            //            init("");
        }
    }, 500);
}
function loginClicked(isTimedout) {
    if (isTimedout) {
        showMessage("Login failed.Please try again.");
    }
    $("#txt_userid").blur();
    $("#txt_password").blur();
    $('#m_login_signin_submit').removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
}
function logout() {
    if (!$("#cb_login_remember_id").is(":checked")) {
        $("#txt_userid").val("");
    }
    $("#txt_password").val("");
    //    $('#dp_login_worktime').datepicker("setDate", new Date());
    pageNavigation(currentPage, "page_login");
    $('body').stopTime('restTimer');
    $('body').stopTime('loginTimer');
    delete loginJson.LoginTime;
    //destroy results
    currentResult = undefined;
    currentCustomer = undefined;
    tempScanResultList = [];
    //call device method
    window.webkit.messageHandlers.LogoutClick({ key: "key", value: "value" });
    parent.window.subframeLogedout($("#txt_userid").val(), $(window.frameElement), loginJson.Result.mAccount.Id);
}
var tempTransmission
var tempScanTime
//var tempScanMaxLength
function getLocalSettingsInfo(loginInfo) {
    loginClicked();
    if (loginInfo.ReturnCode == 3) {
        showMsg($('#m_login_signin_submit').closest('form'), 'danger', loginInfo.Message), 3000;
        return;
    }
    if (!parent.window.subframeLogedin(loginInfo.Result.mAccount.Name, $(window.frameElement), loginInfo.Result.mAccount.Id)) {
        loginJson = loginInfo;
        tempTransmission = loginJson.Result.mMobileSet.Transmission;
        tempScanTime = loginJson.Result.mMobileSet.ScanTime;
        //tempScanMaxLength = loginJson.Result.mMobileSet.Digit;
        if (window.webkit) {
            var userId = loginJson.Result.mAccount.Id;
            var token = loginJson.Token;
            window.webkit.messageHandlers.GetLocalSettings({ "userId": JSON.stringify(userId), "token": token });
        }
    }
}
function init(localSettingsInfo) {
    //start to init pages and settings
    if (localSettingsInfo && localSettingsInfo != "") {
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
    practicalsInit(dpd_count_numtype_practical.empty(), btn_count_numtype_practical);
    practicalsInit(dpd_count_tabtype_practical.empty(), btn_count_tabtype_practical);
    practicalsInit(dpd_count_tabtype_edit_practical.empty(), btn_count_tabtype_edit_practical);
    practicalsInit(dpd_count_numtype_edit_practical.empty(), btn_count_numtype_edit_practical);
    alarmsInit(dpd_setting_count_method_alarm.empty(), btn_setting_count_method_alarm);

    if (loginJson.Result.mAccount.MultiKBN == 2 && loginJson.Result.mAccount.CheckFlg == 1 && !currentResult) {
        //to show customer page
        pageNavigation("page_login", "page_customer");
    } else {
        //to show top page
        pageNavigation("page_login", getTopPage());
    }
    if (currentResult) {
        setTopBgColor(currentResult.mWorkKbn_Id);
        //set customer clicked
        $(".btn_customer[mCustomer_Id=" + currentResult.mCustomer_Id + "]").click();
    }
    $("#m_login_signin_submit").removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
}
jQuery(document).ready(function () {
    $("#id").keyup(function () {
        $('.alert').remove();
    });
    $("#password").keyup(function () {
        $('.alert').remove();
    });
    $("#txt_userid").keydown(function () {
        if (event.keyCode == 13) {
            $("#txt_password").focus();
            return false;
        }
    });

    $('#m_login_signin_submit').click(function (e) {
        var _this = this;
        login(_this);
        //if (!parent.window.subframeLogedin($("#txt_userid").val(), $(window.frameElement))) {
        //    var userimg = $("<img/>").attr("src", "../workingpic.png").attr("usemap", "#planetmap").css({
        //        "height": "100%",
        //        "margin": "0 auto",
        //        "z-index": "999"
        //    });
        //    $("body").append(userimg.hide());
        //    var userimgY = userimg.height() / 2082 * 1650;
        //    $("map").append($("<area shape='rect' coords='0," + userimgY + ",200," + (userimgY + 200) + "' href='javascript:logout();'/>"));
        //    //$("body > div").hide();
        //}
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
//function logout() {
//    parent.window.subframeLogedout($("#txt_userid").val(), $(window.frameElement));
//}