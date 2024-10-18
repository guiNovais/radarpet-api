import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

test.group('Imagem destroy', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('remover uma imagem de usuário com sucesso')

  test('remover uma imagem de pet com sucesso')

  test('falhar ao remover por uma imagem de pet sem informar o index')

  test('falhar ao remover uma imagem com index maior do que 2')

  test('falhar caso uma imagem de pet não for encontrada')

  test('falhar caso uma imagem de pet com index maior do que a quantidade armazenada')

  test('exigir autenticação e autorizção para remover imagem de um usuário')

  test('exigir autenticação e autorizção para que somente o dono de um pet possa remover imagem')
})
