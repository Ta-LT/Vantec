$(function () {
  
  initBtns()
  
  var btns = $('.btn.m-btn--air');
  //m-btn--air btn-outline-info m-btn m-btn--custom m-btn--outline-2x active main-btn
  btns.removeClass("active");
  //btns.removeClass("btn");
  btns.removeClass("m-btn--air");
  //btns.removeClass("m-btn");
  
  //btns.removeClass("m-btn--custom");
  
  //btns.removeClass("m-btn--outline-2x");
  
  //btns.removeClass("main-btn");
  
  var preClickedBtn
  $.each(btns, function (index, btn) {
         $(btn).css('background-color',$(btn).css('border-color'))
         $(btn).css('color','#ffffff');
         $(btn).css('-webkit-box-shadow','inset 0 0 5px 2px rgba(0,0,0,.75)');
         $(btn).on("click",function(e){
                   
                   if(preClickedBtn){
                   preClickedBtn.css('background-color',preClickedBtn.css('border-color'))
                   preClickedBtn.css('color','#ffffff');
                   }
                   $(this).css('background-color','red')
                   $(this).css('color','#212529');
                   preClickedBtn = $(this)
                   })
    });
  //create button (作業区分)
  $("#btn_logout").click(function(){
                         
                         $("#page_top").hide()
                         $("#page_login").show()
                         })
  })
function initBtns(){
    var container = $("#main-container")
    
    //container.append(createBtn("New Button","fa fa-medkit"))
}
function createBtn(name,fa){
    var newBtn = $("<div/>").addClass("m-stack__item m-stack__item--center m-stack__item--middle").append(                                                                   $("<div/>").addClass("btn m-btn--air btn-outline-info m-btn m-btn--custom m-btn--outline-2x active main-btn").append(                                                                                                                                                                                                                       $("<table/>").append(                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      $("<tr/>").append(                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 $("<td/>").append($("<i class="+fa+"/>"),$("<p>"+name+"</p>")                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       ))                                                                                                                                                                                                                                                                                )                                                                          ))
    return newBtn
}
