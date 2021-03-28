var id_revive = '0cceecb9cae9f51a31123c541910d59b';

function extCheck(content_key, text_search){
    var strRegex  = "(\\W|^)" + text_search + "(\\W|$)";
    var regex     = new RegExp(strRegex, "gi");
    var resultKey = content_key.match(regex);
    if(resultKey) return true;
}

function extTagging(siteVar, siteValue, zoneId) {
    var metas   = document.getElementsByTagName("meta");
    var val_key = (metas.namedItem("keywords") || metas.namedItem("Keywords") || metas.namedItem("KEYWORDS") || {}).content;

    try{
       if(extCheck(val_key, siteValue)){
        create_ins(siteVar, siteValue, zoneId);
       }
    }catch(err){
       console.log(err);
    }
}

function create_ins(siteVar, siteValue, zoneId){
  var elements = document.getElementsByClassName("dtk-ins-"+zoneId);

    for (var i = 0; i < elements.length; i++) {
      var ins = document.getElementsByClassName("dtk-ins-"+zoneId)[i];
      ins.setAttribute('data-revive-zoneid', zoneId);
      ins.setAttribute('data-revive-id', id_revive);
      ins.setAttribute('data-revive-'+siteVar, siteValue);
    }
}

//DFP brandsafety and keyvalue targeting

function getKeywords(){
    var metas = document.getElementsByTagName('meta');
    var str = (metas.namedItem("keywords") || metas.namedItem("Keywords") || metas.namedItem("KEYWORDS") || metas.namedItem("keyword") || meta.namedItem("Keyword") || metas.namedItem("KEYWORD") || {}).content;
    var keywords = str.toLowerCase().split(",").map(function(item) {
        return item.trim().replace(/\s\s+/g, ' ');
    });
    return keywords;
}

// Function refresh DFP & Revive
function dtkRefreshBanner() {
  try {
    // Revive
    var removeTarget = document.getElementsByClassName("dtkRefreshBanner");
    if (removeTarget.length > 0) {
        for(var targs = 0; targs < removeTarget.length; targs++) { // For each element
            var removeLoaded = removeTarget[targs];
            removeLoaded.removeAttribute("data-revive-loaded");
        }

        if (window.reviveAsync) {
            window.reviveAsync[id_revive].refresh();
        }
    }

    // dfp
    if (slot_dfp_remove.length > 0) {
        googletag.cmd.push(function() {
            googletag.pubads().refresh(slot_dfp_remove);
        });
    }
  } catch(err) {
    console.log(err.name);
    console.log(err.message);
  }

}
