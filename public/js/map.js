const map = L.map('map').setView([lat, lon], 13); // initializin a map + latitude and longitude with zoom level

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {   // tile layer (using openstreet map)
    attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    
L.marker([lat, lon]).addTo(map)
    .bindPopup(`<b>${listingTitle}</b> <br> Exact location provided after booking`)
    .openPopup();