const postgres = require("postgres");

async function initDb() {
  const adminSql = postgres("postgresql://postgres:postgres@localhost:5432/postgres");

  try {
    console.log("Checking if database 'aurumend' exists...");
    const dbs = await adminSql`SELECT datname FROM pg_database WHERE datname = 'aurumend'`;
    if (dbs.length === 0) {
      console.log("Creating database 'aurumend'...");
      await adminSql`CREATE DATABASE aurumend`;
      console.log("✓ Database 'aurumend' created successfully!");
    } else {
      console.log("✓ Database 'aurumend' already exists.");
    }
  } catch (err) {
    console.log("Postgres admin connection result:", err.message);
  } finally {
    await adminSql.end();
  }
}

initDb();
