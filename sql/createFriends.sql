use campusvibe;

drop table if exists friends;
drop table if exists requests;

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