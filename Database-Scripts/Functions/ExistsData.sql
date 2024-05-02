CREATE OR REPLACE FUNCTION ExistsData(
    table_name IN VARCHAR2,
    clmn IN VARCHAR2,
    data_ IN VARCHAR2
)
RETURN NUMBER
IS
    bool NUMBER;
BEGIN

    EXECUTE IMMEDIATE 'SELECT COUNT(*) FROM ' || table_name || ' WHERE ' || clmn || ' = :1'
        INTO bool
        USING data_;
    RETURN bool;

EXCEPTION
    WHEN OTHERS THEN
        RETURN -1;
END;
/
