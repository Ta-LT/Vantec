﻿var worker;
$(function () {
    $.data(document, "iframes", []);
    addNewloginFrame();
    $(".user").addClass("selected");
    $("#framescontainer iframe").show();
})

function subframeLogedin(username, frameElement) {
    if ($("button.user[username='" + username + "']").length > 0) {
        $("button.user[username='" + username + "']").click();
        $(frameElement[0].contentWindow.document).find("button#m_login_signin_submit").attr("disabled", false);
        return true;
    }
    else {
        $("button.user.selected").text(username).attr("username", username);
        frameElement.attr("username", username);
        $(frameElement[0].contentWindow.document).find("div.m-login__logo span").text(username);
        addNewloginFrame();
        $("#usernamediv").text(username);
        return false;
    }
}
function subframeLogedout(username, frameElement) {
    if ($("button.user[username='" + username + "']").length > 0) {
        $("button.user[username='" + username + "']").remove();
        frameElement.remove();
        $("button.user[username='']").click();
        return true;
    }
}
function addNewloginFrame() {
    var newUserloginButton = $("<button type='button'/>").addClass("user").text("Login New User").attr("username", "");
    newUserloginButton.click(function () {
        $(".user").removeClass("selected");
        newUserloginButton.addClass("selected");
        $("#framescontainer iframe").hide();
        $("#framescontainer iframe[username='" + newUserloginButton.attr("username") + "']").show();
        $("#usernamediv").text(newUserloginButton.attr("username"));
    });
    $("#maindiv").append(newUserloginButton);
    var newUserFrame = $("<iframe/>").attr("src", "./HTML/index.html").attr("username", "");
    $.data(document, "iframes").push(newUserFrame);
    $("#framescontainer").append(newUserFrame.hide());
}