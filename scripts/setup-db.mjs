import { config } from 'dotenv'
config({ path: '.env.local' })

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN

// Extrair project ref
const projectRef = SUPABASE_URL?.replace('https://', '').replace('.supabase.co', '')

console.log('🚀 Criando tabelas via Supabase Management API...')
console.log(`   Projeto: ${projectRef}\n`)

// Ler SQL
const sqlPath = path.join(__dirname, '..', 'supabase', 'migrations', '001_initial_schema.sql')
const sqlContent = fs.readFileSync(sqlPath, 'utf8')

async function setupDatabase() {
  try {
    const response = await fetch(
      `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: sqlContent }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`API Error: ${response.status} - ${error}`)
    }

    const result = await response.json()

    console.log('✅ Todas as tabelas foram criadas com sucesso!\n')
    console.log('📊 Tabelas criadas:')
    console.log('   - users')
    console.log('   - posts')
    console.log('   - categories')
    console.log('   - tags')
    console.log('   - post_tags')
    console.log('   - media')
    console.log('   - folders')
    console.log('   - api_keys')
    console.log('   - webhooks')
    console.log('   - ai_generations')
    console.log('\n🔒 RLS habilitado')
    console.log('🌱 Dados iniciais inseridos')
    console.log('\n✨ Setup completo!')

  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

setupDatabase()
