<?php
$recipient_email    = "send@destination.email"; //recipient - where do you want the content sent
$from_email         = "sent@source.email"; //from email using site domain.

if(!isset($_SERVER['HTTP_X_REQUESTED_WITH']) AND strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
    die('Sorry Request must be Ajax POST'); //exit script
}

if($_POST){

    $ownername    = filter_var($_POST["ownername"], FILTER_SANITIZE_STRING); //capture sender name
    $owneremail   = filter_var($_POST["owneremail"], FILTER_SANITIZE_STRING); //capture sender email
    $title        = filter_var($_POST["title"], FILTER_SANITIZE_STRING); //capture project title
    $description  = filter_var($_POST["description"], FILTER_SANITIZE_STRING); //capture message
    $duedate      = filter_var($_POST["due_date"], FILTER_SANITIZE_STRING); //capture due date
    $attachments  = $_FILES['file_attach'];
    $requestdate  = date("d/m/Y");

    //CLEAN THIS UP LATER
    $stakeholder_01      = filter_var($_POST["extraname_1"], FILTER_SANITIZE_STRING);
    $stakeholderemail_01 = filter_var($_POST["extraemail_1"], FILTER_SANITIZE_STRING);
    $stakeholder_02      = filter_var($_POST["extraname_2"], FILTER_SANITIZE_STRING);
    $stakeholderemail_02 = filter_var($_POST["extraemail_2"], FILTER_SANITIZE_STRING);
    $stakeholder_03      = filter_var($_POST["extraname_3"], FILTER_SANITIZE_STRING);
    $stakeholderemail_03 = filter_var($_POST["extraemail_3"], FILTER_SANITIZE_STRING);
    $stakeholder_04      = filter_var($_POST["extraname_4"], FILTER_SANITIZE_STRING);
    $stakeholderemail_04 = filter_var($_POST["extraemail_4"], FILTER_SANITIZE_STRING); //Seriously, clean this up, it's terrible
    //Aaaaand this mess too
    $milestoned_01 = filter_var($_POST["extramilestone_1"], FILTER_SANITIZE_STRING);
    $milestone_01  = filter_var($_POST["extradate_1"], FILTER_SANITIZE_STRING);
    //$milestoned_02 = filter_var($_POST["extramilestone_2"], FILTER_SANITIZE_STRING);
    //$milestone_02  = filter_var($_POST["extradate_2"], FILTER_SANITIZE_STRING);
    //$milestoned_03 = filter_var($_POST["extramilestone_3"], FILTER_SANITIZE_STRING);
    //$milestone_03  = filter_var($_POST["extradate_3"], FILTER_SANITIZE_STRING);

    //php validation
    if(strlen($ownername)<4){ // If length is less than 4 it will output JSON error.
        print json_encode(array('type'=>'error', 'text' => 'Name is too short or empty!'));
        exit;
    }
    if(!filter_var($owneremail, FILTER_VALIDATE_EMAIL)){ //email validation
        print json_encode(array('type'=>'error', 'text' => 'Please enter a valid email!'));
        exit;
    }
    if(strlen($title)<3){ //check emtpy subject
        print json_encode(array('type'=>'error', 'text' => 'Project title required'));
        exit;
    }
    if(strlen($description)<3){ //check emtpy message
        print json_encode(array('type'=>'error', 'text' => 'Write a project outline'));
        exit;
    }

    //Assemble message
    $subjectline = $title . " [" . $requestdate . "]" . " [" . $duedate . "]";

    $assembledMessageWithEntities = "## Job Owner " . " <br /> " . $ownername . " - " . $owneremail . " <br /> " . "## Due Date: " . $duedate . " <br />-----<br /> " . "## Job Description " . " <br /> " . "<p>" . $description . "</p>" . " <br />-----<br /> " . "Stakeholders:<br />" . $stakeholder_01 . " - " . $stakeholderemail_01 . " <br /> " . $stakeholder_02 . " - " . $stakeholderemail_02 . " <br /> " . $stakeholder_03 . " - " . $stakeholderemail_03 . " <br /> " . $stakeholder_04 . " - " . $stakeholderemail_04 . " <br />-----<br /> " . "Milestones: <br /> " . $milestoned_01 . " <br /> " . $milestone_01; //. "\n" . $milestoned_02 . "\n" . $milestone_02 . "\n" . $milestoned_03 . "\n" . $milestone_03;

    //Convert HTML entity codes
    $assembledMessage = html_entity_decode($assembledMessageWithEntities);

    $file_count = count($attachments['name']); //count total files attached
    $boundary = md5("sanwebe.com");

    if($file_count > 0){ //if attachment exists
        //header
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "From:".$from_email."\r\n";
        $headers .= "Reply-To: ".$owneremail."" . "\r\n";
        $headers .= "Content-Type: multipart/mixed; boundary = $boundary\r\n\r\n";

        //message text
        $body = "--$boundary\r\n";
        $body .= "Content-Type: text/html; charset=utf-8\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $body .= chunk_split(base64_encode($assembledMessage));

        //attachments
        for ($x = 0; $x < $file_count; $x++){
            if(!empty($attachments['name'][$x])){

                if($attachments['error'][$x]>0) //exit script and output error if we encounter any
                {
                    $mymsg = array(
                    1=>"The uploaded file exceeds the upload_max_filesize directive in php.ini",
                    2=>"The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form",
                    3=>"The uploaded file was only partially uploaded",
                    4=>"No file was uploaded",
                    6=>"Missing a temporary folder" );
                    print  json_encode( array('type'=>'error',$mymsg[$attachments['error'][$x]]) );
                    exit;
                }

                //get file info
                $file_name = $attachments['name'][$x];
                $file_size = $attachments['size'][$x];
                $file_type = $attachments['type'][$x];

                //read file
                $handle = fopen($attachments['tmp_name'][$x], "r");
                $content = fread($handle, $file_size);
                fclose($handle);
                $encoded_content = chunk_split(base64_encode($content)); //split into smaller chunks (RFC 2045)

                $body .= "--$boundary\r\n";
                $body .="Content-Type: $file_type; name="."\"".$file_name."\""."\r\n"; //Escape quotes to allow filenames with spaces
                $body .="Content-Disposition: attachment; filename="."\"".$file_name."\""."\r\n"; //Escape quotes to allow filenames with spaces
                $body .="Content-Transfer-Encoding: base64\r\n";
                $body .="X-Attachment-Id: ".rand(1000,99999)."\r\n\r\n";
                $body .= $encoded_content;
            }
        }

    }else{ //send plain email otherwise
       $headers = "From:".$from_email."\r\n".
        "Reply-To: ".$owneremail. "\n" .
        "X-Mailer: PHP/" . phpversion();
        $body = $assembledMessage;
    }

    $sentMail = mail($recipient_email, $subjectline, $body, $headers);
    if($sentMail) //output success or failure messages
    {
        print json_encode(array('type'=>'done', 'text' => 'Your request has been received'));
        exit;
    }else{
        print json_encode(array('type'=>'error', 'text' => 'Could not send mail! Please check your PHP mail configuration.'));
        exit;
    }
}
