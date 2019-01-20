//
//  VantecSwift
//
//  Created by technoalliance on 2018/2/5.
//  Copyright © 2018年 technoalliance. All rights reserved.
//

import UIKit
import WebKit

@IBDesignable
class WebView: UIView {
    
    /// event
    fileprivate var target: AnyObject?
    
    /// create webveiew
    public var webView = WKWebView()
    
    /// progress
    fileprivate var progressView = UIProgressView()
    
    /// create webiview config
    fileprivate let configuretion = WKWebViewConfiguration()
    
    //
    fileprivate var POSTJavaScript = String()
    
    //
    fileprivate var needLoadJSPOST:Bool?
    
    ///
    var webConfig : WkwebViewConfig?
    
    //save request url
    fileprivate var snapShotsArray:Array<Any>?
    
    //delegate init
    weak var delegate : WKWebViewDelegate?
    
    override public init(frame: CGRect) {
        super.init(frame: frame)
    }
    
    required public init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }
    open override func layoutSubviews() {
        super.layoutSubviews()
        webView.frame = CGRect(x: 0, y: 0, width: self.width, height: self.height)
    }
    
    fileprivate func setupUI(webConfig:WkwebViewConfig)  {
        // Webview customize
        configuretion.preferences = WKPreferences()
        configuretion.preferences.minimumFontSize = webConfig.minFontSize
        configuretion.preferences.javaScriptEnabled = webConfig.isjavaScriptEnabled
        configuretion.preferences.javaScriptCanOpenWindowsAutomatically = webConfig.isAutomaticallyJavaScript
        configuretion.userContentController = WKUserContentController()
        _ = webConfig.scriptMessageHandlerArray.map{configuretion.userContentController.add(self, name: $0)}
        webView = WKWebView(frame:frame,configuration: configuretion)
        
        //
        webView.allowsBackForwardNavigationGestures = webConfig.isAllowsBackForwardGestures
        
        //scroll
        webView.scrollView.showsVerticalScrollIndicator = webConfig.isShowScrollIndicator
        webView.scrollView.showsHorizontalScrollIndicator = webConfig.isShowScrollIndicator
        webView.scrollView.bounces = false
        
        // KVO lisener
        webView.addObserver(self, forKeyPath: "estimatedProgress", options: .new, context: nil)
        //
        webView.sizeToFit()
        self.addSubview(webView)
        
        progressView = UIProgressView(progressViewStyle: .default)
        progressView.frame = CGRect(x: 0, y: 0, width: webView.width, height: webConfig.progressHeight)
        progressView.trackTintColor = webConfig.progressTrackTintColor
        progressView.progressTintColor = webConfig.progressTintColor
        webView.addSubview(progressView)
        progressView.isHidden = webConfig.isProgressHidden
        
        webView.navigationDelegate = self
        webView.uiDelegate = self
    }
    
    /// load webView
    func webloadType(_ target:AnyObject,_ loadType:WkwebLoadType) {
        self.target = target
        setupUI(webConfig:webConfig ?? WkwebViewConfig())
        
        switch loadType {
            
        case .URLString(let urltring):
            let urlstr = URL(string: urltring)
            let request = URLRequest(url: urlstr!)
            webView.load(request)
            
        case .HTMLName(let string):
            loadHost(string: string)
            
        case .POST(let string, parameters: let postString):
            needLoadJSPOST = true
            //
            let dictMap = postString.map({"\"\($0.key)\":\"\($0.value)\""})
            POSTJavaScript = "post('\(string)\',{\(dictMap.joined(separator: ","))})"
            loadHost(string: "WKJSPOST")
        }
    }
    
    fileprivate func loadHost(string:String) {
        let path = Bundle.main.path(forResource: string, ofType: "html")
        //
        do {
            let html = try String(contentsOfFile: path!, encoding: String.Encoding.utf8)
            //
            webView.loadHTMLString(html, baseURL: Bundle.main.bundleURL)
        } catch { }
    }
    
    /// run js
    /// 例run_JavaScript(script:"document.getElementById('someElement').innerText")
    ///
    /// Parameter titleStr: title
    public func run_JavaScript(javaScript:String?) {
        if let javaScript = javaScript {
            DispatchQueue.main.async {
                self.webView.evaluateJavaScript(javaScript) { result,error in
                    print(error ?? "")
                    self.delegate?.webViewEvaluateJavaScript(result, error: error)
                }
            }
        }
    }
    
    /// refresh
    public func reload() {
        webView.reload()
    }
    /// back
    public func goBack() {
        webView.goBack()
    }
    /// forword
    public func goForward() {
        webView.goForward()
    }
    ///
    public func removeWebView(){
        webView.removeObserver(self, forKeyPath: "estimatedProgress")
        if let scriptMessage = webConfig?.scriptMessageHandlerArray {
            _ = scriptMessage.map{webView.configuration.userContentController .removeScriptMessageHandler(forName: $0)}
        }
        webView.navigationDelegate = nil
        webView.uiDelegate = nil
        self.removeFromSuperview()
    }
    //
    fileprivate func pushCurrentSnapshotView(_ request: NSURLRequest) -> Void {
        //
        guard let urlStr = snapShotsArray?.last else { return }
        //
        let url = URL(string: urlStr as! String)
        //
        let lastRequest = NSURLRequest(url: url!)
        //
        if request.url?.absoluteString == "about:blank"{ return }
        //
        if (lastRequest.url?.absoluteString == request.url?.absoluteString) {return}
        //
        let currentSnapShotView = webView.snapshotView(afterScreenUpdates: true);
        //
        snapShotsArray = [["request":request,"snapShotView":currentSnapShotView]]
    }
    
    open override func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {
        if keyPath == "estimatedProgress"{
            //
            progressView.alpha = CGFloat(1.0 - webView.estimatedProgress)
            //
            progressView.setProgress(Float(webView.estimatedProgress), animated: true)
            //
            if Float(webView.estimatedProgress) >= 1.0{
                progressView.alpha = 0.0
                progressView .setProgress(0.0, animated: false)
            }
            print(webView.estimatedProgress)
        }
    }
}

// MARK: - WKScriptMessageHandler
extension WebView: WKScriptMessageHandler{
    
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if let scriptMessage = webConfig?.scriptMessageHandlerArray {
            self.delegate?.webViewUserContentController(scriptMessage, didReceive: message)
        }
    }
}
// MARK: - WKNavigationDelegate
extension WebView: WKNavigationDelegate{
    
    //
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        self.delegate?.webView(webView, decidePolicyFor: navigationAction, decisionHandler: decisionHandler)
        
        let navigationURL = navigationAction.request.url?.absoluteString
        if let requestURL = navigationURL?.removingPercentEncoding {
            if requestURL.hasPrefix("tel://") {
                decisionHandler(.cancel);
                if let mobileURL:URL = URL(string: requestURL) {
                    UIApplication.shared.openURL(mobileURL)
                }
            }
            // alipays
            if requestURL.hasPrefix("alipay://") {
                
                var urlString = requestURL.mySubString(from: 23)
                urlString = urlString.replacingOccurrences(of: "alipays", with: webConfig!.aliPayScheme)
                
                if let strEncoding = urlString.addingPercentEncoding(withAllowedCharacters: .urlHostAllowed) {
                    
                    let payString = "alipay://alipayclient/?\(strEncoding)"
                    
                    if let urlalipayURL:URL = URL(string: payString) {
                        if #available(iOS 10.0, *) {
                            UIApplication.shared.open(urlalipayURL, options: [:], completionHandler: { result in
                                self.webView.reload()
                            })
                        } else {
                            UIApplication.shared.openURL(urlalipayURL)
                        }
                    }
                }
            }
        }
        switch navigationAction.navigationType {
        case WKNavigationType.linkActivated:
            pushCurrentSnapshotView(navigationAction.request as NSURLRequest)
            break
        case WKNavigationType.formSubmitted:
            pushCurrentSnapshotView(navigationAction.request as NSURLRequest)
            break
        case WKNavigationType.backForward:
            break
        case WKNavigationType.reload:
            break
        case WKNavigationType.formResubmitted:
            break
        case WKNavigationType.other:
            pushCurrentSnapshotView(navigationAction.request as NSURLRequest)
            break
        }
        decisionHandler(.allow)
    }
    
    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        self.delegate?.webView(webView, didStartProvisionalNavigation: navigation)
    }
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        self.delegate?.webView(webView, didFinish: navigation)
        if needLoadJSPOST == true {
            run_JavaScript(javaScript: POSTJavaScript)
            needLoadJSPOST = false
        }
    }
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        self.delegate?.webView(webView, didFail: navigation, withError: error)
        print(error)
    }
    //
    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        self.delegate?.webView(webView, didFailProvisionalNavigation: navigation, withError: error)
        progressView.isHidden = true
        print(error)
    }
    
    //
    func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration, for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
        if navigationAction.targetFrame?.isMainFrame == nil {
            webView.load(navigationAction.request)
        }
        return nil
    }
}

// MARK: - WKUIDelegate
extension WebView: WKUIDelegate{
    
    //
    func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
        
        let alert = UIAlertController(title: "提示", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "确定", style: .default, handler: { (_) -> Void in
            completionHandler()
        }))
        alert.addAction(UIAlertAction(title: "取消", style: .cancel, handler: { (_) -> Void in
            completionHandler()
        }))
        target?.present(alert, animated: true, completion: nil)
    }
    
    // js
    func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
        
        let alert = UIAlertController(title: "提示", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "确定", style: .default, handler: { (_) -> Void in
            completionHandler(true)
        }))
        alert.addAction(UIAlertAction(title: "取消", style: .cancel, handler: { (_) -> Void in
            completionHandler(false)
        }))
        target?.present(alert, animated: true, completion: nil)
    }
    
    //
    func webView(_ webView: WKWebView, runJavaScriptTextInputPanelWithPrompt prompt: String, defaultText: String?, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (String?) -> Void) {
        
        let alert = UIAlertController(title: prompt, message: defaultText, preferredStyle: .alert)
        
        alert.addTextField { (textField: UITextField) -> Void in
            textField.textColor = UIColor.red
        }
        alert.addAction(UIAlertAction(title: "确定", style: .default, handler: { (_) -> Void in
            completionHandler(alert.textFields![0].text!)
        }))
        target?.present(alert, animated: true, completion: nil)
    }
}
