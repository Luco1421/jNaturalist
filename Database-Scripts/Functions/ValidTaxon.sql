-- language=PL/SQL

CREATE OR REPLACE FUNCTION validTaxon(taxon IN VARCHAR2) RETURN NUMBER IS
    bool NUMBER;
BEGIN
    SELECT count (*) INTO bool 
    FROM Kingdom k
    LEFT JOIN Phylum p ON k.id_Kingdom = p.id_Kingdom
    LEFT JOIN Class c ON p.id_Phylum = c.id_Phylum
    LEFT JOIN Order_ o ON c.id_Class = o.id_Class
    LEFT JOIN Family f ON o.id_Order_ = f.id_Order_
    LEFT JOIN Genus g ON f.id_Family = g.id_Family
    LEFT JOIN Species s ON g.id_Genus = s.id_Genus
    WHERE k.name_Kingdom = taxon
       OR p.name_Phylum = taxon
       OR c.name_Class = taxon
       OR o.name_Order_ = taxon
       OR f.name_Family = taxon
       OR g.name_Genus = taxon
       OR s.name_Species = taxon;

    RETURN bool;
END;
