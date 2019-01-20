var customer_edit_callback;
// init top page
function customerEditInit(){
	createCustomersForEdit(loginJson.Result.mCustomer)
}
// create customer on page_edit
function createCustomersForEdit(customers){
	var content = $("#content_customer_edit").empty();
	//var customerColumn = $("<div/>").addClass("m-stack m-stack--ver m-stack--general m-stack--demo m-stack--demorow");
	var preClickedBtn;
	$.each(customers,function(index,customer){
		var customerButtonElements = {
			customerContainer : $("<div/>").addClass("m-stack__item m-stack__item--center m-stack__item--middle").addClass("customer-btn_edit"),
			customerButton : $("<div/>"),
			customerOutter : $("<div/>").addClass("main-btn-outter"),
			customerInner : $("<div/>").addClass("main-btn-inner"),
			customerText : $("<p/>")
		}
		customerButtonElements.customerButton.addClass("btn m-btn--air btn-outline-info m-btn m-btn--custom m-btn--outline-2x main-btn").addClass("btn_customer_edit");
		// add click event 
		customerButtonElements.customerButton.click(function(){
            $(".btn_customer_edit").removeClass("select");
            $(this).addClass("select");
            if(typeof customer_edit_callback == "function"){
                customer_edit_callback($(this).data("customerInfo"));
            }
		});
        // set values
        customerButtonElements.customerButton.data("customerInfo",customer);
        customerButtonElements.customerButton.attr("mCustomer_edit_Id",customer.Id);
        customerButtonElements.customerText.text(customer.CustomerName)
        // append html elements
		customerButtonElements.customerButton.append(
			customerButtonElements.customerOutter.append(
				customerButtonElements.customerInner.append(
					customerButtonElements.customerText
				)
			)
		)

		
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
function setCustomerEditValue(result,callBack){
    setCustomerEditBgColor(result.mCustomer_Id);
    customer_edit_callback = callBack;
}
function setCustomerEditBgColor(mCustomer_Id){
    $(".btn_customer_edit").removeClass("select");
    $("[mCustomer_edit_Id="+mCustomer_Id+"]").addClass("select");
}
$(function () {
	$("#btn_close_customer_edit").click(function(){
        pageNavigation("page_customer_edit","page_results");
	});
});
