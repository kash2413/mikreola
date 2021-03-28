/**
 * detik gtm datalayer builder for custom dimension 
 * @author : insan@detik.com
 */
var dtkGTMDL = {
    data : {},
    getMeta : function(prop, val) {
        e = document.head.querySelector("["+prop+"=\""+val+"\"]");
        if ( e !== null ) {
            return e.content;
        }
        return null;
    },
    addDataLayer : function(prop, metaKey, dlKey=null) {
        if (dlKey === null) {
            dlKey = metaKey;
        }
        val = dtkGTMDL.getMeta(prop, metaKey);
        if ( val === null || val == '' ) {
            return;
        }
        dtkGTMDL.data[dlKey] = val;
    },
    addCustomDimension: function(arr) {
        for(i=0;i<arr.length;i++) {
            switch(arr[i]) {
                case 'kanalid':
                    dtkGTMDL.addDataLayer('name', 'kanalid');
                    break;
                case 'articleid':
                    dtkGTMDL.addDataLayer('name', 'articleid');
                    break;
                case 'articletype':
                    dtkGTMDL.addDataLayer('name', 'articletype');
                    break;
                case 'articledewasa':
                    dtkGTMDL.addDataLayer('name', 'articledewasa');
                    break;
                case 'articlehoax':
                    dtkGTMDL.addDataLayer('name', 'articlehoax');
                    break;
                case 'createdate':
                    dtkGTMDL.addDataLayer('name', 'createdate');
                    break;
                case 'publishdate':
                    dtkGTMDL.addDataLayer('name', 'publishdate');
                    break;
                case 'keyword':
                    dtkGTMDL.addDataLayer('name', 'keywords', 'keyword');
                    break;
                case 'idfokus':
                    dtkGTMDL.addDataLayer('name', 'idfokus');
                    break;
                case 'namafokus':
                    dtkGTMDL.addDataLayer('name', 'namafokus');
                    break;
                case 'idprogram':
                    dtkGTMDL.addDataLayer('name', 'idprogram');
                    break;
                case 'namaprogram':
                    dtkGTMDL.addDataLayer('name', 'namaprogram');
                    break;
                case 'pagesize':
                    dtkGTMDL.addDataLayer('name', 'pagesize');
                    break;
                case 'pagenumber':
                    dtkGTMDL.addDataLayer('name', 'pagenumber');
                    break;
                case 'videopresent':
                    dtkGTMDL.addDataLayer('name', 'videopresent');
                    break;
                case 'video_id':
                    dtkGTMDL.addDataLayer('name', 'video_id');
                    break;
        		case 'refferal_url':
        		    dtkGTMDL.addDataLayer('name', 'refferal_url');
                    break;
                case 'contenttype':
                    dtkGTMDL.addDataLayer('name', 'contenttype');
                    break;
                case 'platform':
                    dtkGTMDL.addDataLayer('name', 'platform');
                    break;
                case 'author':
                    dtkGTMDL.addDataLayer('name', 'author');
                    break;
                case 'title':
                    dtkGTMDL.addDataLayer('property', 'og:title', 'title');
                    break;
                case 'subcategori':
                    dtkGTMDL.addDataLayer('name', 'subcategori');
                    break;
                case 'keywordkanal':
                    dtkGTMDL.addDataLayer('name', 'keywordkanal');
                    break;
                case 'duration':
                    dtkGTMDL.addDataLayer('name', 'duration');
                    break;
                case 'hl_nhl_wp':
                    dtkGTMDL.addDataLayer('name', 'hl_nhl_wp');
                    break;
                case 'hl_nhl_kanal':
                    dtkGTMDL.addDataLayer('name', 'hl_nhl_kanal');
                    break;
                case 'originalTitle':
                    dtkGTMDL.addDataLayer('name', 'originalTitle');
                    break;
                case 'video_story_url':
                    dtkGTMDL.addDataLayer('name', 'video_story_url');
                    break;
                default:
                    break;
            }
        }
    },
    generate : function() {
        contenttype = dtkGTMDL.getMeta('name', 'contenttype');
        dtkGTMDL.addCustomDimension(['kanalid','articleid', 'articletype', 'articledewasa', 'articlehoax', 'createdate', 'publishdate', 'keyword', 'idfokus', 'namafokus', 'idprogram', 'namaprogram', 'pagesize', 'pagenumber', 'videopresent', 'video_id', 'contenttype', 'platform','author', 'subcategori', 'keywordkanal', 'duration', 'hl_nhl_wp', 'hl_nhl_kanal', 'originalTitle', 'video_story_url']);
        dtkGTMDL.data['event'] = 'articlePush';
        return dtkGTMDL.data;
    }
}

dataLayer = [dtkGTMDL.generate()];

/**
 * paneltracking
 * with var additional
 */
var _pt = function(_this, box, title, action, additional)
{
    console.log('__pt:gtmdl');
    var _send = {
		'event'			: 'panel tracking',
		'action'		: 'klik '+action,
		'panelname'		: box.toLowerCase(),
		'pt_from_type'	: $('meta[name=contenttype]').attr('content'),
		'pt_from_kanal'	: $('meta[name=kanalid]').attr('content'),
		'pt_to_url' 	: _this.href,
		'pt_platform' 	: $('meta[name=platform]').attr('content'),
		'pt_to_page' 	: title
	};
	if( typeof additional !== typeof undefined ) {
		var _send = $.extend(_send, additional);
	}
	dataLayer.push(_send);
}

/*
handle push event specific click
*/
$(function(){
    pushEvent = function(el, url, title)
    {
        var bc_domain;
        if(typeof(basekanal) != "undefined" && basekanal !== null) {
            bc_domain = basekanal;
        }else{
            bc_domain = baseurl;
        }
        dataLayer.push({
            'event': ''+el+'',
            'bc_nav_url': ''+url+'',
            'bc_domain': ''+bc_domain+'',
            'bc_title': ''+title+'',
            'baca_juga_aid': ''+getArticleId(el, url)+''
        });
    }
    getArticleId = function(el, url)
    {
        var set;
            arrUrl = url.split('/');
        if(arrUrl.length > 9){
            if(arrUrl[2].indexOf('m.detik') > -1 || arrUrl[2].indexOf('mdev.detik') > -1){
				if(url.indexOf('/~') > -1){
					arID = arrUrl[10];
				}else{
					arID = arrUrl[9];
				}
            }else{
            	if(arrUrl[3].indexOf('sepakbola') > -1){
            		arID = arrUrl[9];
            	}else{
            		arID = arrUrl[8];
            	}
			}
        }else{
            if(arrUrl[2].indexOf('garuda.detik') > -1){
                if(url.indexOf('/~') > -1){
					arID = arrUrl[6];
				}else{
                    arID = arrUrl[5];
                }
            }else{
                if(url.indexOf('/~') > -1){
                    arID = (arrUrl[4] == 'sepakbola') ? arrUrl[6] : arrUrl[5];
                }else{
                    arID = (arrUrl[3] == 'sepakbola') ? arrUrl[5] : arrUrl[4];
                }
            }
        }

        if(arID.indexOf('d-') > -1)
            arID = arID.split('-')[1];

        return arID;
    }
    $('#relatedgtm a').click(function(){
        pushEvent('beritaterkait', $(this).attr('href'), $(this).text().trim());
    });

    if($('#readtoogtm').hasClass('list__other__item')){
        selector = $('#readtoogtm h5 a'); set = true;
    }else{
        selector = $('#readtoogtm a'); set = false;
    }
    selector.click(function(){
        var title;
        if($('h2', this).length){
            title = $('h2', this).text().trim();
        }
        if($('h3', this).length){
            title = $('h3', this).text().trim();
        }
        if($('h4', this).length){
            if($('h4 strong', this).length){
                title = $('h4 strong', this).text().trim();
            }else{
                title = $('h4', this).text().trim();
            }
        }
        if(set == true){
            title = $(this).text().trim();
        }
        if($('h6', this).length){
            title = $('h6', this).text().trim();
        }

        pushEvent('bacajuga', $(this).attr('href'), title);
    });
});