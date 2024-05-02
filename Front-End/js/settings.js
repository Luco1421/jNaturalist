document.getElementById("change").addEventListener('click', async function(event) {
    event.preventDefault();

    document.querySelector(".load").removeAttribute('hidden');

    let namee = document.getElementById("n").value;
    let lastname = document.getElementById("lstn").value;
    let lastname2 = document.getElementById("lstn2").value;
    let country = document.getElementById("pais").value;
    let address = document.getElementById("dir").value;
    if (namee && lastname && lastname2 && country && address) {
        await insertar(`Update user_ set name = '${namee}' , last_name = '${lastname}' , last_name2 = '${lastname2}' , country = '${await obtenerGOD('country','name',country,false,'id_country',0)}' , address = '${await obtenerGOD('address','name',address,false,'id_address',0)}'  where mail = '${await obtenerGOD('mail','name',sessionStorage.getItem('username'),false,'id_mail',0)}'`);
        alert('Datos actualizados');
        window.location.href = "principal.html";
        return;
    }
    alert('datos incompletos');
    document.querySelector(".load").setAttribute('hidden','');
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