-- CREATE DATABASE test_db;

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE user_roles (
    id         UUID                     DEFAULT uuid_generate_v4() NOT NULL,
    key VARCHAR(10) NOT NULL,
    value VARCHAR(10) NOT NULL
);

ALTER TABLE user_roles
    ADD CONSTRAINT user_roles_pk
        PRIMARY KEY (id);

INSERT INTO user_roles(key, value) VALUES ('DESIGNER', 'Designer'),('EMPLOYER', 'Employer'),('PERSONAL', 'Personal');

CREATE TABLE users (
    id         UUID                     DEFAULT uuid_generate_v4() NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    email  VARCHAR(30) NOT NULL UNIQUE,
    password  TEXT NOT NULL,
    user_role UUID NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP  NOT NULL
);

ALTER TABLE users
    ADD CONSTRAINT users_pk
        PRIMARY KEY (id);

ALTER TABLE users
    ADD CONSTRAINT users_user_role_fk
        FOREIGN KEY (user_role) REFERENCES user_roles;