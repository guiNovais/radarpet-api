import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

test.group('Usuario password define', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('definir senha com sucesso')

  test('falhar caso o token não seja de definição')

  test('falhar caso o token esteja expirado')

  test('falhar caso o token já tenha sido utilizado')

  test('falhar caso a senha tenha menos do que 8 caracteres')

  test('falhar caso a senha tenha mais do que 16 caracteres')

  test('falhar caso a senha não tenha ao menos uma letra maiúscula')

  test('falhar caso a senha não tenha ao menos uma letra minúscula')

  test('falhar caso a senha não tenha ao menos um algarismo numérico')
})
