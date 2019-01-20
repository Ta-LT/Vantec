//
//  SoundPlayer.swift
//  VantecSwift
//
//  Created by technoalliance on 2018/3/6.
//  Copyright © 2018年 technoalliance. All rights reserved.
//

import Foundation
import AudioToolbox
import AVFoundation

class SoundPlayer{
    public static var Shared=SoundPlayer();
    var avPlayer:AVAudioPlayer? = nil
    func playSystemSound(soundID:SystemSoundID,playTimes:Int,completion: @escaping ((_ result: String) -> ()))  {
        let audioSession = AVAudioSession.sharedInstance()
        do {
            try audioSession.setCategory(AVAudioSessionCategoryAmbient)
            //try audioSession.setMode(AVAudioSessionModeMeasurement)
            //try audioSession.setActive(true, with: .notifyOthersOnDeactivation)
        } catch {
            print("audioSession properties weren't set because of an error.")
        }
        playSound(soundID:soundID,playTimes: playTimes,completion:completion)
    }
    
    func playSound(soundID:SystemSoundID,playTimes:Int,completion: @escaping ((_ result: String) -> ())){
        AudioServicesPlaySystemSoundWithCompletion(soundID, {
            var count = playTimes - 1
            if(count>0)
            {
                self.playSound(soundID:soundID,playTimes: count, completion: completion)
            }else{
                completion("")
                AudioServicesDisposeSystemSoundID(soundID)
            }
        })
    }
    func playLocalSound(fileName:String){
        let file = Bundle.main.path(forResource: fileName, ofType: "mp3", inDirectory: nil)
        let url = NSURL(fileURLWithPath: file!)
        let audioSession = AVAudioSession.sharedInstance()
        do {
            try audioSession.setCategory(AVAudioSessionCategoryAmbient)
        } catch {
            print("audioSession properties weren't set because of an error.")
        }
        do{
            self.avPlayer = try AVAudioPlayer.init(contentsOf: url as URL)
            if(self.avPlayer != nil){
                self.avPlayer?.prepareToPlay()
                self.avPlayer?.volume = audioSession.outputVolume
                self.avPlayer?.play()
            }
        }catch {
            print("audio error")
        }
    }
}
