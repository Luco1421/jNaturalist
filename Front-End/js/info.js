let id_occ = sessionStorage.getItem('taxon');
llenarDatos();

async function mostrarUbicacion(){
    let map = L.map('map');
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);
    map.setMaxBounds(L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180)));
    let lat = await obtener(`SELECT Latitude FROM Location JOIN Image ON Location.location_id = Image.location JOIN Occurrence ON Image.id_Image = Occurrence.id_Image WHERE Occurrence.id_occurrence = ${id_occ}`);
    let lon = await obtener(`SELECT Longitude FROM Location JOIN Image ON Location.location_id = Image.location JOIN Occurrence ON Image.id_Image = Occurrence.id_Image WHERE Occurrence.id_occurrence = ${id_occ}`);
    map.setView([lat[0][0], lon[0][0]],5);
    L.marker([lat[0][0], lon[0][0],]).addTo(map);
}

async function llenarDatos(){
    await obtener(`select * from occurrence where id_occurrence = ${id_occ}`).then(
        async (data) => {
            console.log(data);
            document.getElementById('tax_img').src = await obtener(`select url from image where id_image = ${data[0][12]}`);
            for(let i=3; i<11; i++) {
                if (data[0][i]) document.getElementById('tax_route').innerHTML += `-> ${data[0][i]} `;
            }
            document.getElementById('tax_date').innerHTML += data[0][2];
            let user = await obtener(`select name, last_name, last_name2 from user_ where id_user = ${data[0][1]}`)
            document.getElementById('tax_author').innerHTML += `${user[0][0]} ${user[0][1]} ${user[0][2]}`;
            if (data[0][11]) document.getElementById('tax_com').innerHTML += data[0][11];
        }
    );
    mostrarUbicacion();
}

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