var txt_count_scantype_edit_text = $("#txt_count_scantype_edit_text");
var txt_count_scantype_edit_text_proxy = $("#txt_count_scantype_edit_text_proxy");
var content_count_scantype_edit = $("#content_count_scantype_edit");
var sp_count_scantype_edit_title = $("#sp_count_scantype_edit_title");
var count_scantype_edit_callback;
var customerForEdit;
function setCountScanTypeEditValue(result,callback){
    txt_count_scantype_edit_text.val("");
    //txt_count_scantype_edit_text_proxy.val("");
    txt_count_scantype_edit_text.focus();
    //txt_count_scantype_edit_text_proxy.blur(function(){$(this).focus()})
    var customers = loginJson.Result.mCustomer.filter(function(customer) {
                                                    return customer.Id == result.mCustomer_Id;
                                               })
    if(customers.length > 0){
        customerForEdit = customers[0];
    }
    count_scantype_edit_callback = callback;
}
function getCountScanTypeEditValue(){
    return {
        ScanKeyNo:txt_count_scantype_edit_text.val()
    }
}
$(function () {
  txt_count_scantype_edit_text.change(function(e){
    var scanKeyNoInput = $(this).val();
    if(customerForEdit.BarcodeNumMax == 0 && customerForEdit.BarcodeNumMin == 0){
        if(scanKeyNoInput.length > 20){
            var alertMessage = loginJson.Result.mMessage["WEB_MESSAGE3007"]
            showMessage(alertMessage);
            $(this).val("")
            return;
        }
    }else if(scanKeyNoInput.length > customerForEdit.BarcodeNumMax || scanKeyNoInput.length < customerForEdit.BarcodeNumMin){
        var alertMessage = loginJson.Result.mMessage["WEB_MESSAGE3008"]
        showMessage(alertMessage);
        $(this).val("")
        return;
    }
    if(typeof count_scantype_edit_callback == "function"){
        count_scantype_edit_callback(getCountScanTypeEditValue());
    }
    $("#btn_close_count_scantype_edit").click();
  });
  txt_count_scantype_edit_text_proxy.on('input', function() {
    //$("#txt_count_scantype_edit_text").val(this.value);
  });
  //go back to top page
  $("#btn_close_count_scantype_edit").click(function(e){
    txt_count_scantype_edit_text_proxy.unbind("blur");
    txt_count_scantype_edit_text_proxy.blur();
    pageNavigation("page_count_scantype_edit","page_results");
  });
})
