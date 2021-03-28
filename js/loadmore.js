$.fn.loadMore = function(o) {
    o       = o || {};
    var obj = {
        page:1, url:null, busy:false, el:null, max:null, tag:null,
        init: function(el)
        {
            var me  = this;
            me.el   = el;
            me.url  = me.cleaningUrl(el.attr('href'));
            me.max  = o.max || null;
            me.tag	= el.attr('tag') || null;

            if ( typeof o.mode != 'undefined' && o.mode == 'click')
            {
                me.onClick();
            } else {
                me.onScroll();
            }

            return this;
        },
        onClick: function()
        {
            var me = this;
            me.el.click(function(){
               if ( me.busy )
                    return;
               if ( me.max !== null && me.page > me.max )
                    return true;

               me.showTime();

               return false;
            });
            return this;
        },
        onScroll: function()
        {
            var me  = this, st=0, tt=20, wh=$( window ).height();

            var iScrollPos = 0;
            $(document).scroll(function(e){
            	var iCurScrollPos	= $(this).scrollTop();
            	var downScroll		= iCurScrollPos > iScrollPos;
            	iScrollPos = iCurScrollPos;
            	if ( downScroll ) //only allowed down scrolled
            	{
            		st  = $(this).scrollTop() + wh;
	                tt  = me.el.offset().top - 20;

	                if ( st < tt || me.busy)
	                    return;
	                if ( me.max !== null && me.page > me.max )
	                    return;

	                me.showTime();
            	}
            });

            return this;
        },
        cleaningUrl: function(url)
        {
            /*if ( url.substr(url.length - 1) !== '/' )
            {
                url+= '/';
            }*/
            return url;
        },
        showTime: function()
        {
            var me  = this;

            me.busy   = true;
            me.page++;

            console.log('show time');

            if ( typeof o.onLoading != 'undefined' )
            {
                o.onLoading(me.el);
            }

            var params = {};
            if ( typeof o.getParams != 'undefined' )
            {
                params	= o.getParams(me.el);
            }

            var final_url	= me.url;// + me.page + tag;

            if(final_url.indexOf('?')>=0){
                final_url+=(final_url.indexOf('?')>=0?'&':'?') + 'p=' + me.page;
            }else{
                final_url+='/'+me.page;
            }

            if(me.tag!==null){
                final_url+=(final_url.indexOf('?')>=0?'&':'?') + 'tag=' + me.tag;
            }
            
            $.each(params, function(key, val){
            	final_url+=(final_url.indexOf('?')>=0?'&':'?') + key + '=' + val;
            });

            $.getJSON(final_url, function(result)
            {
                if ( parseInt(result.status) !== 200 )
                {
                	me.page = me.max + 1;
                	if (typeof o.onMax !== 'undefined')
                	{
                		o.onMax(me.el);
                	}
                	return;
                }

                //me.el.before(result.content);
                if ( typeof o.onReceive !== 'undefined' )
                {
                	o.onReceive(me.el, result);
                }

                if ( me.max !== null && me.page > me.max && typeof o.onMax !== 'undefined')
                {
                    o.onMax(me.el);
                }
            }).fail(function() {
                me.page--;
            }).always(function() {
                me.busy = false;
                console.log('finnish');
                if ( typeof o.onFinish !== 'undefined')
                {
                    o.onFinish(me.el);
                }
            });

            return this;
        }
    }

    return this.each(function(){
        obj.init($(this));
    });
}

$(function(){
	$('.loadmore[href]').each(function(){
        var _this       = $(this),
            maximum		= typeof _this.attr('d:max') === 'undefined' ? 1 : (_this.attr('d:max') === 'nil' ? 1000 : parseInt(_this.attr('d:max')));

        _this.loadMore({
    		max: maximum,
            mode: typeof _this.attr('d:mode') != 'undefined' ? _this.attr('d:mode') : 'scroll',
    		current: 0,
    		getParams: function(el)
    		{
    			var params = {};
    			if ( typeof lt !== 'undefined' )
    			{
    				params.lt = lt;
    			}
    			return params;
    		},
            onLoading: function(el)
            {
                el.addClass('hide').parent().find(' > .spinner').removeClass('hide');
            },
    		onReceive: function(el, result)
    		{
                el.removeClass('hide').parent().find(' > .spinner').addClass('hide');
                if ( typeof result.lastdate !== 'undefined' )
    			{
    				lt = result.lastdate;
    			}
    			if ( $('[target-item]').length > 0 )
    			{
    				$('[target-item]').append(result.content);
    				return;
    			}
                if ( typeof el.attr('d:before') != 'undefined' )
                {
                    el.show();
                    el.closest(el.attr('d:before')).before(result.content);
                    return;
                }
    			el.before(result.content);
    		},
    		onFinish: function(el){
    			this.current++;
    			$(".lqd:not(.imgLiquid_ready)").imgLiquid();

    			$('.share_content a:not([ready])').attr({ready:true}).click(function(){
    				shareBox.regShare(this);
    				return false;
    			});

    			if ( typeof modal_zoom !== 'undefined' )
    			{
    				modal_zoom();
    			}

    			$(document.body).trigger("sticky_kit:recalc");
    		},
    		onMax: function(el){
                if ( typeof el.attr('d:url') != 'undefined' )
                {
                    el.attr({href: el.attr('d:url')});
                }

                if ( typeof el.attr('d:finish') != 'undefined' )
                {
                    el.html(el.attr('d:finish'));
                }

                if ( typeof el.attr('d:mode') == 'undefined' )
                {
        			el.remove();
                }
                el.parent().find(' > .more').removeClass('hide');
                el.parent().find(' > .spinner').remove();
    		}
    	});
    });
});
