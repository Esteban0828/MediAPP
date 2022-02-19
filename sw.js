importScripts('sw-utils.js');

const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

function limpiarCache(cacheName, numeroItems) {

    caches.open(cacheName)
        .then(cache => {

            return cache.keys()
                .then(keys => {
                    if (keys.length > numeroItems) {
                        cache.delete(keys[0])
                            .then(limpiarCache(cacheName,numeroItems))
                    }
                })

        })
    
}

const APP_SHELL = [
    '/',
    'index.html',
    'Styles/style.css',
    'app.js'
]

const APP_SHELL_INMUTABLE = [
    'https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css',
    'https://cdn.datatables.net/1.10.21/css/dataTables.bootstrap4.min.css',
    'https://code.jquery.com/jquery-3.5.1.slim.min.js',
    'https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js',
    'https://cdn.jsdelivr.net/npm/sweetalert2@9.14.2/dist/sweetalert2.all.min.js',
    'https://www.gstatic.com/firebasejs/7.14.6/firebase.js',
    'https://cdn.datatables.net/1.10.21/js/jquery.dataTables.min.js',
    'https://cdn.datatables.net/1.10.21/js/dataTables.bootstrap4.min.js',
    'https://bdmedi-64262-default-rtdb.firebaseio.com'
];

self.addEventListener('install', e => {

    const cacheStatic = caches.open(STATIC_CACHE).then(cache => 
        cache.addAll(APP_SHELL));

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache => 
        cache.addAll(APP_SHELL_INMUTABLE));


    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

const respuesta = self.addEventListener('activate', e => {

    caches.keys().then(keys => {

        keys.forEach(key => {

            if(key !== STATIC_CACHE && key.includes('static')){
                return caches.delete(key);
            }

            if(key !== DYNAMIC_CACHE && key.includes('dynamic')){
                return caches.delete(key);
            }
        })
    })

    e.waitUntil(respuesta);

})

self.addEventListener('fetch', e => {

    const respuesta = caches.match(e.request).then(res => {
    
        if(res) {
            return res;
        } else {
            return fetch(e.request).then(newRes =>{
    
                return actualizaCacheDinamico(DYNAMIC_CACHE,e.request,newRes);
            })
    
        }
    })
    
    
        e.respondWith(respuesta);
    })




        



    
    


    
