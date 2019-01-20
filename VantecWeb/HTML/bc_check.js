var sp_bc_check_type = $("#sp_bc_check_type");
var sp_bc_check_title1 = $("#sp_bc_check_title1");
var sp_bc_check_title2 = $("#sp_bc_check_title2");
var txt_bc_check_code1 = $("#txt_bc_check_code1");
var txt_bc_check_code1_proxy = $("#txt_bc_check_code1_proxy");
var txt_bc_check_code2 = $("#txt_bc_check_code2");
var txt_bc_check_code2_proxy = $("#txt_bc_check_code2_proxy");
var btn_cb_check_result = $("#btn_cb_check_result");

function resetBCCheck(){
    sp_bc_check_type.text(currentCustomer.BarcodeUseName);
    sp_bc_check_title1.text(currentCustomer.BarcodeName1);
    sp_bc_check_title2.text(currentCustomer.BarcodeName2);
    txt_bc_check_code1.val("");
    txt_bc_check_code1.focus(function(){$(this).blur()})
    txt_bc_check_code1_proxy.val("")
    txt_bc_check_code2.val("");
    txt_bc_check_code2.focus(function(){$(this).blur()})
    txt_bc_check_code2_proxy.val("")
    txt_bc_check_code1_proxy.focus();
    txt_bc_check_code1_proxy.blur(function(){$(this).focus()})
    btn_cb_check_result.hide();
}
function showBCCheckResult(bcCheckCode1,bcCheckCode2){
    if(bcCheckCode1 === bcCheckCode2){
        playLocalAutio("ok");
        btn_cb_check_result.text("OK");
        btn_cb_check_result.css("background","rgb(0, 227, 0)");
    }else{
        playLocalAutio("ng");
        btn_cb_check_result.text("NG");
        btn_cb_check_result.css("background","yellow");
    }
    btn_cb_check_result.show();
}
$(function () {
  var bcCheckCode1;
  var bcCheckCode2;
  txt_bc_check_code1_proxy.change(function(e){
    bcCheckCode1 = $(this).val();
//    if(currentCustomer.BarcodeNumMax == 0 && currentCustomer.BarcodeNumMin == 0 && scanKeyNoInput.length > 20){
//        var alertMessage = loginJson.Result.mMessage["WEB_MESSAGE3007"]
//        showMessage(alertMessage);
//        $(this).val("");
//        return;
//    }else if(scanKeyNoInput.length > currentCustomer.BarcodeNumMax || scanKeyNoInput.length < currentCustomer.BarcodeNumMin){
//        var alertMessage = loginJson.Result.mMessage["WEB_MESSAGE3008"]
//        showMessage(alertMessage);
//        $(this).val("");
//        return;
//    }
    txt_bc_check_code1_proxy.unbind("blur");
    txt_bc_check_code2_proxy.focus();
    txt_bc_check_code2_proxy.blur(function(){$(this).focus()})
    $(this).val("");
  });
  txt_bc_check_code2_proxy.change(function(e){
    bcCheckCode2 = $(this).val();
    //    if(currentCustomer.BarcodeNumMax == 0 && currentCustomer.BarcodeNumMin == 0 && scanKeyNoInput.length > 20){
    //        var alertMessage = loginJson.Result.mMessage["WEB_MESSAGE3007"]
    //        showMessage(alertMessage);
    //        $(this).val("");
    //        return;
    //    }else if(scanKeyNoInput.length > currentCustomer.BarcodeNumMax || scanKeyNoInput.length < currentCustomer.BarcodeNumMin){
    //        var alertMessage = loginJson.Result.mMessage["WEB_MESSAGE3008"]
    //        showMessage(alertMessage);
    //        $(this).val("");
    //        return;
    //    }
    txt_bc_check_code2_proxy.unbind("blur");
    $(this).val("");
    showBCCheckResult(bcCheckCode1,bcCheckCode2);
  });
  txt_bc_check_code1_proxy.on('input', function() {
    txt_bc_check_code1.val(this.value);
  });
  txt_bc_check_code2_proxy.on('input', function() {
    txt_bc_check_code2.val(this.value);
  });
  // click result button back to scan
  btn_cb_check_result.click(function(e){
    btn_cb_check_result.hide();
    txt_bc_check_code1.val("");
    txt_bc_check_code2.val("");
    txt_bc_check_code1_proxy.focus();
    txt_bc_check_code1_proxy.blur(function(){$(this).focus()})
  });
  //go back to top page
  $("#btn_close_bc_check").click(function(e){
    txt_bc_check_code1_proxy.unbind("blur");
    txt_bc_check_code1_proxy.blur();
    txt_bc_check_code2_proxy.unbind("blur");
    txt_bc_check_code2_proxy.blur();
    pageNavigation("page_bc_check",getTopPage());
  });
})
