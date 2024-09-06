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
        description TEXT NOT NULL,
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

-- followers
CREATE TABLE followings(
    user_id UUID NOT NULL,
    designer_id UUID NOT NULL
);

ALTER TABLE followings ADD CONSTRAINT followings_user_id_fk FOREIGN KEY (user_id) REFERENCES users;
ALTER TABLE followings ADD CONSTRAINT followings_designer_id_fk FOREIGN KEY (designer_id) REFERENCES designers;

-- messages
CREATE TABLE messages(
    id UUID DEFAULT uuid_generate_v4 () NOT NULL,
    type VARCHAR(10) NOT NULL,
    message TEXT,
    file_url TEXT,
    from_user UUID NOT NULL,
    to_user UUID NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE messages ADD CONSTRAINT messages_pk PRIMARY KEY (id);
ALTER TABLE messages ADD CONSTRAINT from_user_id_fk FOREIGN KEY (from_user) REFERENCES users;
ALTER TABLE messages ADD CONSTRAINT to_user_id_fk FOREIGN KEY (to_user) REFERENCES users;


CREATE TABLE users_sockets (
    user_id UUID NOT NULL,
    socket_id VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);


-- vacancies
CREATE TABLE vacancies(
    id UUID DEFAULT uuid_generate_v4 () NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    application_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE vacancies ADD CONSTRAINT vacancies_pk PRIMARY KEY (id);
ALTER TABLE vacancies ADD CONSTRAINT created_by_vacancies_fk FOREIGN KEY (created_by) REFERENCES users;

CREATE TABLE vacancy_categories(
    designer_category_id UUID NOT NULL,
    vacancy_id UUID NOT NULL
);

ALTER TABLE vacancy_categories ADD CONSTRAINT vacancy_categories_designer_category_id_fk FOREIGN KEY (designer_category_id) REFERENCES designer_categories;
ALTER TABLE vacancy_categories ADD CONSTRAINT vacancy_categories_vacancy_id_fk FOREIGN KEY (vacancy_id) REFERENCES vacancies;

CREATE TABLE vacancy_locations(
    location_id UUID NOT NULL,
    vacancy_id UUID NOT NULL
);

ALTER TABLE vacancy_locations ADD CONSTRAINT vacancy_locations_location_id_fk FOREIGN KEY (location_id) REFERENCES locations;
ALTER TABLE vacancy_locations ADD CONSTRAINT vacancy_locations_vacancy_id_fk FOREIGN KEY (vacancy_id) REFERENCES vacancies;

-- applications
CREATE TABLE applications(
    id UUID DEFAULT uuid_generate_v4 () NOT NULL,
    applicant_id UUID NOT NULL,
    vacancy_id UUID NOT NULL,
    resume_url TEXT NOT NULL,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE applications ADD CONSTRAINT applications_pk PRIMARY KEY (id);
ALTER TABLE applications ADD CONSTRAINT applicant_id_applications_fk FOREIGN KEY (applicant_id) REFERENCES users;
ALTER TABLE applications ADD CONSTRAINT vacancy_id_applications_fk FOREIGN KEY (vacancy_id) REFERENCES vacancies;


-- Add created at columns
ALTER TABLE followings ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL;
ALTER TABLE post_upvotes ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL;
ALTER TABLE posts ADD COLUMN is_active BOOLEAN DEFAULT TRUE