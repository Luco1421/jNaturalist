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
    let owner_id = await obtenerGOD('User_','name',db_owner,false,'id_user',0);
    let db_url = await obtenerURL();
    let mail_id = await obtenerGOD('Mail','name',sessionStorage.getItem("username"),false,'id_mail',0);
    let user_id = await obtenerGOD('User_','mail',mail_id,false,'id_user',1);
    
    if (owner_id == -1) owner_id = user_id;
    await insertar(`insert into Image(url,license,location,owner) values('${db_url}',${license_id},${location_id},${owner_id})`);
    
    let valid = await obtener(`SELECT COUNT(*) FROM Kingdom k LEFT JOIN Phylum p ON k.id_Kingdom = p.id_Kingdom LEFT JOIN Class c ON p.id_Phylum = c.id_Phylum LEFT JOIN Order_ o ON c.id_Class = o.id_Class LEFT JOIN Family f ON o.id_Order_ = f.id_Order_ LEFT JOIN Genus g ON f.id_Family = g.id_Family LEFT JOIN Species s ON g.id_Genus = s.id_Genus WHERE k.name_Kingdom = '${db_taxon}' OR p.name_Phylum = '${db_taxon}' OR c.name_Class = '${db_taxon}' OR o.name_Order_ = '${db_taxon}' OR f.name_Family = '${db_taxon}' OR g.name_Genus = '${db_taxon}' OR s.name_Species = '${db_taxon}'`);
    
    if(valid) {
        let image_id = await obtenerGOD('Image','url',db_url,false,'id_image',0);
        await insertar2(['ADMIN.Autocomplete',image_id[0][0],user_id[0][0],db_date,db_note,db_taxon]);
        
        alert("Imagen subida con éxito");
        window.location.href = "principal.html";
    }
    else {
        alert('El taxon no existe');
    }
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

function insertar(query) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: "https://server-jnaturalist.onrender.com/insertar",
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

function insertar2(param) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: "https://server-jnaturalist.onrender.com/funcionSQL",
            data: JSON.stringify(param),
            contentType: 'application/json',
            success: function(i) {
                resolve(i);
            },
            error: function(xhr, status, error) {
                reject(error);
            }
        });
    });
}

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

async function obtenerGOD(tabla,columna,valor,unique,id,num) {
    if (!valor) {
        if (tabla == 'User_') return -1;
        valor = 'No Copyright';
    }
    let temp = await obtener(`select count(*) from ${tabla} where ${columna} = ` + (num ? valor: `'${valor}'`));
    if (temp==1) {
        if (unique) return 0;
        else {
            let temp2 = await obtener(`select ${id} from ${tabla} where ${columna} = '${valor}'`);
            return temp2;
        }
    } else if (temp==0) {
        let temp3 = await obtener(`select max(${id}) from ${tabla}`);
        temp3++;
        if(tabla=='User_') await insertar(`insert into User_(name) values ('${valor}')`);
        else await insertar(`insert into ${tabla} values (${temp3}, '${valor}')`);
        return temp3;
    }
}