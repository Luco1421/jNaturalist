function obtener(query) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:5000/obtener",
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
            url: "http://127.0.0.1:5000/insertar",
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
            url: "http://127.0.0.1:5000/funcionSQL",
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
            url: "http://127.0.0.1:5000/funcionSQL3",
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
        let val;
        (tabla == 'User_')? val = '(name)': val='';
        let temp3 = await obtener(`select max(${id}) from ${tabla}`);
        temp3++;
        await insertar(`insert into ${tabla}${val} values (${temp3}, '${valor}')`);
        return temp3;
    }
}
