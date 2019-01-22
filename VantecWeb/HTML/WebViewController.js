
class WebViewController {
    constructor() {
        this.fw = framework.Shared;
        this.deviceRotationControl = {
            portrait: function () { },
            landscapeRight: function () { }
        };
        this.setWebView();
    }
    setWebView() {
        // 配置webView样式
        var config = {};
        config.isShowScrollIndicator = false;
        config.isProgressHidden = false;
        // 加载本地URL
        config.scriptMessageHandlerArray = ["LoginClick", "LogoutClick", "SettingsChanged", "GetLocalSettings", "WorkStart", "WorkEnd", "DailyOutputClick", "ChangeRotation", "ShowResultsList", "SendResultsToServer", "DeleteResults", "RememberID", "CallAlarm", "SaveCurrentPageInfo", "PlayLocalAudio"];
        this.webConfig = config;

        let userName = LocalDataHelper.getLocalDataByKey("rememberedId");
        if (userName) {
            setUserId(userName);
        }
        //set version
        setVersion('Ver 2.0');
        showLoginPage();
    }
    updateLocalResultList(userId, tMeasuresList) {
        let localData = LocalDataHelper.getLocalDataByKey(userId + "_localResults");
        var localResults = localData;
        var localResultsToReturn = [];
        if (localData) {
            var localResultIndex = localResults.length - 1
            for (localResult in localResults.reverse()) {
                for (result in tMeasuresList) {
                    if (result.CreateDateTimeStamp && localResult.CreateDateTimeStamp &&
                        result.CreateDateTimeStamp != localResult.CreateDateTimeStamp) {
                        localResultsToReturn.push(localResult);
                        break
                    }
                }
                localResultIndex = localResultIndex - 1
            }
            LocalDataHelper.setLocalDataByKey(userId + "_localResults", localResultsToReturn);
        }
    }
    LoginClick(message) {
        // do after login clicked
        var userInfo = message;

        var postSucess = function (result) {
            getLocalSettingsInfo(result);
        }
        var postError = function (error) {
            loginClicked(true);
        }
        this.fw.UserLogin(userInfo, postSucess, postError);
    }
    LogoutClick(message) {
        //LocalDataHelper.removeLocalDataByKey(key: "currentResult")
        //LocalDataHelper.removeLocalDataByKey(key: "currentCustomer")
        //LocalDataHelper.removeLocalDataByKey(key: "loginJson")
        this.deviceRotationControl.portrait();
    }
    SettingsChanged(message) {
        let dic = message;
        let settingsInfo = dic["settingsInfo"]
        let userId = dic["userId"]
        LocalDataHelper.setLocalDataByKey(userId, settingsInfo);
    }
    GetLocalSettings(message) {
        //let userId = message.body as! String
        let dic = message;
        let userId = dic["userId"];
        this.fw.httpHelper.httpToken = dic["token"];
        let localData = LocalDataHelper.getLocalDataByKey(userId);
        var settingsInfo = "''"
        if (localData) {
            settingsInfo = localData;
        }
        init(settingsInfo, false);
    }
    WorkStart(message) {
        // todo upload new result to server
        let dic = message;
        let newResultList = dic["newResultList"]
        let autoSendDataFlg = dic["Transmission"]
        var postSucess = function (result) {
            let tMeasuresInfo = result;
            workStartCallback(tMeasuresInfo.Result);
        }
        var postError = function (error) {
            workStartCallback(newResultList);
        }
        if (autoSendDataFlg == "1") {
            fw.SendNewResultToServer(newResultList, postSucess, postError);
        } else {
            workStartCallback(newResultList);
        }
    }
    WorkEnd(message) {
        let stepsCount = 0;//StepCounter.Shared.stopPedometerUpdates()
        //
        let dic = message;
        let endResult = dic["data"];
        let userId = dic["mAccount_Id"];
        let autoSendDataFlg = dic["Transmission"];
        var tMeasuresList = endResult;
        // set step count
        $.each(tMeasuresList, function (tmIndex, tmItem) {
            tmItem.Steps = stepsCount;
        })

        var postSucess = function (result) {
            //var rr = result
        }
        var postError = function (error) {
            // save result data to locallist
            saveResultToLocal();
        }
        var saveResultToLocal = function () {
            let localData = LocalDataHelper.getLocalDataByKey(userId + "_localResults")
            var localResults = localData;

            $.each(tMeasuresList, function (tmIndex, tmItem) {
                tmItem.StatusCode = 0;
                localResults.push(tmItem);
            });
            LocalDataHelper.setLocalDataByKey(userId + "_localResults", localResults);
            workEndCallback(endResult);
        }
        if (autoSendDataFlg == "1") {
            fw.SendNewResultToServer(tMeasuresList, postSucess, postError);
        } else {
            saveResultToLocal();
        }
    }
    ShowResultsList(message) {
        let dic = message;
        let workDate = dic["WorkDate"];
        let userId = dic["mAccount_Id"];
        let localData = LocalDataHelper.getLocalDataByKey(userId + "_localResults");
        var resultsToShow = localData;
        var getSucess = function (result) {
            let tMeasuresInfo = result;
            resultsToShow = resultsToShow + tMeasuresInfo.Result;
            showResultsListCallback(resultsToShow);
        }
        var getError = function (error) {
            showResultsListCallback(resultsToShow);
        }
        fw.GetTMeasures(userId, workDate, getSucess, getError);
    }
    SendResultsToServer(message) {
        let dic = message;
        let resultForSendList = dic["data"];
        let userId = dic["mAccount_Id"];
        var tMeasuresList = resultForSendList;

        var postSucess = function (result) {
            let tMeasuresInfo = result;
            //delete selected result from locallist
            this.updateLocalResultList(userId, tMeasuresInfo.Result);
            sendResultsToServerCallback(result);
        }
        var postError = function (error) {
            sendResultsToServerCallback();
        }
        fw.SendNewResultToServer(tMeasuresList, postSucess, postError);
    }
    DeleteResults(message) {
        let dic = message;
        let resultListForDelete = dic["data"];
        let userId = dic["mAccount_Id"];
        var tMeasuresList = resultListForDelete;
        var localResultForDeleteList = [];
        var resultForDeleteListOnServer = [];
        for (tMeasure in tMeasuresList) {
            if (tMeasure.StatusCode == 0) {
                localResultForDeleteList.push(tMeasure);
            } else {
                resultForDeleteListOnServer.push(tMeasure);
            }
        }
        // remove results from locallist
        this.updateLocalResultList(userId, localResultForDeleteList);

        var postSucess = function (result) {
            removeResultsCallback(result);
        }
        var postError = function (error) {
            removeResultsCallback();
        }
        // remove results from server
        fw.SendNewResultToServer(resultForDeleteListOnServer, postSucess, postError);
    }
    RememberID(message) {
        let dic = message;
        let rememberIdFlg = dic["rememberIdFlg"];
        let userName = dic["userName"];
        if (rememberIdFlg == "true") {
            LocalDataHelper.setLocalDataByKey("rememberedId", userName);
        } else {
            LocalDataHelper.removeLocalDataByKey("rememberedId");
        }
    }
    CallAlarm(message) {
        let dic = message;
        let alarmCode = dic["code"];
        let playTimes = dic["playTimes"];
        //SoundPlayer.Shared.playSystemSound(soundID: alarmCode!, playTimes: playTimes!, completion: playCompletion);
        $("#mainalarm").attr("src", "./Audio/ok.mp3");
        $("#mainalarm")[0].play();
    }
    DailyOutputClick(message) {
        let dic = message;
        let workDate = dic["WorkDate"];
        let userId = dic["mAccount_Id"];
        var getSucess = function (result) {
            dailyOutputCallback(result);
        }
        var getError = function (error) {
            dailyOutputCallback();
        }
        fw.DailyOutput(userId, workDate, getSucess, getError);
    }
    ChangeRotation(message) {
        let dic = message;
        if (dic["value"] == "1") {
            this.deviceRotationControl.portrait()
        } else {
            this.deviceRotationControl.landscapeRight()
        }
    }
    SaveCurrentPageInfo(message) {
        let dic = message;
        let currentResult = dic["currentResult"];
        let currentCustomer = dic["currentCustomer"];
        let loginJson = dic["loginJson"];
        if (currentResult) {
            LocalDataHelper.setLocalDataByKey("currentResult", currentResult);
        }
        if (currentCustomer) {
            LocalDataHelper.setLocalDataByKey("currentCustomer", currentCustomer);
        }
        if (loginJson) {
            LocalDataHelper.setLocalDataByKey("loginJson", loginJson);
        }
    }
    PlayLocalAudio(message) {
        let dic = message;
        let fileName = dic["fileName"];
        $("#mainalarm").attr("src", "./Audio/" + fileName);
        $("#mainalarm")[0].play();
    }
}
class LocalDataHelper {
    //データ登録
    static setLocalDataByKey(key, value) {
        $.data(document, key, value);
    }
    //データ削除
    static removeLocalDataByKey(key) {
        $.data(document, key, undefined);
    }
    //データ取得
    static getLocalDataByKey(key) {
        return $.data(document, key);
    }
}
