var top_edit_callback;
var content_top_edit = $("#content_top_edit");
var content_top_h_edit = $("#content_top_h_edit");
// init top page
function topEditInit(customerId){
    var workKBNList = loginJson.Result.mWorkKbn.filter(function(workKBN) {
                                                    return workKBN.mCustomer_Id == customerId;
                                                }).filter(function(workKBN) {
                                                    return workKBN.RestFlg == 0;
                                                });
    var settingInfo = loginJson.Result.mMobileSet;
	var content = content_top_edit.empty();
    var content_h = content_top_h_edit.empty();
	var topColumn = $("<div/>").addClass("m-stack m-stack--ver m-stack--general m-stack--demo m-stack--demorow");
    var topColumn_h = $("<div/>").addClass("m-stack m-stack--ver m-stack--general m-stack--demo m-stack--demorow");
	var preClickedBtn;
	$.each(workKBNList,function(index,workKBN){
		var topButtonElements = {
			topContainer : $("<div/>").addClass("m-stack__item m-stack__item--center m-stack__item--middle"),
			topButton : $("<div/>").addClass("btn_top_edit"),
			topOutter : $("<div/>").addClass("main-btn-outter"),
			topInner : $("<div/>").addClass("main-btn-inner"),
			topIcon : $("<i/>"),
			topText : $("<p/>")
		}
		topButtonElements.topButton.addClass("btn btn-outline-" + workKBN.ButtonColor + " m-btn m-btn--custom m-btn--outline-2x active main-btn");
		// add click event 
		topButtonElements.topButton.click(function(){
            //change bgColor
            setTopEditBgColor($(this).data("kbnInfo").Id);
            if(typeof top_edit_callback == "function"){
                top_edit_callback($(this).data("kbnInfo"));
            }
		});
        // set values
        topButtonElements.topButton.data("kbnInfo",workKBN);
        topButtonElements.topButton.attr("topEditId",workKBN.Id);
        topButtonElements.topText.text(workKBN.DetailType)
        // append html elements
		if(workKBN.Icon){
			topButtonElements.topButton.append(
				topButtonElements.topIcon.addClass(workKBN.Icon),
				topButtonElements.topText.css("-webkit-line-clamp","1").text(workKBN.DetailType)
			)
		}else{
			topButtonElements.topButton.append(
				topButtonElements.topOutter.append(
					topButtonElements.topInner.append(
						topButtonElements.topText.css("-webkit-line-clamp","4")
					)
				)
			)
		}
		topColumn.append(
			topButtonElements.topContainer.append(
				topButtonElements.topButton
			)
		)
        topColumn_h.append(
            topButtonElements.topContainer.clone(true)
        )
		if((index+1)%3 == 0 || index == (workKBNList.length-1)){
            content.append(topColumn);
            topColumn = $("<div/>").addClass("m-stack m-stack--ver m-stack--general m-stack--demo m-stack--demorow");
		}
        if((index+1)%5 == 0 || index == (workKBNList.length-1)){
            content_h.append(topColumn_h);
            topColumn_h = $("<div/>").addClass("m-stack m-stack--ver m-stack--general m-stack--demo m-stack--demorow");
        }
	});
    if(workKBNList.length%3 != 0){
        for(var i = 0;i<(3-(workKBNList.length%3));i++){
            content.children().last().append(
                $("<div/>").addClass("m-stack__item m-stack__item--center m-stack__item--middle")
            )
        }
    }
    if(workKBNList.length%5 != 0){
        for(var i = 0;i<(5-(workKBNList.length%5));i++){
            content_h.children().last().append(
                $("<div/>").addClass("m-stack__item m-stack__item--center m-stack__item--middle")
            )
        }
    }
}
function setTopEditValue(result,callBack){
    topEditInit(result.mCustomer_Id)
    setTopEditBgColor(result.mWorkKbn_Id);
    top_edit_callback = callBack;
}
function setTopEditBgColor(topEditId){
    $(".btn_top_edit").removeClass("btn-outline-danger");
    $(".btn_top_edit").css("border","");
    $("[topEditId="+topEditId+"]").addClass("btn-outline-danger");
    $("[topEditId="+topEditId+"]").css("border","solid 3px #8B0000");
}
$(function () {
  //go back to top page
  $("#btn_close_top_edit,#btn_close_top_h_edit").click(function(e){
    pageNavigation(getTopEditPage(),"page_results");
  });
});
