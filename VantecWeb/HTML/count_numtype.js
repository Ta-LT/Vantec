var txt_count_numtype_num = $("#txt_count_numtype_num");
var btn_close_count_numtype = $("#btn_close_count_numtype");
var btn_back_count_numtype = $("#btn_back_count_numtype");
var btn_count_numtype_calculator_del = $("#btn_count_numtype_calculator_del");
var btn_count_numtype_practical = $("#btn_count_numtype_practical");
var dpd_count_numtype_practical = $("#dpd_count_numtype_practical");//practical menu
var div_count_numtype_alert = $("#div_count_numtype_alert");
var count_numtype_callback;
function resetCountNumType(){
    txt_count_numtype_num.val("0");
    //btn_count_tabtype_practical.text("単位");
    //btn_count_tabtype_practical.val("");
}
function setCountNumTypeValue(callback){
    if(currentResult.Number != null)txt_count_numtype_num.val(currentResult.Number);
    if(currentResult.Practical != "")btn_count_numtype_practical.text(currentResult.Practical);
    if(currentResult.mPractical_Id != null)btn_count_numtype_practical.val(currentResult.mPractical_Id);
    count_numtype_callback = callback
}
function getCountNumTypeValue(){
    return {
        Number:txt_count_numtype_num.val(),
        Practical:btn_count_numtype_practical.text(),
        mPractical_Id:btn_count_numtype_practical.val()
    }
}
$(function () {
    txt_count_numtype_num.val("0");
    txt_count_numtype_num.focus(function(){$(this).blur()})
    $(".btn_count_numtype_calculator_num").click(function(e){
        if(txt_count_numtype_num.val().length == numInputMaxLength){return;}
        if(txt_count_numtype_num.val() == "0"){
            txt_count_numtype_num.val($(this).text().trim());
        }else{
            txt_count_numtype_num.val(txt_count_numtype_num.val() + $(this).text().trim());
        }
    });
    btn_count_numtype_calculator_del.click(function(e){
        txt_count_numtype_num.val("0");
    });
    btn_back_count_numtype.click(function(e){
        pageNavigation("page_count_numtype",getTopPage());
    })
    //go back to top page
    btn_close_count_numtype.click(function(e){
        if(btn_count_numtype_practical.val()==""){
            var alertMessage = loginJson.Result.mMessage["WEB_MESSAGE3003"]
            showMessage(alertMessage);
            return;
        }
                                  
        if(typeof count_numtype_callback == "function"){
            count_numtype_callback(getCountNumTypeValue());
        }
        pageNavigation("page_count_numtype",getTopPage());
    });
})
