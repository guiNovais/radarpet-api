import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

test.group('Usuario password reset', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('enviar email de redefinição de senha com sucesso')

  test('falhar caso um email não esteja armazenado')
})
