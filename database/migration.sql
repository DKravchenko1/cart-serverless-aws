CREATE TYPE status_type AS ENUM ('OPEN', 'ORDERED');

CREATE TABLE IF NOT EXISTS users (
     id varchar(50) not null PRIMARY KEY,
     name varchar(50) not null,
     email varchar(50),
     password varchar(50) not null,
     created_at timestamp DEFAULT CURRENT_TIMESTAMP,
     updated_at timestamp not null DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id varchar(50) not null PRIMARY KEY,
    title varchar(50) not null,
    description varchar(100) not null,
    price integer not null
);

CREATE TABLE IF NOT EXISTS carts
(
    id varchar(50) not null PRIMARY KEY,
    user_id varchar(50) not null references users(id),
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp not null DEFAULT CURRENT_TIMESTAMP,
    status status_type not null default 'OPEN',
    isDeleted bool NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS cart_items
(
    id varchar(50) PRIMARY KEY,
    product_id varchar(50) not null references products(id),
    cart_id varchar(50) not null references carts(id),
    count integer not null default 0
);

CREATE TABLE IF NOT EXISTS orders (
    id varchar(50) PRIMARY KEY not null,
    user_id varchar(50) not null references users(id),
    cart_id varchar(50) not null references carts(id),
    payment json,
    delivery json,
    comment text,
    status status_type not null,
    total int not null
);

INSERT INTO carts VALUES ('9ef9f86e-6cd8-4c8f-a0e0-a8f7da93bf92', '1921755d-25b3-45e1-b730-a067b15b3bcd', now(), now(),'OPEN');
INSERT INTO cart_items VALUES ('2ac38d56-7353-4768-a4d8-7ba840fc3c47', '2ac38d56-6cd8-4c8f-a0e0-a8f7da93bf92', 22);
INSERT INTO products VALUES
    ('2', 'sql-entity-title-2', 'sql-entity-description-2', 2),
    ('3', 'sql-entity-title-3', 'sql-entity-description-3', 3)
;

INSERT INTO products VALUES ('4', 'sql-entity-title-4', 'sql-entity-description-4', 4);
