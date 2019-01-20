var page_count_tabtype_edit = $("#page_count_tabtype_edit");
var btn_count_tabtype_edit_plus = $("#btn_count_tabtype_edit_plus");
var btn_count_tabtype_edit_minus= $("#btn_count_tabtype_edit_minus");
var txt_count_tabtype_edit_num = $("#txt_count_tabtype_edit_num");
var btn_back_count_tabtype_edit = $("#btn_back_count_tabtype_edit");
var btn_close_count_tabtype_edit = $("#btn_close_count_tabtype_edit");
var txt_count_tabtype_edit_increment = $("#txt_count_tabtype_edit_increment");
var btn_count_tabtype_edit_practical = $("#btn_count_tabtype_edit_practical");
var dpd_count_tabtype_edit_practical = $("#dpd_count_tabtype_edit_practical");
var count_tabtype_edit_callback;
function setCountTabTypeEditValue(result,callback){
    txt_count_tabtype_edit_num.val(result.Number);
    if(result.Practical)btn_count_tabtype_edit_practical.text(result.Practical);
    if(result.mPractical_Id)btn_count_tabtype_edit_practical.val(result.mPractical_Id);
    if(result.Practical)txt_count_tabtype_edit_increment.trigger("touchspin.updatesettings", {postfix:result.Practical})
    count_tabtype_edit_callback = callback;
}
function getCountTabTypeEditValue(){
    return {
        Number:txt_count_tabtype_edit_num.val(),
        Practical:btn_count_tabtype_edit_practical.text(),
        mPractical_Id:btn_count_tabtype_edit_practical.val()
    }
}
$(function () {
  txt_count_tabtype_edit_num.val("0");
  txt_count_tabtype_edit_num.focus(function(){$(this).blur()})
  txt_count_tabtype_edit_increment.focus(function(){$(this).blur()})
  btn_count_tabtype_edit_plus.click(function(e){
    if(txt_count_tabtype_edit_num.val()=="0")
    {
        txt_count_tabtype_edit_num.val(txt_count_tabtype_edit_increment.val())
    }else{
                                    
        var val = parseInt(txt_count_tabtype_edit_num.val())+parseInt(txt_count_tabtype_edit_increment.val());
        if(String(val).length > numInputMaxLength){return;}
        txt_count_tabtype_edit_num.val(val);
    }
  });
  btn_count_tabtype_edit_minus.click(function(e){
    if(txt_count_tabtype_edit_num.val()=="0")
    {
        return
    }else{
        var result =parseInt(txt_count_tabtype_edit_num.val())-parseInt(txt_count_tabtype_edit_increment.val())
        if(result<0)
        {
            txt_count_tabtype_edit_num.val(0)
        }else{
            txt_count_tabtype_edit_num.val(result)
        }
    }
  });
  txt_count_tabtype_edit_increment.TouchSpin({
    buttondown_class: 'btn btn-secondary',
    buttonup_class: 'btn btn-secondary',
    
    min: 1,
    max: 999999999,
    stepinterval: 50,
    maxboostedstep: 10000000,
    postfix:'増分'
  });
  //go back to top page
  btn_close_count_tabtype_edit.click(function(e){
    if(btn_count_tabtype_edit_practical.val()==""){
        var alertMessage = loginJson.Result.mMessage["WEB_MESSAGE3003"]
        showMessage(alertMessage);
        return;
    }
    if(typeof count_tabtype_edit_callback == "function"){
        count_tabtype_edit_callback(getCountTabTypeEditValue());
    }
    pageNavigation("page_count_tabtype_edit","page_results");
  });
  btn_back_count_tabtype_edit.click(function(e){
    pageNavigation("page_count_tabtype_edit","page_results");
  });
})
