var btn_count_tabtype_plus = $("#btn_count_tabtype_plus");
var btn_count_tabtype_minus= $("#btn_count_tabtype_minus");
var txt_count_tabtype_num = $("#txt_count_tabtype_num");
var btn_close_count_tabtype = $("#btn_close_count_tabtype");
var btn_back_count_tabtype = $("#btn_back_count_tabtype");
var txt_count_tabtype_increment = $("#txt_count_tabtype_increment");
var btn_count_tabtype_practical = $("#btn_count_tabtype_practical");
var dpd_count_tabtype_practical = $("#dpd_count_tabtype_practical");//practical menu
var div_count_tabtype_alert = $("#div_count_tabtype_alert");
var count_tabtype_callback;
function resetCountTabType(){
    txt_count_tabtype_num.val("0");
    txt_count_tabtype_increment.val("1");
    //btn_count_tabtype_practical.text("単位");
    //btn_count_tabtype_practical.val("");
}
function setCountTabTypeValue(callback){
    if(currentResult.Number != null)txt_count_tabtype_num.val(currentResult.Number);
    if(currentResult.Practical != "")btn_count_tabtype_practical.text(currentResult.Practical);
    if(currentResult.mPractical_Id != null)btn_count_tabtype_practical.val(currentResult.mPractical_Id);
    count_tabtype_callback = callback;
}
function getCountTabTypeValue(){
    return {
        Number:txt_count_tabtype_num.val(),
        Practical:btn_count_tabtype_practical.text(),
        mPractical_Id:btn_count_tabtype_practical.val()
    }
}
$(function () {
  txt_count_tabtype_num.val("0");
  txt_count_tabtype_num.focus(function(){$(this).blur()})
  txt_count_tabtype_increment.focus(function(){$(this).blur()})
  btn_count_tabtype_plus.click(function(e){
    if(txt_count_tabtype_num.val()=="0")
    {
        txt_count_tabtype_num.val(txt_count_tabtype_increment.val())
    }else{
        var val = parseInt(txt_count_tabtype_num.val())+parseInt(txt_count_tabtype_increment.val());
        if(String(val).length > numInputMaxLength){return;}
        txt_count_tabtype_num.val(val)
    }
  });
  btn_count_tabtype_minus.click(function(e){
    if(txt_count_tabtype_num.val()=="0")
    {
        return
    }else{
        var result =parseInt(txt_count_tabtype_num.val())-parseInt(txt_count_tabtype_increment.val())
        if(result<0)
        {
            txt_count_tabtype_num.val(0)
        }else{
            txt_count_tabtype_num.val(result)
        }
    }
  });
  txt_count_tabtype_increment.TouchSpin({
    buttondown_class: 'btn btn-secondary',
    buttonup_class: 'btn btn-secondary',
    
    min: 1,
    max: 999999999,
    stepinterval: 50,
    maxboostedstep: 10000000,
    postfix:'増分'
  });
  function hideCallBack(){
  //alert("hide");
  }
  btn_back_count_tabtype.click(function(e){
    pageNavigation("page_count_tabtype",getTopPage());
  });
  //go back to top page
  btn_close_count_tabtype.click(function(e){
    if(btn_count_tabtype_practical.val()==""){
        var alertMessage = loginJson.Result.mMessage["WEB_MESSAGE3003"]
        showMessage(alertMessage);
        return;
    }
                                
    if(typeof count_tabtype_callback == "function"){
        count_tabtype_callback(getCountTabTypeValue());
    }
    pageNavigation("page_count_tabtype",getTopPage(),hideCallBack);
  });
})
