
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
    // function locateAndCenter(map) {
    //     if (!map || !navigator.geolocation) return;

    //     // Centre temporaire
    //     map.setView([0, 0], 2); // Vue globale du monde

    //     navigator.geolocation.getCurrentPosition(
    //         function (pos) {
    //             var latlng = [pos.coords.latitude, pos.coords.longitude];
    //             map.setView(latlng, 13);
    //             L.marker(latlng).addTo(map).bindPopup('Vous êtes ici').openPopup();
    //         },
    //         function (err) {
    //             console.warn('Erreur de géolocalisation:', err);
    //             // Si échec, reste sur la vue globale
    //         },
    //         { timeout: 5000 } // ne pas bloquer plus de 5s
    //     );
    // }
    const map = L.map('map').setView([48.8566, 2.3522], 5); // vue de départ sur la France
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const statusEl = document.getElementById('status');
    const locateBtn = document.getElementById('locateBtn');
    let userMarker = null;

    // ---- Fonction principale inspirée de ton exemple ----
    function locateAndCenter(map) {
        if (!map || !navigator.geolocation) {
            statusEl.textContent = '❌ Géolocalisation non supportée.';
            return;
        }

        statusEl.textContent = '📡 Localisation en cours...';

        navigator.geolocation.getCurrentPosition(
            function (pos) {
                const latlng = [pos.coords.latitude, pos.coords.longitude];
                map.setView(latlng, 13);

                // Ajout ou mise à jour du marqueur
                if (userMarker) {
                    userMarker.setLatLng(latlng);
                } else {
                    userMarker = L.marker(latlng)
                        .addTo(map)
                        .bindPopup('📍 Vous êtes ici')
                        .openPopup();
                }

                statusEl.textContent = `✅ Position trouvée (${latlng[0].toFixed(5)}, ${latlng[1].toFixed(5)})`;
            },
            function (err) {
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        statusEl.textContent = '❌ Permission refusée.';
                        break;
                    case err.POSITION_UNAVAILABLE:
                        statusEl.textContent = '⚠️ Position indisponible.';
                        break;
                    case err.TIMEOUT:
                        statusEl.textContent = '⏱️ Délai dépassé.';
                        break;
                    default:
                        statusEl.textContent = '❌ Erreur inconnue.';
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }

    // Exécuter automatiquement à l’ouverture
    window.addEventListener('load', () => {
        locateAndCenter(map); // déclenche la popup d’autorisation
    });

    // Bouton manuel pour relancer
    locateBtn.addEventListener('click', () => {
        locateAndCenter(map);
    });

    function mapLoadIndex(){
    const map = window.SafeCongo && window.SafeCongo.initMap('map');
    if (map) {
        window.SafeCongo.locateAndCenter(map);
    }
}

    return { initMap: initMap, locateAndCenter: locateAndCenter, mapLoadIndex: mapLoadIndex};
})();
window.SafeCongo.mapLoadIndex();
