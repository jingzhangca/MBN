$(document).ready(function() {
    if($.session.get('userEmail')==null||undefined)
    {
        //window.location.replace('../signup/index.html');
    }
    else{
        $('#signUpEmail').val($.session.get('userEmail')); 
    }

    var role;

    var signUpEmail=$('#signUpEmail').val();
    $('select').material_select();



    $('.scrollspy').scrollSpy();
    $('.datepicker').pickadate({
        selectMonths: true,
        selectYears: 15,
    });
    $('#main').siblings().hide();
    $('#main_next').addClass("disabled");
    $('#formula_slider').ionRangeSlider({
        min: 0,
        max: 50,
        from: 10
    });

    $('#sf_slider').ionRangeSlider({
        min: 50,
        max: 100,
        from: 55
    });

    

    $.validator.addMethod("postCodeCheck", function(value) {
        return /^(0[289][0-9]{2})|([1345689][0-9]{3})|(2[0-8][0-9]{2})|(290[0-9])|(291[0-4])|(7[0-4][0-9]{2})|(7[8-9][0-9]{2})$/.test(value) // AU postcode validation
    });

    $.validator.addMethod("mobileNumberCheck", function(value) {
        return /^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{1}(\ |-){0,1}[0-9]{3}$/.test(value) // AU postcode validation
    });


    $('#formValidate').validate({
        rules: {
            baby_due_date: {
                required: true,
            },
            pregnant_mum_name:{
            	required: true,
            },
            baby_first_name: {
                required: true,
            },
            baby_gender: {
                required: true,
                notEqual: "",
            },
            baby_dob: {
                required: true,
            },
            carer_name: {
                required: true,
            },
            feeding_method: {
                required: true,
            },
            //if(feeding_method is formula/mixed) then add formula_age
            sf_flag: {
                required: true,
            },
            //if(sf_flag is true) then add sf_age
            postcode: {
                required: true,
                digits: true,
                postCodeCheck: true,
                minlength: 4,
                maxlength: 4,
            },

            carer_age: {
                required: true,
            },

            language: {
                required: true,
            },

            other_language: {
                required: true,
            },

            carer_country: {
                required: true,
            },

            other_country: {
                required: true,
            },

            from_where: {
                required: true,
            },

            other_from_where: {
                required: true,
            },

            email: {
                required: true,
                email: true,
            },

            mobile: {
                // required: true,
                // digits: true,
                // mobileNumberCheck: true,
                // minlength: 10,
                // maxlength: 10,
            },

            health_practitioner_role: {
                required: true,
            },

            other_health_practitioner_role: {
                required: true,
            },

            health_practitioner_postcode: {
                required: true,
                digits: true,
                postCodeCheck: true,
                minlength: 4,
                maxlength: 4,
            },

            health_practitioner_organisation: {
                required: true,
            },



        },
        //For custom messages
        messages: {
            baby_first_name: {
                required: "Enter a baby name",
            },
            carer_name: {
                required: "Enter your name",
            },
            health_practitioner_postcode: {
                postCodeCheck: "Please input a valid Australian postcode",
                minlength: "Please input a valid Australian postcode",
                maxlength: "Please input a valid Australian postcode",
            },
            postcode: {
                postCodeCheck: "Please input a valid Australian postcode",
                minlength: "Please input a valid Australian postcode",
                maxlength: "Please input a valid Australian postcode",

            },
            mobile: {
                mobileNumberCheck: "Please input a valid Australian mobile number",
                minlength: "Please input a valid Australian mobile number",
                maxlength: "Please input a valid Australian mobile number",
            },
        },
        errorElement: 'div',
        errorPlacement: function(error, element) {
            var placement = $(element).data('error');
            if (placement) {
                $(placement).append(error)
            } else {
                error.insertAfter(element);
            }
        }
    });

    $('#carer_role').change(function() {
        var anchor;
        role = this.value;
        if (role == "mum" || role == "dad" || role == "grandparent" || role == "other_carer") anchor = "#baby_info1"
            else anchor = "#" + role;
        $('#main_next').attr("href", anchor);
        if (role == "mum" || role == "dad") {
            $('#sf_dropdown option[value="na"]').remove();
            $('#baby_name_label').html("What is your baby's first name?");
            $('#baby_dob_label').html("What is your baby's Date of Birth?");
            $('#baby_gender_label').html("What is your baby's gender?");
            $('#feeding_method_label').html("What is your baby's current feeding method?");
            $('#solid_foods_label').html("Has your baby started eating solid foods?");
        } else if (role == "grandparent" || role == "other_carer") {
            $('#formula_age').addClass('hide');
            $('#sf_age').addClass('hide');
            if ($("#sf_dropdown option[value='na']").length == 0) $("#sf_dropdown").append(new Option("I don't know", "na"));
            $('#baby_name_label').html("What is the name of the baby in your care?");
            $('#baby_dob_label').html("What is the Date of Birth of the baby in your care?");
            $('#baby_gender_label').html("What is the gender of the baby in your care?");
            $('#feeding_method_label').html("What is the current feeding method of the baby in your care?");
            $('#solid_foods_label').html("Has the baby in your care been introduced to solid food?");
        }
        $('#sf_dropdown').material_select();
        if (this.value == undefined) $('#main_next').addClass("disabled");
        else $('#main_next').removeClass("disabled");
    });

    $('.datepicker').change(
        function() {
            console.log($(this));
            $(this).valid();
        })

    $('select[name]').change(function() {
        validSelect($(this));
    })


    $('.btn').click(function() {
        var visibleInput = $('input:visible');
        var currentDropdown = $('div:visible').find('select[name]');


        if (($(this).text() == "prev") || (validateElement(visibleInput) && validSelect(currentDropdown) && ($(this).text() == "next"))) {
            var divId = $(this).attr('href');
            //show current # div
            $(divId).show();
            $(divId).siblings().hide();

            //when divId== "#thanks" submit form
            $('.preloader-wrapper').removeClass('hide');
            if (divId == "#thanks") {
                var postData = $('form').serializeToJSON();
                //console.log(postData);
                url = "https://assc-klong-gh.azurewebsites.net/tables/gh_survey";
                //post survey data to survey table
                $.ajax({
                    type: "post",
                    url: url,
                    data: JSON.stringify(postData),
                    contentType: "application/json",
                    dataType: "json",
                    success: function(responseData, textStatus, jqXHR) {
                        $('#message_for_user').html("Information saved. Thanks for your time!");
                        //update login table and set isSurveyDone to 1
                        var postData={email:signUpEmail};
                        console.log(postData);
                        url="https://assc-klong-gh.azurewebsites.net/api/mark_survey_done";
                        $.ajax({
                            type: "post",
                            url: url,
                            data: JSON.stringify(postData),
                            contentType: "application/json",
                            dataType: "json",
                            success: function(responseData, textStatus, jqXHR) {
                                //window.location.replace('../forum/index.html');
                                $('.preloader-wrapper').addClass('hide');
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                //enter here means survey info saved but not set isSurveyDone true.
                                var errorMessage = "Something went wrong, tell admin";
                                if (jqXHR.status === 0) {
                                    errorMessage = 'Network not connected.\nPlease verify your network connection.';
                                } else if (jqXHR.status == 404) {
                                    errorMessage = '404. The requested page not found.';
                                } else if (jqXHR.status == 500) {
                                    errorMessage = 'Internal Server Error [500].';
                                }
                                $('#message_for_user').html(errorMessage);
                                $('.preloader-wrapper').addClass('hide');
                            }
                        });
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        var errorMessage = "Something went wrong";
                        if (jqXHR.status === 0) {
                            errorMessage = 'Network not connected.\nPlease verify your network connection.';
                        } else if (jqXHR.status == 404) {
                            errorMessage = '404. The requested page not found.';
                        } else if (jqXHR.status == 500) {
                            errorMessage = 'Internal Server Error [500].';
                        }
                        $('#message_for_user').html(errorMessage);
                        $('.preloader-wrapper').addClass('hide');
                    }
                });
            }
        }
        validSelect(currentDropdown);
    });

    $('#phone').change(function() {
        if($('#phone').val()!=""){
            $('#phone').rules('add',{digits: true,mobileNumberCheck: true,minlength: 10,maxlength: 10});
        }
        else{
            var settings = $('form').validate().settings;
            delete settings.rules.mobile;
        }

    });

    $('#formula_slider').change(function() {
        $('#formula_label').html(this.value);
    });
    $('#sf_slider').change(function() {
        $('#sf_label').html(this.value);
    });
    $('#feeding_method').change(function() {
        var feedingMethod = this.value;
        if (role == "mum" || role == "dad") {
            if (feedingMethod == "formula" || feedingMethod == "mixed") $('#formula_age').removeClass('hide');
            else $('#formula_age').addClass('hide');
        }
        $("#solid_foods").show();
    });
    $('#sf_dropdown').change(function() {
        if (role == "mum" || role == "dad") {
            if (this.value == "yes") $('#sf_age').removeClass('hide');
            else $('#sf_age').addClass('hide');
        }
    });
    $('#carer_country').change(function() {
        console.log(this.value);
        if (this.value == "other") {
            $('#other_country').removeClass('hide');
        } else {
            $('#other_country').addClass('hide');
        }
    });
    $('#carer_language').change(function() {
        console.log(this.value);
        if (this.value == "other") {
            $('#other_language').removeClass('hide');
        } else {
            $('#other_language').addClass('hide');
        }
    });
    $('#source').change(function() {
        console.log(this.value);
        if (this.value == "other") {
            $('#other_source').removeClass('hide');
        } else {
            $('#other_source').addClass('hide');
        }
    });
    $('#hp_role').change(function() {
        console.log(this.value);
        if (this.value == "other") {
            $('#other_hp').removeClass('hide');
        } else {
            $('#other_hp').addClass('hide');
        }
    });

    function validateElement(element) {
        element.each(function() {
            if (!$(this).valid()) {
                if ($(this).nextAll('h5').first().is('.empty'))
                    $(this).nextAll('h5').first().remove();
            }
        });
        return element.valid();
    }

    function validSelect(element) {
        var flag = true;

        element.each(function() {
            //console.log($(this));
            console.log($(this).val());
            if ($(this).val() == null) {
                console.log("enter value null");
                $(this).closest('div').next().removeClass("hide");
                console.log($(this).closest('.col').find('input.select-dropdown'));
                $(this).closest('.col').find('input.select-dropdown').removeClass('valid').addClass('error');
                flag = false;
                if ($(this).parent().nextAll('h5').first().is('.empty'))
                    $(this).parent().nextAll('h5').first().remove();
            } else {
                console.log("enter has value");
                $(this).closest('.col').find('input.select-dropdown').removeClass('error').addClass('valid');
                $(this).closest('div').next().addClass("hide");
            }

        });
        return flag;
    }
});
