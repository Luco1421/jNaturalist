CREATE OR REPLACE PROCEDURE Autocomplete (
    id_Image IN NUMBER,
    id_autor IN NUMBER,
    date_oc IN VARCHAR2,
    note IN VARCHAR2,
    taxon IN VARCHAR2
)
IS
    
    c_Kingdom NUMBER;
    c_Phylum NUMBER;
    c_Class NUMBER;
    c_Order_ NUMBER;
    c_Family NUMBER;
    c_Genus NUMBER;
    c_Species NUMBER;
    name_Kingdom VARCHAR2(1000);
    name_Phylum VARCHAR2(1000);
    name_Class VARCHAR2(1000);
    name_Order_ VARCHAR2(1000);
    name_Family VARCHAR2(1000);
    name_Genus VARCHAR2(1000);
    name_Species VARCHAR2(1000);
    common_name VARCHAR2(1000);
    v_taxon VARCHAR2(1000); 

BEGIN

    v_taxon := taxon; 

    SELECT t.name_Kingdom, t.name_Phylum, t.name_Class, t.name_Order_, t.name_Family, t.name_Genus, t.name_Species, t.common_name
    INTO name_Kingdom, name_Phylum, name_Class, name_Order_, name_Family, name_Genus, name_Species, common_name
    FROM (
        SELECT 
            k.name_Kingdom, p.name_Phylum, c.name_Class, o.name_Order_, f.name_Family, g.name_Genus, s.name_Species, s.common_name,
            ROW_NUMBER() OVER (ORDER BY CASE
                                            WHEN k.name_Kingdom = v_taxon THEN 1
                                            WHEN p.name_Phylum = v_taxon THEN 2
                                            WHEN c.name_Class = v_taxon THEN 3
                                            WHEN o.name_Order_ = v_taxon THEN 4
                                            WHEN f.name_Family = v_taxon THEN 5
                                            WHEN g.name_Genus = v_taxon THEN 6
                                            WHEN s.name_Species = v_taxon THEN 7
                                            ELSE 8
                                        END) AS rn
        FROM Kingdom k
        LEFT JOIN Phylum p ON k.id_Kingdom = p.id_Kingdom
        LEFT JOIN Class c ON p.id_Phylum = c.id_Phylum
        LEFT JOIN Order_ o ON c.id_Class = o.id_Class
        LEFT JOIN Family f ON o.id_Order_ = f.id_Order_
        LEFT JOIN Genus g ON f.id_Family = g.id_Family
        LEFT JOIN Species s ON g.id_Genus = s.id_Genus
        WHERE k.name_Kingdom = v_taxon
           OR p.name_Phylum = v_taxon
           OR c.name_Class = v_taxon
           OR o.name_Order_ = v_taxon
           OR f.name_Family = v_taxon
           OR g.name_Genus = v_taxon
           OR s.name_Species = v_taxon
    ) t
    WHERE rn = 1;

        
    IF (name_Genus = v_taxon) THEN
        name_Species := NULL;
        common_name := NULL;

    ELSIF (name_Family = v_taxon) THEN
        name_Species := NULL;
        common_name := NULL;
        name_Genus := NULL;

    ELSIF (name_Order_ = v_taxon) THEN
        name_Species := NULL;
        common_name := NULL;
        name_Genus := NULL;
        name_Family := NULL;

    ELSIF (name_Class = v_taxon) THEN
        name_Species := NULL;
        common_name := NULL;
        name_Genus := NULL;
        name_Family := NULL;
        name_Order_ := NULL;

    ELSIF (name_Phylum = v_taxon) THEN
        name_Species := NULL;
        common_name := NULL;
        name_Genus := NULL;
        name_Family := NULL;
        name_Order_ := NULL;
        name_Class := NULL;

    ELSIF (name_Kingdom = v_taxon) THEN
        name_Species := NULL;
        common_name := NULL;
        name_Genus := NULL;
        name_Family := NULL;
        name_Order_ := NULL;
        name_Class := NULL;
        name_Phylum := NULL;

    END IF;


    INSERT INTO Occurrence (id_Image, autor, date_, note, Kingdom, Phylum, Class, Order_, Family, Genus, Species, common_name) 
    VALUES (id_Image, id_autor, TO_DATE(date_oc, 'YYYY-MM-DD'), note, name_Kingdom, name_Phylum, name_Class, name_Order_, name_Family, name_Genus, name_Species, common_name);


EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Taxon not found.');
        RETURN;
END;
/
