use campusvibe;

drop table if exists likes;
drop table if exists posts;

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