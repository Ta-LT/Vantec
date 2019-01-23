//var dp_login_worktime = $("#dp_login_worktime");
var div_alert = $("#div_alert");
var txt_alert_message = $("#txt_alert_message");
var loginJson = {};
var currentResult;
var currentCustomer;
var resultElementRemoveList = [];
var tempScanResultList = [];
var numInputMaxLength = 9;
var inputFlg = 1;
var currentPage;
var resultEditCount = 0;// use to count result that edit by user
var wordDate;// use to save date of work
//set language
function languageInit() {
    $.each($("[LanguageKey]"), function (index, item) {
        $(item).text(loginJson.Result.mLanguage[$(item).attr("LanguageKey")]);
    });
    $.each($("[MessageKey]"), function (index, item) {
        $(item).text(loginJson.Result.mMessage[$(item).attr("MessageKey")]);
    });
    btnSelectAllText = loginJson.Result.mLanguage["MOBILEUSER_ALLSEL"]//全選択
    btnDeselectAllText = loginJson.Result.mLanguage["MOBILEUSER_ALLCANCEL"]//全解除;
    $("#txt_count_tabtype_increment,#txt_count_tabtype_edit_increment").trigger("touchspin.updatesettings", { postfix: loginJson.Result.mLanguage["MOBILEUSER_UNIT"] })
    txt_setting_count_method_time.trigger("touchspin.updatesettings", { postfix: loginJson.Result.mLanguage["MOBILEUSER_MINUTE"] })
}
// fill user id when rememberID is checked
function setUserId(userId) {
    if (!$("#cb_login_remember_id").is(":checked")) {
        $("#cb_login_remember_id").click();
    }
    $("#txt_userid").val(userId);
}
// set version
function setVersion(version) {
    $("#txt_version").text("Ver" + version);
}
function workStart(topText, topVal) {
    var newResultList = [];
    currentResult = setResultStartValue(topText, topVal);
    //change bgColor
    setTopBgColor(topVal);

    newResultList.push(currentResult);
    //一定間隔モードオンの場合
    if (loginJson.Result.mMobileSet.MeasureMode == 2) {
        startAlarmTimer();
    }
    if (window.webkit) {
        showBackDrop();
        window.webkit.messageHandlers.WorkStart({ "newResultList": "" + JSON.stringify(newResultList) + "", "Transmission": "" + loginJson.Result.mMobileSet.Transmission + "" });
    }

}
function workStartCallback(resultList) {
    currentResult = resultList[0];
    hideBackDrop();
}
function workEnd() {
    if (currentResult) {
        // end timer
        clearTimeout(timeoutID);
        //end current work
        setResultEndValue(currentResult);
        var sendResults = [];
        if (inputFlg == 1 && tempScanResultList.length > 0 && loginJson.Result.mMobileSet.InputType == 4) {
            // set first scanResult id equel current result id
            tempScanResultList[0].Id = currentResult.Id
            //set end times for each scan result by tempScanTime
            sendResults = setEndTimeForScanResults();
        } else {
            sendResults.push(currentResult);
        }
        if (window.webkit) {
            window.webkit.messageHandlers.WorkEnd({ "mAccount_Id": "" + loginJson.Result.mAccount.Id + "", "data": "" + JSON.stringify(sendResults) + "", "Transmission": "" + loginJson.Result.mMobileSet.Transmission + "" });
        }
        currentResult = undefined;
        tempScanResultList = [];
    }
}
function workEndCallback(resultList) {
    //resultList_local.push(resultList[0]);
    //createResult(result); // add result to page
}
function showResultList() {
    resultEditCount = 0;//reset edit results count to 0
    showBackDrop();
    if (window.webkit) {
        window.webkit.messageHandlers.ShowResultsList({ "mAccount_Id": "" + loginJson.Result.mAccount.Id + "", "WorkDate": "" + workDate + "" });
    }
}
function showResultsListCallback(resultList) {
    if (resultList) {
        content_results.empty();
        checkCBLengthToChangeBtnText();
        resultList.sort(resultListSort);
        $.each(resultList, function (index, result) {
            createResult(result);
        })
    }
    hideBackDrop();
}
function sendResultsToServer(resultList_update) {
    showBackDrop();
    if (window.webkit) {
        window.webkit.messageHandlers.SendResultsToServer({ "mAccount_Id": "" + loginJson.Result.mAccount.Id + "", "data": "" + JSON.stringify(resultList_update) + "" });
    }
}
function sendResultsToServerCallback(result) {
    if (result && result.ReturnCode == 0) {
        showResultList();
    } else {
        var alertMessage = loginJson.Result.mMessage["WEB_MESSAGE3009"]
        showMessage(alertMessage);
        hideBackDrop();
    }
}
function removeResults(resultRemoveList) {
    showBackDrop();
    if (window.webkit) {
        window.webkit.messageHandlers.DeleteResults({ "mAccount_Id": "" + loginJson.Result.mAccount.Id + "", "data": "" + JSON.stringify(resultRemoveList) + "" });
    }
}
function removeResultsCallback(result) {
    if (result && result.ReturnCode == 0) {
        $.each(resultElementRemoveList, function (index, item) {
            item.remove();
        });
    } else if (resultElementRemoveList.length > 0) {
        var alertMessage = loginJson.Result.mMessage["WEB_MESSAGE3010"]
        showMessage(alertMessage);
    }
    resultElementRemoveList = [];
    checkCBLengthToChangeBtnText();
    //div_results_alert.hide();
    hideBackDrop();
}
// Daily Output
function dailyOutput() {
    showBackDrop();
    if (window.webkit) {
        window.webkit.messageHandlers.DailyOutputClick({ "mAccount_Id": "" + loginJson.Result.mAccount.Id + "", "WorkDate": "" + workDate + "" });
    }
}
function dailyOutputCallback(result) {
    if (result && result.ReturnCode == 0) {
        var alertMessage = loginJson.Result.mMessage["WEB_MESSAGE3004"]
    } else {
        var alertMessage = loginJson.Result.mMessage["WEB_MESSAGE3005"]
    }
    showMessage(alertMessage);
    hideBackDrop();
}
// set result start value
function setResultStartValue(topText, topVal) {
    var newResultObj = {
        DetailType: topText,
        mWorkKbn_Id: topVal,
        StartDateTime: getTime(),
        mAccount_Id: loginJson.Result.mAccount.Id,
        WorkDate: workDate,//dp_login_worktime.val(),
        EndDateTime: "",
        Number: null,
        Steps: 0,
        InputType: loginJson.Result.mMobileSet.InputType,
        Practical: "",
        mPractical_Id: null,
        ScanKeyNo: "",
        mCustomer_Id: $(".btn_customer.select").attr("mCustomer_Id") ? parseInt($(".btn_customer.select").attr("mCustomer_Id")) : "",
        DelFlg: 0,
        CreateDateTimeStamp: String(Date.now()),//timestamp
        StatusCode: 0
    }
    return newResultObj;
}
// set result end value
function setResultEndValue(result) {
    result.EndDateTime = getTime();
    result.Steps = 0;//todo
    //result.mCustomer_Id = parseInt($(".btn_customer.select").attr("mCustomer_Id"));
    result.InputType = parseInt(loginJson.Result.mMobileSet.InputType);

    //createResult(currentResult); // add result to page
}
//change top bgColor
function setTopBgColor(topId) {
    $(".btn_top").removeClass("btn-outline-danger");
    $(".btn_top").css("border", "");
    if (topId) {
        $("[topId=" + topId + "]").addClass("btn-outline-danger");
        $("[topId=" + topId + "]").css("border", "solid 3px #8B0000");
    }
}
// init rest time
function restTimeInit(customerId) {
    var restTimeObj = loginJson.Result.mTimeSet;
    var restKBN = loginJson.Result.mWorkKbn.filter(function (workKBN) {
        return workKBN.mCustomer_Id == customerId;
    }).filter(function (workKBN) {
        return workKBN.RestFlg == 1;
    })[0];
    if (!restKBN || restTimeObj == null || restKBN.length == 0 || restTimeObj.AutoRest == 0) {
        return;
    }
    var startTimeArray = [restTimeObj.StartRestTime1,
    restTimeObj.StartRestTime2,
    restTimeObj.StartRestTime3,
    restTimeObj.StartRestTime4];
    var endTimeArray = [restTimeObj.EndRestTime1,
    restTimeObj.EndRestTime2,
    restTimeObj.EndRestTime3,
    restTimeObj.EndRestTime4];
    var preResult;
    $('body').stopTime('restTimer');
    $('body').everyTime('60s', 'restTimer', function () {
        if (startTimeArray.indexOf(getTimeForRest().split(" ")[1]) > -1) {
            //end current work
            preResult = currentResult;
            workEnd();
            // go back to top page
            pageNavigation(currentPage, getTopPage());
            // text blur
            $(".input-proxy").unbind("blur").blur();

            // start rest work
            workStart(restKBN.DetailType, restKBN.Id);
        } else if (endTimeArray.indexOf(getTimeForRest().split(" ")[1]) > -1) {
            if (currentResult && currentResult.mWorkKbn_Id == restKBN.Id) {
                // end rest work
                workEnd();
                // go back to top page
                pageNavigation(currentPage, getTopPage());
                //
                setTopBgColor();
                // start pre work
                if (preResult) {
                    workStart(preResult.DetailType, preResult.mWorkKbn_Id);
                }
            }
        }
    });
}
// init login time
function loginTimeInit() {
    if (!loginJson.LoginTime) {
        loginJson.LoginTime = new Date();
    }
    $('body').everyTime('5s', 'loginTimer', function () {
        var currentTime = (new Date()).setHours((new Date()).getHours() - 24);
        if (currentTime > loginJson.LoginTime) {
            logout();
        }
    });
}
// page navigation
function pageNavigation(pageToHide, pageToShow, hideCallBack, showCallBack) {
    var outClass = 'pt-page-scaleDownCenter';
    var inClass = 'pt-page-scaleUpCenter pt-page-delay100';
    $("#" + pageToHide).fadeOut(100, hideCallBack);
    $("#" + pageToShow).fadeIn(100, showCallBack);
    currentPage = pageToShow;
}
function getTime(dateTime, plusSec) {
    var myDate
    if (dateTime)
        myDate = new Date(dateTime);
    else
        myDate = new Date();

    if (plusSec)
        myDate.setSeconds(myDate.getSeconds() + plusSec);
    var newDate = setZero(myDate.getFullYear()) + "-";
    newDate += setZero((myDate.getMonth() + 1)) + "-";
    newDate += setZero(myDate.getDate()) + " ";
    newDate += setZero(myDate.getHours()) + ":";
    newDate += setZero(myDate.getMinutes()) + ":";
    newDate += setZero(myDate.getSeconds());
    return newDate;
}
function getTimeForRest() {
    var myDate = new Date();
    var newDate = setZero(myDate.getFullYear()) + "-";
    newDate += setZero((myDate.getMonth() + 1)) + "-";
    newDate += setZero(myDate.getDate()) + " ";
    newDate += setZero(myDate.getHours()) + ":";
    newDate += setZero(myDate.getMinutes()) + ":00";
    return newDate;
}
function setZero(time) {
    return time < 10 ? "0" + time : time;
}
function resultListSort(a, b) {
    return parseInt(b.CreateDateTimeStamp) - parseInt(a.CreateDateTimeStamp)
}
// create practical for menu on each count page
function practicalsInit(menu, practicalsBtn) {
    practicalsBtn.val("");
    practicalsBtn.text(loginJson.Result.mLanguage["MOBILEUSER_UNIT"]);
    var practicals = loginJson.Result.mPractical;
    $.each(practicals, function (index, item) {
        var menuItem = $("<span>").addClass("dropdown-item").text(item.Practical).val(item.Id);
        // add click event
        menuItem.click(function () {
            practicalsBtn.text($(this).text());
            practicalsBtn.val($(this).val());
            $("#txt_count_tabtype_increment,#txt_count_tabtype_edit_increment").trigger("touchspin.updatesettings", { postfix: $(this).text() })
        });
        menu.append(menuItem);
    });
}
// create alarm selection for count type method page
function alarmsInit(menu, alarmsSelectBtn) {
    var alarms = [{ code: "1310", name: "Sound 01" }, { code: "1331", name: "Sound 02" }, { code: "1313", name: "Sound 03" },
    { code: "1314", name: "Sound 04" }, { code: "1320", name: "Sound 05" }, { code: "1327", name: "Sound 06" },
    { code: "1328", name: "Sound 07" }, { code: "1335", name: "Sound 08" }, { code: "1336", name: "Sound 09" },
    { code: "1325", name: "Sound 10" },];
    $.each(alarms, function (index, item) {
        var menuItem = $("<span>").addClass("dropdown-item").text(item.name).val(item.code);
        // add click event
        menuItem.click(function () {
            alarmsSelectBtn.text($(this).text());
            alarmsSelectBtn.val($(this).val());
            loginJson.Result.mMobileSet.alarm = {
                code: $(this).val(),
                name: $(this).text()
            }
            playAlarm($(this).val(), "1");
        });
        menu.append(menuItem);
    });
}
var timeoutID = null;
function startAlarmTimer() {
    var timeLimit = loginJson.Result.mMobileSet.Time;
    var soundID = "1350"
    if (loginJson.Result.mMobileSet.alarm && loginJson.Result.mMobileSet.Notice == 1) {
        soundID = loginJson.Result.mMobileSet.alarm.code;
    }
    timeoutID = setTimeout(function () {
        playAlarm(soundID, "1");
        showMsg($("body"), "alarm", loginJson.Result.mMessage["WEB_MESSAGE2049"], 12000)
    }, timeLimit * 60 * 1000);
}
function playAlarm(soundCode, playTimes) {

    if (window.webkit) {
        window.webkit.messageHandlers.CallAlarm({
            "code": soundCode,
            "playTimes": playTimes
        });
    }
}
function playLocalAutio(fileName) {
    window.webkit.messageHandlers.PlayLocalAudio({
        "fileName": fileName
    });
}
function getTopPage() {
    return loginJson.Result.mMobileSet.Horizontal == "1" ? "page_top" : "page_top_h";
}
function getTopEditPage() {
    return loginJson.Result.mMobileSet.Horizontal == "1" ? "page_top_edit" : "page_top_h_edit";
}

//todo show count page
function showCountPage(pageToHide) {
    var inputType = loginJson.Result.mMobileSet.InputType;
    switch (inputType) {
        case 1:
            pageNavigation(pageToHide, getTopPage());
            break;
        case 2:
            // pop input window
            pageNavigation(pageToHide, "page_count_numtype");
            setCountNumTypeValue(callback);
            break;
        case 3:
            // pop input window
            pageNavigation(pageToHide, "page_count_tabtype");
            setCountTabTypeValue(callback);
            break;
        case 4:
            // pop input window
            pageNavigation(pageToHide, "page_count_scantype");
            setCountScanTypeValue(callback);
            break;
        default:
            break
    }
    function callback(data) {
        if (inputType == 4) {
            currentResult.ScanKeyNo = data.ScanKeyNo;
        } else if (inputType != 1) {
            currentResult.Number = parseInt(data.Number);
            currentResult.Practical = data.Practical;
            currentResult.mPractical_Id = parseInt(data.mPractical_Id);
        }
        currentResult.InputType = inputType;
    }
}
function showBackDrop() {
    mApp.blockPage({
        overlayColor: '#000000',
        type: 'loader',
        state: 'primary',
        message: '',
        opacity: 0.5
    });
}
function hideBackDrop() {
    mApp.unblockPage();
}
function voiceTotext(resultText) {
    var div_voice_tost = $("#div_voice_tost")
    div_voice_tost.text(resultText)
    div_voice_tost.show();
    div_voice_tost.fadeOut(2000);
    // match workkbn white list
    if ($("#page_top").is(":visible") || $("#page_top_h").is(":visible")) {
        var displayPage = $("#page_top").is(":visible") ? "#page_top" : "#page_top_h";
        $.each(loginJson.Result.mWhiteList, function (index, item) {
            if (resultText == item.SimilarName) {
                $(displayPage + " .btn_top[topId=" + item.mWorkKbn_Id + "]").click();
                return false;
            }
        });
    }
}
//set end times for each scan result by tempScanTime
function setEndTimeForScanResults() {
    if (tempScanResultList.length > 0) {
        var scanEndTimeMark = getTime(tempScanResultList[0].StartDateTime.replace('-', '/').replace('-', '/'), tempScanTime);
        var tempIndex = 0
        $.each(tempScanResultList, function (index, item) {
            if (item.StartDateTime > scanEndTimeMark) {
                for (i = index - 1; i >= tempIndex; i--) {
                    tempScanResultList[i].EndDateTime = item.StartDateTime;
                }
                tempIndex = index;
                scanEndTimeMark = getTime(item.StartDateTime.replace('-', '/').replace('-', '/'), tempScanTime);
            }
        });
        for (i = tempScanResultList.length - 1; i >= tempIndex; i--) {
            tempScanResultList[i].EndDateTime = currentResult.EndDateTime;
        }
    }
    return tempScanResultList
}
// show alert message
function showMessage(messageText) {
    txt_alert_message.text(messageText);
    div_alert.show();
    div_alert.fadeOut(3000);
}
//function saveCurrentResult(){
//    if(window.webkit)
//    {
//        window.webkit.messageHandlers.SaveCurrentPageInfo({"currentResult":JSON.stringify(currentResult),"loginJson":JSON.stringify(loginJson)});
//    }
//}
// page init when reactived
//function reactivePage(reactivedLoginJson,reactivedCurrentResult,reactivedCurrentCustomer){
//    if(reactivedLoginJson && reactivedLoginJson!=""){
//        getLocalSettingsInfo(reactivedLoginJson);
//    }
//    if(reactivedCurrentResult && reactivedCurrentResult!=""){
//        currentResult = reactivedCurrentResult;
//    }
//    if(reactivedCurrentCustomer && reactivedCurrentCustomer!=""){
//        currentCustomer = reactivedCurrentCustomer;
//    }
//}
function showLoginPage() {
    $("#page_login").fadeIn();
}
function showConfirmBox(message, onOK) {
    $("#div_results_alert").find("strong").html(message);
    $("#div_results_alert").slideDown();
    if (typeof onOK == "function") {
        $("#btn_results_alert_del").unbind("click").click(function () {
            onOK();
            $("#div_results_alert").slideUp();
        });
    }
}
function getCustomersObjByJson() {
    var customersObj = {};
    $.each(loginJson.Result.mCustomer, function (index, item) {
        customersObj[item.Id] = item.CustomerName;
    });
    return customersObj;
}
$(function () {

});
