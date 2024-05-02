async function crearCartas() {
    let num = await obtener(`select date_,id_occurrence,id_image from occurrence where autor = (select id_user from user_ where mail = (select id_mail from mail where name = '${sessionStorage.getItem('username')}'))`);
    let cartasContainer = document.getElementById("jsGoodd");
    if (!num.length) {
        var carta = document.createElement("div");
      carta.classList.add("hijo");
        var cartaHTML = `
        <a href="ocurrence.html">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Aun no registra Taxones</h5>
              <p class="card-text">Contribuye ahora!</p>
            </div>
          </div>
        </a>`;
      carta.innerHTML = cartaHTML;
      cartasContainer.appendChild(carta);
    }
    for (let i of num) {
        let url = await obtener(`select url from image where id_image = ${i[2]}`);
        var carta = document.createElement("div");
        carta.classList.add("hijo");
        var cartaHTML = `
            <div class="card2 ${i[1]}">
              <div class="itemc">
                <img src="${url}" class="itemc_img">
                <h5 class="itemc_h5">${i[0]}</h5>
                <p class="itemc_p">Toque para editar.</p>
              </div>
            </div>`;
      carta.innerHTML = cartaHTML;
      cartasContainer.appendChild(carta);
      cartasContainer.querySelectorAll('.card2').forEach(i => i.addEventListener('click', (e) => {
        sessionStorage.setItem('taxon', i.classList[1]);
        window.location.href = 'editar.html';
      }));
    }
}

crearCartas();

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