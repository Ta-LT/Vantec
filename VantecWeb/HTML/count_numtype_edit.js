var txt_count_numtype_edit_num = $("#txt_count_numtype_edit_num");
var btn_back_count_numtype_edit = $("#btn_back_count_numtype_edit");
var btn_close_count_numtype_edit = $("#btn_close_count_numtype_edit");
var btn_count_numtype_edit_calculator_del = $("#btn_count_numtype_edit_calculator_del");
var btn_count_numtype_edit_practical = $("#btn_count_numtype_edit_practical");
var dpd_count_numtype_edit_practical = $("#dpd_count_numtype_edit_practical");//practical menu
var btn_count_numtype_edit_practical = $("#btn_count_numtype_edit_practical");
var count_numtype_edit_callback;
function setCountNumTypeEditValue(result,callback){
    txt_count_numtype_edit_num.val(result.Number);
    if(result.Practical)btn_count_numtype_edit_practical.text(result.Practical);
    if(result.mPractical_Id)btn_count_numtype_edit_practical.val(result.mPractical_Id);
    count_numtype_edit_callback = callback;
}
function getCountNumTypeEditValue(){
    return {
    Number:txt_count_numtype_edit_num.val(),
    Practical:btn_count_numtype_edit_practical.text(),
    mPractical_Id:btn_count_numtype_edit_practical.val()
    }
}
$(function () {
    txt_count_numtype_edit_num.val("0");
    txt_count_numtype_edit_num.focus(function(){$(this).blur()})
    $(".btn_count_numtype_edit_calculator_num").click(function(e){
        if(txt_count_numtype_edit_num.val().length == numInputMaxLength){return;}
        if(txt_count_numtype_edit_num.val() == "0"){
            txt_count_numtype_edit_num.val($(this).text().trim());
        }else{
            txt_count_numtype_edit_num.val(txt_count_numtype_edit_num.val() + $(this).text().trim());
        }
    });
    btn_count_numtype_edit_calculator_del.click(function(e){
        txt_count_numtype_edit_num.val("0");
    });
    //go back to top page
    btn_close_count_numtype_edit.click(function(e){
        if(btn_count_numtype_edit_practical.val()==""){
            var alertMessage = loginJson.Result.mMessage["WEB_MESSAGE3003"]
            showMessage(alertMessage);
            return;
        }
        if(typeof count_numtype_edit_callback == "function"){
            count_numtype_edit_callback(getCountNumTypeEditValue());
        }
        pageNavigation("page_count_numtype_edit","page_results");
    });
    btn_back_count_numtype_edit.click(function(e){
        pageNavigation("page_count_numtype_edit","page_results");
    })
})
