(function() {
    'use strict';
    var app = angular.module('ghForum', ['forum-directives', 'igTruncate', 'ngSanitize', 'infinite-scroll', 'ngStorage', 'cp.ng.fix-image-orientation', 'angular-inview', 'ui.materialize', 'ngFileUpload']);
    var posts = [];

    app.controller('ForumController', ['$http', '$scope', 'postPagination', '$sce', function($http, $scope, postPagination, $window) {
        if ($.session.get('secretKey') == null || undefined) {
            //window.location.replace('../signup/index.html');
        }

        $scope.showSubmitFlag = false; //show submit area flag

        $scope.postPagination = new postPagination();

        $scope.$on('posts', function(event, arg) {
            $scope.postPagination = new postPagination();
            $scope.postPagination.nextPage();
        });


        // $scope.lineInView = function(index, inview, inviewpart, event) {
        //     var inViewReport = inview ? '<strong>enters</strong>' : '<strong>exit</strong>';

        //     if (typeof(inviewpart) != 'undefined') {
        //         inViewReport = '<strong>' + inviewpart + '</strong> part ' + inViewReport;
        //     }

        //     console.log(event);
        //     //console.log(inviewpart);


        //         // var url = "https://assc-klong-gh.azurewebsites.net/tables/post/" + $scope.postPagination.posts[index].id;
        //         // $http.get(url).success(function(data) {
        //         //     $scope.postPagination.posts[index] = data;
        //         //     console.log(data);
        //         //     return false;
        //         // });


        // }

        $scope.update = function(post) {
            var url = "https://assc-klong-gh.azurewebsites.net/tables/post/" + post.id;
            //var posts= $scope.postPagination.posts;
            $http.get(url).success(function(data) {
                $scope.postPagination.posts[post.id] = data;
                // posts[post.id]=post;
                // $scope.postPagination.posts=posts;
                console.log(data.title + "      " + data.likes);
                // for(var i=0;i<$scope.postPagination.posts.length;i++)
                // {
                //     if($scope.postPagination.posts[i].id==post.id)
                //         $scope.postPagination.posts[i]=data;
                // }
            });

        }

        $scope.isSubmitShown = function() {
            return $scope.showSubmitFlag;
        }

        $scope.toggleSubmit = function() {
            if ($scope.showSubmitFlag == false) {
                $scope.showSubmitFlag = true;
            } else {
                $scope.showSubmitFlag = false;
            }

        };
    }]);

    //postPagination constructor function to encapsulate HTTP and pagination logic
    app.factory('postPagination', function($http) {
        var postPagination = function() {
            this.posts = [];
            this.busy = false;
            this.offset = 0;
            this.next = 5;
        };

        postPagination.prototype.nextPage = function() {
            if (this.busy) return;
            this.busy = true;

            var url = "https://assc-klong-gh.azurewebsites.net/api/next_page?offset=" + this.offset + "&next=" + this.next;
            if (this.offset == 0 || this.offset <= this.posts.length) {
                $http.get(url).success(function(data) {
                    var posts = data;
                    for (var i = 0; i < posts.length; i++) {
                        this.posts.push(posts[i]);
                    }
                    this.offset += this.next;
                    this.busy = false;
                }.bind(this));
            } else {
                this.busy = false;
            }
        };

        return postPagination;
    });

    app.controller('PostFormController', ['$rootScope', '$scope', '$http', 'Upload', function($rootScope, $scope, $http, Upload) {
        $scope.post = {}; //init variable
        $scope.realImage = null;

        $scope.click = function() { //default function, to be override if browser supports input type='file'
            $scope.data.alert = "Your browser doesn't support HTML5 input type='File'"
        }



        var fileSelect = document.createElement('input'); //input it's not displayed in html, I want to trigger it form other elements
        fileSelect.type = 'file';

        if (fileSelect.disabled) { //check if browser support input type='file' and stop execution of controller
            return;
        }

        $scope.click = function() { //activate function to begin input file on click
            fileSelect.value = null;
            fileSelect.click();
        }

        fileSelect.onchange = function() { //set callback to action after choosing file
            console.log(fileSelect);
            var f = fileSelect.files[0],
                r = new FileReader();

            $scope.realImage = f;


            r.onloadend = function(e) { //callback after files finish loading
                $scope.post.image = e.target.result;
                $scope.$apply();
                //console.log($scope.data.b64.replace(/^data:image\/(png|jpg);base64,/, "")); //replace regex if you want to rip off the base 64 "header"

                //here you can send data over your server as desired
                var tempImg = new Image();
                tempImg.onload = function() {
                    var MAX_WIDTH = 647.5;
                    var MAX_HEIGHT = 647.5;
                    var tempW = tempImg.width;
                    var tempH = tempImg.height;
                    if (tempW > tempH) {
                        if (tempW > MAX_WIDTH) {
                            tempH *= MAX_WIDTH / tempW;
                            tempW = MAX_WIDTH;
                        }
                    } else {
                        if (tempH > MAX_HEIGHT) {
                            tempW *= MAX_HEIGHT / tempH;
                            tempH = MAX_HEIGHT;
                        }
                    }

                    var canvas = document.createElement('canvas');
                    canvas.width = tempW;
                    canvas.height = tempH;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(this, 0, 0, tempW, tempH);
                    var dataURL = canvas.toDataURL("image/jpeg");
                    $scope.post.image = dataURL;
                }

            }

            r.readAsDataURL(f); //once defined all callbacks, begin reading the file
        };

        $scope.addPost = function() {
            $scope.post.userId = $.session.get('secretKey');

            $http.post(
                'https://assc-klong-gh.azurewebsites.net/tables/post',
                $scope.post
            ).success(function() {
                $http.get('https://assc-klong-gh.azurewebsites.net/tables/post').success(function(data) {
                    posts = data.reverse();
                    $rootScope.$broadcast('posts', posts);


                    var storageurl = "https://ghpostimages.blob.core.windows.net/ghpostimagescontainer/" + posts[0].id + "?sv=2015-04-05&ss=b&srt=sco&sp=rwdlac&se=2016-10-14T08:22:23Z&st=2016-08-14T00:22:23Z&spr=https,http&sig=8GWGxjpOhA8JSWiphSyInWQPgqmXkWS%2Fp7LD%2FpLhsUU%3D";

                    Upload.http({
                        method: "PUT",
                        url: storageurl,
                        headers: {
                            'x-ms-blob-type': 'BlockBlob',
                            'x-ms-blob-content-type': $scope.realImage.type
                        },
                        data: $scope.realImage
                    }).then(function(response) {
                        if (response.status > 0)
                            $scope.errorMsg = response.status + ': ' + response.data;
                    }, null, function(evt) {
                        //file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });


                    $scope.post = {};
                });


            });
        };

    }]);
})();
