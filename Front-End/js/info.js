function dislike() {
    let c = +document.getElementsByClassName('dislike-text-content')[0].innerHTML;
    if(c&1) {
        document.getElementsByClassName('dislike-text-content')[0].innerHTML = c-1;
        document.getElementById('like-checkbox').removeAttribute('disabled');
    }
    else {
        document.getElementsByClassName('dislike-text-content')[0].innerHTML = c+1;
        document.getElementById('like-checkbox').setAttribute('disabled', 'true');
    }
}

function like() {
    let c = +document.getElementsByClassName('like-text-content')[0].innerHTML;
    if(c&1) {
        document.getElementsByClassName('like-text-content')[0].innerHTML = c-1;
        document.getElementById('dislike-checkbox').removeAttribute('disabled');
    }
    else {
        document.getElementsByClassName('like-text-content')[0].innerHTML = c+1;
        document.getElementById('dislike-checkbox').setAttribute('disabled', 'true');
    }
}

let info = await obtener(`select * from occurrence where id_occurrence = ${sessionStorage.getItem('taxon')}`);

document.getElementById('tax_name').innerHTML += info[n];
//
//
//

var map = L.map('map');
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

async function despuesSigo() {
    let [lat, lon] = await getLatLon(sessionStorage.getItem('tax'));
    map.setView([lat, lon], 2);
    let marker = L.marker([lat, lon]).addTo(map);
}

await despuesSigo();
