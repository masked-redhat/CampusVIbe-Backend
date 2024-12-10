use campusvibe;

drop table if exists news;

create table news(
	id int auto_increment primary key,
    user_id int,
    title text not null,
    content varchar(150) not null,
    image varchar(60),
    timestamp datetime not null default now(),
    verified boolean not null default false,
    foreign key (user_id) references users(id)
);