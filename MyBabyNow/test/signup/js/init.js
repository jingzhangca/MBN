$(document).ready(function() {
  var role;

  $("select").material_select();

  $(".scrollspy").scrollSpy();
  $(".datepicker").pickadate({
    selectMonths: true,
    selectYears: 15
  });
  $("#main").siblings().hide();
  $("#main_next").addClass("disabled");
  $("#formula_slider").ionRangeSlider({
    min: 0,
    max: 50,
    from: 10
  });

  $("#sf_slider").ionRangeSlider({
    min: 50,
    max: 100,
    from: 55
  });

  $.validator.addMethod("pwcheck", function(value) {
    return (
      /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) && // consists of only these
      /[a-z]/.test(value) && // has a lowercase letter
      /[A-Z]/.test(value) && // has a uppercase letter
      /\d/.test(value)
    ); // has a digit
  });

  $("#formSurvey").validate({
    rules: {
      baby_due_date: {
        required: true
      },
      baby_first_name: {
        required: true
      },
      baby_gender: {
        required: true,
        notEqual: ""
      },
      baby_dob: {
        required: true
      },
      carer_name: {
        required: true
      },
      feeding_method: {
        required: true
      },
      //if(feeding_method is formula/mixed) then add formula_age
      sf_flag: {
        required: true
      },
      //if(sf_flag is true) then add sf_age
      postcode: {
        required: true,
        digits: true
      },

      carer_age: {
        required: true
      },

      language: {
        required: true
      },

      other_language: {
        required: true
      },

      carer_country: {
        required: true
      },

      other_country: {
        required: true
      },

      from_where: {
        required: true
      },

      other_from_where: {
        required: true
      },

      email: {
        required: true,
        email: true
      },

      mobile: {
        required: true,
        digits: true
      },

      health_practitioner_role: {
        required: true
      },

      other_health_practitioner_role: {
        required: true
      },

      health_practitioner_postcode: {
        required: true,
        digits: true
      },

      health_practitioner_organisation: {
        required: true
      }
    },

    //For custom messages
    messages: {
      baby_first_name: {
        required: "Enter a baby name"
      },
      carer_name: {
        required: "Enter your name"
      }
    },
    errorElement: "div",
    errorPlacement: function(error, element) {
      var placement = $(element).data("error");
      if (placement) {
        $(placement).append(error);
      } else {
        error.insertAfter(element);
      }
    }
  });

  $("#carer_role").change(function() {
    var anchor;
    role = this.value;
    if (
      role == "mum" ||
      role == "dad" ||
      role == "grandparent" ||
      role == "other_carer"
    )
      anchor = "#baby_info1";
    else anchor = "#" + role;
    $("#main_next").attr("href", anchor);
    if (role == "mum" || role == "dad") {
      $('#sf_dropdown option[value="na"]').remove();
      $("#baby_name_label").html("What is your baby's first name?");
      $("#baby_dob_label").html("What is your baby's Date of Birth?");
      $("#baby_gender_label").html("What is your baby's gender?");
      $("#feeding_method_label").html(
        "What is your baby's current feeding method?"
      );
      $("#solid_foods_label").html("Has your baby started eating solid foods?");
    } else if (role == "grandparent" || role == "other_carer") {
      $("#formula_age").addClass("hide");
      $("#sf_age").addClass("hide");
      if ($("#sf_dropdown option[value='na']").length == 0)
        $("#sf_dropdown").append(new Option("I don't know", "na"));
      $("#baby_name_label").html("What is the name of the baby in your care?");
      $("#baby_dob_label").html(
        "What the Date of Birth of the baby in your care?"
      );
      $("#baby_gender_label").html(
        "What is the gender of the baby in your care?"
      );
      $("#feeding_method_label").html(
        "What is the current feeding method of the baby in your care?"
      );
      $("#solid_foods_label").html(
        "Has the baby in your care been introduced to solid food?"
      );
    }
    $("#sf_dropdown").material_select();
    if (this.value == undefined) $("#main_next").addClass("disabled");
    else $("#main_next").removeClass("disabled");
  });

  $(".datepicker").change(function() {
    $(this).valid();
  });

  $("select[name]").change(function() {
    validSelect($(this));
  });

  $("#formSurvey").find(".btn").click(function() {
    var currentDropdown = $("div:visible").find("select[name]");
    var visibleInput = $("input:visible");

    if (
      $(this).text() == "prev" ||
      (validateElement(visibleInput) &&
        validSelect(currentDropdown) &&
        $(this).text() == "next")
    ) {
      var divId = $(this).attr("href");
      //show current # div
      $(divId).show();
      $(divId).siblings().hide();

      //when divId== "#thanks" submit form
      $(".preloader-wrapper").removeClass("hide");
      if (divId == "#thanks") {
        var postData = $("form").serializeToJSON();
        url = "https://assc-klong-gh.azurewebsites.net/tables/gh_survey";
        $.ajax({
          type: "post",
          url: url,
          data: JSON.stringify(postData),
          contentType: "application/json",
          dataType: "json",
          success: function(responseData, textStatus, jqXHR) {
            $("#message_for_user").html(
              "Information saved. Thanks for your time!"
            );
            $(".preloader-wrapper").addClass("hide");
          },
          error: function(jqXHR, textStatus, errorThrown) {
            var errorMessage = "Something went wrong";
            if (jqXHR.status === 0) {
              errorMessage =
                "Network not connected.\nPlease verify your network connection.";
            } else if (jqXHR.status == 404) {
              errorMessage = "404. The requested page not found.";
            } else if (jqXHR.status == 500) {
              errorMessage = "Internal Server Error [500].";
            }
            $("#message_for_user").html(errorMessage);
            $(".preloader-wrapper").addClass("hide");
          }
        });
      }
    }
    validSelect(currentDropdown);
  });

  $("#formula_slider").change(function() {
    $("#formula_label").html(this.value);
  });

  $("#sf_slider").change(function() {
    $("#sf_label").html(this.value);
  });

  $("#feeding_method").change(function() {
    var feedingMethod = this.value;
    if (role == "mum" || role == "dad") {
      if (feedingMethod == "formula" || feedingMethod == "mixed")
        $("#formula_age").removeClass("hide");
      else $("#formula_age").addClass("hide");
    }
    $("#solid_foods").show();
  });

  $("#sf_dropdown").change(function() {
    if (role == "mum" || role == "dad") {
      if (this.value == "yes") $("#sf_age").removeClass("hide");
      else $("#sf_age").addClass("hide");
    }
  });

  $("#carer_country").change(function() {
    if (this.value == "other") {
      $("#other_country").removeClass("hide");
    } else {
      $("#other_country").addClass("hide");
    }
  });
  $("#carer_language").change(function() {
    if (this.value == "other") {
      $("#other_language").removeClass("hide");
    } else {
      $("#other_language").addClass("hide");
    }
  });
  $("#source").change(function() {
    if (this.value == "other") {
      $("#other_source").removeClass("hide");
    } else {
      $("#other_source").addClass("hide");
    }
  });
  $("#hp_role").change(function() {
    if (this.value == "other") {
      $("#other_hp").removeClass("hide");
    } else {
      $("#other_hp").addClass("hide");
    }
  });

  function validateElement(element) {
    element.each(function() {
      if (!$(this).valid()) {
        if ($(this).nextAll("h5").first().is(".empty"))
          $(this).nextAll("h5").first().remove();
      }
    });
    return element.valid();
  }

  function validSelect(element) {
    var flag = true;

    element.each(function() {
      if ($(this).val() == null) {
        $(this).closest("div").next().removeClass("hide");
        $(this)
          .closest(".col")
          .find("input.select-dropdown")
          .removeClass("valid")
          .addClass("error");
        flag = false;
        if ($(this).parent().nextAll("h5").first().is(".empty"))
          $(this).parent().nextAll("h5").first().remove();
      } else {
        $(this)
          .closest(".col")
          .find("input.select-dropdown")
          .removeClass("error")
          .addClass("valid");
        $(this).closest("div").next().addClass("hide");
      }
    });
    return flag;
  }

  //register form
  $("#signup").siblings().hide();

  $("#formRegister").validate({
    rules: {
      registerEmail: {
        required: true,
        email: true
      },

      signUpEmail: {
        required: true,
        email: true
      },

      signUpPwd: {
        required: true
      },

      code: {
        required: true,
        digits: true
      },

      setPassword: {
        minlength: 8,
        required: true,
        pwcheck: true
      },

      confirmPassword: {
        required: true,
        equalTo: "#setPassword"
      },

      forgetPwdEmail: {
        required: true,
        email: true
      }
    },
    messages: {
      setPassword: {
        pwcheck: "The password does not meet the criteria. Please include one uppercase letter, one lowercase letter and one digit."
      }
    },

    errorElement: "div",
    errorPlacement: function(error, element) {
      var placement = $(element).data("error");
      if (placement) {
        $(placement).append(error);
      } else {
        error.insertAfter(element);
      }
    }
  });

  $("#formRegister").find("a").click(function() {
    var divId = $(this).attr("href");
    var visibleInput = $("input:visible");

    if ($(this).is("#noCode")) {
      var email = $("#registerEmail").val();
      console.log(email);
      url = "http://assc-klong-gh.azurewebsites.net/api/register_email";
      $("#loader-wrapper").show();
      $.ajax({
        type: "post",
        url: url,
        contentType: "application/x-www-form-urlencoded",
        data: {
          to: email,
          to_name: email
        },
        success: function(responseData, textStatus, jqXHR) {
          $("#loader-wrapper").hide();
          var result = JSON.parse(responseData);
          console.log(result);
          if (result.status == "ERR") {
            $("#modal p").html(result.exception);
            $("#modal").openModal();
          } else {
            $("#modal p").html("Validation code has been resent.");
            $("#modal").openModal();
            $("#hiddenCode").data("hidden", responseData);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          var errorMessage = "Something went wrong";
          if (jqXHR.status === 0) {
            errorMessage =
              "Network not connected.\nPlease verify your network connection.";
          } else if (jqXHR.status == 404) {
            errorMessage = "404. The requested page not found.";
          } else if (jqXHR.status == 500) {
            errorMessage = "Internal Server Error [500].";
          }
          $("#modal p").html(errorMessage);
          $("#modal").openModal();
          $("#loader-wrapper").hide();
        }
      });
    }

    if (divId == "#forget_pwd") {
      if ($("#signUpEmail").val() == "") {
        $("#forgetPwdLabel").html("Please input the email you have registered");
      } else {
        $("#forgetPwdEmail").val($("#signUpEmail").val());
        $("#forgetPwdLabel").html(
          "Please confirm the email you have registered"
        );
      }
    }

    if ($(this).hasClass("js-btn")) {
      if (
        $(this).text() == "prev" ||
        //&& $(this).text() == "next"
        (visibleInput.valid() )
      ) {
        //show current # div

        if (visibleInput.valid() && $(this).text() == "next") {
          $($(this).attr("href")).find(".error").html("");
          console.log($(this).attr("href"));
        }

        if ($(this).is("#signUpBtn")) {
          $("#loader-wrapper").show();
          var signUpEmail = $("#signUpEmail").val();
          var signUpPwd = $("#signUpPwd").val();
          var loginConfidential = { email: signUpEmail, password: signUpPwd };
          url = "https://assc-klong-gh.azurewebsites.net/api/login_auth";
          $.ajax({
            type: "POST",
            data: JSON.stringify(loginConfidential),
            url: url,
            contentType: "application/json",
            success: function(responseData, textStatus, jqXHR) {
              $("#loader-wrapper").hide();
              var result = JSON.parse(responseData);
              console.log(result);
              if (result.status == "ERR") {
                $("#modal p").html(result.exception);
                $("#modal").openModal();
              } else {
                $.session.set("userEmail", signUpEmail);
                $.session.set("secretKey", result.secretKey);
                var url =
                  "https://assc-klong-gh.azurewebsites.net/api/check_if_survey_done?email=" +
                  signUpEmail;
                $.ajax({
                  type: "get",
                  url: url,
                  contentType: "application/json",
                  dataType: "json",
                  success: function(responseData, textStatus, jqXHR) {
                    if (responseData) {
                      window.location.replace('../forum/index.html');
                    } else {
                      window.location.replace('../survey/index.html');
                    }
                  },
                  error: function(jqXHR, textStatus, errorThrown) {
                    var errorMessage = "Something went wrong";
                    if (jqXHR.status === 0) {
                      errorMessage =
                        "Network not connected.\nPlease verify your network connection.";
                    } else if (jqXHR.status == 404) {
                      errorMessage = "404. The requested page not found.";
                    } else if (jqXHR.status == 500) {
                      errorMessage = "Internal Server Error [500].";
                    }
                    $("#modal p").html(result.exception);
                    $("#modal").openModal();
                  }
                });
              }
            },
            error: function(jqXHR, textStatus, errorThrown) {
              var errorMessage = "Something went wrong";
              if (jqXHR.status === 0) {
                errorMessage =
                  "Network not connected.\nPlease verify your network connection.";
              } else if (jqXHR.status == 404) {
                errorMessage = "404. The requested page not found.";
              } else if (jqXHR.status == 500) {
                errorMessage = "Internal Server Error [500].";
              }
              $("#modal p").html(errorMessage);
              $("#modal").openModal();
              $("#loader-wrapper").hide();
            }
          });
        } else if ($(this).is("#registerEmailBtn")) {
          var email = $("#registerEmail").val();
          console.log(email);
          url = "http://assc-klong-gh.azurewebsites.net/api/register_email";
          $("#loader-wrapper").show();
          $.ajax({
            type: "post",
            url: url,
            contentType: "application/x-www-form-urlencoded",
            data: {
              to: email,
              to_name: email
            },
            success: function(responseData, textStatus, jqXHR) {
              $("#loader-wrapper").hide();
              var result = JSON.parse(responseData);
              console.log(result);
              if (result.status == "ERR") {
                $("#modal p").html(result.exception);
                $("#modal").openModal();
              } else {
                $("#hiddenCode").data("hidden", responseData);
                $(divId).show();
                $(divId).siblings().hide();
              }
            },
            error: function(jqXHR, textStatus, errorThrown) {
              var errorMessage = "Something went wrong";
              if (jqXHR.status === 0) {
                errorMessage =
                  "Network not connected.\nPlease verify your network connection.";
              } else if (jqXHR.status == 404) {
                errorMessage = "404. The requested page not found.";
              } else if (jqXHR.status == 500) {
                errorMessage = "Internal Server Error [500].";
              }
              $("#modal p").html(errorMessage);
              $("#modal").openModal();
            }
          });
        } else if ($(this).is("#verifyCodeBtn")) {
          if ($("#code").val() == $("#hiddenCode").data("hidden")) {
            console.log("cool");
            $(divId).show();
            $(divId).siblings().hide();
          } else {
            $("#modal p").html("The validation code is not correct.");
            $("#modal").openModal();
          }
        } else if ($(this).is("#finishRegisterBtn")) {
          $("#loader-wrapper").show();
          var emailValue = $("#registerEmail").val();
          var pwdValue = $("#confirmPassword").val();
          var loginConfidential = { email: emailValue, password: pwdValue };
          url = "https://assc-klong-gh.azurewebsites.net/tables/login";
          $.ajax({
            type: "POST",
            data: JSON.stringify(loginConfidential),
            url: url,
            contentType: "application/json",
            success: function(responseData, textStatus, jqXHR) {
              $("#loader-wrapper").hide();
              console.log("success");
              location.reload();
            },
            error: function(jqXHR, textStatus, errorThrown) {
              var errorMessage = "Something went wrong";
              if (jqXHR.status === 0) {
                errorMessage =
                  "Network not connected.\nPlease verify your network connection.";
              } else if (jqXHR.status == 404) {
                errorMessage = "404. The requested page not found.";
              } else if (jqXHR.status == 500) {
                errorMessage = "Internal Server Error [500].";
              }
              $("#modal p").html(errorMessage);
              $("#modal").openModal();
              $("#loader-wrapper").hide();
            }
          });
        } else if ($(this).is("#forgetPwdBtn")) {
          $("#loader-wrapper").show();
          var emailValue = $("#forgetPwdEmail").val();
          url = "https://assc-klong-gh.azurewebsites.net/api/forget_pwd";
          var loc = window.location.href;
          var folderPath = loc.substring(0, loc.lastIndexOf("/"));
          console.log(folderPath);
          $.ajax({
            type: "POST",
            contentType: "application/x-www-form-urlencoded",
            data: {
              email: emailValue,
              folderPath: folderPath
            },
            url: url,
            success: function(responseData, textStatus, jqXHR) {
              // $('#message_for_user').html("Information saved. Thanks for your time!");
              $("#loader-wrapper").hide();
              var result = JSON.parse(responseData);
              console.log(result);
              if (result.status == "ERR") {
                $("#modal p").html(result.exception);
                $("#modal").openModal();
              } else {
                $("#modal p").html(
                  "Please check your inbox for a reset password link."
                );
                $("#modal").openModal();
              }
            },
            error: function(jqXHR, textStatus, errorThrown) {
              var errorMessage = "Something went wrong";
              if (jqXHR.status === 0) {
                errorMessage =
                  "Network not connected.\nPlease verify your network connection.";
              } else if (jqXHR.status == 404) {
                errorMessage = "404. The requested page not found.";
              } else if (jqXHR.status == 500) {
                errorMessage = "Internal Server Error [500].";
              }
              $("#modal p").html(errorMessage);
              $("#modal").openModal();
              $("#loader-wrapper").hide();
            }
          });
        } else {
          $(divId).show();
          $(divId).siblings().hide();
        }
      }
    } else {
      $(divId).show();
      $(divId).siblings().hide();
    }
  });

  //reset password form
  $("#reset_pwd").siblings().hide();

  $("#formForgetPwd").validate({
    rules: {
      resetPassword: {
        minlength: 8,
        required: true,
        pwcheck: true
      },

      confirmResetPassword: {
        required: true,
        equalTo: "#resetPassword"
      }
    },

    messages: {
      resetPassword: {
        pwcheck: "The password does not meet the criteria. Please include one uppercase letter, one lowercase letter and one digit."
      }
    },

    errorElement: "div",
    errorPlacement: function(error, element) {
      var placement = $(element).data("error");
      if (placement) {
        $(placement).append(error);
      } else {
        error.insertAfter(element);
      }
    }
  });

  $("#formForgetPwd").find("a").click(function() {
    var divId = $(this).attr("href");
    var visibleInput = $("input:visible");

    if ($(this).hasClass("btn")) {
      if (
        $(this).text() == "prev" ||
        (visibleInput.valid() && $(this).text() == "next")
      ) {
        //show current # div
        if ($(this).is("#resetPwdBtn")) {
          $("#loader-wrapper").show();

          var resetKey = location.search.split("resetKey=")[1];
          var password = $("#confirmResetPassword").val();
          console.log(resetKey);
          url = "https://assc-klong-gh.azurewebsites.net/api/reset_pwd";
          $.ajax({
            type: "POST",
            contentType: "application/x-www-form-urlencoded",
            data: {
              resetKey: resetKey,
              password: password
            },
            url: url,
            success: function(responseData, textStatus, jqXHR) {
              // $('#message_for_user').html("Information saved. Thanks for your time!");
              $("#loader-wrapper").hide();
              var result = JSON.parse(responseData);
              console.log(result);
              if (result.status == "ERR") {
                $("#resetFailError").html(result.exception);
              } else {
                console.log("reset success");
                document.location.href = "index.html";
              }
            },
            error: function(jqXHR, textStatus, errorThrown) {
              var errorMessage = "Something went wrong";
              if (jqXHR.status === 0) {
                errorMessage =
                  "Network not connected.\nPlease verify your network connection.";
              } else if (jqXHR.status == 404) {
                errorMessage = "404. The requested page not found.";
              } else if (jqXHR.status == 500) {
                errorMessage = "Internal Server Error [500].";
              }
              $("#resetFailError").html(errorMessage);
              $("#loader-wrapper").hide();
            }
          });
        } else {
          $(divId).show();
          $(divId).siblings().hide();
        }
      }
    } else {
      $(divId).show();
      $(divId).siblings().hide();
    }
  });
});
