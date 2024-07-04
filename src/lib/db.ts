import pkg from 'pg';
const {Pool} = pkg;

const pool = new Pool({
  user: 'quant',
  host: 'localhost',
  database: 'quantdb', 
  password: 'quant14',
  port: 5432,
});

export async function query(text: string, params?: any[]) {
  const res = await pool.query(text, params);
  return res.rows;
}


