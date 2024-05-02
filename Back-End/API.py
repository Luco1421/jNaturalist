from flask import Flask, request, jsonify
from flask_cors import CORS
import oracledb
import boto3

connection = oracledb.connect(user="ADMIN", password="e2rR7crGCPXfP6p", dsn='(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1521)(host=adb.sa-bogota-1.oraclecloud.com))(connect_data=(service_name=gaa3984019cccbe_jnaturalist_low.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))')
cursor = connection.cursor()

s3 = boto3.client('s3', aws_access_key_id='AKIA6GBMFJUPEAHMTYGN', aws_secret_access_key='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')
S3_BUCKET_NAME = 'jnaturalist'

app = Flask(__name__)
CORS(app)

def insertarDatos(query):
    data = cursor.execute(query)
    connection.commit()
    return 'Se inserto bien'

def obtenerDatos(query):
    data = cursor.execute(query).fetchall()
    return jsonify(data)

def exeProcInput(l):
    cursor.callproc(l[0],l[1:])
    return 'salio goood'

def returnFun(l,tipo):
    data = cursor.callfunc(l[0],tipo,l[1:])
    return data

def cursorPy(l):
    result_set = cursor.var(oracledb.CURSOR)
    cursor.execute(f"BEGIN :result := ADMIN.{l[0]}(:param); END;", result = result_set, param = l[1])
    return list(result_set.getvalue())

@app.route('/insertar', methods=['POST'])
def insertar():
    query = request.form.get('query')
    print(query)
    return insertarDatos(query)

@app.route('/obtener', methods=['POST'])
def obtener():
    query = request.form.get('query')
    print(query)
    return obtenerDatos(query)

@app.route('/funcionSQL', methods=['POST'])
def funcionSQL():
    datos = request.get_json()
    print(datos)
    return exeProcInput(datos)

@app.route('/funcionSQL2', methods=['POST'])
def funcionSQL2():
    datos = request.get_json()
    print(datos)
    return returnFun(datos,int)

@app.route('/funcionSQL3', methods=['POST'])
def funcionSQL3():
    datos = request.get_json()
    print(datos)
    return cursorPy(datos)

@app.route('/upload', methods=['POST'])
def upload():
    archivo = request.files['imagen']
    tipo = archivo.filename.split('.')[1]
    id_img = returnFun(['ADMIN.nextID','Image','id_Image'],int)
    s3.upload_fileobj(archivo, S3_BUCKET_NAME, f'{id_img}.{tipo}')
    url = f'https://jnaturalist.s3.us-east-2.amazonaws.com/{id_img}.{tipo}'
    return jsonify(url)

if __name__ == '__main__':
    app.run(debug=True)