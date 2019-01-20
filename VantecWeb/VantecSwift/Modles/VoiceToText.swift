//
//  VoiceToTextNew.swift
//  VantecSwift
//
//  Created by technoalliance on 2018/4/8.
//  Copyright © 2018年 technoalliance. All rights reserved.
//

import Foundation
import Speech
import AVFoundation

class VoiceToText {
    fileprivate var recordRequest: SFSpeechAudioBufferRecognitionRequest?
    fileprivate var recordTask: SFSpeechRecognitionTask?
    fileprivate let audioEngine = AVAudioEngine()
    fileprivate lazy var recognizer: SFSpeechRecognizer = {//
        let recognize = SFSpeechRecognizer(locale: Locale(identifier: "ja-JP"))
        //recognize?.delegate = self as! SFSpeechRecognizerDelegate
        return recognize!
    }()
    fileprivate var recordTimer:Timer!// timer for speech text
    fileprivate var reportTimer:Timer!// timer for report
    fileprivate var getResultText:((_ resultText:String) -> ())// return text for speech context
    fileprivate var resultText:String!
    
    init(getResultText: @escaping ((_ resultText: String) -> ())) {
        self.getResultText = getResultText
    }
}
extension VoiceToText{
    func start() {
        //self.addSpeechRecordLimit()
        startRecognize()
        reportTimerStart();
    }
    func stop(){
        reportTimer.fireDate = Date.distantFuture
        stopRecognize()
    }
}
extension VoiceToText{
    fileprivate func reportTimerStart(){
        if reportTimer == nil{
            reportTimer = Timer.scheduledTimer(timeInterval: 2.0, target: self, selector: #selector(reportIntervalx), userInfo: nil, repeats: true)
        }else{
            reportTimer.fireDate = Date.distantPast
        }
        
    }
    @objc func reportIntervalx(){
        //var availabe:Bool = false
        //self.speechRecognizer(recognizer, availabilityDidChange: availabe)
        if(recordTask != nil && ((recordTask?.isFinishing)! || (recordTask?.state.rawValue != 1))){
            startRecognize()
        }
        print("isFinishing:\(recordTask?.isFinishing) status:\(recordTask?.state.rawValue)")
    }
    fileprivate func recordTimerStart(){
        if recordTimer == nil{
            recordTimer = Timer.scheduledTimer(timeInterval: 1.0, target: self, selector: #selector(recordIntervalx), userInfo: nil, repeats: true)
        }
    }
    @objc func recordIntervalx(){
        stopRecognize()
        recordTimer?.invalidate()
        recordTimer = nil
        //self.getResultText(changeToKatakanaString(str: self.resultText))
        self.getResultText(self.resultText)
        startRecognize()
    }
    //开始识别
    fileprivate func startRecognize(){
        //1. 停止当前任务
        stopRecognize()
        
        //2. 创建音频会话
        let session = AVAudioSession.sharedInstance()
        do{
            try session.setCategory(AVAudioSessionCategoryRecord)
            try session.setMode(AVAudioSessionModeMeasurement)
            //激活Session
            try session.setActive(true, with: .notifyOthersOnDeactivation)
        }catch{
            print("Throws：\(error)")
        }
        
        //3. 创建识别请求
        recordRequest = SFSpeechAudioBufferRecognitionRequest()
        recordRequest?.shouldReportPartialResults = true
        let inputNode = audioEngine.inputNode
        //开始识别获取文字
        recordTask = recognizer.recognitionTask(with: recordRequest!, resultHandler: { (result, error) in
            if result != nil {
                self.recordTimerStart()
                self.resultText = (result?.bestTranscription.formattedString)!
                if error != nil {
                    self.recordIntervalx()
                }
            }
        })
        let recordFormat = inputNode.outputFormat(forBus: 0)
        inputNode.installTap(onBus: 0, bufferSize: 2048, format: recordFormat, block: { (buffer, time) in
            self.recordRequest?.append(buffer)
        })
        audioEngine.prepare()
        do {
            try audioEngine.start()
        } catch {
            print("Throws：\(error)")
        }
    }
    
    //停止识别
    fileprivate func stopRecognize(){
        if recordTask != nil{
            recordTask?.cancel()
            recordTask = nil
        }
        removeTask()
    }
    
    //销毁录音任务
    fileprivate func removeTask(){
        self.audioEngine.stop()
        audioEngine.inputNode.removeTap(onBus: 0)
        self.recordRequest = nil
        self.recordTask = nil
    }
    func changeToKatakanaString(str: String) -> String {
        
        let inputText = str as NSString
        
        let outputText = NSMutableString()
        
        var range: CFRange = CFRangeMake(0, inputText.length)
        let locale: CFLocale = CFLocaleCopyCurrent()
        
        /* トークナイザーを作成 */
        let tokenizer: CFStringTokenizer = CFStringTokenizerCreate(kCFAllocatorDefault, inputText as CFString, range, kCFStringTokenizerUnitWordBoundary, locale)
        
        
        /* 最初の位置に */
        var tokenType: CFStringTokenizerTokenType = CFStringTokenizerGoToTokenAtIndex(tokenizer, 0)
        
        /* 形態素解析 */
        while tokenType.rawValue != 0 {
            dump(tokenType)
            range = CFStringTokenizerGetCurrentTokenRange(tokenizer)
            
            /* ローマ字を得る */
            let latin: CFTypeRef = CFStringTokenizerCopyCurrentTokenAttribute(tokenizer, kCFStringTokenizerAttributeLatinTranscription)
            
            let romaji = latin as! NSString
            
            /* カタカナに変換 */
            let furigana: NSMutableString = romaji.mutableCopy() as! NSMutableString
            CFStringTransform(furigana as CFMutableString, nil, kCFStringTransformLatinKatakana, false)
            
            outputText.append(furigana as String)
            tokenType = CFStringTokenizerAdvanceToNextToken(tokenizer)
        }
        
        return outputText as String
    }
}
