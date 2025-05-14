async function  initMap() {
  const {ColorScheme} = await google.maps.importLibrary("core")
  const location = {
    lat: parseFloat(document.getElementById('map').dataset.lat),
    lng: parseFloat(document.getElementById('map').dataset.lng)
  };

  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: location,
    colorScheme: ColorScheme.LIGHT,
  });

  new google.maps.Marker({
    position: location,
    map: map,
    title: "Exact Locationn provided after booking"
  });
}

// Attach to window so Google callback can find it
window.initMap = initMap;
