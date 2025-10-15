// SafeCongo global scripts

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

  function locateAndCenter(map) {
    if (!map || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(function (pos) {
      var latlng = [pos.coords.latitude, pos.coords.longitude];
      map.setView(latlng, 13);
      L.marker(latlng).addTo(map).bindPopup('Vous êtes ici').openPopup();
    });
  }

  return { initMap: initMap, locateAndCenter: locateAndCenter };
})();


