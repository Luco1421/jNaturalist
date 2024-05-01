document.getElementById("change").addEventListener('click', async function(event) {
    event.preventDefault();
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
});