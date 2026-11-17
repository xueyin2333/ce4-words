const C='ce4-20261117-151444';
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(C).then(function(c){return c.addAll(['./','./index.html']);}).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==C;}).map(function(k){return caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});
// 网络优先：联网时总能拿到最新版，断网时回到缓存
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(function(res){
    var cp=res.clone();
    caches.open(C).then(function(c){c.put(e.request,cp);});
    return res;
  }).catch(function(){
    return caches.match(e.request,{ignoreSearch:true}).then(function(r){
      return r||caches.match('./index.html')||caches.match('./');
    });
  }));
});
