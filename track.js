/* Enquiry tracking for Google Analytics (GA4, G-2ZXFBZTMYE).
   Sends these events. Mark them as key events in GA: Admin > Events / Key events.
     whatsapp_click  - any WhatsApp link or the quote form
     call_click      - any "Call" (tel:) link
     see_prices      - any link to the price list (catalog.html)
     view_prices     - a product group opened on the catalog page
     copy_number     - "Copy number" button
   Each event carries link_location (which part of the page) and, where it applies, phone / product. */
(function(){
  function send(name, params){
    try{ if(window.gtag) window.gtag('event', name, params || {}); }catch(e){}
  }
  function where(el){
    if(el.closest('header')) return 'header';
    if(el.closest('footer')) return 'footer';
    if(el.classList.contains('fab')) return 'floating_button';
    var s = el.parentElement && el.parentElement.closest('section[id],form[id],div[id],details[id]');
    return s ? s.id : 'page';
  }
  window.cwTrack = send;

  document.addEventListener('click', function(e){
    var a = e.target.closest('a,button');
    if(!a) return;
    var href = a.getAttribute('href') || '';
    var loc = where(a);
    if(href.indexOf('wa.me/') > -1){
      var m = href.match(/wa\.me\/(\d+)/);
      var t = href.match(/text=[^&]*?(?:price%20for%3A%20)([^&]*)/);
      send('whatsapp_click', {link_location: loc, phone: m ? m[1] : '', product: t ? decodeURIComponent(t[1]) : '', page: location.pathname});
    } else if(href.indexOf('tel:') === 0){
      send('call_click', {link_location: loc, phone: href.slice(4), page: location.pathname});
    } else if(href.indexOf('catalog.html') > -1){
      send('see_prices', {link_location: loc, link_text: (a.textContent || '').trim().slice(0, 40)});
    } else if(a.classList.contains('copy')){
      send('copy_number', {link_location: loc, phone: a.getAttribute('data-copy') || ''});
    }
  }, true);

  // Catalog: product groups are <details class="cat">. Record when one is opened.
  document.querySelectorAll('details.cat').forEach(function(d){
    d.addEventListener('toggle', function(){
      if(d.open){
        var n = d.querySelector('.cat-name');
        send('view_prices', {product: n ? n.textContent.trim() : d.id, link_location: d.id});
      }
    });
  });
})();
