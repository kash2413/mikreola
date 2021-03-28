/**
* asynchronous widget generator
* application
* recommendation
* getuseragent smartbanner
**/
var helper = {
    setimage: function(src, title, ratio='169', qs='', _class = '')
    {
        if(src.indexOf('/visual/') != -1) {
            src = src.replace(/\_[0-9]+/, '_' + ratio) + qs;
        }
        return '<img src="'+ src +'" title="'+ title +'" alt="'+ title +'" class="'+ _class +'"/>';
    },
    prettydate: function(_date)
    {
        let _month = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September',
            'Oktober', 'November', 'Desember'
        ];
        let _day = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

        var offs = new Date().getTimezoneOffset();
        var diff = offs * 60000;
        var rec = _date + diff;
        var _ndate = new Date(rec);

        let h = _day[_ndate.getDay()];
        let b = _month[_ndate.getMonth()];

        return h + ', ' + this.addzero(_ndate.getDate()) + ' ' + b.slice(0,3) + ' ' + _ndate.getFullYear() + ' ' +
        this.addzero(_ndate.getHours()) + ':' + this.addzero(_ndate.getMinutes()) + ' WIB';
    },
    addzero: function(i)
    {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    },
    ismobile: function()
    {
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            return true;
        }
        return false;
    },
    set_paneltracking: function(name, title, type, obj)
    {
        var append_obj = '';
        if(obj !== '' && typeof obj !== 'undefined') {
            append_obj = ', ' + obj + '';
        }
        return '_pt(this, "' + name + '", "' + title + '", "' + type + '"' + append_obj + ')';
    },
    getuseragent: function()
    {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;

        if (/iPad|iPhone|iPod/i.test(userAgent) && !window.MSStream) {
            return "iOS";
        }

        return "Android";
    },
    randomize: function(obj)
    {
      $.each(obj, function(i, v){
        let j = i + Math.floor(Math.random() * (obj.length - i));
        let temp = obj[j];
        obj[j] = obj[i];
        obj[i] = temp;
      });

      return obj;
    }
}
var detikWidget = {
    elm: 'd-widget',
    rec: '//rec.detik.com/article-recommendation/keywordsxchannelsandtagsmospopxchannels/',
    gif: 'https://cdn.detik.net.id/assets/images/load.gif',
    app: ( ( typeof baseurl !== 'undefined' ) ? baseurl : base_url ) + '/ajax/',
    _method: ( typeof wid_method !== 'undefined' ) ? wid_method : 'POST',
    create: function()
    {
        $('[' +detikWidget.elm+ ']').each(function () {
            detikWidget.init($(this));
        })
    },
    init: function(el)
    {
        var attr_rec = el.attr('d-recommendation'),
        appurl = this.app + this._name(el) + this._flush(),
        params = ( el.attr('d-params')) ? el.attr('d-params' ) : {},
        is_rec = ( typeof attr_rec !== typeof undefined && attr_rec !== false ) ? true : false;

        this._create(el, appurl, params, is_rec);
    },
    _flush: function()
    {
        var qs = new URLSearchParams(window.location.search),
            fl = (qs.has('flush') ? '?flush' : ''),
            dv = (qs.has('device') ? '?device=' + qs.get('device') : ''),
            pr = fl + dv;

        if((pr.split('?').length - 1) > 1)
        {
            pr = pr.replace(/\?([^?]*)$/, '&' + '$1');
        }

        return pr;
    },
    _name: function(el)
    {
        return el.attr(detikWidget.elm);
    },
    _loading: function(el)
    {
        if(el.find('img').length == 0){
            el.html('<div align="center"><img src="' +this.gif+ '"/></div>');
        }
    },
    _create: function(el, appurl, params, is_rec)
    {
        if( typeof is_rec !== typeof undefined && is_rec !== false ) {
            this.rec_get(el);
        } else {
            this._request({
                url: appurl,
                type: detikWidget._method,
                data: {param : params},
                beforeSend: function(){
                    detikWidget._loading(el);
                },
                success:function(response ){
                    detikWidget._generate(response, el)
                },
                fail:function(xhr, status, errorthrown){
                    detikWidget._failed(xhr, status, errorthrown)
                }
            });
        }
    },
    _generate: function(res, el)
    {
        el.html(res.html);
        try {
            if (typeof liquid == 'function') {
                liquid('.lqd');
                liquid('.lqd_block');
            }
            $(".lqd").imgLiquid();
        } catch (e) {}

        if (el.find('img').length>0) {
            el.find('img').each(function() {
                if( this.complete ){
                    setTimeout(function(){
                        $(document.body).trigger("sticky_kit:recalc");
                    },3000);
                }
            });
        }else{
            $(document.body).trigger("sticky_kit:recalc");
        }

        detikWidget._refreshads(el);
    },
    _refreshads: function(el)
    {
        let ads = el.find('ins').length;
        if(ads > 0) {
            try {
                window.reviveAsync["0cceecb9cae9f51a31123c541910d59b"].refresh();
            } catch (e) { console.log('___',e); }
        }
    },
    _failed: function(xhr, status, errorthrown)
    {
        console.log('__xhr',xhr);
        console.log('__status',status);
        console.log('__errorthrown',errorthrown);
    },
    _limit: function()
    {
        return ( $('meta[name=platform]').attr("content") == 'desktop' ) ? 20 : 10;
    },
    rec_get: function(el)
    {
        var dtma = this._dtma(),
        size = this._limit();
        this._request({
            url: this.rec + dtma + '?size=' + size + '&nocache=1',
            type: 'GET',
            xhrFields: {
                withCredentials: true
            },
            dataType: 'json',
            success:function(data) {
                detikWidget.rec_pull(data, el);
            }
        })
    },
    rec_pull: function(datarec, el)
    {
        detikWidget._request({
            url: detikWidget.app + detikWidget._name(el) + detikWidget._flush(),
            type: 'GET',
            dataType: 'json',
            success:function(response) {
                detikWidget.rec_generate(response, el, datarec);
            }
        });
    },
    rec_generate: function(resapp, el, rec)
    {
        if(typeof rec.body !== 'undefined') {
            let pf = '_itp';
            let _pfx    = 'd-panel-';
            let _attr   = ['name', 'type', 'disable-source'];
            let _numb   = '[pt_number]';
            let _types  = 'artikel';
            let _panel  = 'box recommendation for you';

            el.html(resapp.html).hide();
            $.each(helper.randomize(rec.body), function(index, item) {
                let is = '#rec_loop_' + index + ' .rec_';
                $(el).find(is + 'title' + pf).html(item.title);
                $(el).find(is + 'date' + pf).text(
                    helper.prettydate(item.unixtime)
                );

                let panel   = $(el).find(is + 'link' + pf);
                let _source = '{"source_rekomendasi":"' + item.type + '"}';

                if(typeof panel.attr(_pfx+'name') !== 'undefined')
                {
                    _panel = panel.attr(_pfx+'name');
                }
                if(typeof panel.attr(_pfx+'type') !== 'undefined')
                {
                    _types = panel.attr(_pfx+'type');
                    if(_types.indexOf(_numb) != 1)
                    {
                        _types = _types.replace(_numb, (index+1));
                    }
                }
                if(typeof panel.attr(_pfx+'disable-source') !== 'undefined')
                {
                    _source = '';
                }

                $(el).find(is + 'link' + pf).attr({
                    // 'href': (helper.ismobile()) ? item.mobileurl : item.desktopurl,
                    'href': item.desktopurl,
                    'onclick': helper.set_paneltracking(
                        _panel,
                        item.title,
                        _types,
                        _source
                    )
                });

                try{
                    let wo_rep = $(el).find(is + 'resume_woreplace' + pf);
                    if(wo_rep.length > 0) {
                        wo_rep.html(item.resume);
                    } else {
                        var decoded = $('<textarea/>').html(item.resume).text();
                        $(el).find(is + 'resume' + pf).html(decoded);
                    }
                }catch(e){}

                let el_img = $(el).find(is + 'image' + pf);
                let ratio = el_img.data('ratio');
                let qs = el_img.data('qsimg');
                $(el).find(is + 'image' + pf).replaceWith(
                    helper.setimage(item.imageurl, item.title, ratio, qs)
                );
                $.each(_attr, function(i, val) {
                    $(el).find(is + 'link' + pf).removeAttr(_pfx + val);
                });
            })
            $('article[id^="rec_loop_"]').each(function(i, el){
                if($(el).find('.rec_link_itp').attr('href') == '#') {
                    el.remove();
                }
            });
            try {
                $(".lqd").imgLiquid();
            } catch (e) {}
            el.show();
            setTimeout(function(){
                detikWidget._refreshads(el);
            }, 1000);
        }
    },
    _request: function(args)
    {
        $.ajax(args);
    },
    _dtma: function()
    {
        var key = '__dtma',
        match = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'));
        if ( match ) {
            var _d = match[2].split('.');
            var _dtma = _d[0] + '.' + _d[1] + '.' + _d[2];
            return _dtma;
        }
        else{
            return '-';
        }
    }
}
var callSticky = {
    setsticky: function()
    {
        var time = 1;
        var interval = setInterval(function() {
            if (time <= 10) {
                $(document.body).trigger("sticky_kit:recalc");
                time++;
            }
            else {
                clearInterval(interval);
            }
        }, 1000);
    }
}
var appendPT = {
    _name: '',
    _type: '',
    _val : '',
    run: function()
    {
        $('*[class^="append_pt"]').each(function(i, el){
            let _name = $(el).attr('d_pt-n')
            if(typeof _name !== 'undefined') {
                appendPT._name = _name;
            }

            let _type = $(el).attr('d_pt-t')
            if(typeof _type !== 'undefined') {
                appendPT._type = _type;
            }

            let _value = $(el).attr('d_pt-v')
            if(typeof _value !== 'undefined') {
                appendPT._val = _value;
            }
            $(el).attr('onclick',helper.set_paneltracking(
                appendPT._name,
                appendPT._type,
                appendPT._val
            ));
        });
    },
    del: function(el, e)
    {
        $(el).removeAttr('append-pt-'+e);
    }
}

var smartbanner =  {
    detail: {
        'Android': {
            'text': 'Get it on the Play Store',
            'link': 'https://play.google.com/store/apps/details?id=org.detikcom.rss',
            'pt_btn': '_pt(this, "header", "smartbanner", "button get play store")'
        },
        'iOS': {
            'text': 'Get it on the App Store',
            'link': 'https://apps.apple.com/id/app/detikcom-berita-terlengkap/id442914988',
            'pt_btn': '_pt(this, "header", "smartbanner", "button get app store")'
        }
    },
    run: function()
    {
        var useragent = helper.getuseragent();
        $('.itpp_sb_text').text(this.detail[useragent].text);
        $('.itpp_sb_url').attr('href', this.detail[useragent].link);
        $('.itpp_sb_url').attr('onclick', this.detail[useragent].pt_btn);
        $('.itpp_sb').show();
    }
}

$(function(){
    smartbanner.run();
    detikWidget.create();
    callSticky.setsticky();
})
