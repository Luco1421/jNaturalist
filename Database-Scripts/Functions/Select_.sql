CREATE OR REPLACE FUNCTION Select_ (
    table_name IN VARCHAR2,
    values_ IN VARCHAR2,
    conditions IN VARCHAR2
)

RETURN SYS_REFCURSOR
IS
    v_cursor SYS_REFCURSOR;
    v_query VARCHAR2(1000);

BEGIN

    v_query := 'SELECT ' || values_ || ' FROM ' || table_name;
    IF conditions IS NOT NULL THEN
        v_query := v_query || ' WHERE ' || conditions;
    END IF;
    OPEN v_cursor FOR v_query;
    RETURN v_cursor;

EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
/
