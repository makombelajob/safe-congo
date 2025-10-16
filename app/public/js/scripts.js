
window.SafeCongo = (function () {
    function initMap(elementId, options) {
        if (!window.L) return null;
        var map = L.map(elementId, options || { zoomControl: true });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        return map;
    }

    // function locateAndCenter(map) {
    //     if (!map || !navigator.geolocation) return;
    //     navigator.geolocation.getCurrentPosition(function (pos) {
    //         var latlng = [pos.coords.latitude, pos.coords.longitude];
    //         map.setView(latlng, 13);
    //         L.marker(latlng).addTo(map).bindPopup('Vous êtes ici').openPopup();
    //     });
    // }
    function locateAndCenter(map) {
        if (!map || !navigator.geolocation) return;

        // Centre temporaire
        map.setView([0, 0], 2); // Vue globale du monde

        navigator.geolocation.getCurrentPosition(
            function (pos) {
                var latlng = [pos.coords.latitude, pos.coords.longitude];
                map.setView(latlng, 13);
                L.marker(latlng).addTo(map).bindPopup('Vous êtes ici').openPopup();
            },
            function (err) {
                console.warn('Erreur de géolocalisation:', err);
                // Si échec, reste sur la vue globale
            },
            { timeout: 5000 } // ne pas bloquer plus de 5s
        );
    }

    function mapLoadIndex(){
    const map = window.SafeCongo && window.SafeCongo.initMap('map');
    if (map) {
        window.SafeCongo.locateAndCenter(map);
    }
}

    return { initMap: initMap, locateAndCenter: locateAndCenter, mapLoadIndex: mapLoadIndex};
})();
window.SafeCongo.mapLoadIndex();
