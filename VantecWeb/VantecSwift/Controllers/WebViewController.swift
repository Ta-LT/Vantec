//
//  WebViewController.swift
//  VantecSwift
//
//  Created by technoalliance on 2018/2/1.
//  Copyright © 2018年 technoalliance. All rights reserved.
//

import UIKit
import WebKit
import AudioToolbox

class WebViewController: UIViewController,URLSessionDelegate {
    @IBOutlet weak var webView: WebView!
    let fw = framework.Shared
    var voice : VoiceToText? = nil
    override func viewDidLoad() {
        super.viewDidLoad()
        self.automaticallyAdjustsScrollViewInsets = false
        setWebView()
        addNotification()
    }
    func setWebView(){
        // 配置webView样式
        var config = WkwebViewConfig()
        config.isShowScrollIndicator = false
        config.isProgressHidden = false
        // 加载本地URL
        config.scriptMessageHandlerArray = ["LoginClick","LogoutClick","SettingsChanged","GetLocalSettings","WorkStart","WorkEnd","DailyOutputClick","ChangeRotation","ShowResultsList","SendResultsToServer","DeleteResults","RememberID","CallAlarm","SaveCurrentPageInfo","PlayLocalAudio"]
        webView.webConfig = config
        webView.delegate = self
        webView.webloadType(self, .HTMLName(name: "index"))
        // Do any additional setup after loading the view.
    }
    func addNotification(){
        // add NotificationCenter when ApplicationDidEnterBackground
        NotificationCenter.default.addObserver(self, selector: #selector(self.appDidEnterBackground), name: NSNotification.Name.UIApplicationDidEnterBackground, object: nil)
    }
    @objc func appDidEnterBackground(notification:NSNotification){
        //self.webView.run_JavaScript(javaScript: "saveCurrentResult()")
    }
    func getResultTextFromVoice(result:String){
        self.webView.run_JavaScript(javaScript: "voiceTotext(`\(result)`)")
    }
    func updateLocalResultList(userId:String,tMeasuresList:[TMeasures]){
        let localData = LocalDataHelper.getLocalDataByKey(key:userId+"_localResults")
        var localResults:[TMeasures] = [TMeasures]()
        if(localData != nil){
            localResults = JsonHelper.ToObject(localData as! String)
            var localResultIndex = localResults.count-1
            for localResult in localResults.reversed(){
                for result in tMeasuresList {
                    if(result.CreateDateTimeStamp ==  localResult.CreateDateTimeStamp){
                        localResults.remove(at: localResultIndex)
                        break
                    }
                }
                localResultIndex = localResultIndex-1
            }
            LocalDataHelper.setLocalDataByKey(key: userId+"_localResults", value: JsonHelper.ToJson(localResults) as AnyObject)
        }
    }
}
extension WebViewController:WKWebViewDelegate{
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        // start speech
        voice = VoiceToText(getResultText: getResultTextFromVoice)
        voice?.start()
        // fill user id when rememberID is checked
        let userName = LocalDataHelper.getLocalDataByKey(key: "rememberedId")
        if(userName != nil){
            self.webView.run_JavaScript(javaScript: "setUserId('\(userName as! String)')")
        }
        //set version
        self.webView.run_JavaScript(javaScript: "setVersion('\(Bundle.main.infoDictionary!["CFBundleShortVersionString"] as! String)')")
        //reactive page
        /*
        let currentResultLocal = LocalDataHelper.getLocalDataByKey(key:"currentResult")
        let currentCustomerLocal = LocalDataHelper.getLocalDataByKey(key:"currentCustomer")
        let loginJsonLocal = LocalDataHelper.getLocalDataByKey(key:"loginJson")
        if(loginJsonLocal != nil){
            var currentResult = "''"
            var loginJson = "''"
            var currentCustomer = "''"
            
            loginJson = loginJsonLocal as! String
            
            if(currentResultLocal != nil){
                currentResult = currentResultLocal as! String
            }
            
            if(currentCustomerLocal != nil){
                currentCustomer = currentCustomerLocal as! String
            }
            self.webView.run_JavaScript(javaScript: "reactivePage("+loginJson+","+currentResult+","+currentCustomer+")")
        }else{
 */
            self.webView.run_JavaScript(javaScript: "showLoginPage()")
        //}
    }
    func webViewUserContentController(_ scriptMessageHandlerArray: [String], didReceive message: WKScriptMessage) {
        //recived js call from page
        // for test
        let deviceRotationControl = DeviceRotationControl.Shared
        switch message.name {
        case "LoginClick":
            // do after login clicked
            var userInfo = message.body
            
            func postSucess(result:String){
                self.webView.run_JavaScript(javaScript: "getLocalSettingsInfo("+result+")")
            }
            func postError(error:Error){
                self.webView.run_JavaScript(javaScript: "loginClicked(true)")
            }
            fw.UserLogin(userInfo: userInfo as! String, success: postSucess, failure: postError)
            break
        case "LogoutClick":
//            LocalDataHelper.removeLocalDataByKey(key: "currentResult")
//            LocalDataHelper.removeLocalDataByKey(key: "currentCustomer")
//            LocalDataHelper.removeLocalDataByKey(key: "loginJson")
            deviceRotationControl.portrait()
            break
        case "SettingsChanged":
            let dic = message.body as! Dictionary<String, AnyObject>
            let settingsInfo = dic["settingsInfo"]
            let userId = dic["userId"]
            LocalDataHelper.setLocalDataByKey(key: userId! as! String, value: settingsInfo)
            voice?.start()//音声識別再開する
            break
        case "GetLocalSettings":
            //let userId = message.body as! String
            let dic = message.body as! Dictionary<String, String>
            let userId = dic["userId"]
            fw.httpHelper.httpToken = dic["token"]!
            let localData = LocalDataHelper.getLocalDataByKey(key: userId!)
            var settingsInfo = "''"
            if(localData != nil){
                settingsInfo = localData as! String
            }
            self.webView.run_JavaScript(javaScript: "init("+settingsInfo+",false)")
            break
        case "WorkStart":
            StepCounter.Shared.startPedometerUpdates()
            // todo upload new result to server
            let dic = message.body as! Dictionary<String, String>
            let newResultList = dic["newResultList"]
            let autoSendDataFlg = dic["Transmission"]
            func postSucess(result:String){
                let tMeasuresInfo:TMeasuresInfo = JsonHelper.ToObject(result)
                self.webView.run_JavaScript(javaScript: "workStartCallback("+JsonHelper.ToJson(tMeasuresInfo.Result)+")")
            }
            func postError(error:Error){
                self.webView.run_JavaScript(javaScript: "workStartCallback("+newResultList!+")")
            }
            if(autoSendDataFlg == "1"){
                fw.SendNewResultToServer(newResult: newResultList!, success: postSucess, failure: postError)
            }else{
                self.webView.run_JavaScript(javaScript: "workStartCallback("+newResultList!+")")
            }
            break
        case "WorkEnd":
            let stepsCount = StepCounter.Shared.stopPedometerUpdates()
            //
            let dic = message.body as! Dictionary<String, String>
            let endResult = dic["data"]
            let userId = dic["mAccount_Id"]
            let autoSendDataFlg = dic["Transmission"]
            var tMeasuresList:[TMeasures] = JsonHelper.ToObject(endResult!)
            // set step count
            for i in 0..<tMeasuresList.count
            {
                tMeasuresList[i].Steps = stepsCount as? Int32
            }
            
            func postSucess(result:String){
                //var rr = result
            }
            func postError(error:Error){
                // save result data to locallist
                saveResultToLocal()
            }
            func saveResultToLocal(){
                let localData = LocalDataHelper.getLocalDataByKey(key:userId!+"_localResults")
                var localResults:[TMeasures] = [TMeasures]()
                if(localData != nil){
                    localResults = JsonHelper.ToObject(localData as!String)
                }
                
                for i in 0..<tMeasuresList.count
                {
                    tMeasuresList[i].StatusCode = 0
                    localResults.append(tMeasuresList[i])
                }
                LocalDataHelper.setLocalDataByKey(key: userId!+"_localResults", value: JsonHelper.ToJson(localResults) as AnyObject)
                self.webView.run_JavaScript(javaScript: "workEndCallback("+endResult!+")")
            }
            if(autoSendDataFlg == "1"){
                fw.SendNewResultToServer(newResult: JsonHelper.ToJson(tMeasuresList), success: postSucess, failure: postError)
            }else{
                saveResultToLocal()
            }
            break
        case "ShowResultsList":
            let dic = message.body as! Dictionary<String, String>
            let workDate = dic["WorkDate"]
            let userId = dic["mAccount_Id"]
            let localData = LocalDataHelper.getLocalDataByKey(key:userId!+"_localResults")
            var resultsToShow:[TMeasures] = [TMeasures]()
            if(localData != nil){
                resultsToShow = JsonHelper.ToObject(localData as! String)
            }
            func getSucess(result:String){
                let tMeasuresInfo:TMeasuresInfo = JsonHelper.ToObject(result)
                resultsToShow = resultsToShow + tMeasuresInfo.Result!
                self.webView.run_JavaScript(javaScript: "showResultsListCallback("+JsonHelper.ToJson(resultsToShow)+")")
            }
            func getError(error:Error){
                self.webView.run_JavaScript(javaScript: "showResultsListCallback("+JsonHelper.ToJson(resultsToShow)+")")
            }
            fw.GetTMeasures(mAccount_id: userId!, WorkDate: workDate!, success: getSucess, failure: getError)
            break
        case "SendResultsToServer":
            
            let dic = message.body as! Dictionary<String, String>
            let resultForSendList = dic["data"]
            let userId = dic["mAccount_Id"]
            var tMeasuresList:[TMeasures] = JsonHelper.ToObject(resultForSendList!)
            
            func postSucess(result:String){
                let tMeasuresInfo:TMeasuresInfo = JsonHelper.ToObject(result)
                //delete selected result from locallist
                self.updateLocalResultList(userId:userId!,tMeasuresList:tMeasuresInfo.Result!)
                self.webView.run_JavaScript(javaScript: "sendResultsToServerCallback("+result+")")
            }
            func postError(error:Error){
                self.webView.run_JavaScript(javaScript: "sendResultsToServerCallback()")
            }
            fw.SendNewResultToServer(newResult: JsonHelper.ToJson(tMeasuresList), success: postSucess, failure: postError)
            break
        case "DeleteResults":
            let dic = message.body as! Dictionary<String, String>
            let resultListForDelete = dic["data"]
            let userId = dic["mAccount_Id"]
            var tMeasuresList:[TMeasures] = JsonHelper.ToObject(resultListForDelete!)
            var localResultForDeleteList = [TMeasures]()
            var resultForDeleteListOnServer = [TMeasures]()
            for tMeasure in tMeasuresList{
                if(tMeasure.StatusCode == 0){
                    localResultForDeleteList.append(tMeasure)
                }else{
                    resultForDeleteListOnServer.append(tMeasure)
                }
            }
            // remove results from locallist
            self.updateLocalResultList(userId:userId!,tMeasuresList:localResultForDeleteList)
            
            func postSucess(result:String){
                self.webView.run_JavaScript(javaScript: "removeResultsCallback("+result+")")
            }
            func postError(error:Error){
                self.webView.run_JavaScript(javaScript: "removeResultsCallback()")
            }
            // remove results from server
            fw.SendNewResultToServer(newResult: JsonHelper.ToJson(resultForDeleteListOnServer), success: postSucess, failure: postError)
            break
        case "RememberID":
            let dic = message.body as! Dictionary<String, String>
            let rememberIdFlg = dic["rememberIdFlg"]
            let userName = dic["userName"]
            if(rememberIdFlg == "true"){
                LocalDataHelper.setLocalDataByKey(key: "rememberedId", value: userName as AnyObject)
            }else{
                LocalDataHelper.removeLocalDataByKey(key: "rememberedId")
            }
            break
        case "CallAlarm":
            let dic = message.body as! Dictionary<String, String>
            let alarmCode = UInt32(dic["code"]!)
            let playTimes = Int(dic["playTimes"]!)
            //AudioServicesPlaySystemSound(UInt32(dic["code"]!)!)
            voice?.stop()
            func playCompletion(result:String){
                //voice?.start()
            }
            SoundPlayer.Shared.playSystemSound(soundID: alarmCode!, playTimes: playTimes!, completion: playCompletion)
            break
        case "DailyOutputClick":
            let dic = message.body as! Dictionary<String, String>
            let workDate = dic["WorkDate"]
            let userId = dic["mAccount_Id"]
            func getSucess(result:String){
                self.webView.run_JavaScript(javaScript: "dailyOutputCallback("+result+")")
            }
            func getError(error:Error){
                self.webView.run_JavaScript(javaScript: "dailyOutputCallback()")
            }
            fw.DailyOutput(mAccount_id: userId!, WorkDate: workDate!, success: getSucess, failure: getError)
            break
        case "ChangeRotation":
            let dic = message.body as! Dictionary<String, Any>
            if(dic["value"] as! String == "1"){
                deviceRotationControl.portrait()
            }else{
                deviceRotationControl.landscapeRight()
            }
            break
        case "SaveCurrentPageInfo":
            let dic = message.body as! Dictionary<String, String>
            let currentResult = dic["currentResult"]
            let currentCustomer = dic["currentCustomer"]
            let loginJson = dic["loginJson"]
            if(currentResult != nil){
                LocalDataHelper.setLocalDataByKey(key: "currentResult", value: currentResult as AnyObject)
            }
            if(currentCustomer != nil){
                LocalDataHelper.setLocalDataByKey(key: "currentCustomer", value: currentCustomer as AnyObject)
            }
            if(loginJson != nil)
            {
                LocalDataHelper.setLocalDataByKey(key: "loginJson", value: loginJson as AnyObject)
            }
            break
        case "PlayLocalAudio":
            let dic = message.body as! Dictionary<String, String>
            let fileName = dic["fileName"]!
            SoundPlayer.Shared.playLocalSound(fileName: fileName)
            break
        default:break
        }
        //print("key:\(dic["key"]) ,value:\(dic["value"])")
    }
}
