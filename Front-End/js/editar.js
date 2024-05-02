let taxonAct = sessionStorage.getItem('taxon');

document.getElementById('change').addEventListener('click', async function(e) {
    let newName = document.getElementById('n').value;
    let newComment = document.getElementById('lstn').value;
    let valid = await obtener(`SELECT COUNT(*) FROM Kingdom k LEFT JOIN Phylum p ON k.id_Kingdom = p.id_Kingdom LEFT JOIN Class c ON p.id_Phylum = c.id_Phylum LEFT JOIN Order_ o ON c.id_Class = o.id_Class LEFT JOIN Family f ON o.id_Order_ = f.id_Order_ LEFT JOIN Genus g ON f.id_Family = g.id_Family LEFT JOIN Species s ON g.id_Genus = s.id_Genus WHERE k.name_Kingdom = '${newName}' OR p.name_Phylum = '${newName}' OR c.name_Class = '${newName}' OR o.name_Order_ = '${newName}' OR f.name_Family = '${newName}' OR g.name_Genus = '${newName}' OR s.name_Species = '${newName}'`);
    alert(valid);
    if(valid) {
         insertar2(['updateProc',taxonAct, newName, newComment]);
    }
});

// document.getElementById('remove').addEventListener('click', function(e) {

// });

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
                resolve(i[0]);
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