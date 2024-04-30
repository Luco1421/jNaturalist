create or replace function obtenerID (
    tabla in varchar2,
    columna in varchar2,
    valor in varchar2,
    unico in number,
    id_columna in VARCHAR2,
    numero in number
) return number is 
    temp1 number;
    temp2 number;
    valor_num number;
begin
    if (numero = 1) then
        valor_num := to_number(valor);
    end if;
    
    execute immediate 'select count(*) from ' || tabla || ' where ' || columna || ' = :val' into temp1 using valor_num;
    
    if (temp1 = 1) then
        if (unico = 1) then 
            return 0; 
        end if;
        
        execute immediate 'select ' || id_columna || ' from ' || tabla || ' where ' || columna || ' = :val' into temp2 using valor_num;
    else
        execute immediate 'select max(' || id_columna || ') from ' || tabla into temp2;
        
        if (tabla = 'User_') then 
            execute immediate 'insert into User_(id_columna, name) values (:temp2, :val)' using temp2, valor;
        else 
            execute immediate 'insert into ' || tabla || '(' || id_columna || ', ' || columna || ') values (:temp2, :val)' using temp2, valor;
        end if;
    end if;
    
    return temp2;
end;
