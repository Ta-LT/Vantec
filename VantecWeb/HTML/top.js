var span_workkbn_names = $(".workkbn-name");
// init top page
function topInit(customerId){
    var workKBNList = loginJson.Result.mWorkKbn.filter(function(workKBN) {
                                                    return workKBN.mCustomer_Id == customerId;
                                                });
	var content = $("#content_top").empty();
    var content_h = $("#content_top_h").empty();
	var topColumn = $("<div/>").addClass("m-stack m-stack--ver m-stack--general m-stack--demo m-stack--demorow");
    var topColumn_h = $("<div/>").addClass("m-stack m-stack--ver m-stack--general m-stack--demo m-stack--demorow");
	//var preClickedBtn;
	$.each(workKBNList,function(index,workKBN){
		var topButtonElements = {
			topContainer : $("<div/>").addClass("m-stack__item m-stack__item--center m-stack__item--middle"),
			topButton : $("<div/>").addClass("btn_top"),
			topOutter : $("<div/>").addClass("main-btn-outter"),
			topInner : $("<div/>").addClass("main-btn-inner"),
			topIcon : $("<i/>"),
			topText : $("<p/>")
		}
		topButtonElements.topButton.addClass("btn btn-outline-" + workKBN.ButtonColor + " m-btn m-btn--custom m-btn--outline-2x active main-btn");
		// add click event 
		topButtonElements.topButton.click(function(){
            var isFirstClick = !$(this).hasClass("btn-outline-danger")
            var isCustomerPreClick = loginJson.Result.mAccount.MultiKBN == 2 && loginJson.Result.mAccount.CheckFlg == 2
            var restFlg = workKBN.RestFlg == 1
            var autoRest = (loginJson.Result.mTimeSet && loginJson.Result.mTimeSet.AutoRest == 1)
            var inputType = loginJson.Result.mMobileSet.InputType
            // case when restFlg is true then do nothing
            if (autoRest && restFlg) { return }
            function navigateToKbn(groupPeople) {
                if (isFirstClick) {
                    //end current work
                    workEnd();
                    // todo if has customer pre click mode
                    if (isCustomerPreClick && !restFlg) {
                        isCallFromTopClick = true;
                        pageNavigation(getTopPage(), "page_customer");
                    }
                    // start to work
                    workStart(topButtonElements.topButton.text(), parseInt(topButtonElements.topButton.attr("topId")), groupPeople);
                    // count type init
                    resetCountTabType();
                    resetCountNumType();
                    resetCountScanType();
                }
                inputFlg = workKBN.InputType;
                if (!isFirstClick || !isCustomerPreClick) {
                    //show count page
                    if (inputType != 1 && inputFlg != 0) {
                        showCountPage(getTopPage());
                    }
                }
                //set work kbn name as input page title
                span_workkbn_names.text(workKBN.DetailType);
            }
            var currentSelectedWorkKbn = null;
            $.each(loginJson.Result.mWorkKbn, function (kbnIndex, kbnItem) {
                if (kbnItem.Id == topButtonElements.topButton.attr("topId")) {
                    currentSelectedWorkKbn = kbnItem;
                }
            })
            if (currentSelectedWorkKbn && currentSelectedWorkKbn.Member === 1) {
                pageNavigation(getTopPage(), "page_group_person_number_edit");
                $("#page_group_person_number_edit").data("oncommit",function(groupPeople){
                    navigateToKbn(groupPeople);
                });
            }
            else {
                navigateToKbn();
            }
		});
        // set values
        topButtonElements.topButton.attr("topId",workKBN.Id);
        topButtonElements.topText.text(workKBN.DetailType);
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
    
    //set customer button
    if(loginJson.Result.mAccount.MultiKBN == 1){
        $("#btn_top_customer_open,#btn_top_h_customer_open").hide();
    }else{
        $("#btn_top_customer_open,#btn_top_h_customer_open").show();
    }
}
$(function () {
	// do logout
	$("#btn_logout,#btn_logout_h").click(function(){
        showConfirmBox(loginJson.Result.mMessage["WEB_MESSAGE0068"],function(){
            //end current work
            workEnd();
            //logout
            logout();
        });
	});
	//open customers selecttion page
	$("#btn_top_customer_open,#btn_top_h_customer_open").click(function(e) {
        isCallFromTopClick = false;
		pageNavigation(getTopPage(),"page_customer");
	});
	//open setting page
	$("#btn_open_setting,#btn_open_setting_h").click(function(e){
		pageNavigation(getTopPage(),"page_setting");
	});
	//open results page
	$("#btn_open_results,#btn_open_results_h").click(function(e){
        showResultList();
		pageNavigation(getTopPage(),"page_results");
	});
    //Daily Output
    $("#btn_report_output,#btn_report_output_h").click(function(e){
        showConfirmBox(loginJson.Result.mMessage["WEB_MESSAGE0069"],function(){
            dailyOutput();
        });
    });
    //BC Check
    $("#btn_bc_check,#btn_bc_check_h").click(function(e){
        pageNavigation(getTopPage(),"page_bc_check");
        resetBCCheck();
    });
});
