-- CREATE DATABASE designer_digest_db;
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE
    user_roles (
        id UUID DEFAULT uuid_generate_v4 () NOT NULL,
        key VARCHAR(10) NOT NULL,
        value VARCHAR(10) NOT NULL
    );

ALTER TABLE user_roles ADD CONSTRAINT user_roles_pk PRIMARY KEY (id);

INSERT INTO
    user_roles (key, value)
VALUES
    ('DESIGNER', 'Designer'),
    ('EMPLOYER', 'Employer'),
    ('PERSONAL', 'Personal');

-- is verifed is using to redirection in the front end.
-- is verified is update when user verfied their account with something
CREATE TABLE
    users (
        id UUID DEFAULT uuid_generate_v4 () NOT NULL,
        first_name VARCHAR(30) NOT NULL,
        last_name VARCHAR(30) NOT NULL,
        email VARCHAR(30) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        profile_picture TEXT,
        is_verified BOOLEAN DEFAULT FALSE,
        user_role UUID NOT NULL,
        phone TEXT,
        created_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
    );

ALTER TABLE users ADD CONSTRAINT users_pk PRIMARY KEY (id);

ALTER TABLE users ADD CONSTRAINT users_user_role_fk FOREIGN KEY (user_role) REFERENCES user_roles;

CREATE TABLE
    categories (
        id UUID DEFAULT uuid_generate_v4 () NOT NULL,
        name VARCHAR(50) NOT NULL
    );

ALTER TABLE categories ADD CONSTRAINT categories_pk PRIMARY KEY (id);

INSERT INTO
    categories (name)
VALUES
    ('Apparel'),
    ('Ready-to-wear'),
    ('Mass market'),
    ('Footwear'),
    ('Accessory'),
    ('Sportwear'),
    ('Evening wear'),
    ('Childrenswear'),
    ('Classic wear'),
    ('Eco friendly');

CREATE TABLE
    posts (
        id UUID DEFAULT uuid_generate_v4 () NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
            created_by UUID NOT NULL
    );

ALTER TABLE posts ADD CONSTRAINT posts_pk PRIMARY KEY (id);

ALTER TABLE posts ADD CONSTRAINT post_designers_id_fk FOREIGN KEY (created_by) REFERENCES designers;

CREATE TABLE
    post_categories (post_id UUID NOT NULL, category_id UUID NOT NULL);

ALTER TABLE post_categories ADD CONSTRAINT post_categories_post_id_fk FOREIGN KEY (post_id) REFERENCES posts;

ALTER TABLE post_categories ADD CONSTRAINT post_categories_category_id_fk FOREIGN KEY (category_id) REFERENCES categories;

CREATE TABLE
    post_media (
        post_id UUID NOT NULL,
        type VARCHAR(10) NOT NULL,
        media_url TEXT NOT NULL,
        is_thumbnail BOOLEAN NOT NULL
    );

ALTER TABLE post_media ADD CONSTRAINT post_media_post_id_fk FOREIGN KEY (post_id) REFERENCES posts;

CREATE TABLE
    post_upvotes (post_id UUID NOT NULL, voted_by UUID NOT NULL);

ALTER TABLE post_upvotes ADD CONSTRAINT post_upvotes_post_id_fk FOREIGN KEY (post_id) REFERENCES posts;

ALTER TABLE post_upvotes ADD CONSTRAINT post_upvotes_voted_by_fk FOREIGN KEY (voted_by) REFERENCES users;

-- designer categorie
CREATE TABLE
    designer_categories (
        id UUID DEFAULT uuid_generate_v4 () NOT NULL,
        name VARCHAR(50) NOT NULL
    );

ALTER TABLE designer_categories ADD CONSTRAINT designer_categories_pk PRIMARY KEY (id);

INSERT INTO
    designer_categories (name)
VALUES
    ('Apparel Designer'),
    ('Costume Designer'),
    ('Accessories Designer'),
    ('Footwear Designer'),
    ('Economy Fashion Designer');

-- locations
CREATE TABLE
    locations (
        id UUID DEFAULT uuid_generate_v4 () NOT NULL,
        name VARCHAR(20) NOT NULL
    );

ALTER TABLE locations ADD CONSTRAINT locations_pk PRIMARY KEY (id);

INSERT INTO
    locations (name)
VALUES
    ('Ampara'),
    ('Anuradhapura'),
    ('Badulla'),
    ('Batticaloa'),
    ('Colombo'),
    ('Galle'),
    ('Gampaha'),
    ('Hambantota'),
    ('Jaffna'),
    ('Kalutara'),
    ('Kandy'),
    ('Kegalle'),
    ('Kilinochchi'),
    ('Kurunegala'),
    ('Mannar'),
    ('Matale'),
    ('Matara'),
    ('Monaragala'),
    ('Mullaitivu'),
    ('NuwaraEliya'),
    ('Polonnaruwa'),
    ('Puttalam'),
    ('Ratnapura'),
    ('Trincomalee'),
    ('Vavuniya');

-- designers accounts
CREATE TABLE
    designers (
        id UUID DEFAULT uuid_generate_v4 () NOT NULL,
        user_id UUID NOT NULL UNIQUE,
        location_id UUID NOT NULL
    );

ALTER TABLE designers ADD CONSTRAINT designers_pk PRIMARY KEY (id);

ALTER TABLE designers ADD CONSTRAINT designer_user_id_fk FOREIGN KEY (user_id) REFERENCES users;

ALTER TABLE designers ADD CONSTRAINT designer_location_id_fk FOREIGN KEY (location_id) REFERENCES locations;

-- catrgories assigned to designers
CREATE TABLE
    designer_assigned_categories (
        category_id UUID NOT NULL,
        designer_id UUID NOT NULL
    );

ALTER TABLE designer_assigned_categories ADD CONSTRAINT designer_assigned_categories_category_id_fk FOREIGN KEY (category_id) REFERENCES designer_categories;

ALTER TABLE designer_assigned_categories ADD CONSTRAINT designer_assigned_categories_designer_id_fk FOREIGN KEY (designer_id) REFERENCES designers;