document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    document.querySelector('.load').removeAttribute('hidden');
    let correo = document.getElementById('emailInput').value;
    sessionStorage.setItem("username", correo);
    let passwd = document.getElementById('passwordInput').value;
    let pwG = await obtener(`SELECT passwd FROM passw WHERE correo = '${correo}'`);
    if (pwG == passwd) {
        window.location.href = 'principal.html';
    } else {
        alert('Credenciales incorrectos');
        document.querySelector('.load').setAttribute('hidden', 'true');
        passwd = '';
    }
});

document.getElementById('signupForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    document.querySelector('.load').removeAttribute('hidden');

    let name = document.getElementById('name').value;
    let lastname = document.getElementById('lastname').value;
    let lastname2 = document.getElementById('lastname2').value;
    let country = document.getElementById('country').value;
    let address = document.getElementById('address').value;
    let email = document.getElementById('email').value;
    sessionStorage.setItem("username", email);
    let password = document.getElementById('password').value;

    let mailLibre = await obtenerGOD('Mail','name',email,true,'id_mail',0);

    if (!mailLibre) {
        alert('Correo en uso, proceda a cambiar la contraseña');
        email = '';
        document.querySelector('.load').setAttribute('hidden','');
    }
    else {
        let idPais = await obtenerGOD('Country','name',country,false,'id_country',0);
        let idDir = await obtenerGOD('Address','name',address,false,'id_address',0);
        await insertar(`insert into user_(name, last_name, last_name2, country, address, mail) values('${name}', '${lastname}', '${lastname2}', ${idPais}, ${idDir}, ${mailLibre})`);
        await insertar(`insert into passw values('${email}','${password}')`);
        alert('Usuario registrado con exito');
        window.location.href = 'principal.html';
    }
});

function insertar(query) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: "https://server-jnaturalist.onrender.com/insertar",
            data: { query: query },
            success: function(i) {
                resolve(i[0]);
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
                resolve(i[0]);
            },
            error: function(xhr, status, error) {
                reject(error);
            }
        });
    });
}

async function obtenerGOD(tabla,columna,valor,unique,id,num) {
    let temp = await obtener(`select count(*) from ${tabla} where ${columna} = ` + (num ? valor: `'${valor}'`));
    alert(temp);
    console.log('Existe email:', temp);
    if (temp==1) {
        if (unique) return 0;
        else {
            let temp2 = await obtener(`select ${id} from ${tabla} where ${columna} = '${valor}'`);
            return temp2;
        }
    } else if (temp==0) {
        let temp3 = await obtener(`select max(${id}) from ${tabla}`);
        temp3++;
        await insertar(`insert into ${tabla} values (${temp3}, '${valor}')`);
        return temp3;
    }
}