DROP TABLE IF EXISTS `trips`;
DROP TABLE IF EXISTS `locations`;
DROP TABLE IF EXISTS `mileage_rates`;
DROP TABLE IF EXISTS `traffic`;
DROP TABLE IF EXISTS `stuff_sold`;
DROP TABLE IF EXISTS `ordered_stuff`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `stuff_sold`;
DROP TABLE IF EXISTS `stuff_types`;
DROP TABLE IF EXISTS `stuff`;
DROP TABLE IF EXISTS `black_traffic`;
DROP TABLE IF EXISTS `debts`;
DROP TABLE IF EXISTS `sales`;
DROP TABLE IF EXISTS `occasions`;
DROP TABLE IF EXISTS `invoices`;
DROP TABLE IF EXISTS `events`;
DROP TABLE IF EXISTS `event_types`;
DROP TABLE IF EXISTS `entities`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE users (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NULL,
    username varchar(255) UNIQUE,
    password varchar(255),
    refresh_token varchar(255) NULL,
    email varchar(255) NULL,
    role varchar(255) NULL,
    PRIMARY KEY (id)
);

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

CREATE TABLE sales (
    id int NOT NULL AUTO_INCREMENT,
    event_id int NULL UNIQUE,
    date date,
    PRIMARY KEY (id),
    FOREIGN KEY (event_id) REFERENCES events(id)
);

CREATE TABLE debts (
    id int NOT NULL AUTO_INCREMENT,
    user_id int NULL,
    amount int,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE black_traffic (
    id int NOT NULL AUTO_INCREMENT,
    debt_id int NULL,
    sale_id int NULL,
    name varchar(255),
    amount int,
    direction boolean,
    date DATE,
    PRIMARY KEY (id),
    FOREIGN KEY (sale_id) REFERENCES sales(id),
    FOREIGN KEY (debt_id) REFERENCES debts(id)
);

CREATE TABLE stuff (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255),
    image_path varchar(255) NULL,
    PRIMARY KEY (id)
);

CREATE TABLE stuff_types (
    id int NOT NULL AUTO_INCREMENT,
    stuff_id int,
    type varchar(255),
    price int,
    PRIMARY KEY (id),
    FOREIGN KEY (stuff_id) REFERENCES stuff(id)
);

CREATE TABLE stuff_sold (
    id int NOT NULL AUTO_INCREMENT,
    sale_id int NULL,
    stufftype_id int,
    quantity int,
    price_actual int,
    PRIMARY KEY (id),
    FOREIGN KEY (sale_id) REFERENCES sales(id),
    FOREIGN KEY (stufftype_id) REFERENCES stuff_types(id)
);

CREATE TABLE orders (
    id int NOT NULL AUTO_INCREMENT,
    date date,
    pdf_path varchar(255) NULL,
    PRIMARY KEY (id)
);

CREATE TABLE ordered_stuff (
    id int NOT NULL AUTO_INCREMENT,
    order_id int,
    stufftype_id int,
    amount int,
    PRIMARY KEY (id),
    FOREIGN KEY (stufftype_id) REFERENCES stuff_types(id),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

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
    event_id int NULL UNIQUE,
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

CREATE TABLE locations (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    distance int NULL,
    PRIMARY KEY (id)
);

CREATE TABLE mileage_rates (
    id int NOT NULL AUTO_INCREMENT,
    year int NOT NULL,
    rate int NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE trips (
    id int NOT NULL AUTO_INCREMENT,
    user_id int NULL,
    event_id int NULL,
    rate_id int NULL,
    origin_id int NULL,
    destination_id int NULL,
    mileage int NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (rate_id) REFERENCES mileage_rates(id),
    FOREIGN KEY (origin_id) REFERENCES locations(id),
    FOREIGN KEY (destination_id) REFERENCES locations(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

insert into event_types (name) values ('Vaje');
insert into event_types (name) values ('Intenzivne vaje');
insert into event_types (name) values ('Nastop');

insert into locations (name) values ('Vipava');
insert into mileage_rates (year, rate) values (2024, 20);

insert into entities (name, address, postal, place, iban, note) values ('TamburaTeam', 'Ulica Milana Bajca 5', 5271, 'Vipava', 'SI56 1234 5678 9101 1121', 'Najbulši štjrje');