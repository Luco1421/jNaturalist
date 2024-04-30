document.querySelectorAll('.card').forEach(i => i.addEventListener('click', (e) => {
    sessionStorage.setItem('taxon', i.classList[1]);
    window.location.href = 'info.html';
    }
));

insertar3(['getrandomoccurrences',12]).then(function(data) {
    console.log(data);
    let i = 0;
    document.querySelectorAll('.card').forEach(
        async function(j) {
            j.classList.add(`${data[i][0]}`);
            j.querySelector('.love').querySelector('span').innerText = data[i][2];
            url = await obtener(`select url from image where id_image = ${data[i++][12]}`);
            j.querySelector('.image').querySelector('img').src = url;        
        }
    );
});

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

function insertar3(param) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: "https://server-jnaturalist.onrender.com/funcionSQL3",
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
