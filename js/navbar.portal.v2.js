/**
 * framebar generator
 */
$(function(context){
    var dc_params = {};
    $.each($('script'), function(i, elem) {
        if (elem.src.indexOf('navbar.portal') !== -1)
        {
            eval('dc_params ='.concat(elem.text));
        }
    });

    var f = {
        _wd: 'https://www.detik.com/',
        ljs: [],
        elm: 'div#navbar_block',
        rep: '#status_user_nf',
        ste: 'msite',
        bdy: 'body',
        ddc: 'https://connect.detik.com/',
        cdn: 'https://cdn.detik.net.id/',
        sid: {
            l: 'left',
            r: 'right'
        },
        reg: {
            s: 'libs/assets/css/framebar/framebar.css?v=0.1',
            j: 'libs/assets/js/framebar/dtkframebar-controller.js',
            ac: {
                as: false,
                js: 'libs/assets/js/framebar/jquery.autocomplete.js',
                cs: 'libs/assets/css/framebar/autocomplete.css'
            },
            dc: {
                register: 'accounts/register/option/',
                login: 'oauth/authorize',
                dashboard: 'dashboard/',
                profile: 'dashboard/public/',
                setting: 'dashboard/settings',
                logout: 'oauth/signout?redirectUrl=',
                app: 'token/me'
            }
        },
        hsn: window.location.hostname,
        ref: window.location.href,
        current_uri: function(key)
        {
            var urlwoqs = f.ref;
            var q = urlwoqs.indexOf(key);
            var w = urlwoqs.substring(q);
            var e = urlwoqs.replace(w,"");
            return (e !== '') ? e : urlwoqs;
        },
        attr_elm: function(at)
        {
            var d = $(f.elm);
            return (typeof d.data(at) !== 'undefined') ? d.data(at) : (at == 'platform') ? 'desktop' : f.__env(f.ref)
        },
        __env: function(u)
        {
            var _r;
            var _c = u;
            var _d = _c.split('~');
            if(_d.length > 1)
            {
                var __d = _d[1].split('/');
                if(f.attr_elm('platform')=='mobile')
                {
                    _r = f._wd+'~'+__d[0]+'/'+f.ste+'/';
                }
                else
                {
                    _r = f._wd+'~'+__d[0]+'/';
                }
            }
            else
            {
                _r = f._wd;
            }
            return _r + 'navbar';
        },
        _env: function(u)
        {
            var _c = u;
            var _d = _c.split('~');
            var _r;
            if(_d.length > 1)
            {
                var __d = _d[1].split('/');
                if(f.attr_elm('platform') == 'mobile')
                {
                    _r = _d[0]+'~'+__d[0]+'/'+__d[1].replace(/[?#].*/g,'')+'/';
                }
                else
                {
                    _r = _d[0]+'~'+__d[0]+'/';
                }
            }
            else
            {
                if(f.attr_elm('platform') == 'mobile')
                {
                    _r = f._wd;
                    if(f.hsn == 'm.detik.com')
            		{
            			var _h = f.ref.split('/');
            			if(typeof _h[3] !== "undefined" && _h[3] != '')
            			{
            				_r = 'https://'+_h[2]+'/'+_h[3].replace(/[?#].*/g,'')+'/';
            			}
                        else
                        {
                            _r = 'https://'+_h[2]+'/'+_h[3].replace(/[?#].*/g,'');
                        }
            		}
                }
                else
                {
                    _r = f._wd;
                    _r = 'https://'+f.hsn+'/';
                }
            }
            return _r + 'navbar';
        },
        create: function()
        {
            if(f.attr_elm('platform') == 'desktop')
            {
                $(f.elm).css({
                    'height':'46px',
                    'display':'inline'
                });
                $(f.bdy).css('padding',0);
            }
            var _url = f.attr_elm('url');
            if(f.ismobile() && f.attr_elm('platform') == 'desktop')
            {
                _url = _url + '?device=desktop'
            }
            f._request(f.sid.l, {
                type: 'GET',
                url: _url
            });
        },
        load_script: function(src)
        {
            var o = f.ljs;
            if ($.inArray(src, o) == -1){
                var s = document.createElement("script");
                s.type = "text/javascript";
                s.src = src;
                $("head").append(s);
                o.push(src);
            }
        },
        _request: function(k, obj)
        {
            $.ajax({
                type: obj.type,
                url:  obj.url,
                dataType: (obj.dataType !== 'undefined') ? obj.dataType : '',
                xhrFields: {
                   withCredentials: (obj.x !== 'undefined') ? obj.x : false
                },
                beforeSend: function() {
                    if(k == f.sid.l)
                    {
                        var h = f.reg;
                        if(f.attr_elm('platform') == 'desktop')
                        {
                            $('head').append('<link rel="stylesheet" href="'+f.cdn+h.s+'" type="text/css" />');
                        }
                    }
                },
                success: function(r)
                {
                    if(k == f.sid.l)
                    {
                        var e = $(f.elm);
                        _res = $(r.content);

                        var inp_si = _res.find('input[name=siteid]');
                        if(dc_params.site_id === 75)
                        {
                            inp_si.remove();
                            var cls_form = 'form[id=search_navbar]';
                            if(f.attr_elm('platform')=='mobile')
                            {
                                cls_form = 'form[class=nsearch]';
                            }
                            var _form = _res.find(cls_form);
                            var __act = _form.attr('action');
                            var _act  = __act.replace('\/searchall','\/searchvideo');
                            _form.attr('action', _act)
                        }
                        else
                        {
                            inp_si.val(dc_params.site_id);
                        }
                        setTimeout(function(){
                            _res.appendTo(e);
                            if(f.attr_elm('platform') == 'mobile')
                            {
                                $(f.bdy).find('#menudetik').removeAttr('style');
                            }
                            $('#search_navbar input[type="text"]').focus(function() {
                                f.auto_complete($(this));
                            });
                            var u = f.reg.dc;
                            f._request(f.sid.r, {
                                type: 'GET',
                                url: f.ddc+u.app,
                                dataType: 'json',
                                x: true
                            });
                        }, 100)
                    }
                    else
                    {
                        var c = f.block(r);
                        $(f.bdy).find(f.rep).replaceWith(c);
                    }
                    if(f.attr_elm('platform') == 'desktop')
                    {
                        setTimeout(function(){
                            f.load_script(f.cdn+f.reg.j);
                        }, 200)
                    }
                },
                error: function(jqxhr, status, exception)
                {
                    if(k == f.sid.l)
                    {
                        console.log('N:'+status+'|'+exception);
                    }
                    else
                    {
                        console.log('NL:'+exception);
                        var c = f.block({
                            is_login: false
                        });
                        $(f.bdy).find(f.rep).replaceWith(c);
                        if(f.attr_elm('platform') == 'desktop')
                        {
                            f.load_script(f.cdn+f.reg.j);
                        }
                    }
                }
            })
        },
        dc_send: function(o)
        {
            $.ajax({
                type: "GET",
                url: f.ddc+o.app,
                dataType: 'json',
                xhrFields: {
                   withCredentials: true
                },
                success: function (r) {
                    var c = f.block(r);
                    $(f.bdy).find(f.rep).replaceWith(c);
                },
                error: function(jqxhr, status, exception)
                {
                    var c = f.block({
                        is_login: false
                    });
                    $(f.bdy).find(f.rep).replaceWith(c);
                    f.load_script(f.cdn+f.reg.j);
                    console.log('NL:'+exception);
                }
            });
        },
        auto_complete: function(el)
        {
            var ac = f.reg.ac;
            f.load_script(f.cdn+ac.js);
            $('head').append('<link rel="stylesheet" href="'+f.cdn+ac.cs+'" type="text/css" />');
            el.keypress(function(){
                el.autocomplete({
                    serviceUrl: "//suggestqueries.google.com/complete/search?client=chrome&callback=?",
                    dataType: "jsonp",
                    paramName: "q",
                    lookupLimit: 5,
                    transformResult: function(n) {
                        return {
                            suggestions: $.map(n[1], function(n) {
                                try {
                                    n = n.replace(/[\<\>\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "");
                                } catch (e) {console.log(e);}
                                return {
                                    value: n,
                                    data: n
                                }
                            })
                        }
                    }
                })
            });
        },
        createparam_dc: function()
        {
            var dc = f.reg.dc;
            var qs = {
                'clientId': dc_params.client_id,
                'redirectUrl': f.current_uri('?'),
                'parentURI': f.current_uri('#')
            }

            // if (qs.redirectUrl.indexOf('m.detik.com/travel') != -1) {
            //     qs.redirectUrl += '/authorize';
            // }

            var _href = f.attr_elm('platform')+'&'+$.param(qs);
            var _alt = dc_params.ui+'&'+$.param(qs);
            return l = {
                register: {
                    'href': f.ddc+dc.register+'?ui='+_href,
                    'alt': f.ddc+dc.register+'?ui='+_alt
                },
                login: {
                    'href': f.ddc+dc.login+'?ui='+_href,
                    'alt': f.ddc+dc.login+'?ui='+_alt
                }
            }
        },
        block: function(obj)
        {
            var box;
            var dc = f.reg.dc;
            if(obj.is_login)
            {
                if(f.attr_elm('platform') == 'mobile')
                {
                    box = '<div class="nnama">'+
                    '<a href="'+f.ddc+dc.dashboard+'">'+
                    '<div class="ratio1_1 box_img">'+
                    '<div class="img_con">'+
                    '<img src="'+obj.avatar+'" alt=""></div>'+
                    '</div>'+obj.first_name+' '+obj.last_name.replace(/(\w+).*/,"$1")+
                    '</a></div>'+
                    '<a href="'+f.ddc+dc.logout+f.current_uri('?')+'" class="msk">Keluar</a>';
                }
                else
                {
                    box = '<div class="dtkframebar__user__login__in">'+
                    '<h4 class="pull-left">'+obj.first_name+' '+obj.last_name.replace(/(\w+).*/,"$1")+'</h4>'+
                    '<span class="dtkframebar__user__login__in__img"><img src="'+obj.avatar+'" alt=""></span>'+
                    '<i class="dtkframebar__caret dtkframebar__caret-down"></i>'+
                    '<div class="dtkframebar__user__login__in__db">'+
                    '<ul><li>'+
                    '<a href="'+f.ddc+dc.dashboard+'">Profile Saya</a>'+
                    '</li><li>'+
                    '<a href="'+f.ddc+dc.logout+f.current_uri('?')+'">Keluar</a>'+
                    '</li></ul>'+
                    '</div></div>';
                }
            }
            else
            {
                var l = f.createparam_dc();
                if(f.attr_elm('platform') == 'mobile')
                {
                    box = '<div class="nnama">'+
                    '<div class="ratio1_1 box_img">'+
                    '<div class="img_con">'+
                    '<img src="https://cdn.detik.net.id/libs/assets/images/framebar/user_default.png" alt="">'+
                    '</div>'+
                    '</div>Halo detik user</div>'+
                    '<a href="'+l.login.href+'" alt="'+l.login.alt+'" class="msk to_login">'+
                    'Masuk/Daftar</a>';
                }
                else
                {
                    let mode = ' box_modal_dtkid';
                    if(typeof dc_params.redirect !== 'undefined' && dc_params.redirect === true)
                    {
                        mode = '';
                    }
                    box = '<a alt="'+l.register.alt+'" href="'+l.register.href+'" class="daftar to_reg box_modal_dtkid dtkframebar__btn gtm_framebardc_daftar active">'+
                    'Daftar detikID</a>\n'+
                    '<a alt="'+l.login.alt+'" href="'+l.login.href+'" class="masuk to_login'+mode+' dtkframebar__btn gtm_framebardc_masuk">Masuk</a>';
                }
            }
            return box;
        },
        ismobile: function()
        {
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                return true;
            }
            return false;
        }
    }
    f.create();
});
