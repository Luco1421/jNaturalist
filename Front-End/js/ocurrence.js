var dropZone = document.getElementById('drop_zone');
var imagePreview = document.getElementById('image_preview');
var file = document.getElementById('file');

dropZone.addEventListener('dragover', function(e) {
  e.preventDefault();
  this.classList.add('drag_over');
});

dropZone.addEventListener('dragleave', function() {
  this.classList.remove('drag_over');
});

dropZone.addEventListener('drop', function(e) {
    e.preventDefault();
    this.classList.remove('drag_over');
    var file = e.dataTransfer.files[0];
    handleFile(file);
});

file.addEventListener('change', function(e) {
    var file = e.target.files[0];
    handleFile(file);
});
  
function handleFile(file) {
    var reader = new FileReader();
    reader.onload = function(event) {
        dropZone.setAttribute('hidden', 'true');
        imagePreview.removeAttribute('hidden');
        imagePreview.querySelector('img').src = event.target.result;
    }
    reader.readAsDataURL(file);
}


var map = L.map('map').setView([9, -85], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var marker = L.marker([0, 0], { draggable: true }).addTo(map);
var southWest = L.latLng(-90, -180);
var northEast = L.latLng(90, 180);
var bounds = L.latLngBounds(southWest, northEast);
map.setMaxBounds(bounds);

map.on('click', function(e) {
    var latLng = e.latlng;
    marker.setLatLng(latLng);
    document.getElementById('latitude').value = latLng.lat;
    document.getElementById('longitude').value = latLng.lng;
});

map.on('mousemove', function(e) {
    var latLng = marker.getLatLng();
    document.getElementById('latitude').value = latLng.lat;
    document.getElementById('longitude').value = latLng.lng;
});

document.getElementById('seFue').addEventListener('click', async function(event) {
    event.preventDefault();

    document.querySelector('.load').removeAttribute('hidden');

    let db_owner = document.getElementById('owner').value;
    let db_license = document.getElementById('license').value;
    let db_latitude = document.getElementById('latitude').value;
    let db_longitude = document.getElementById('longitude').value;
    let db_taxon = document.getElementById('taxon').value;
    let db_date = document.getElementById('date').value;
    let db_note = document.getElementById('note').value;

    if(!db_latitude || !db_longitude || !db_taxon || !db_date || !file.files[0]) {
        alert("Faltan datos");
        document.querySelector('.load').setAttribute('hidden','');
        return;
    }

    let license_id = await obtenerGOD('License','name',db_license,false,'id_license',0);
    let location_id = await obtenerLatlon(db_latitude,db_longitude);
    let db_url = await obtenerURL();
    let mail_id = await obtenerGOD('Mail','name',sessionStorage.getItem("username"),false,'id_mail',0);
    let user_id = await obtenerGOD('User_','mail',mail_id,false,'id_user',1);
    
    let owner_id;
    if (db_owner) owner_id = await obtenerGOD('User_','name',db_owner,false,'id_user',0);
    else owner_id = user_id;
    await insertar(`insert into Image(url,license,location,owner) values('${db_url}',${license_id},${location_id},${owner_id})`);
    
    let image_id = await obtenerGOD('Image','url',db_url,false,'id_image',0);
    let result = await insertar2(['ADMIN.Autocomplete',image_id[0][0],user_id[0][0],db_date,db_note,db_taxon]);
    alert(result);
    
    alert("Imagen subida con éxito");
    window.location.href = "principal.html";
});

async function obtenerURL() {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('imagen', file.files[0]);
        $.ajax({
            type: "POST",
            url: "https://server-jnaturalist.onrender.com/upload",
            data: formData,
            processData: false,
            contentType: false,
            success: function(i) {
                resolve(i);
            },
            error: function(xhr, status, error) {
                reject(error);
            }
        });
    });
}

async function obtenerLatlon(lat,lon) {
    let temp = await obtener(`select count(*) from Location where latitude = ${lat} and longitude = ${lon}`);
    if (temp==1) {
        let temp2 = await obtener(`select location_id from Location where latitude = ${lat} and longitude = ${lon}`);
        return temp2;
    } else if (temp==0) {
        let temp3 = await obtener(`select max(location_id) from Location`);
        temp3++;
        await insertar(`insert into Location values (${temp3}, ${lat}, ${lon})`);
        return temp3;
    }
}