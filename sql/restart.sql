use campusvibe;

drop table if exists commentvotes;
drop table if exists comments;
drop table if exists answers;
drop table if exists friends;
drop table if exists requests;
drop table if exists likes;
drop table if exists posts;
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

create table posts(
	id int auto_increment primary key,
    user_id int not null,
    foreign key (user_id) references users(id),
    title text not null,
    content text,
    image varchar(60),
    timestamp datetime not null default now(),
    likes int not null default 0,
    comments int not null default 0,
    shares int not null default 0
);

create table likes(
	id int auto_increment primary key,
    user_id int not null,
    post_id int not null,
    timestamp datetime not null default now(),
    foreign key (user_id) references users(id),
    foreign key (post_id) references posts(id),
    unique key uniq_pair (user_id, post_id)
);

create table answers(
	id int auto_increment primary key
);

create table comments(
	id int auto_increment primary key,
    post_id int,
    answer_id int,
    user_id int not null,
    comment text not null,
    timestamp datetime not null default now(),
    reply_id int,
    votes int not null default 0,
    foreign key (post_id) references posts(id),
    foreign key (answer_id)  references answers(id),
    foreign key (reply_id) references comments(id),
    check((post_id is null and answer_id is not null) or (post_id is not null and answer_id is null)),
    check((post_id is not null) or (answer_id is not null))
);

create table commentvotes(
	id int auto_increment primary key,
    comment_id int not null,
    user_id int not null,
    timestamp datetime not null default now(),
    vote_value int not null default 0,
    check((vote_value = 0) or (vote_value = 1) or (vote_value = -1)),
    foreign key (comment_id) references comments(id),
    foreign key (user_id) references users(id),
    unique key uniq_pair (user_id, comment_id)
);

create table friends (
	id int auto_increment primary key,
    user_1 int not null,
    user_2 int not null,
    timestamp datetime not null default now(),
    foreign key (user_1) references users(id),
    foreign key (user_2) references users(id),
    check (user_1 != user_2),
    user_min int as (least(user_1, user_2)) stored,
    user_max int as (greatest(user_1, user_2)) stored,
    unique key uniq_friend_pair (user_min, user_max)
);

create table requests (
	id int auto_increment primary key,
    user_1 int not null,
    user_2 int not null,
    timestamp datetime not null default now(),
    foreign key (user_1) references users(id),
    foreign key (user_2) references users(id),
    check (user_1 != user_2),
    user_min int as (least(user_1, user_2)) stored,
    user_max int as (greatest(user_1, user_2)) stored,
    unique key uniq_friend_pair (user_min, user_max)
);

