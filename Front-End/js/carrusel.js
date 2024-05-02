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
    document.querySelectorAll('.card').forEach(i => i.addEventListener('click', async (e) => {
        sessionStorage.setItem('taxon', i.classList[1]);
        window.location.href = 'info.html';
        }
    ));
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

function buscar() {
    document.querySelector('.cartas').setAttribute('hidden','');
    document.querySelector('.result').removeAttribute('hidden');
    let i = document.getElementById('entrada').value;
    insertar3(['search',i]).then(function(data) {
        console.log(data);
        crearCartas(data);
    });
}

async function crearCartas(num) {
    document.getElementById('resultado').innerHTML = '';
    let cartasContainer = document.getElementById("resultado");
    if (!num.length) {
        var carta = document.createElement("div");
      carta.classList.add("hijo");
        var cartaHTML = `
        <a href="ocurrence.html">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">No hay resultados</h5>
              <p class="card-text">Contribuye ahora!</p>
            </div>
          </div>
        </a>`;
      carta.innerHTML = cartaHTML;
      cartasContainer.appendChild(carta);
    }
    for (let i of num) {
        let url = await obtener(`select url from image where id_image = ${i[12]}`);
        var carta = document.createElement("div");
        carta.classList.add("hijo");
        var cartaHTML = `
            <div class="card2 ${i[0]}">
              <div class="itemc">
                <img src="${url}" class="itemc_img">
                <h5 class="itemc_h5">${i[2]}</h5>
                <p class="itemc_p">Toque para editar.</p>
              </div>
            </div>`;
      carta.innerHTML = cartaHTML;
      cartasContainer.appendChild(carta);
      cartasContainer.querySelectorAll('.card2').forEach(i => i.addEventListener('click', (e) => {
        sessionStorage.setItem('taxon', i.classList[1]);
        window.location.href = 'info.html';
      }));
    }
}
