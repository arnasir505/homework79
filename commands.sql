create schema `stock-taking` collate utf8mb4_general_ci;
use `stock-taking`;
create table categories
(
    id          int auto_increment,
    name        VARCHAR(50) not null,
    description TEXT        null,
    constraint categories_pk
        primary key (id)
)
    auto_increment = 101;
create table places
(
    id          int auto_increment,
    name        VARCHAR(50) not null,
    description TEXT        null,
    constraint places_pk
        primary key (id)
)
    auto_increment = 201;
create table items
(
    id          int auto_increment,
    category_id int          not null,
    place_id    int          not null,
    name        VARCHAR(50)  not null,
    description TEXT         null,
    image       VARCHAR(100) null,
    constraint items_pk
        primary key (id),
    constraint items_categories_id_fk
        foreign key (category_id) references categories (id),
    constraint items_places_id_fk
        foreign key (place_id) references places (id)
)
    auto_increment = 301;
INSERT INTO `stock-taking`.categories (name, description) VALUES ('Мебель', 'Предметы связанные с мебелью');
INSERT INTO `stock-taking`.categories (name, description) VALUES ('Бытовая техника', 'Предметы связанные с бытовой техникой');
INSERT INTO `stock-taking`.categories (name, description) VALUES ('Электроника', 'Предметы связанные с электроникой');
INSERT INTO `stock-taking`.categories (name, description) VALUES ('Декор', null);
INSERT INTO `stock-taking`.places (name, description) VALUES ('Кухня', 'Место для готовки и трапезы');
INSERT INTO `stock-taking`.places (name, description) VALUES ('Зал для переговоров', 'Комната для серъезных обсуждений');
INSERT INTO `stock-taking`.places (name, description) VALUES ('Зона отдыха', 'Место для расслабления');
INSERT INTO `stock-taking`.places (name, description) VALUES ('Рабочая зона', null);
INSERT INTO `stock-taking`.items (category_id, place_id, name, description, image) VALUES (101, 203, 'Пуфик', 'Мягкое кресло-пуфик', null);