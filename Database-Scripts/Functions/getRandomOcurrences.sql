-- language=PL/SQL

CREATE OR REPLACE FUNCTION getRandomImages(numOcurrences IN NUMBER) RETURN SYS_REFCURSOR IS
    cur SYS_REFCURSOR;
BEGIN
    OPEN cur FOR
    SELECT *
    FROM (
        
        SELECT *
        FROM Occurrence
        ORDER BY DBMS_RANDOM.value() 

    )WHERE ROWNUM <= numOcurrences; 
    RETURN cur;
END;
/
