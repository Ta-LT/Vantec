var btn_results_selectall = $("#btn_results_selectall");
var btn_results_delete = $("#btn_results_delete");
var btn_close_results = $("#btn_close_results");
var btn_results_senddata = $("#btn_results_senddata");
var content_results = $("#content_results");
var btnSelectAllText = "全選択";
var btnDeselectAllText = "全解除";
function createResult(result){
    var content = content_results;
    var restKBN = loginJson.Result.mRestWork;
    var workKBNList = loginJson.Result.mWorkKbn;
    var isRestKBN = loginJson.Result.mRestWork.Id == result.mWorkKbn_Id;
    var customersObj = getCustomersObjByJson();
    var resultElements = {
        resultContainer : $("<div/>").addClass("m-stack m-stack--ver m-stack--general m-stack--demo record-row").css("border","solid 5px #FF3300").css("border-radius","10px"),
        checkBoxContainer:{
            container:$("<div/>").addClass("m-stack__item m-stack__item--right m-stack__item--middle").width("20%").addClass("cb_result"),
            span:$("<span/>").addClass("checkbox-span"),
            checkbox:$("<input type='checkbox' name='cb_results'/>").addClass("checkbox-input").css("zoom",2),
            label:$("<label/>").addClass("checkbox-label"),
        },
        recordContainerLeft:{
            container:$("<div/>").addClass("m-stack__item m-stack__item--left m-stack__item--middle m-stack__item--fluid").width("60%"),
            customer :{
                container:$("<div/>").addClass("m-stack m-stack--ver m-stack--general").height("50%"),
                text:$("<div/>").addClass("m-stack__item m-stack__item--center m-stack__item--middle").css("font-weight","bold")
            },
            top :{
                container:$("<div/>").addClass("m-stack m-stack--ver m-stack--general").height("50%"),
                text:$("<div/>").addClass("m-stack__item m-stack__item--center m-stack__item--middle").css("font-weight","bold")
            },
        },
        recordContainerRight:{
            container:$("<div/>").addClass("m-stack__item m-stack__item--right m-stack__item--middle m-stack__item--fluid"),
            time:{
                container:$("<div/>").addClass("m-stack m-stack--ver m-stack--general").height("50%"),
                StartDateTime:{
                    container:$("<div/>").addClass("m-stack__item m-stack__item--center m-stack__item--middle"),
                    text:$("<input type='text'/>").addClass("form-control m_timepicker_1 m_timepicker").attr("readonly","true").attr("placeholder","Select time").css("font-size","1.5rem")
                },
                EndDateTime:{
                    container:$("<div/>").addClass("m-stack__item m-stack__item--center m-stack__item--middle"),
                    text:$("<input type='text'/>").addClass("form-control m_timepicker_1 m_timepicker").attr("readonly","readonly").attr("placeholder","Select time").css("font-size","1.5rem")
                },
            },
            Number:{
                container:$("<div/>").addClass("m-stack m-stack--ver m-stack--general").height("50%"),
                text:$("<div/>").addClass("m-stack__item m-stack__item--center m-stack__item--middle").css("padding",0)
            },
        }
    }
    // add event
    var timepickerOption = {
        defaultTime: '11:45',
        minuteStep: 1,
        showSeconds: false,
        showMeridian: false,
        snapToStep: true,
        disableFocus: false
    }
    
    resultElements.recordContainerRight.time.StartDateTime.text.focus(function(){
        resultElements.recordContainerRight.time.StartDateTime.text.css("color","red")
        $(this).blur()
    })
    resultElements.recordContainerRight.time.StartDateTime.text.timepicker(timepickerOption).on(
        "hide.timepicker",function(e){
            var changedValue = result.StartDateTime.split(" ")[0] + " " + setZero(e.time.hours) +":"+ setZero(e.time.minutes)+":"+result.StartDateTime.split(" ")[1].split(":")[2];
            if(result.StartDateTime != changedValue)
            {
               result.StartDateTime = changedValue;
               changeBorderColorToEdit();
            }
            resultElements.recordContainerRight.time.StartDateTime.text.css("color","")
        }
    );
    
    resultElements.recordContainerRight.time.EndDateTime.text.focus(function(){
        resultElements.recordContainerRight.time.EndDateTime.text.css("color","red");
        $(this).blur()
    })
    resultElements.recordContainerRight.time.EndDateTime.text.timepicker(timepickerOption).on(
        "hide.timepicker",function(e){
            var changedValue = result.EndDateTime.split(" ")[0] + " " + setZero(e.time.hours) +":"+ setZero(e.time.minutes)+":"+result.EndDateTime.split(" ")[1].split(":")[2];
            if(result.EndDateTime != changedValue)
            {
                result.EndDateTime = changedValue;
                changeBorderColorToEdit();
            }
            resultElements.recordContainerRight.time.EndDateTime.text.css("color","");
        }
    );
    resultElements.checkBoxContainer.checkbox.click(function(){
        checkCBLengthToChangeBtnText();
    });
    resultElements.recordContainerRight.Number.text.click(function(){
        var numCountText = $(this);
        if(!isKBNCanInput()){return;}
        switch (result.InputType){
            case 1:
                return;
                break;
            case 2:
                pageNavigation("page_results","page_count_numtype_edit");
                setCountNumTypeEditValue(result,callback);
                break;
            case 3:
                // pop input window
                pageNavigation("page_results","page_count_tabtype_edit");
                setCountTabTypeEditValue(result,callback);
                break;
            case 4:
                pageNavigation("page_results","page_count_scantype_edit");
                setCountScanTypeEditValue(result,callback);
                break;
            default:
                break;
        }
        function callback(data){
            if(result.InputType == 4){
                numCountText.text(data.ScanKeyNo);
                result.ScanKeyNo = data.ScanKeyNo;
            } else if(result.InputType != 1){
                numCountText.text(data.Number + data.Practical);
                result.Number = parseInt(data.Number);
                result.Practical = data.Practical;
                result.mPractical_Id = parseInt(data.mPractical_Id);
            }
            changeBorderColorToEdit();
        }
    });
    resultElements.recordContainerLeft.top.text.click(function(e){
        function callback(data){
            resultElements.recordContainerLeft.top.text.text(data.DetailType);
            result.DetailType = data.DetailType;
            result.mWorkKbn_Id = parseInt(data.Id);
            //
            if(data.InputType == 0){
                resultElements.recordContainerRight.Number.text.hide()
            }else{
                resultElements.recordContainerRight.Number.text.show()
            }
            changeBorderColorToEdit();
        }
        setTopEditValue(result,callback);
        pageNavigation("page_results",getTopEditPage());
    });
    //edit customer
//    resultElements.recordContainerLeft.customer.text.click(function(e){
//        function callback(data){
//            resultElements.recordContainerLeft.customer.text.text(data.CustomerName);
//            resultElements.recordContainerLeft.customer.text.css("color","");
//            result.mCustomer_Id = data.Id;
//            changeBorderColorToEdit();
//        }
//        setCustomerEditValue(result,callback);
//        pageNavigation("page_results","page_customer_edit");
//    });
    function changeBorderColorToEdit(){
        resultEditCount++;
        if(result.StatusCode != 0)
        {
            resultElements.resultContainer.css("border","solid 5px #2F75B5")
        }
    }
    function isKBNCanInput(){
        var canInput = true;
        $.each(workKBNList,function(index,workKBN){
            if(workKBN.Id == result.mWorkKbn_Id && workKBN.InputType == 0)
            {
               canInput = false;
               return false;
            }
        });
        return canInput;
    }
    // set values
    resultElements.resultContainer.data("resultData",result);
    resultElements.recordContainerLeft.top.text.text(result.DetailType);
    resultElements.recordContainerLeft.top.text.val(result.mWorkKbn_Id);
    if(result.mCustomer_Id){
        resultElements.recordContainerLeft.customer.text.text(customersObj[result.mCustomer_Id]);
        resultElements.recordContainerLeft.customer.text.val(result.mCustomer_Id);
    }else{
        resultElements.recordContainerLeft.customer.text.text(loginJson.Result.mLanguage["MOBILEUSER_CUSROMERSEL"]);
        resultElements.recordContainerLeft.customer.text.css("color","#ccc");
    }
    resultElements.recordContainerLeft.customer.container.click(function () {
        $("#page_results").hide();
        customerInit(function (selectedCustomer) {
            result.mCustomer_Id = selectedCustomer.Id;
            resultElements.recordContainerLeft.customer.text.text(customersObj[result.mCustomer_Id]);
            resultElements.recordContainerLeft.customer.text.val(result.mCustomer_Id);
            resultEditCount++;
            $("#page_results").show();
            $("#page_customer").hide();
        });
        $("#page_customer").show();
    });

    resultElements.recordContainerRight.time.StartDateTime.text.timepicker("setTime", result.StartDateTime.split(" ")[1]);
    resultElements.recordContainerRight.time.EndDateTime.text.timepicker("setTime", result.EndDateTime.split(" ")[1]);
    if(result.InputType == 4){
        resultElements.recordContainerRight.Number.text.text(result.ScanKeyNo);
    }else if((result.InputType == 2 || result.InputType == 3) && result.Practical){
        resultElements.recordContainerRight.Number.text.text(result.Number + result.Practical);
    }
    if(resultElements.recordContainerRight.Number.text.text() == ""){
        resultElements.recordContainerRight.Number.text.text("0");
    }
    if(!isKBNCanInput()){
        resultElements.recordContainerRight.Number.text.hide();
    }
    if(result.StatusCode == 1){
        resultElements.resultContainer.css("border","solid 5px #70AD47");
    }
    // append html elements
    resultElements.resultContainer.append(
        resultElements.checkBoxContainer.container.append(
            resultElements.checkBoxContainer.label.append(
                resultElements.checkBoxContainer.checkbox,
                resultElements.checkBoxContainer.span
            )
        ),
        resultElements.recordContainerLeft.container.append(
            resultElements.recordContainerLeft.customer.container.append(
                resultElements.recordContainerLeft.customer.text
            ),
            resultElements.recordContainerLeft.top.container.append(
                resultElements.recordContainerLeft.top.text
            ),
        ),
        resultElements.recordContainerRight.container.append(
            resultElements.recordContainerRight.time.container.append(
                resultElements.recordContainerRight.time.StartDateTime.container.append(
                    resultElements.recordContainerRight.time.StartDateTime.text
                ),
                resultElements.recordContainerRight.time.EndDateTime.container.append(
                    resultElements.recordContainerRight.time.EndDateTime.text
                )
            ),
            resultElements.recordContainerRight.Number.container.append(
                resultElements.recordContainerRight.Number.text
            ),
        )
    );
    content.append(resultElements.resultContainer);
    if(isRestKBN)
    {
        resultElements.recordContainerRight.time.StartDateTime.text.attr("disabled","disabled");
        resultElements.recordContainerRight.time.EndDateTime.text.attr("disabled","disabled");
        resultElements.recordContainerRight.Number.container.remove()
        resultElements.recordContainerLeft.customer.container.remove();
        resultElements.recordContainerLeft.top.text.unbind("click");
    }
}
function checkCBLengthToChangeBtnText(){
    var cbCheckedLength = $("input[name='cb_results']:checkbox:checked").length;
    var cbLength = $("input[name='cb_results']:checkbox").length;
    if(cbCheckedLength < cbLength || cbLength == 0){
        btn_results_selectall.text(btnSelectAllText);
    }else{
        btn_results_selectall.text(btnDeselectAllText);
    }
}
$(function () {
  // set all select/deselect
    btn_results_selectall.click(function(){
        if($("input[name='cb_results']:checkbox").length == 0){return;}
        var checkAll = false;
        if($(this).text().trim() == btnSelectAllText){
            $(this).text(btnDeselectAllText);
            $("input[name='cb_results']:checkbox").each(function(index,item){
                if(!$(item).is(":checked")){
                    $(item).click();
                }
            });
        }else{
            $(this).text(btnSelectAllText);
            $("input[name='cb_results']:checkbox").each(function(index,item){
                if($(item).is(":checked")){
                    $(item).click();
                }
            });
        }
        $("input[name='cb_results']:checkbox").attr("checked",checkAll)
    });
    btn_results_delete.click(function(){
        if($("input[name='cb_results']:checkbox:checked").length==0){return}
        showConfirmBox(loginJson.Result.mMessage["WEB_MESSAGE3002"],function(){
            var resultRemoveList = [];
            $("input[name='cb_results']:checkbox:checked").each(function(index,item){
                var resultElement = $(item).parent().parent().parent();
                var resultData = resultElement.data("resultData");
                //delete element from content
                resultData.DelFlg = 1
                resultRemoveList.push(resultData);
                if(resultData.StatusCode == 0){
                    resultElement.remove();
                }else{
                    resultElementRemoveList.push(resultElement);
                }
            });
            removeResults(resultRemoveList);
        })
    });
    //go back to top page
    btn_close_results.click(function(e){
        if(resultEditCount > 0){
            showConfirmBox(loginJson.Result.mMessage["WEB_MESSAGE3006"],function(){
                pageNavigation("page_results",getTopPage());
            });
        }else{
            pageNavigation("page_results",getTopPage());
        }
    });
    // send data for update
    btn_results_senddata.click(function(e){
        if($("input[name='cb_results']:checkbox:checked").length==0){return}
        showConfirmBox(loginJson.Result.mMessage["WEB_MESSAGE3001"],function(){
            var resultList_update = [];
            $("input[name='cb_results']:checkbox:checked").each(function(index,item){
                 var resultElement = $(item).parent().parent().parent();
                 var resultData = resultElement.data("resultData");
                 resultList_update.push(resultData);
            });
            // send
            sendResultsToServer(resultList_update);
        })
    });
})
