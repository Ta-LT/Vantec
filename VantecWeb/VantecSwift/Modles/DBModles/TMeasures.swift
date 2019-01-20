//
//  TMeasures.swift
//  VantecSwift
//
//  Created by technoalliance on 2018/4/4.
//  Copyright © 2018年 technoalliance. All rights reserved.
//

import Foundation

struct TMeasuresInfo:Codable {
    var Token:String?
    var ReturnCode:Int?
    var Message:String?
    var Result:[TMeasures]?
}
struct TMeasures : Codable {
    var Id:Int32?
    var mAccount_Id:Int32?
    var StartDateTime:String?
    var EndDateTime:String?
    var Time:Int32?
    var Steps:Int32?
    var FacilityName:String?
    var mWorkKbn_Id:Int32?
    var DetailType:String?
    var Practical:String?
    var mPractical_Id:Int32?
    var Number:Int32?
    var ScanKeyNo:String?
    var mCustomer_Id:Int32?
    var InputType:Int32?
    var WorkDate:String?
    var CreateDate:String?
    var DelFlg:Int32?
    var isKeyNumberScan:Int32?
    var StatusCode:Int32?
    var CreateDateTimeStamp:String?
}
