//--- Add Stakeholders section --//
$(document).ready(function() {
    var max_fields      = 4; //maximum input boxes allowed
    var wrapper         = $(".stakeholders"); //Fields wrapper
    var add_button      = $(".add-field"); //Add button ID

    var x = 1; //initial text box count
    $(add_button).click(function(e){ //on add input button click
        e.preventDefault();
        if(x < max_fields){ //max input box allowed
            x++; //text box increment
            //$(wrapper).append('<div class="medium-collapse added-stakeholder"><div class="column small-10 medium-11"><input type="text" name="extraname" placeholder="name"/><input type="text" name="extraemail" placeholder="email"/></div><div class="column small-2 medium-1 end"><a href="#" class="remove-field alert button ">&minus;</a></div></div>'); //add input box

            var extraname_block_01 = '<div class="medium-collapse added-stakeholder"><div class="column small-10 medium-11"><input type="text" name="extraname_',
            extraname_block_02 = x+'" placeholder="name"/><input type="text" name="extraemail_',
            extraname_block_03 = x+'" placeholder="email"/></div><div class="column small-2 medium-1 end"><a href="#" class="remove-field alert button ">&minus;</a></div></div>';

            $(wrapper).append(extraname_block_01 + extraname_block_02 + extraname_block_03);

        }
    });

    $(wrapper).on("click",".remove-field", function(e){ //user click on remove text
        e.preventDefault(); $(this).parents('div.added-stakeholder').remove(); x--;
    });
});

//-- Add date selection for milestones --//
$(document).ready(function() {
    var max_dates = 3; //maximum input boxes allowed
    var wrapper_milestones = $(".milestones"); //Fields wrapper
    var add_date = $(".add-date"); //Add button ID

    var y = 1; //initial text box count
    $(add_date).click(function(e){ //on add input button click
        e.preventDefault();
        if(y < max_dates){ //max input box allowed
            //var milestonenumber = y.tostring();
            y++; //text box increment

            var firstelement = ('<div class="added-date medium-collapse"><div class="column small-10"><input type="text" name="extramilestone_'),
            extramilestone = y+('" placeholder="description"/><input type="text" name="extradate_'),
            extradate = y+('" id="datepicker'),
            secondelement = "_"+y,
            thirdelement = ('" class="datepicker" placeholder="select" /></div><div class="column small-2"><a href="#" class="remove-field alert button ">&minus;</a></div></div>');

            $(wrapper_milestones).append(firstelement + extramilestone + extradate + secondelement + thirdelement);

            var datepicker = "#datepicker_"+y;
            //$(datepicker).on("click", datepicker, function(){
            $(datepicker).datepicker({ dateFormat: "dd/mm/yy", minDate: +15 });
            $(wrapper_milestones).find('input, select').val('');
            //});
            //$(wrapper_milestones).append('<div class="row added-date"><div class="column small-11"><input type="text" name="extra-milestone[]" placeholder="description"/><input type="text" name="extra-date[]" id="addedmilestone_{milestonenumber}"/></div><div class="column small-1"><a href="#" class="remove-field alert button ">&minus;</a></div></div>'); //add input box
        }

        //function finishnewmilestone() {
        //var milestonenumber = y.tostring();
        //var milestone = document.getElementById(id);
        //var id = milestone.getAttribute('id').replace('{milestonenumber}', milestonenumber);
        //milestone.id = id;
      //}
      //finishnewmilestone();
    });

    $(wrapper_milestones).on("click",".remove-field", function(e){ //user click on remove text
        e.preventDefault(); $(this).parents('div.added-date').remove(); y--;
    });
});
