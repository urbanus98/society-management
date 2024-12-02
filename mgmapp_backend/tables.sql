DROP TABLE IF EXISTS `traffic`;
DROP TABLE IF EXISTS `stuff_sold`;
DROP TABLE IF EXISTS `ordered_stuff`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `stuff_types`;
DROP TABLE IF EXISTS `stuff`;
DROP TABLE IF EXISTS `invoices`;
DROP TABLE IF EXISTS `events`;
DROP TABLE IF EXISTS `event_types`;
DROP TABLE IF EXISTS `entities`;

CREATE TABLE event_types (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255),
    PRIMARY KEY (id)
); 

CREATE TABLE events (
    id int NOT NULL AUTO_INCREMENT,
    type_id int,
    name varchar(255),
    duration int,
    date date,
    PRIMARY KEY (id),
    FOREIGN KEY (type_id) REFERENCES event_types(id)
); 

CREATE TABLE stuff (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255),
    price int,
    image_path varchar(255) NULL,
    PRIMARY KEY (id)
);

-- CREATE TABLE stuff_types (
--     id int NOT NULL AUTO_INCREMENT,
--     stuff_id int,
--     type varchar(255),
--     price int,
--     PRIMARY KEY (id),
--     FOREIGN KEY (stuff_id) REFERENCES stuff(id)
-- );

CREATE TABLE stuff_sold (
    id int NOT NULL AUTO_INCREMENT,
    event_id int NULL,
    stuff_id int,
    quantity int,
    price_actual int,
    PRIMARY KEY (id),
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (stuff_id) REFERENCES stuff(id)
);

-- CREATE TABLE orders (
--     id int NOT NULL AUTO_INCREMENT,
--     date varchar(255),
--     price_total int,
--     pdf_path varchar(255) NULL,
--     PRIMARY KEY (id)
-- );

-- CREATE TABLE ordered_stuff (
--     id int NOT NULL AUTO_INCREMENT,
--     order_id int,
--     stufftype_id int,
--     quantity int,
--     PRIMARY KEY (id),
--     FOREIGN KEY (stufftype_id) REFERENCES stuff_types(id),
--     FOREIGN KEY (order_id) REFERENCES orders(id)
-- );

CREATE TABLE entities (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255),
    address varchar(255),
    postal int,
    place varchar(255),
    iban varchar(255),
    note varchar(255) NULL,
    PRIMARY KEY (id)
); 

CREATE TABLE invoices (
    id int NOT NULL AUTO_INCREMENT,
    event_id int NULL,
    payer_id int,
    receiver_id int,
    number int,
    status tinyint,
    type tinyint,
    issue_date timestamp,
    PRIMARY KEY (id),
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (payer_id) REFERENCES entities(id),
    FOREIGN KEY (receiver_id) REFERENCES entities(id)
);

CREATE TABLE traffic (
    id int NOT NULL AUTO_INCREMENT,
    invoice_id int NULL,
    order_id int NULL,
    name varchar(255),
    amount int,
    direction boolean,
    date DATE,
    PRIMARY KEY (id),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);

insert into event_types (name) values ('Vaje');
insert into event_types (name) values ('Intenzivne vaje');
insert into event_types (name) values ('Nastop');


insert into entities (name, address, postal, place, iban, note) values ('TamburaTeam', 'Ulica Milana Bajca 5', 5271, 'Vipava', 'SI56 1234 5678 9101 1121', 'Najbulši štjrje');