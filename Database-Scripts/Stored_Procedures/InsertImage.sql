-- language=PL/SQL

CREATE OR REPLACE PROCEDURE InsertImage (
    id_License IN NUMBER,
    id_Location IN NUMBER,
    id_Owner IN NUMBER,
    url IN VARCHAR2
) AS
BEGIN
    INSERT INTO Image (license, location, owner, url) VALUES (id_License, id_Location, id_Owner, url);
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Image inserted!');
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END;
/
