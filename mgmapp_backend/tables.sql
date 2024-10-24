DROP TABLE IF EXISTS `invoices`;
DROP TABLE IF EXISTS `services`;
DROP TABLE IF EXISTS `entities`;

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
    payer_id int,
    receiver_id int,
    number int,
    status int(2),
    type int(1),
    issue_date timestamp,
    PRIMARY KEY (id),
    FOREIGN KEY (payer_id) REFERENCES entities(id),
    FOREIGN KEY (receiver_id) REFERENCES entities(id)
);

CREATE TABLE services (
    id int NOT NULL AUTO_INCREMENT,
    invoice_id int,
    name varchar(255),
    amount int,
    PRIMARY KEY (id),
    FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);

-- insert into invoices (payer_id, receiver_id, number, status, issue_time) values (2, 1, 1, 1, '2024-10-03');