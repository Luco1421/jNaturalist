document.getElementById("change").addEventListener('click', async function(event) {
    event.preventDefault();
    let namee = document.getElementById("n").value;
    let lastname = document.getElementById("lstn").value;
    let lastname2 = document.getElementById("lstn2").value;
    let email = document.getElementById("mail").value;
    let password = document.getElementById("ps").value;
    let password2 = document.getElementById("ps2").value;
    if (password != password2) {
        alert('Las contraseñas no son iguales');
        return;
    }
    let db = await obtener(`select User_.name, User_.last_name, User_.last_name2, Mail.name from User_ join Mail on Mail.id_mail = User_.mail where Mail.name = '${email}'`);
    if (namee == db[0][0] && lastname == db[0][1] && lastname2 == db[0][2] && email == db[0][3]) {
        await insertar(`Update passw set passwd = '${password}' where correo = '${email}'`)
        alert('Contraseña actualizada');
        window.location.href = "login.html";
    }
    else {
        alert('Datos incorrectos');
        namee = ''
        lastname = ''
        lastname2 = ''
        email = ''
        password = ''
        password2 = '' 
    }
    return;
});

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