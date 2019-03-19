var worker;
$(function () {
    $.data(document, "iframes", []);
    addNewloginFrame();
    $(".user").addClass("selected");
    $("#framescontainer iframe").show();
})

function subframeLogedin(username, frameElement, userid) {
    if ($("button.user[userid='" + userid + "']").length > 0) {
        $("button.user[userid='" + userid + "']").click();
        $(frameElement[0].contentWindow.document).find("button#m_login_signin_submit").attr("disabled", false);
        frameElement.remove();
        $("button.user[userid='']").remove();
        addNewloginFrame();
        return true;
    }
    else {
        $("button.user.selected").text(username).attr("userid", userid);
        frameElement.attr("userid", userid);
        $(frameElement[0].contentWindow.document).find("div.m-login__logo span").text(username);
        addNewloginFrame();
        $("#usernamediv").text(username);
        return false;
    }
}
function subframeLogedout(username, frameElement, userid) {
    if ($("button.user[userid='" + userid + "']").length > 0) {
        $("button.user[userid='" + userid + "']").remove();
        frameElement.remove();
        $("button.user[userid='']").click();
        return true;
    }
}
function addNewloginFrame() {
    var newUserloginButton = $("<button type='button'/>").addClass("user").text("New User").attr("userid", "");
    newUserloginButton.click(function () {
        $(".user").removeClass("selected");
        newUserloginButton.addClass("selected");
        $("#framescontainer iframe").hide();
        $("#framescontainer iframe[userid='" + newUserloginButton.attr("userid") + "']").show();
        $("#usernamediv").text(newUserloginButton.text());
    });
    $("#maindiv").append(newUserloginButton);
    var newUserFrame = $("<iframe/>").attr("src", "./HTML/index.html").attr("userid", "");
    $.data(document, "iframes").push(newUserFrame);
    $("#framescontainer").append(newUserFrame.hide());
}