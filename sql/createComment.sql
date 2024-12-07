use campusvibe;

drop table if exists commentvotes;
drop table if exists comments;
drop table if exists answers;

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