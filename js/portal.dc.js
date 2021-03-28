var k = 'eyedc',
	c = document.cookie.match('(^|; )'+k+'=([^;]*)')||0,
	h = document.getElementsByTagName("head")[0],
	EO_CTG	= document.querySelectorAll('meta[property="og:site_name"]')[0].content,
	EO_AGE = '', EO_GEN = '', EO_SUBCAT = '',
    curr_url = window.location.href,
	arr_url = curr_url.split('/'),
	notin = ['wolipop.detik.com','wolipop'],
	sc = '';

	if(arr_url[2] == 'm.detik.com'){
		//m
		if(typeof arr_url[4] != 'undefined' && notin.indexOf(arr_url[3]) == -1)
        {
            sc = arr_url[4].split("?")[0];
        }
	}else{
		//d
		if(typeof arr_url[3] != 'undefined' && notin.indexOf(arr_url[2]) == -1)
        {
			sc = arr_url[3].split("?")[0];
			if(arr_url[3] == 'sepakbola')
			{
				sc =(typeof arr_url[4] != 'undefined') ? arr_url[4].split("?")[0] : '';
			}
        }
	}
	EO_SUBCAT = sc.replace(/-/g, '');

if(c !== 0)
{
	dob		= c[2].split('|')[1];
    EO_GEN	= c[2].split('|')[0];
    EO_AGE	= Math.round((new Date()-new Date(dob * 1000))/ (365.25 * 24 * 60 * 60 * 1000));
}
