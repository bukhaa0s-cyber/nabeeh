// Arabic or English: ?lang= wins, then the visitor's last choice, then the browser language.
(function () {
  var q = new URLSearchParams(location.search).get('lang');
  var saved = null; try { saved = localStorage.getItem('nabeeh-site-lang'); } catch (e) {}
  var nav = (navigator.language || 'en').toLowerCase();
  var l = q === 'ar' || q === 'en' ? q : saved || (/^(ar|ur|fa)/.test(nav) ? 'ar' : 'en');
  function apply(v) {
    var h = document.documentElement;
    h.setAttribute('data-l', v); h.lang = v; h.dir = v === 'ar' ? 'rtl' : 'ltr';
    try { localStorage.setItem('nabeeh-site-lang', v); } catch (e) {}
  }
  apply(l);
  window.toggleLang = function () { apply(document.documentElement.getAttribute('data-l') === 'ar' ? 'en' : 'ar'); };
})();
