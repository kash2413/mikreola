var applicationId = '187960271237149';

if(window.location.hostname.replace('www.','') == 'insertlive.com'){
    applicationId = '229248547753202';
}
else if(window.location.hostname.replace('www.','') == 'updatebanget.com'){
    applicationId = '1942207059345335';
}
else if(window.location.hostname.replace('www.','') == 'haibunda.com'){
    applicationId = '341571256274234';
}
else if(window.location.hostname.replace('www.','') == 'cnnindonesia.com'){
    applicationId = '902258536467731';
}
else if(window.location.hostname.replace('m.','') == 'cnnindonesia.com'){
    applicationId = '902258536467731';
}
else if(window.location.hostname.replace('www.','') == 'cnbcindonesia.com'){
    applicationId = '1766408923659392';
}
else if(window.location.hostname.replace('www.','') == 'beautynesia.id'){
    applicationId = '1372126242995623';
}

window.fbAsyncInit = function() {
    FB.init({
      appId      : applicationId,
      xfbml      : true,
      version    : 'v2.7'
    });
	//shareBox.detail();
};

(function(d, s, id){
 var js, fjs = d.getElementsByTagName(s)[0];
 if (d.getElementById(id)) {return;}
 js = d.createElement(s); js.id = id;
 js.src = "https://connect.facebook.net/en_US/sdk.js";
 fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

var shareBox = {
	num_share : 0,
	fbLoaded : false,
	shorturl : '',
    totalArr : [],
    totalSeq : 0,
    totalCount : 0,
    regShare : function(elm) {
        shareBox.addShare(elm);
        return false;
    },
	windowOptions : "scrollbars=yes,resizable=yes,toolbar=no,location=yes",
    checkFbBrowser : function () {
        var ua = navigator.userAgent || navigator.vendor || window.opera;
        return (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1);
    },
	facebook : function (data) {
		var _url	= 'http://www.facebook.com/share.php?u=|u|';
		_url = _url.replace('|u|',data.pageUrl).replace('|t|',data.pageTitle).replace('|d|',data.pageDesc).replace('|140|',data.pageTitle.substring(0,130));
		window.open(_url,shareBox.windowOptions, 'width=640, height=528');
	},
	twitter : function (data) {
		var twAPI = "https://twitter.com/intent/tweet",
	    title = encodeURIComponent(data.pageTitle),
	    url = encodeURIComponent(data.pageUrl);
        
        if(data.pageQuote){
            if (data.pageTitle) {
                title = encodeURIComponent("\""+data.pageQuote+"\" - "+data.pageTitle)
            } else {
                title = encodeURIComponent("\""+data.pageQuote+"\"")
            }
            
        }
        if(applicationId == '902258536467731') {
        	var urlcnn = "http://cnn.id/"+article.idnews;
            window.open(twAPI+"?text="+title+"&url="+encodeURIComponent(urlcnn),
                shareBox.windowOptions, "width=550,height=320"
            );
        //} else if(applicationId == '1766408923659392') {
        //    $.getJSON("http://cnbc.id/?"+url+"&detkjsonpcb=?", function(data){
        //        var data_url = data.result;
        //        console.log(shareBox.checkFbBrowser())
        //        if(shareBox.checkFbBrowser() === true) {
        //            window.location.href = twAPI+"?text="+title+"&url="+encodeURIComponent(data_url)
        //        }
        //        else {
        //            window.open(twAPI+"?text="+title+"&url="+encodeURIComponent(data_url),
        //                shareBox.windowOptions, "width=550,height=320"
        //            );
        //        }
        //    });
        } else {
            $.getJSON("https://detik.id/?"+url+"&detkjsonpcb=?", function(data){
                var data_url = data.result;
                console.log(shareBox.checkFbBrowser())
                if(shareBox.checkFbBrowser() === true) {
                    window.location.href = twAPI+"?text="+title+"&url="+encodeURIComponent(data_url)
                }
                else {
                    window.open(twAPI+"?text="+title+"&url="+encodeURIComponent(data_url),
                        shareBox.windowOptions, "width=550,height=320"
                    );
                }
            });
        }
	},
	gplus : function (data) {
        title = encodeURIComponent(data.pageTitle);
        if(data.pageQuote){
            if (data.pageTitle) {
                title = encodeURIComponent("\""+data.pageQuote+"\" - "+data.pageTitle)
            } else {
                title = encodeURIComponent("\""+data.pageQuote+"\"")
            }
        }
        var _url	= 'https://plusone.google.com/_/+1/confirm?url='+encodeURIComponent(data.pageUrl)+'&title='+title;
		window.open(_url,shareBox.windowOptions, 'width=640, height=528');
	},
	linked : function (data) {
        url = encodeURIComponent(data.pageUrl);
        // title = encodeURIComponent(data.pageTitle);
        // desc = encodeURIComponent(data.pageDesc);
        // ======== description ========
        // https://developer.linkedin.com/docs/share-on-linkedin#methods
        // every parameter requirement and max length is : url = 1024 required, mini = 4 required, title = 200, summary = 256, source = 200
        // ======== end description ========
        // var _url = "https://www.linkedin.com/shareArticle?mini=true&url="+url+"&title="+title+"&summary="+desc+"&source="+window.location.hostname;
        var _url = "https://www.linkedin.com/shareArticle?mini=true&url="+url;
		window.open(_url,shareBox.windowOptions, 'width=520, height=570');
	},
    fb_copy : function (data) {
        var obj = {
			method: 'feed',
			display: 'popup',
			link: data.pageUrl,
			picture: data.pageImage,
			name: data.pageTitle,
            // caption: data.pageUrl,
            description: data.pageDesc
        };
        if(data.pageQuote){
            obj['quote'] = data.pageQuote;            
        }

		function callback(response) {
		  if (response && response.post_id) {
			jQuery.ajax({
			  type: "GET",
			  async: true,
			  cache: false,
			  dataType: 'jsonp',
			  jsonp: false,
			  jsonpCallback: 'track',
			  url: 'https://connect.detik.com/share/track?url='+data.pageUrl+'&service=facebook&clientId=21&token=0bcd238282d290b2122b566199e02ca4',
			  success: function (res, st, xhr) {},
			  error: function (xhr, ajaxOptions, thrownError) {}
			});
		  }

		  //console.log('sukses fb');
	  }

        //FB.ui(obj);
        FB.ui(obj, callback);
	},
	whatsapp : function(data, elm) {
		var twAPI = "https://twitter.com/intent/tweet",
	    title = encodeURIComponent(data.pageTitle),
	    url = encodeURIComponent(data.pageUrl);
        if(data.pageQuote){
            if (data.pageTitle) {
                title = encodeURIComponent("\""+data.pageQuote+"\" - "+data.pageTitle)
            } else {
                title = encodeURIComponent("\""+data.pageQuote+"\"")
            }
            
        }
        var wurl = data.pageUrl;
		if(shareBox.shorturl != '')
			wurl = shareBox.shorturl;
        if(applicationId == '902258536467731') {
            var data_url = "cnn.id/"+article.idnews
            // trigger href whatsapp
            $('.whatsap').attr({href:"whatsapp://send?text="+title+' '+encodeURIComponent(data_url)})
            $('.whatsap').attr({'data-href':data_url})
        //} else if(applicationId == '1766408923659392') {
        //    $.getJSON("http://cnbc.id/?"+url+"&detkjsonpcb=?", function(data){
        //        var data_url = data.result;
        //
        //        // trigger href whatsapp
        //        $('.whatsap').attr({href:"whatsapp://send?text="+title+' '+data_url})
        //        $('.whatsap').attr({'data-href':data_url})
        //    });
        } else {
            $.getJSON("https://detik.id/?"+url+"&detkjsonpcb=?", function(data){
                var data_url = data.result;
    
                // trigger href whatsapp
                $('.whatsap').attr({href:"whatsapp://send?text="+title+' '+data_url})
                $('.whatsap').attr({'data-href':data_url})
            });
        }
		

		// window.location.href = 'whatsapp://send?text='+data.pageTitle+' '+wurl;
	},
	lineit: function(data) {
        title = encodeURIComponent(data.pageTitle)
        if(data.pageQuote){
            if (data.pageTitle) {
                title = encodeURIComponent("\""+data.pageQuote+"\" - "+data.pageTitle)
            } else {
                title = encodeURIComponent("\""+data.pageQuote+"\"")
            }
            
        }        
		window.location.href = 'http://line.me/R/msg/text/?'+title+' '+data.pageUrl
	},
    addShare : function(elm) {
		var url_ex = $(elm).attr('data-url');
		if (url_ex.substr(0, 2) == '//')
			url_ex = 'http:'+url_ex;

        var data = {
            pageUrl : url_ex,
            pageTitle	: $(elm).attr('data-title'),
            pageDesc	: $(elm).attr('data-desc'),
            pageImage   : $(elm).attr('data-image'),
            pageQuote   : $(elm).attr('data-quote')
        }
		if (!data.pageImage) {
			data.pageImage = baseurl+'images/default-43.gif?w=300';
		}

        if ($(elm).attr('class') == 'fb') {
            shareBox.fb_copy(data);
        }
        else if ($(elm).attr('class') == 'tw') {
            shareBox.twitter(data);
        }
        else if ($(elm).attr('class') == 'gplus') {
            shareBox.gplus(data);
        }
        else if ($(elm).attr('class') == 'line') {
            shareBox.lineit(data);
        }
        else if ($(elm).attr('class') == 'whatsap') {
            shareBox.whatsapp(data, $(elm));
        }
        else if ($(elm).attr('class') == 'linked') {
            shareBox.linked(data);
        }

        return false;
    },
	addCounter : function(elm) {
		var url_ex = $(elm).attr('data-url');
		if (url_ex.substr(0, 1) == '//')
			url_ex = 'http:'+url_ex;

		var data = {
            pageUrl : url_ex,
            pageTitle	: $(elm).attr('data-title'),
            pageDesc	: $(elm).attr('data-desc'),
            pageImage   : $(elm).attr('data-image'),
            pageQuote   : $(elm).attr('data-quote')
        }

		if($(elm).hasClass('fb')) {
			//shareBox.countFB(elm);
			$(elm).click(function(e) {
				shareBox.fb_copy(data);
				e.preventDefault();
			});
		}
		else if ($(elm).hasClass('tw')) {
			// shareBox.countTW(elm);
			$(elm).click(function(e) {
				shareBox.twitter(data);
				e.preventDefault();
			});
		}
		else if ($(elm).hasClass('gplus'))  {
			//shareBox.countGplus(elm);
			$(elm).click(function(e) {
				shareBox.gplus(data);
				e.preventDefault();
			});
        }
		else if ($(elm).hasClass('linked'))  {
			//shareBox.countGplus(elm);
			$(elm).click(function(e) {
				shareBox.linked(data);
				e.preventDefault();
			});
		}        
		else if ($(elm).hasClass('line'))  {
			shareBox.countLine(elm);
			$(elm).click(function(e) {
				shareBox.lineit(data);
				e.preventDefault();
			});
		}
		else if ($(elm).hasClass('whatsap'))  {
			// shareBox.countGplus(elm);
			shareBox.whatsapp(data, $(this));

		}
		else if ($(elm).hasClass('komentar') || $(elm).hasClass('sh-komentar')) {
			shareBox.countComment(elm);
			$(elm).click(function(e) {
				var divtop = parseInt($('#thecomment2').offset().top) - parseInt(46); 
				var dt_plus	= divtop + 200;

				$('html, body').animate({ scrollTop: dt_plus }, 600);
				setTimeout(function(){
					$('html, body').animate({ scrollTop: divtop }, 800);
				}, 500);


				return false;
			});
		}
	},
    updateCounter : function(elm, sostype, total) {
        if(this.totalArr.indexOf(sostype) < 0) {
            this.totalArr.push(sostype)
            this.totalCount = this.totalCount+total
            this.totalSeq++
        }

        if(this.totalSeq >= 2) {
            var total_share = $(elm).closest('.share-top-new').find('.count');
    		if (typeof $(total_share) !== 'undefined') {
                $({someValue: 0}).animate({someValue: this.totalCount}, {
                    duration: 1500,
                    easing:'swing',
                    step: function() {
                      $(total_share).find('strong').text(Math.round(this.someValue));
                    }
                });
                setTimeout(function(){$(total_share).find('strong').text(shareBox.totalCount)}, 1600)
    		}
        }
    },
	countFB : function (elm) {
        var pageUrl	= $(elm).attr('data-url')
        pageUrl = pageUrl.split('?')[0]
        var total_share = 0
        //var access_token = "EAACq8uky8B0BANwrioHW5WfCpQudoMow2ZAvmGo06Hd1GRZAdvg7iLlZBLQZA1jt0uhpe2NZAuhhnKsT9HGqVVEijHMPfQDmutJNVup69GPnPGAaWeZCXuiMPu2k49tpcauXA1aI6PfLGhQbbi6gGo2r2Q8WzZCjBwZD"
        //
        //FB.api("https://graph.facebook.com/v2.7/?id=" + pageUrl + "&access_token=" + access_token,
        //   function(data){
        //       var totalFb = 0;
        //       if (data && !data.error) {
        //           totalFb = data.share.share_count
        //            if(typeof($(elm).find('.nolabel').html()) != 'undefined')
        //                $(elm).find('.nolabel').html(totalFb);
        //            else
        //                $(elm).find('span').html('Share '+totalFb);
        //       }
        //       shareBox.updateCounter(elm, 'facebook', totalFb)
        //   }
        //);

        FB.api(
            "/",
            {
                "id": pageUrl
            },
            function(data){
               var totalFb = 0;
               if (data && !data.error) {
                   totalFb = data.share.share_count
                    if(typeof($(elm).find('.nolabel').html()) != 'undefined')
                        $(elm).find('.nolabel').html(totalFb);
                    else
                        $(elm).find('span').html('Share '+totalFb);
               }
               shareBox.updateCounter(elm, 'facebook', totalFb)
           }
        );

        // $.getJSON('http://graph.facebook.com/?ids=' + pageUrl, function(data){
        //     Object.keys(data).forEach(function(key){
        //         var value = data[key]
        //         Object.keys(value).forEach(function(index){
        //             if(index == 'share') {
        //                 var val = value[index]
        //                 totalFb = val.share_count
        //             }
        //         })
        //     });
        //     shareBox.updateCounter(elm, totalFb)
        // });
	},
	countTW : function (elm) {
		var pageUrl	= $(elm).attr('data-url');

		var tweets;
        /*$.getJSON('http://urls.api.twitter.com/1/urls/count.json?url=' + pageUrl + '&callback=?', function(data){
            tweets = data.count;
			$(elm).find('span').html(tweets);

			// update total share
			var total_share = $(elm).closest('.share_top').find('.total_share');
			if (typeof $(total_share) !== 'undefined') {
				var num = $(total_share).find('span').html();
				num = parseInt(num) + parseInt(tweets);
				$(total_share).find('span').html(num);
			}
        });*/
	},
	countGplus : function (elm) {
		var pageUrl	= $(elm).attr('data-url');
		//var api_url = baseurl+'share?url='+ pageUrl;
        var api_url = '';

		$.ajax({
			url: api_url,
			dataType: 'json',
			contentType: 'application/json',
			type: 'GET',
			processData: false,
			success: function(data) {
				var google_pluses = data;

				if(typeof($(elm).find('.nolabel').html()) != 'undefined')
					$(elm).find('.nolabel').html(google_pluses);
				else
					$(elm).find('span').html('Share '+google_pluses);

                shareBox.updateCounter(elm, 'gplus', google_pluses)
			}
		})
	},
	countLine : function(elm) {

	},
	countComment : function (elm) {
		$.getJSON('//comment.detik.com/v2/?count&callback=?',{
			key:article.idnews,
			group:article.idkanal,
			format:'jsonp'
		},function(response){
			if(typeof($(elm).find('.nolabel').html()) != 'undefined')
				$(elm).find('.nolabel').html(response);
			else
				$(elm).find('span').html(response+' komentar');
		})
	},
	run : function(elm) {
		$(elm).find('a').each(function(key, cshare){
			if($(cshare).attr('class') != 'count')
				shareBox.addCounter(cshare)
		})
	},
    includeFb : function() {

    }
};
