CREATE OR REPLACE FUNCTION Search(data_ IN VARCHAR2) RETURN SYS_REFCURSOR IS
    cur SYS_REFCURSOR;
    data_lowercase VARCHAR2(100); 
BEGIN
    data_lowercase := LOWER(data_);
    
    OPEN cur FOR
    SELECT *
    FROM Occurrence O
    WHERE UTL_MATCH.EDIT_DISTANCE_SIMILARITY(LOWER(O.Kingdom), data_lowercase) > 60 OR 
          UTL_MATCH.EDIT_DISTANCE_SIMILARITY(LOWER(O.Phylum), data_lowercase) > 60 OR 
          UTL_MATCH.EDIT_DISTANCE_SIMILARITY(LOWER(O.Class), data_lowercase) > 60 OR 
          UTL_MATCH.EDIT_DISTANCE_SIMILARITY(LOWER(O.Order_), data_lowercase) > 60 OR
          UTL_MATCH.EDIT_DISTANCE_SIMILARITY(LOWER(O.Genus), data_lowercase) > 60 OR
          UTL_MATCH.EDIT_DISTANCE_SIMILARITY(LOWER(O.Species), data_lowercase) > 60 OR 
          UTL_MATCH.EDIT_DISTANCE_SIMILARITY(LOWER(O.Common_name), data_lowercase) > 60 OR 
          EXISTS (
            SELECT 1
            FROM User_ U
            WHERE (UTL_MATCH.EDIT_DISTANCE_SIMILARITY(LOWER(U.name), data_lowercase) > 85 OR 
                  UTL_MATCH.EDIT_DISTANCE_SIMILARITY(LOWER(U.last_name), data_lowercase) > 85 OR 
                  UTL_MATCH.EDIT_DISTANCE_SIMILARITY(LOWER(U.last_name2), data_lowercase) > 85)
                  AND O.autor = U.id_user
        );

    RETURN cur;
END;
/
