document.querySelectorAll('.card').forEach(i => i.addEventListener('load', () => {
    info = obtenerDatos([i]);
    i.querySelector('.image').querySelector('img').src = info[url];
    }
));

document.querySelectorAll('.card').forEach(i => i.addEventListener('click', () => {
    sessionStorage.setItem('taxon', [i]);
    window.location.href = 'info.html';
    }
));

let p = insertar3(['getrandomoccurrences',12]);

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
