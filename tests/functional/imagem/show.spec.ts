import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

test.group('Imagem show', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('recuperar uma imagem de usuário com sucesso')

  test('recuperar uma imagem de pet com sucesso')

  test('recuperar três imagens de um pet com sucesso')

  test('falhar ao pesquisar por uma imagem de pet sem informar o index')

  test('falhar ao pesquisar uma imagem com index maior do que 2')

  test('falhar caso uma imagem de usuário não for encontrada')

  test('falhar caso uma imagem de pet não for encontrada')

  test('falhar caso uma imagem de pet com index maior do que a quantidade armazenada')
})
