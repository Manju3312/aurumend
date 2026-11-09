const postgres = require('postgres');
const sql = postgres('postgresql://postgres:postgres@localhost:5432/aurumend');

async function main() {
  await sql.unsafe("UPDATE organizations SET role_mode = 'hybrid'");
  console.log("Successfully updated organization role_mode to hybrid");
  await sql.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
