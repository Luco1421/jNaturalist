import oracledb

ids = [-(1 << 30), 17, 125, 414, 1709, 14052, 209480, 2152730]
ranks = {1: 'Kingdom', 2: 'Phylum', 3: 'Class', 4: 'Order_', 5: 'Family', 6: 'Genus', 7: 'Species'}

connection = oracledb.connect(user="ADMIN", password="e2rR7crGCPXfP6p", dsn='(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1521)(host=adb.sa-bogota-1.oraclecloud.com))(connect_data=(service_name=gaa3984019cccbe_jnaturalist_low.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))')
cursor = connection.cursor()


def insert_values(arr):
    rank = len(arr)
    ids[rank] -= 1
    query = (f"INSERT INTO Kingdom (id_{ranks[rank]}, name_{ranks[rank]}) VALUES ({ids[rank]}, '{arr[0]}')" if rank == 1
            else f"INSERT INTO {ranks[rank]} (id_{ranks[rank]}, id_{ranks[rank - 1]}, name_{ranks[rank]}) VALUES ({ids[rank]}, {ids[rank-1]}, '{arr[-1]}')")
    cursor.execute(query)
    connection.commit()


with open('Taxon.csv', 'r') as file:
    lines = file.readlines()[::-1]  
    for line in lines:
        if line.strip(): 
            insert_values(line.strip().split(', '))

cursor.close()
connection.close()
