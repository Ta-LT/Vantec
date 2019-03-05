var sp_bc_check_type = $("#sp_bc_check_type");
var sp_bc_check_title1 = $("#sp_bc_check_title1");
var sp_bc_check_title2 = $("#sp_bc_check_title2");
var txt_bc_check_code1 = $("#txt_bc_check_code1");
var txt_bc_check_code1_proxy = $("#txt_bc_check_code1_proxy");
var txt_bc_check_code2 = $("#txt_bc_check_code2");
var txt_bc_check_code2_proxy = $("#txt_bc_check_code2_proxy");
var btn_cb_check_result = $("#btn_cb_check_result");

function resetBCCheck() {
    sp_bc_check_type.text(currentCustomer.BarcodeUseName);
    sp_bc_check_title1.text(currentCustomer.BarcodeName1);
    sp_bc_check_title2.text(currentCustomer.BarcodeName2);
    txt_bc_check_code1.val("");
    //txt_bc_check_code1.focus(function(){$(this).blur()})
    txt_bc_check_code1_proxy.val("")
    txt_bc_check_code2.val("");
    //txt_bc_check_code2.focus(function(){$(this).blur()})
    txt_bc_check_code2_proxy.val("")
    txt_bc_check_code1_proxy.focus();
    //txt_bc_check_code1_proxy.blur(function(){$(this).focus()})
    btn_cb_check_result.hide();
}
function showBCCheckResult(bcCheckCode1, bcCheckCodeDate1, bcCheckCode2, bcCheckCodeDate2) {


    if (bcCheckCode1 === bcCheckCode2) {
        playLocalAutio("ok.mp3");
        btn_cb_check_result.text("OK");
        btn_cb_check_result.css("background", "rgb(0, 227, 0)");
    } else {
        playLocalAutio("ng.mp3");
        btn_cb_check_result.text("NG");
        btn_cb_check_result.css("background", "yellow");
    }
    sendBcListToServer({
        mAccount_Id: loginJson.Result.mAccount.Id,
        mWorkKbn_Id: currentWorkKbn,
        mCustomer_Id: currentCustomer ? currentCustomer.Id : null,
        WorkDate: new Date(),
        Barcode1: bcCheckCode1,
        StartDateTime1: bcCheckCodeDate1,
        Barcode2: bcCheckCode2,
        StartDateTime2: bcCheckCodeDate2,
        Collation: (bcCheckCode1 === bcCheckCode2 ? "OK" : "NG")
    });
    btn_cb_check_result.show();
}
function getChangedVal(bcCheckCode) {
    var returnValue = null;
    $.each(loginJson.Result.mAlternation, function (alterIndex, alterItem) {
        if (alterItem.ConvertedCode == bcCheckCode) {
            returnValue = alterItem.AfterCode;
            return false;
        }
    });
    return returnValue;
}
$(function () {
    var bcCheckCode1;
    var bcCheckCode2;
    var bcCheckCode1Date;
    var bcCheckCode2Date;
    txt_bc_check_code1_proxy.change(function (e) {
        bcCheckCode1 = $(this).val();
        bcCheckCode1Date = new Date();
        txt_bc_check_code1_proxy.unbind("blur");
        txt_bc_check_code2_proxy.focus();
        txt_bc_check_code2_proxy.blur(function () { $(this).focus() })
        $(this).val("");
    });
    txt_bc_check_code1.change(function (e) {
        bcCheckCode1 = $(this).val();
        bcCheckCode1Date = new Date();
        var BcCheck = currentCustomer;
        switch (BcCheck.Pipe1) {
            case 0:
                break;
            case 1:
                if (BcCheck.StartLine1) {
                    bcCheckCode1 = bcCheckCode1.substr(0, BcCheck.StartLine1);
                }
                break;
            case 2:
                if (BcCheck.MidStartLine1 && BcCheck.MidEndLine1) {
                    bcCheckCode1 = bcCheckCode1.substr(BcCheck.MidStartLine1 - 1, BcCheck.MidEndLine1);
                }
                break;
            case 3:
                if (BcCheck.EndLine1) {
                    bcCheckCode1 = bcCheckCode1.substr(bcCheckCode1.length - BcCheck.EndLine1, BcCheck.EndLine1);
                }
                break;
            case 4:
                var changedCode = getChangedVal(bcCheckCode1);
                if (changedCode) {
                    bcCheckCode1 = changedCode;
                    txt_bc_check_code1.val(bcCheckCode1);
                }
                break;
            default:
                break;
        }
        txt_bc_check_code2.focus();
    });
    txt_bc_check_code2_proxy.change(function (e) {
        bcCheckCode2 = $(this).val();
        bcCheckCode2Date = new Date();
        txt_bc_check_code2_proxy.unbind("blur");
        $(this).val("");
        showBCCheckResult(bcCheckCode1, bcCheckCode1Date, bcCheckCode2, bcCheckCode2Date);
    });
    txt_bc_check_code2.change(function (e) {
        bcCheckCode2 = $(this).val();
        bcCheckCode2Date = new Date();

        var BcCheck = currentCustomer;
        switch (BcCheck.Pipe2) {
            case 0:
                break;
            case 1:
                if (BcCheck.StartLine2) {
                    bcCheckCode2 = bcCheckCode2.substr(0, BcCheck.StartLine2);
                }
                break;
            case 2:
                if (BcCheck.MidStartLine2 && BcCheck.MidEndLine2) {
                    bcCheckCode2 = bcCheckCode2.substr(BcCheck.MidStartLine2 - 1, BcCheck.MidEndLine2);
                }
                break;
            case 3:
                if (BcCheck.EndLine2) {
                    bcCheckCode2 = bcCheckCode2.substr(bcCheckCode2.length - BcCheck.EndLine2, BcCheck.EndLine2);
                }
                break;
            case 4:
                var changedCode = getChangedVal(bcCheckCode2);
                if (changedCode) {
                    bcCheckCode2 = changedCode;
                    txt_bc_check_code2.val(bcCheckCode2);
                }
                break;
            default:
                break;
        }
        showBCCheckResult(bcCheckCode1, bcCheckCode1Date, bcCheckCode2, bcCheckCode2Date);
    });
    txt_bc_check_code1_proxy.on('input', function () {
        txt_bc_check_code1.val(this.value);
    });
    txt_bc_check_code2_proxy.on('input', function () {
        txt_bc_check_code2.val(this.value);
    });
    // click result button back to scan
    btn_cb_check_result.click(function (e) {
        btn_cb_check_result.hide();
        txt_bc_check_code1.val("");
        txt_bc_check_code2.val("");
        txt_bc_check_code1_proxy.focus();
        txt_bc_check_code1_proxy.blur(function () { $(this).focus() })
    });
    //go back to top page
    $("#btn_close_bc_check").click(function (e) {
        txt_bc_check_code1_proxy.unbind("blur");
        txt_bc_check_code1_proxy.blur();
        txt_bc_check_code2_proxy.unbind("blur");
        txt_bc_check_code2_proxy.blur();
        pageNavigation("page_bc_check", getTopPage());
    });
})
