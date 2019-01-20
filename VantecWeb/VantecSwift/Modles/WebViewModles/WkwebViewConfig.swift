
import Foundation
import WebKit

struct WkwebViewConfig {
    
    /// WKScriptMessageHandler
    /// send a message with a name in JS：valueName
    /// window.webkit.messageHandlers.valueName.postMessage({body: 'xxx'})
    public var scriptMessageHandlerArray: [String] = [String]()
    
    /// default min font size
    public var minFontSize: CGFloat = 0
    
    /// show scroll
    public var isShowScrollIndicator: Bool = true
    
    /// is allow gestures
    public var isAllowsBackForwardGestures: Bool = true
    
    /// is allow load javaScript
    public var isjavaScriptEnabled: Bool = true
    
    /// is automatically js to open windwo allowed.by user interaction
    public var isAutomaticallyJavaScript: Bool = true
    
    /// is progress hidden
    public var isProgressHidden:Bool = false
    
    /// progress height
    public var progressHeight:CGFloat = 3
    
    /// default color
    public var progressTrackTintColor:UIColor = UIColor.clear
    
    /// load color
    public var progressTintColor:UIColor = UIColor.green
    
    ///
    public var aliPayScheme:String = "zhianjia"
    
}
//net load type
enum WkwebLoadType{
    
    /// load normal url
    case URLString(url:String)
    
    /// load local html(send name)
    case HTMLName(name:String)
    
    /// post(url:URL，parameters：param)
    case POST(url:String,parameters: [String:Any])
}

protocol WKWebViewDelegate:class {
    /// call when server start to send request
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void)
    
    /// page start to load
    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!)
    
    /// page loaded
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!)
    
    /// when navigation failed
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error)
    
    /// load data failed
    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error)
    
    /// JS injection method
    func webViewUserContentController(_ scriptMessageHandlerArray:[String], didReceive message: WKScriptMessage)
    
    /// JS execution callback method
    func webViewEvaluateJavaScript(_ result:Any?,error:Error?)
}

extension WKWebViewDelegate {
    /// call when server start to send request
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void){}
    
    /// page start to load
    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!){}
    
    /// page loaded
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!){}
    
    /// when navigation failed
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error){}
    
    /// load data failed
    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error){}
    
    /// JS injection method
    func webViewUserContentController(_ scriptMessageHandlerArray:[String], didReceive message: WKScriptMessage){}
    
    /// JS execution callback method
    func webViewEvaluateJavaScript(_ result:Any?,error:Error?){}
}


