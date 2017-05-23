(function() {
    var app = angular.module("forum-directives", ['ui.materialize',
    '720kb.socialshare']);

    app.config(function($locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix("!");
    });

    // app.run(function($FB) {
    //     $FB.init("1752593438362265");
    // });

    app.directive("post", function() {
        return {
            restrict: "E",
            templateUrl: "post.html",
            controller: [
                "$http",
                "$scope",
                "$sce",
                function($http, $scope, $sce) {
                    $scope.comment = {};
                    $scope.comments = [];
                    $scope.userId = $.session.get("secretKey");
                    $scope.userEmail = $.session.get("userEmail");
                    $scope.htmlContent = $sce.trustAsHtml(
                        $scope.post.content.replace(/\n/g, "<br/>")
                    );
                    $scope.isLiked = false;
                    $scope.flag = false; //show comment area flag

                    $scope.postUser = {};

                    $http
                        .get(
                            "http://assc-klong-gh.azurewebsites.net/api/get_profile?userId=" +
                            $scope.post.userId
                        )
                        .success(function(respondData) {
                            $scope.postUser.avatar = respondData.profile_photo;
                            $scope.postUser.babyName = respondData.baby_first_name == "" ?
                                "My Baby" :
                                respondData.baby_first_name;
                            $scope.postUser.userName = respondData.user_name;
                        });

                    $http
                        .post(
                            "http://assc-klong-gh.azurewebsites.net/api/check_if_post_liked", {
                                postId: $scope.post.id,
                                userId: $scope.userId
                            }
                        )
                        .success(function(respondData) {
                            if (respondData.isLiked) $scope.isLiked = true;
                            else $scope.isLiked = false;
                        });

                    $scope.$on("postIsLiked", function() {
                        $scope.isLiked = true;
                    });

                    $scope.isCommentShown = function() {
                        return $scope.flag;
                    };

                    $scope.showComment = function() {
                        var y = $(window).scrollTop();
                        $(window).scrollTop(y + 210);
                        if ($scope.flag == false) {
                            if ($scope.comments.length == 0) {
                                $http
                                    .get(
                                        "https://assc-klong-gh.azurewebsites.net/tables/comment?$filter=postId eq '" +
                                        $scope.post.id +
                                        "'"
                                    )
                                    .success(function(data) {
                                        $scope.comments = data;
                                    });
                            }
                            $scope.flag = true;
                        }
                    };

                    $scope.hideComment = function() {
                        $scope.flag = false;
                    };

                    $scope.showFullContent = false;

                    $scope.isLongContent = function(post) {
                        return post.content.length > 200;
                    };

                    $scope.isFullContentShown = function() {
                        return $scope.showFullContent;
                    };

                    $scope.toggleFullContent = function() {
                        if ($scope.showFullContent) $scope.showFullContent = false;
                        else $scope.showFullContent = true;
                    };

                    $scope.addLikes = function(post) {
                        if (post.likes === null || post.likes === undefined) post.likes = 0;

                        $http
                            .get(
                                "http://assc-klong-gh.azurewebsites.net/api/check_if_post_liked?postId=" +
                                $scope.post.id +
                                "&userId=" +
                                $scope.userId
                            )
                            .success(function(respondData) {
                                if (!respondData.isLiked) {
                                    post.likes++;
                                    //Todo: post to server
                                    var data = { likes: post.likes };
                                    var url =
                                        "https://assc-klong-gh.azurewebsites.net/tables/post/" +
                                        post.id;

                                    $http({
                                        method: "PATCH",
                                        url: url,
                                        data: angular.toJson(data)
                                    }).success(function(data) {
                                        $http.get(
                                            "http://assc-klong-gh.azurewebsites.net/api/set_post_liked_by_user?postId=" +
                                            post.id +
                                            "&userId=" +
                                            $scope.userId
                                        );
                                        $scope.$broadcast("postIsLiked", post.likes);
                                    });
                                }
                            });
                    };

                    $scope.hasComments = function(post) {
                        return (
                            $scope.comments !== undefined &&
                            $scope.comments !== null &&
                            $scope.comments.length !== 0
                        );
                    };

                    $scope.addComment = function(post) {
                        $scope.comment.postId = post.id;
                        $scope.comment.userId = $.session.get("secretKey");

                        $http
                            .post(
                                "https://assc-klong-gh.azurewebsites.net/tables/comment",
                                $scope.comment
                            )
                            .success(function() {
                                $http
                                    .get(
                                        "https://assc-klong-gh.azurewebsites.net/tables/comment?$filter=postId eq '" +
                                        post.id +
                                        "'"
                                    )
                                    .success(function(data) {
                                        $scope.comments = data;
                                        $scope.comment = {};
                                    });
                            });
                    };
                }
            ],
            controllerAs: "postCtrl"
        };
    });

    app.directive("postComments", function() {
        return {
            restrict: "E",
            templateUrl: "post-comments.html",
            controller: [
                "$http",
                "$scope",
                function($http, $scope) {
                    $scope.user = {};
                    $scope.secondLevelComment = {};
                    $scope.secondLevelComments = [];
                    $scope.currentUserId = $.session.get("secretKey");
                    $scope.commentAreaShowFlag = false;
                    $scope.isLiked = false;


                    $http
                        .get(
                            "https://assc-klong-gh.azurewebsites.net/tables/comment/" +
                            $scope.comment.id
                        )
                        .success(function(data) {
                            var userId = data.userId;
                            $http
                                .get(
                                    "http://assc-klong-gh.azurewebsites.net/api/get_profile?userId=" +
                                    userId
                                )
                                .success(function(data) {
                                    $scope.user = data;
                                });
                        });

                    $http
                        .get(
                            "http://assc-klong-gh.azurewebsites.net/api/check_if_comment_liked?commentId=" +
                            $scope.comment.id +
                            "&userId=" +
                            $scope.currentUserId
                        )
                        .success(function(respondData) {
                            if (respondData.isLiked) $scope.isLiked = true;
                            else $scope.isLiked = false;
                        });

                    $scope.$on("commentIsLiked", function() {
                        $scope.isLiked = true;
                    });

                    $scope.addLikes = function(comment) {
                        if (comment.likes === null || comment.likes === undefined)
                            comment.likes = 0;

                        $http
                            .get(
                                "http://assc-klong-gh.azurewebsites.net/api/check_if_comment_liked?commentId=" +
                                comment.id +
                                "&userId=" +
                                $scope.currentUserId
                            )
                            .success(function(respondData) {
                                if (!respondData.isLiked) {
                                    comment.likes++;
                                    //Todo: post to server
                                    var data = { likes: comment.likes };
                                    var url =
                                        "https://assc-klong-gh.azurewebsites.net/tables/comment/" +
                                        comment.id;

                                    $http({
                                        method: "PATCH",
                                        url: url,
                                        data: angular.toJson(data)
                                    }).success(function(data) {
                                        $http.get(
                                            "http://assc-klong-gh.azurewebsites.net/api/set_comment_liked_by_user?commentId=" +
                                            comment.id +
                                            "&userId=" +
                                            $scope.currentUserId
                                        );
                                        $scope.$broadcast("commentIsLiked", comment.likes);
                                    });
                                }
                            });
                    };

                    $scope.addComment = function(comment) {
                        $scope.secondLevelComment.commentId = comment.id;
                        $scope.secondLevelComment.userId = $.session.get("secretKey");
                        $http
                            .post(
                                "https://assc-klong-gh.azurewebsites.net/tables/second_level_comment",
                                $scope.secondLevelComment
                            )
                            .success(function() {
                                $http
                                    .get(
                                        "https://assc-klong-gh.azurewebsites.net/tables/second_level_comment?$filter=commentId eq '" +
                                        comment.id +
                                        "'"
                                    )
                                    .success(function(data) {
                                        $scope.secondLevelComments = data;
                                        $scope.secondLevelComment = {};
                                    });
                            });
                    };

                    $scope.isCommentAreaShown = function() {
                        return $scope.commentAreaShowFlag;
                    };

                    $scope.toggleCommentArea = function() {
                        if ($scope.commentAreaShowFlag == false) {
                            if ($scope.secondLevelComments.length == 0) {
                                $http
                                    .get(
                                        "https://assc-klong-gh.azurewebsites.net/tables/second_level_comment?$filter=commentId eq '" +
                                        $scope.comment.id +
                                        "'"
                                    )
                                    .success(function(data) {
                                        $scope.secondLevelComments = data;
                                    });
                            }
                            $scope.commentAreaShowFlag = true;
                        } else {
                            $scope.commentAreaShowFlag = false;
                        }
                    };
                }
            ],
            controllerAs: "commentsCtrl"
        };
    });

    app.directive("secondLevelComments", function() {
        return {
            restrict: "E",
            templateUrl: "second-level-comments.html",
            controller: [
                "$http",
                "$scope",
                function($http, $scope) {
                    $scope.user = {};
                    $http
                        .get(
                            "https://assc-klong-gh.azurewebsites.net/tables/second_level_comment/" +
                            $scope.secondLevelComment.id
                        )
                        .success(function(data) {
                            var userId = data.userId;
                            $http
                                .get(
                                    "http://assc-klong-gh.azurewebsites.net/api/get_profile?userId=" +
                                    userId
                                )
                                .success(function(data) {
                                    $scope.user = data;
                                });
                        });
                }
            ],
            controllerAs: "secondLevelCommentsCtrl"
        };
    });

    app.directive("postForm", function() {
        return {
            restrict: "E",
            templateUrl: "post-form.html"
        };
    });

    app.directive("focusMe", function($timeout, $parse) {
        return {
            link: function(scope, element, attrs) {
                var model = $parse(attrs.focusMe);
                scope.$watch(model, function(value) {
                    console.log("value=", value);
                    if (value === true) {
                        $timeout(function() {
                            element[0].focus();
                        });
                    }
                });
            }
        };
    });

    app.directive("loading", [
        "$http",
        function($http) {
            return {
                restrict: "A",
                link: function(scope, elm, attrs) {
                    scope.isLoading = function() {
                        return $http.pendingRequests.length > 0;
                    };

                    scope.$watch(scope.isLoading, function(v) {
                        if (v) {
                            elm.show();
                        } else {
                            elm.hide();
                        }
                    });
                }
            };
        }
    ]);

    app.directive("imgOrientation", function() {
        return {
            restrict: "A",
            link: function(scope, element /*, attrs*/ ) {
                function setTransform(transform) {
                    element.css("-ms-transform", transform);
                    element.css("-webkit-transform", transform);
                    element.css("-moz-transform", transform);
                    element.css("transform", transform);
                }

                var parent = element.parent();
                $(element).bind("load", function() {
                    EXIF.getData(element[0], function() {
                        var orientation = EXIF.getTag(element[0], "Orientation");
                        var height = element.height();
                        var width = element.width();
                        if (orientation && orientation !== 1) {
                            switch (orientation) {
                                case 2:
                                    setTransform("rotateY(180deg)");
                                    break;
                                case 3:
                                    setTransform("rotate(180deg)");
                                    break;
                                case 4:
                                    setTransform("rotateX(180deg)");
                                    break;
                                case 5:
                                    setTransform("rotateZ(90deg) rotateX(180deg)");
                                    if (width > height) {
                                        parent.css("height", width + "px");
                                        element.css("margin-top", (width - height) / 2 + "px");
                                    }
                                    break;
                                case 6:
                                    setTransform("rotate(90deg)");
                                    if (width > height) {
                                        parent.css("height", width + "px");
                                        element.css("margin-top", (width - height) / 2 + "px");
                                    }
                                    break;
                                case 7:
                                    setTransform("rotateZ(90deg) rotateY(180deg)");
                                    if (width > height) {
                                        parent.css("height", width + "px");
                                        element.css("margin-top", (width - height) / 2 + "px");
                                    }
                                    break;
                                case 8:
                                    setTransform("rotate(-90deg)");
                                    if (width > height) {
                                        parent.css("height", width + "px");
                                        element.css("margin-top", (width - height) / 2 + "px");
                                    }
                                    break;
                            }
                        }
                    });
                });
            }
        };
    });
})();