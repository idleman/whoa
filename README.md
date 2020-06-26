Whoa - Version control for RDBMS(s) for nodejs projects
=======================================================
Whoa is a simple migration tool for relational database management systems (SQL databases).
It keeps tracks of all available database changes and let the user easy configure how
they should be executed. Whoa will also make sure no migration is never run twice and once it
has been run, will you not be able to change its source code without whoa will notify you about it.

How it works
------------
The user needs to put all migrations in one folder. For simplicity, let us name this folder
"migrations". Each migration in that folder should when be named as "{year}-{month}-{day}-{version}". The length must be exact 13 characters and only numbers is accepted. Example: `2020-06-26-01`.

## config.json
The entry point of each migration is `config.json`. Within that file can you specify
any amount of sql files that should be run and then. Example:

config.json:

```
{  
  "main": [
    ["users.sql", { "title": "Setup user schema(s)" } ]
  ],
  "env": {
    "test": [
      ["users.test.sql", { "title": "Add test users"} ]
    ]
  }
}
```

As the **env** column suggests, those files will only be run if the corresponding process.env.NODE_ENV is correct.
For example, in the example above must process.env.NODE_ENV equal to "test" for "test.sql" to be able to be run.

Assume now you create both users.sql, test.sql and config.json, then you should have the follow file structure:

```
migrations/2020-06-26-01/
                        user.sql
                        test.sql
                        config.sql
```
And once you have installed whoa, can you run it through the following CLI command:
```
$ whoa migrations --host=localhost --user={user} --database={database} --password={password} migrations
```
All command line arguments will default to the corresponding environment variable (in uppercase), so in case you
want to read the password from the environment instead of the command line argument, can you just skip the "--password"
and just define the environment variable: "PASSWORD".

For a full sample, see `example` folder.

CLI Options
-------

  - **host**. The address to the database manager. Defaults to environment variable "HOST".
  - **database**. The database to use. Defaults to environment variable "DATEBASE".
  - **password**. The password to use. Defaults to environment variable "PASSWORD".
  - **driver**. Database drivere. Only "mysql" is supported yet. Default: "mysql".
  
Config.json options
-------------------

- **main**. A list of files that should be executed, no matter the environment. See "How it works" for the format.
- **before**. Same as "main", but will be scheduled before it.
- **before**. Same as "main". Will be scheduled after "main", but before any "env".
- **env**. Environment specific. Only if the specific environment variable: "NODE_ENV" match the child key, will its files be run.

Best practices
--------------
Take advantage of the environment configuration to optimize each build. For example. To ease testing, one might add a "test" environment to generate some test data.
config.json
```
{
  "env": {
    "test": [
      ["users.test.sql", { "title": "Add test users"} ]
    ]
  }
}
```
You can then, in your continous integration process setup a new database and execute all migrations and do a full system wide testing before you deploy your code.



Limitations
-----------
- **MySQL**. Whoa only supports MySQL right now.
- **Rollback**. There is no way to undo/rollback a migration. If you want to undo a migration, do you need to create a new migration and write the "undo" code yourself.


Why
---
I wanted a simple database migration tool that fits into the nodejs ecosystem. Even if enterprise
solutions such as [flyway](https://flywaydb.org/) will probably be better for larger projects, will
a simple solution such as "whoa" get you very far.
