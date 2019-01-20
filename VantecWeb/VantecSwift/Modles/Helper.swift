//
//  Helper.swift
//  VantecSwift
//
//  Created by technoalliance on 2018/2/22.
//  Copyright © 2018年 technoalliance. All rights reserved.
//

import Foundation
public class HttpHelper:NSObject,URLSessionDelegate{
    //单例
    public static var Shared=HttpHelper();
    public var httpToken = ""
    // MARK:- get请求
    func Get(path: String,success: @escaping ((_ result: String) -> ()),failure: @escaping ((_ error: Error) -> ())) {
        
        let url = URL(string: path.addingPercentEncoding(withAllowedCharacters: CharacterSet.urlQueryAllowed)!)
        var request = URLRequest.init(url: url!)
        request.httpMethod = "GET"
        request.setValue("application/json; charset=utf-8", forHTTPHeaderField: "Content-Type")
        request.setValue(httpToken, forHTTPHeaderField: "access_token")
        
        let sessionConfig = URLSessionConfiguration.default
        sessionConfig.timeoutIntervalForRequest = 10
        let session = URLSession(configuration: sessionConfig, delegate:self, delegateQueue: OperationQueue.main)
        
        let dataTask = session.dataTask(with: request) { (data, respond, error) in
            
            if let data = data {
                
                if let result = String(data:data,encoding:.utf8){
                    
                    success(result)
                }
            }else {
                
                failure(error!)
            }
        }
        dataTask.resume()
    }
    
    
    // MARK:- post请求
    func Post(path: String,paras: String,success: @escaping ((_ result: String) -> ()),failure: @escaping ((_ error: Error) -> ())) {
        
        let url = URL(string: path)
        var request = URLRequest.init(url: url!)
        request.httpMethod = "POST"
        request.setValue("application/json; charset=utf-8", forHTTPHeaderField: "Content-Type")
        request.setValue(httpToken, forHTTPHeaderField: "access_token")
        request.httpBody = paras.data(using: .utf8)
        
        let sessionConfig = URLSessionConfiguration.default
        sessionConfig.timeoutIntervalForRequest = 10
        let session = URLSession(configuration: sessionConfig, delegate: self, delegateQueue: OperationQueue.main)
        let dataTask = session.dataTask(with: request) { (data, respond, error) in
            
            if let data = data {
                
                if let result = String(data:data,encoding:.utf8){
                    success(result)
                }
                
            }else {
                failure(error!)
            }
        }
        dataTask.resume()
    }
    public func urlSession(_ session: URLSession, didReceive challenge: URLAuthenticationChallenge, completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void) {
        completionHandler(URLSession.AuthChallengeDisposition.useCredential,URLCredential(trust:challenge.protectionSpace.serverTrust!))
    }
}
class JsonHelper {
    static func ToJson<T:Codable>(_ obj:T) -> String {
        let encoder=JSONEncoder();
        let data=try! encoder.encode(obj)
        let str=String(data:data,encoding:.utf8)!
        return str
    }
    static func ToObject<T:Codable>(_ data:String) -> T{
        let decoder=JSONDecoder();
        let obj=try! decoder.decode(T.self, from: data.data(using: .utf8)!)
        return obj;
    }
}
// ローカルデータの処理
class LocalDataHelper {
    //データ登録
    static func setLocalDataByKey(key:String, value:AnyObject?){
        if value == nil {
            UserDefaults.standard.removeObject(forKey: key)
        }
        else{
            UserDefaults.standard.set(value, forKey: key)
            // 同調
            UserDefaults.standard.synchronize()
        }
    }
    //データ削除
    static func removeLocalDataByKey(key:String?){
        if key != nil {
            UserDefaults.standard.removeObject(forKey: key!)
            UserDefaults.standard.synchronize()
        }
    }
    //データ取得
    static func getLocalDataByKey(key:String)->AnyObject?{
        return UserDefaults.standard.value(forKey: key) as AnyObject?
    }
}
