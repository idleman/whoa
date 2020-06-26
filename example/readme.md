Whoa Example
============

Install
-------
```
$ cd your/path/to/this/directory
$ npm install

```

Build
-----
To build the database test users:
```
$ cross-env NODE_ENV=test npm run update-database -- --host={host} --user={user} --database={database} --password={password} migrations
```
