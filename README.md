# 1MoreRep

**1MoreRep** is your workout companion app, designed to help you plan, track, and optimize your workouts right from your phone. Whether you’re at the gym or at home, this app makes staying consistent easier.

---

## **Technologies**

- React Native
- Expo
- Node.js
- PostgreSQL
- TypeScript

## Features

- **Workout Planning**: Create and track workouts, including sets, reps, and weights.
 
- **Progress Tracking**: View logs of completed workouts.
- **Authentication**: Secure login system with session-based authentication.
- **Responsive Design**: Optimized for use on Android and iOS devices.
---

## **Getting Started**

### Clone the Repository
Clone the main branch of this repository to your local machine and navigate into the cloned project folder.
### Install dependencies using pnpm

Open a CLI in the project folder and run:

```bash
pnpm install
```

### Start database

Setup the database as mentioned below. To start the database run:

```bash
postgres
```

### Populate database

The database is populated with migrations (using the ley library, which is a dependency of this project). Run the following command to populate the database:

```bash
pnpm migrate up
```
### Run local development server

You can start the development server for the project by running the following command:

```bash
pnpm start
```

This will open the Expo Developer Tools in your browser. From there, you can:

- Scan the QR code using the Expo Go app on your phone to run the app on your physical device.
- Run the app on an Android or iOS emulator/simulator (if set up on your machine).


## Database Setup

If you don't have PostgreSQL installed yet, follow the instructions from the PostgreSQL step in [UpLeveled's System Setup Instructions](https://github.com/upleveled/system-setup/blob/master/readme.md).

Copy the `.env.example` file to a new file called `.env` (ignored from Git) and fill in the necessary information.

Then, connect to the built-in `postgres` database as administrator in order to create the database:

### Windows

If it asks for a password, use `postgres`.

```bash
psql -U postgres
```

### macOS

```bash
psql postgres
```

### Linux

```bash
sudo -u postgres psql
```


Once you have connected to PostgreSQL, run the following to create the database:

```sql
CREATE DATABASE workout_tracker;
CREATE USER workoutapp WITH ENCRYPTED PASSWORD 'workoutapp';
GRANT ALL PRIVILEGES ON DATABASE workout_tracker TO workoutapp;
\connect workout_tracker
```

If you need to create tables at this stage, you can use the following commands:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(80) NOT NULL,
  password_hash VARCHAR(80) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  UNIQUE (username)
);

CREATE TABLE exercises (
  id SERIAL PRIMARY KEY,
  workout_id INT REFERENCES workouts(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  set_number INT NOT NULL,
  reps INT NOT NULL,
  weight INT NOT NULL
);

CREATE TABLE workouts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  duration VARCHAR(50),
  user_id INT REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  token VARCHAR(150) NOT NULL UNIQUE,
  expiry_timestamp TIMESTAMP NOT NULL DEFAULT (now() + INTERVAL '24 hours'),
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE migrations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL
);
```















Quit `psql` using the following command:

```bash
\q
```

On Linux, it is [best practice to create an operating system user for each database](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/configuring_and_using_database_servers/using-postgresql_configuring-and-using-database-servers#con_postgresql-users_using-postgresql), to ensure that the operating system user can only access the single database and no other system resources. A different password is needed on Linux because [passwords of operating system users cannot contain the user name](https://github.com/upleveled/system-setup/issues/74). First, generate a random password and copy it:

```bash
openssl rand -hex 16
```

Then create the user, using the database user name from the previous section above. When you are prompted to create a password for the user, paste in the generated password.

```bash
sudo adduser <user name>
```

Once you're ready to use the new user, reconnect using the following command.

**Windows and macOS:**

```bash
psql -U <user name> <database name>
```

**Linux:**

```bash
sudo -u <user name> psql -U <user name> <database name>
```
