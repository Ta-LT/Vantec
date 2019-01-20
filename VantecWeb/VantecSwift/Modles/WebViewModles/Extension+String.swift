//
//  VantecSwift
//
//  Created by technoalliance on 2018/2/5.
//  Copyright © 2018年 technoalliance. All rights reserved.
//

import Foundation

extension String {
    func mySubString(to index: Int) -> String {
        return String(self[..<self.index(self.startIndex, offsetBy: index)])
    }
    func mySubString(from index: Int) -> String {
        return String(self[self.index(self.startIndex, offsetBy: index)...])
    }
}

