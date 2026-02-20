import { config } from 'dotenv'
config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN
const projectRef = SUPABASE_URL?.replace('https://', '').replace('.supabase.co', '')

async function verify() {
  const response = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          SELECT table_name
          FROM information_schema.tables
          WHERE table_schema = 'public'
          ORDER BY table_name;
        `
      }),
    }
  )

  const result = await response.json()
  console.log('📊 Tabelas no banco:')
  result.forEach(row => console.log(`   ✅ ${row.table_name}`))
}

verify()
