var map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
var southWest = L.latLng(-90, -180);
var northEast = L.latLng(90, 180);
var bounds = L.latLngBounds(southWest, northEast);
map.setMaxBounds(bounds);

async function getLatLon(id_occ) {
    let prueba = await obtener(`SELECT Latitude FROM Location JOIN Image ON Location.location_id = Image.location JOIN Occurrence ON Image.id_Image = Occurrence.id_Image WHERE Occurrence.id_occurrence = ${id_occ}`);
    let prueba2 = await obtener(`SELECT Longitude FROM Location JOIN Image ON Location.location_id = Image.location JOIN Occurrence ON Image.id_Image = Occurrence.id_Image WHERE Occurrence.id_occurrence = ${id_occ}`);
    return [prueba[0][0], prueba2[0][0]];
}

async function mostrar() {
    let xd = await obtener(`select id_occurrence from occurrence`);
    for (let i of xd) {
        let [lat, lon] = await getLatLon(i);
        L.marker([lat, lon], { draggable: false }).addTo(map);
    }
}

mostrar();
    
function obtener(query) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: "https://server-jnaturalist.onrender.com/obtener",
            data: { query: query },
            success: function(i) {
                resolve(i);
            },
            error: function(xhr, status, error) {
                reject(error);
            }
        });
    });
}