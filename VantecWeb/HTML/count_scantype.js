var txt_count_scantype_text = $("#txt_count_scantype_text");
var txt_count_scantype_text_proxy = $("#txt_count_scantype_text_proxy");
var content_count_scantype = $("#content_count_scantype");
var count_scantype_callback;
function resetCountScanType(){
    txt_count_scantype_text.val("");
    txt_count_scantype_text_proxy.val("")
    content_count_scantype.empty();
}
function setCountScanTypeValue(callback){
    //if(currentResult.ScanKeyNo != "")txt_count_scantype_text.val(currentResult.ScanKeyNo);
    // todo push result into list by workkbnid
    txt_count_scantype_text_proxy.focus();
    txt_count_scantype_text_proxy.blur(function(){$(this).focus()})
    count_scantype_callback = callback;
}
function getCountScanTypeValue(){
    return {
        ScanKeyNo:txt_count_scantype_text_proxy.val()
    }
}
function createScanResultOnPage(scanResult){
    var scanResultElements = {
        scanResultContainer : $("<div/>").addClass("m-stack m-stack--ver m-stack--general m-stack--demo record-row"),
        kbnText:$("<div/>").addClass("m-stack__item m-stack__item--left m-stack__item--middle").width("35%").css("-webkit-line-clamp","4"),
        scanStartTime:$("<div/>").addClass("m-stack__item m-stack__item--center m-stack__item--middle").width("25%"),
        scanNo:$("<div/>").addClass("m-stack__item m-stack__item--right m-stack__item--middle m-stack__item--fluid").width("40%").css("word-break","break-all"),
    }
    //set value
    scanResultElements.kbnText.text(scanResult.DetailType);
    scanResultElements.scanStartTime.text(scanResult.StartDateTime.split(" ")[1].substring(0,5));
    scanResultElements.scanNo.text(scanResult.ScanKeyNo);
    // append html elements
    content_count_scantype.prepend(
        scanResultElements.scanResultContainer.append(
            scanResultElements.kbnText,
            scanResultElements.scanStartTime,
            scanResultElements.scanNo
        )
    )
}
$(function () {
  txt_count_scantype_text_proxy.change(function(e){
    var scanKeyNoInput = $(this).val();
    if(currentCustomer.BarcodeNumMax == 0 && currentCustomer.BarcodeNumMin == 0 ){
        if(scanKeyNoInput.length > 20){
            var alertMessage = loginJson.Result.mMessage["WEB_MESSAGE3007"]
            showMessage(alertMessage);
            $(this).val("");
            return;
        }
    }else if(scanKeyNoInput.length > currentCustomer.BarcodeNumMax || scanKeyNoInput.length < currentCustomer.BarcodeNumMin){
        var alertMessage = loginJson.Result.mMessage["WEB_MESSAGE3008"]
        showMessage(alertMessage);
        $(this).val("");
        return;
    }
    var scanTopText = currentResult.DetailType;
    var scanTopVal = currentResult.mWorkKbn_Id;
    var scanResult = setResultStartValue(scanTopText,scanTopVal);//start
    scanResult.ScanKeyNo = scanKeyNoInput;
    setResultEndValue(scanResult);//end
    createScanResultOnPage(scanResult);
    tempScanResultList.push(scanResult);
    $(this).val("");
    $(this).blur();
  });
  txt_count_scantype_text_proxy.on('input', function() {
    $("#txt_count_scantype_text").val(this.value);
  });
  //go back to top page
  $("#btn_close_count_scantype").click(function(e){
    txt_count_scantype_text_proxy.unbind("blur");
    txt_count_scantype_text_proxy.blur();
    if(typeof count_scantype_callback == "function"){
        count_scantype_callback(getCountScanTypeValue());
    }
    pageNavigation("page_count_scantype",getTopPage());
  });
})
