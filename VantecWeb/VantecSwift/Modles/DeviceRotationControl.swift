//
//  DeviceRotationControl.swift
//  VantecSwift
//
//  Created by technoalliance on 2018/3/29.
//  Copyright © 2018年 technoalliance. All rights reserved.
//
import UIKit
import Foundation
public class DeviceRotationControl {
    public static var Shared = DeviceRotationControl();
    private let appDeledate = UIApplication.shared.delegate as! AppDelegate
    func landscapeLeft (){
        appDeledate.isLandscape = true;
        if(UIDevice.current.orientation.isLandscape){
            UIDevice.current.setValue(UIInterfaceOrientation.portrait.rawValue, forKey: "orientation")
        }
        UIDevice.current.setValue(UIInterfaceOrientation.landscapeLeft.rawValue, forKey: "orientation")
    }
    func landscapeRight (){
        appDeledate.isLandscape = true;
        if(UIDevice.current.orientation.isLandscape){
            UIDevice.current.setValue(UIInterfaceOrientation.portrait.rawValue, forKey: "orientation")
        }
        UIDevice.current.setValue(UIInterfaceOrientation.landscapeRight.rawValue, forKey: "orientation")
    }
    func portrait(){
        appDeledate.isLandscape = false;
        if(UIDevice.current.orientation.isPortrait){
            UIDevice.current.setValue(UIInterfaceOrientation.landscapeRight.rawValue, forKey: "orientation")
        }
        UIDevice.current.setValue(UIInterfaceOrientation.portrait.rawValue, forKey: "orientation")
    }
}
