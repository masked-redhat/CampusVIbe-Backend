use campusvibe;

drop table if exists user_profile;
drop table if exists business_profile;
drop table if exists users;

create table users(
	id int auto_increment primary key,
    username varchar(50) unique not null,
    authentication_method enum('gmail', 'email-password') default 'email-password' not null,
    password text,
    blacklist boolean not null default false,
    business boolean not null default false
);

create table user_profile (
	id int auto_increment primary key,
    user_id int not null,
    first_name text not null,
    last_name text,
    pfp varchar(100) default "usericon.png",
    foreign key (user_id) references users(id)
);

create table business_profile (
	id int auto_increment primary key,
    user_id int not null,
    username varchar(50) not null,
    business_name varchar(60) not null ,
    business_type text,
    about text,
    mission_statement text,
    location varchar(250) not null default "Earth, Solar System",
    contact_email text,
    contact_phone text,
    pfp varchar(100) default "usericon.png",
    foreign key (user_id) references users(id)
);