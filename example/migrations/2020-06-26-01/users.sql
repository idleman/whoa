/**
*	Example table for users
*/
CREATE TABLE users (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `email` varchar(255) NOT NULL,              # The user primary email
    `secret` char(64) NOT NULL,                 # Used to generate user password.
    `password` char(64) NOT NULL,               # sha256 hash
    UNIQUE(`email`),
    PRIMARY KEY(`id`)
);