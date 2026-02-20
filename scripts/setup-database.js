#!/usr/bin/env node
/**
 * Script para criar as tabelas no Supabase
 * Execute com: node scripts/setup-database.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Carregar variáveis de ambiente
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas')
  console.error('   Certifique-se de que NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão definidas no .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupDatabase() {
  console.log('🚀 Iniciando setup do banco de dados...\n')

  // Ler o arquivo SQL
  const sqlPath = path.join(__dirname, '..', 'supabase', 'migrations', '001_initial_schema.sql')
  const sql = fs.readFileSync(sqlPath, 'utf8')

  // Dividir em comandos individuais (aproximado)
  const commands = sql
    .split(';')
    .map(cmd => cmd.trim())
    .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'))

  console.log(`📝 Executando ${commands.length} comandos SQL...\n`)

  let successCount = 0
  let errorCount = 0

  for (let i = 0; i < commands.length; i++) {
    const cmd = commands[i] + ';'

    // Pular comandos vazios ou comentários
    if (cmd.trim() === ';' || cmd.trim().startsWith('--')) {
      continue
    }

    try {
      // Usar RPC para executar SQL raw
      const { error } = await supabase.rpc('exec_sql', { sql: cmd })

      if (error) {
        // Se o RPC não existir, vamos tentar outra abordagem
        console.log(`⚠️  Comando ${i + 1}: ${error.message}`)
        errorCount++
      } else {
        successCount++
        process.stdout.write(`\r✅ ${successCount} comandos executados`)
      }
    } catch (err) {
      console.log(`\n⚠️  Comando ${i + 1}: ${err.message}`)
      errorCount++
    }
  }

  console.log(`\n\n📊 Resultado:`)
  console.log(`   ✅ Sucesso: ${successCount}`)
  console.log(`   ❌ Erros: ${errorCount}`)

  if (errorCount > 0) {
    console.log(`\n⚠️  Alguns comandos falharam. Você pode precisar executar o SQL manualmente.`)
    console.log(`   Arquivo: supabase/migrations/001_initial_schema.sql`)
    console.log(`   Ou use o SQL Editor no dashboard do Supabase.`)
  }
}

// Alternativa: usar fetch para chamar a API do Supabase
async function setupViaAPI() {
  console.log('🚀 Iniciando setup via API...\n')

  const sqlPath = path.join(__dirname, '..', 'supabase', 'migrations', '001_initial_schema.sql')
  const sql = fs.readFileSync(sqlPath, 'utf8')

  // A API do Supabase não permite execução direta de SQL arbitrário
  // Vamos informar ao usuário como proceder

  console.log('═'.repeat(60))
  console.log('⚠️  IMPORTANTE: O Supabase não permite execução de SQL')
  console.log('   arbitrário via API REST por segurança.')
  console.log('═'.repeat(60))
  console.log('\n📋 Para criar as tabelas, siga um destes métodos:\n')

  console.log('MÉTODO 1 - SQL Editor (Recomendado):')
  console.log('  1. Acesse: https://supabase.com/dashboard')
  console.log('  2. Selecione seu projeto')
  console.log('  3. Menu lateral → SQL Editor')
  console.log('  4. Clique em "New query"')
  console.log('  5. Cole o conteúdo do arquivo:')
  console.log('     supabase/migrations/001_initial_schema.sql')
  console.log('  6. Clique em "Run" (ou pressione Ctrl+Enter)\n')

  console.log('MÉTODO 2 - Supabase CLI:')
  console.log('  npx supabase db push\n')

  console.log('═'.repeat(60))
  console.log('📁 Arquivo SQL pronto em:')
  console.log(`   ${sqlPath}`)
  console.log('═'.repeat(60))
}

// Executar
setupViaAPI()
