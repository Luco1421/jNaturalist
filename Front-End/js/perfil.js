async function crearCartas() {
    let num = await obtener(`select date_,id_occurrence from occurrence where autor = (select id_user from user_ where mail = (select id_mail from mail where name = '${sessionStorage.getItem('username')}'))`);
    let cartasContainer = document.getElementById("jsGoodd");
    if (!num.length) {
        var carta = document.createElement("div");
      carta.classList.add("col-md-3", "mb-3", "hijo");
        var cartaHTML = `
        <a href="ocurrence.html">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Aun no registra Taxones</h5>
            <p class="card-text">Contribuye ahora!</p>
          </div>
        </div>
        </a>
      `;
      carta.innerHTML = cartaHTML;
      cartasContainer.appendChild(carta);
    }
    for (let i in num) {
      var carta = document.createElement("div");
      carta.classList.add("col-md-3", "mb-3", "hijo");
      sessionStorage.setItem('id_occurrence', num[i][1]);
        var cartaHTML = `
        <a href="editar.html">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${num[i][0]}</h5>
            <p class="card-text">Toque para editar.</p>
          </div>
        </div>
        </a>
      `;
      carta.innerHTML = cartaHTML;
      cartasContainer.appendChild(carta);
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