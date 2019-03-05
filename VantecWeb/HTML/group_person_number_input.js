// Plugin Definition
var GroupPersonNumberInput = function() {
    selectedUnit = 1;
    numberItem = null;

    var unitString = "1";
    var errmsgString = "人数を選択してください。";

    var selectUnit = function(event) {
//        setButton(event);
        var unit = $(event).attr('idp');
        $("#unit").html(unit);
        selectedUnit = unit;
    };

    var commit = function(event) {
        setButton(event);
        $("#page_group_person_number_edit").hide();
        if (typeof $("#page_group_person_number_edit").data("oncommit") == "function") {
            $("#page_group_person_number_edit").data("oncommit")(selectedUnit);
        }

        $("#unit").html(unitString);
        var selected = selectedUnit;
        numberItem = null;
        selectedUnit = 1;
    };

    var setButton = function(event) {
        if (numberItem != null) {
            numberItem.css('background-color', 'transparent');
            numberItem.css('color', numberItem.css('border-color'));
        }
        $(event).css('background-color', $(event).css('border-color'));
        $(event).parent().find('.btn-outline-primary,.btn-outline-success,.btn-outline-info,.btn-outline-warning,.btn-outline-danger,.btn-outline-brand,.btn-outline-metal,.btn-outline-accent').css('color', '#FFFFFF');
        $(event).parent().find('.btn-outline-warning,.btn-outline-brand').css('color', '#000000');
        numberItem = $(event);
    };

    var jumpPageTo = function(pageIndex) {
        $("#unit").html(unitString);
        numberItem = null;
        selectedUnit = 1;
        ok.jumpPageTo(pageIndex);
    };

    var handleOnClick = function() {
        $(document).on('click',function(e){
            if (numberItem != null) {
                numberItem.css('background-color', numberItem.css('border-color'));
                numberItem.parent().find('.btn-outline-primary,.btn-outline-success,.btn-outline-info,.btn-outline-danger,.btn-outline-metal,.btn-outline-accent').css('color', '#FFFFFF');
                numberItem.parent().find('.btn-outline-warning,.btn-outline-brand').css('color', '#000000');
            }
        });
    };
    return {
        init: function() {
            handleOnClick();
        },
        selectUnit: function(event) {
            selectUnit(event);
        },
        commit: function(event) {
            commit(event);
        },
        setButton: function(event) {
            setButton(event);
        },
        jumpPageTo: function(pageName) {
            jumpPageTo(pageName);
        }
    };
}();

// Plugin Initialization
jQuery(document).ready(function() {
    GroupPersonNumberInput.init();
});