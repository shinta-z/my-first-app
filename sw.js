const CACHE='shin-voice-lab-v3';
self.addEventListener('install',event=>{self.skipWaiting();});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
    const clients=await self.clients.matchAll({type:'window'});
    for(const client of clients){try{await client.navigate(client.url)}catch(e){}}
  })());
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  if(event.request.mode==='navigate'){
    event.respondWith((async()=>{
      try{
        const response=await fetch(event.request,{cache:'no-store'});
        let html=await response.text();
        if(!html.includes('copy-helper.js')){
          html=html.replace('</body>','<script src="./copy-helper.js?v=3"></script></body>');
        }
        const headers=new Headers(response.headers);
        headers.set('content-type','text/html; charset=utf-8');
        headers.set('cache-control','no-store');
        return new Response(html,{status:response.status,statusText:response.statusText,headers});
      }catch(e){
        const cached=await caches.match('./index.html');
        if(cached){
          let html=await cached.text();
          if(!html.includes('copy-helper.js')) html=html.replace('</body>','<script src="./copy-helper.js?v=3"></script></body>');
          return new Response(html,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}});
        }
        throw e;
      }
    })());
    return;
  }
  event.respondWith(fetch(event.request).then(response=>{
    const copy=response.clone();
    caches.open(CACHE).then(cache=>cache.put(event.request,copy));
    return response;
  }).catch(()=>caches.match(event.request)));
});