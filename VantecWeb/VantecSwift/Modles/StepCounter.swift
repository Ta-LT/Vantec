//
//  StepCounter.swift
//  VantecSwift
//
//  Created by technoalliance on 2018/3/6.
//  Copyright © 2018年 technoalliance. All rights reserved.
//

import Foundation
import CoreMotion

public class StepCounter{
    public static var Shared=StepCounter();
    let pedometer = CMPedometer()
    var stepsCount:NSNumber = 0
    func startPedometerUpdates(){
        //self.stepCountText.text = "0"
        guard CMPedometer.isStepCountingAvailable() else {
            print("\n this device can not use step count\n")
            return
        }
        self.stepsCount = 0
        self.pedometer.startUpdates(from: Date()) { (pedometerData, error) in
            DispatchQueue.main.async{
                if let numberOfSteps = pedometerData?.numberOfSteps{
                    print("\(numberOfSteps)\n")
                    self.stepsCount = numberOfSteps
                }
            }
        }
    }
    func stopPedometerUpdates() -> NSNumber {
        self.pedometer.stopUpdates()
        return self.stepsCount
    }
}
