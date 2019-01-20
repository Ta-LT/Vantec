//
//  framework.swift
//  VantecSwift
//
//  Created by technoalliance on 2018/2/6.
//  Copyright © 2018年 technoalliance. All rights reserved.
//

import Foundation
public class framework{
    
    public static var Shared = framework();
    
    let httpHelper = HttpHelper.Shared
//    let serverUrl = "http://192.168.1.35:8070/api/"
//    let serverUrl = "http://ec2-54-199-248-151.ap-northeast-1.compute.amazonaws.com:8089/api/"
    let serverUrl = "https://timebird.vantec-gl.com:8443/api/"//本番
//    let serverUrl = "https://timebird.vantec-gl.com:7443/api/"//テスト
    //ログイン
    func UserLogin(userInfo:String,success: @escaping ((_ result: String) -> ()),failure: @escaping ((_ error: Error) -> ())){
        //var jsonData = JsonHelper.ToJson(userInfo)
        let url = serverUrl + "Login"
        httpHelper.Post(path: url, paras: userInfo, success: success, failure: failure)
    }
    //作業実績送信
    func SendNewResultToServer(newResult:String,success: @escaping ((_ result: String) -> ()),failure: @escaping ((_ error: Error) -> ())){
        let url = serverUrl + "UpdateTMeasures"
        httpHelper.Post(path: url, paras: newResult, success: success, failure: failure)
    }
    //作業実績取得
    func GetTMeasures(mAccount_id:String,WorkDate:String,success: @escaping ((_ result: String) -> ()),failure: @escaping ((_ error: Error) -> ())){
        var url = serverUrl + "GetTMeasures/"
        url += mAccount_id + "/"
        url += WorkDate
        httpHelper.Get(path: url, success: success, failure: failure)
    }
    //日報出力
    func DailyOutput(mAccount_id:String,WorkDate:String,success: @escaping ((_ result: String) -> ()),failure: @escaping ((_ error: Error) -> ())){
        var url = serverUrl + "PrintReport/"
        url += mAccount_id + "/"
        url += WorkDate
        httpHelper.Get(path: url, success: success, failure: failure)
    }
}
