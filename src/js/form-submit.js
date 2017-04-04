var form = $('.ajax');

var allowed_file_size = "15123456"; //allowed file size 15MB
var allowed_files = ['image/png', 'image/jpeg', 'image/pjpeg', 'image/tif', 'image/tiff', 'application/msword', 'text/plain', 'text/richtext', 'application/pdf', 'application/excel', 'application/octet-stream', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']; //allowed file types
var border_color = "#C2C2C2"; //initial input border color

$("#contact_body").submit(function(e){
    e.preventDefault(); //prevent default action
    proceed = true; //set proceed flat to true

    //simple input validation
    $($(this).find("input[data-required=true], textarea[data-required=true]")).each(function(){
            if(!$.trim($(this).val())){ //if this field is empty
                $(this).css('border-color','red'); //change border color to red
                proceed = false; //set do not proceed flag
            }
            //check invalid email
            var email_reg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            if($(this).attr("type")=="email" && !email_reg.test($.trim($(this).val()))){
                $(this).css('border-color','red'); //change border color to red
                proceed = false; //set do not proceed flag
            }
    }).on("input", function(){ //change border color to original
         $(this).css('border-color', border_color);
    });

    //check file size and type before upload, works in modern browsers
    if(window.File && window.FileReader && window.FileList && window.Blob){
        var total_files_size = 0;
        $(this.elements['file_attach[]'].files).each(function(i, ifile){
            console.log("File name: " + ifile);
            if(ifile.value !== ""){ //continue only if file(s) are selected
                if(allowed_files.indexOf(ifile.type) === -1){ //check unsupported file
                    alert( ifile.name + " is unsupported file type!");
                    proceed = false;
                }
             total_files_size = total_files_size + ifile.size; //add file size to total size
             console.log("File size: " + total_files_size); //Print file size to log
             console.log("Max size: " + allowed_file_size);
            }
        });
       if(total_files_size > allowed_file_size){
            alert( "Make sure total file size is less than 15MB!");
            proceed = false;
        }
    }

    //if everything's ok, continue with Ajax form submit
    if(proceed){
        var post_url = $(this).attr("action"); //get form action url
        var request_method = $(this).attr("method"); //get form GET/POST method
        var form_data = new FormData(this); //constructs key/value pairs representing fields and values
//Trying to make modal appear with progress bar on click event
        //$('#info-modal').foundation('open');


        $.ajax({ //ajax form submit
            url : post_url,
            type: request_method,
            data : form_data,
            dataType : "json",
            contentType: false,
            cache: false,
            processData:false,
            xhr: function(){
                //upload Progress
                var xhr = $.ajaxSettings.xhr();
                //var $modal = $('#info-modal');
                if (xhr.upload) {
                    xhr.upload.addEventListener('progress', function(event) {
                        var percent = 0;
                        var position = event.loaded || event.position;
                        var total = event.total;
                        if (event.lengthComputable) {
                            percent = Math.ceil(position / total * 100);
                        }
                        //update progressbar
                        $("#upload-progress .progress-bar").css("width", + percent +"%");
                    }, true);
                }
                return xhr;
            }
        }).done(function(res){ //fetch server "json" messages when done
            if(res.type === "error"){
                $('body').replaceWith('<body><div id="responseWrap" class="alert"><h1>Failure</h1><p>Something has gone wrong.</p><p>Contact the <a href="mailto: t.newcombe@creation.info">Design Manager</a></p></div></body>');
            }

/*            if(res.type === "error"){
                $("#contact_results").html('<div class="error">'+ res.text +"</div>");
            }
*/

            if(res.type === "done"){
                $('body').replaceWith('<body><div id="responseWrap"><h2>Your request has been submitted</h2><a href="#" class="button secondary expanded" onClick="location.reload(true)">Back</a></div></body>');
            }

/*            if(res.type == "done"){
                $("#contact_results").html('<div class="success">'+ res.text +"</div>");
            }
*/
        });
    }
});
