insert into entities (name, address, postal, city, iban, note) values ("tt", "hisa 1", 5271, "vipava", "0095 2211 1211 4200 6969", "");
insert into entities (name, address, postal, city, iban, note) values ("bb", "hisa 2", 5272, "ajdovscina", "0095 3211 1211 6969 4200", "");

UPDATE traffic SET amount = amount * 100;

delete from proforma;
delete from traffic where id > 5;
delete from invoices;
ALTER TABLE invoices AUTO_INCREMENT = 1;
ALTER TABLE proforma AUTO_INCREMENT = 1;
ALTER TABLE traffic AUTO_INCREMENT = 6;

ALTER TABLE entities drop column iban;
ALTER TABLE entities drop column bank;

ALTER TABLE entities ADD column short varchar(255) AFTER name;
ALTER TABLE entities ADD column tin varchar(255) AFTER city;

-- TOTAL ORDERED
SELECT 
    st.type as type,
    SUM(os.quantity) as quantity
FROM ordered_stuff as os
    JOIN stuff_types st ON st.id = os.stufftype_id
WHERE type='S' OR type='M' OR type='L' OR type='XL' OR type='XXL'
GROUP BY type;

SELECT 
    SUM(os.quantity) as total_quantity
FROM ordered_stuff as os
    JOIN stuff_types st ON st.id = os.stufftype_id
WHERE UPPER(TRIM(st.type)) IN ('S', 'M', 'L', 'XL', 'XXL');

ALTER TABLE sales ADD discount int AFTER event_id;
