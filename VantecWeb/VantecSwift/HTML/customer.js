var isCallFromTopClick = true;
var span_customer_names = $(".customer-name");
var div_bc_check = $("#div_bc_check,#div_bc_check_h");
// init top page
function customerInit(){
	createCustomers(loginJson.Result.mCustomer)
}
// create customer on page
function createCustomers(customers){
	var content = $("#content_customer").empty();
    span_customer_names.text("");
	//var customerColumn = $("<div/>").addClass("m-stack m-stack--ver m-stack--general m-stack--demo m-stack--demorow");
	$.each(customers,function(index,customer){
		var customerButtonElements = {
			customerContainer : $("<div/>").addClass("m-stack__item m-stack__item--center m-stack__item--middle").addClass("customer-btn"),
			customerButton : $("<div/>"),
			customerOutter : $("<div/>").addClass("main-btn-outter"),
			customerInner : $("<div/>").addClass("main-btn-inner"),
			customerText : $("<p/>")
		}
		customerButtonElements.customerButton.addClass("btn m-btn--air btn-outline-info m-btn m-btn--custom m-btn--outline-2x main-btn").addClass("btn_customer");
		// add click event 
		customerButtonElements.customerButton.click(function(){
            if(!$(this).hasClass("select")){
                //end current work
                workEnd();
                //init workkbn by customer id
                topInit(customer.Id);
                //init rest time
                restTimeInit(customer.Id);
                // clear workkbn text
                span_workkbn_names.text("");
            }
            $(".btn_customer").removeClass("select");
            $(this).addClass("select");
            span_customer_names.text(customer.CustomerName);
            if(currentResult){
                currentResult.mCustomer_Id = parseInt(customer.Id);
            }
            //can bccheck button show up
            if(customer.BarcodeUse == 1){
                div_bc_check.show();
            }else{
                div_bc_check.hide();
            }
            currentCustomer = customer;
            closeCustomer();
		});
        // set values
        customerButtonElements.customerButton.attr("mCustomer_Id",customer.Id);
        customerButtonElements.customerText.text(customer.CustomerName)
        // append html elements
		customerButtonElements.customerButton.append(
			customerButtonElements.customerOutter.append(
				customerButtonElements.customerInner.append(
					customerButtonElements.customerText
				)
			)
		)

		
        //customerColumn.append(
        content.append(
			customerButtonElements.customerContainer.append(
				customerButtonElements.customerButton
			)
		)
//        if((index+1)%3 == 0 || index == (customers.length-1)){
//            content.append(customerColumn);
//            customerColumn = $("<div/>").addClass("m-stack m-stack--ver m-stack--general m-stack--demo m-stack--demorow");
//        }
	});
    
//    if(customers.length%3 != 0){
//        for(var i = 0;i<(3-(customers.length%3));i++){
//            content.children().last().append(
//                $("<div/>").addClass("m-stack__item m-stack__item--center m-stack__item--middle")
//            )
//        }
//    }
}
function closeCustomer(){
    if(isCallFromTopClick && loginJson.Result.mAccount.CheckFlg == 2 && inputFlg != 0)
    {
        //show count page
        showCountPage("page_customer");
    } else{
        pageNavigation("page_customer",getTopPage());
    }
}
$(function () {
//    $("#btn_close_customer").click(function(){
//        closeCustomer()
//    });
});
