function parallax(e){
  var i, j, k, wH, dST, pST_dST, adj, wST, wSB, aOT, aOB;
  var p = $(e);
  $(e + ' .parallax_fix').width(p.width());
  var a = $(e + ' .parallax_ads');
  var genPos = function(){
    wH = $(window).innerHeight();
    dST = $(document).scrollTop() || $(window).scrollTop();
    pST_dST = p.offset().top - dST;
    adj = pST_dST / ( wH - p.innerHeight() );
    wST = $(window).scrollTop();
    wSB = wST + wH;
    aOT = p.offset().top;
    aOB = aOT + p.innerHeight();
    if( wSB>=aOT && wSB<aOB ){
      a.css({'top':'auto', 'bottom':0});
    }
    if( wSB>=aOT && wSB>=aOB ){
      if( wST<aOT ){
        var t = adj*(wH-a.height());
        a.css({'top':t, 'bottom':'auto'});
      }
      if( wST>=aOT && wST<=aOB ){
        a.css({'top':0, 'bottom':'auto'});
      }
    }
  };
  $(document).on('scroll', genPos);
}