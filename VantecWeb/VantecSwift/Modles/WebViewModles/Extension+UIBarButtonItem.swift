//
//  VantecSwift
//
//  Created by technoalliance on 2018/2/5.
//  Copyright © 2018年 technoalliance. All rights reserved.
//

import UIKit

extension UIBarButtonItem {
    /// create UIBarButtonItem
    ///
    /// - parameter title:    title
    /// - parameter image:    image
    /// - parameter imageH:   hight light image
    /// - parameter target:   target
    /// - parameter action:   action
    ///
    /// - returns: UIBarButtonItem
    convenience init(title: String?,image:String?,imageH:String? ,target: AnyObject?, action: Selector) {
        
        let backItemImage = UIImage.init(named: image ?? "")
        let backItemHlImage = UIImage.init(named: imageH ?? "")
        
        let backButton = UIButton.init(type: .system)
        
        backButton .setTitle(title, for: .normal)
        
        backButton.titleLabel?.font = UIFont.systemFont(ofSize: 17)
        
        backButton .setImage(backItemImage, for: .normal)
        backButton .setImage(backItemHlImage, for: .highlighted)
        
        if #available(iOS 11.0, *) {
            backButton.contentEdgeInsets = UIEdgeInsetsMake(0, -15,0, 0);
            backButton.imageEdgeInsets = UIEdgeInsetsMake(0, -15,0, 0);
        }
        backButton.sizeToFit()
        backButton.addTarget(target, action: action, for: .touchUpInside)
        
        self.init(customView: backButton)
    }
}
