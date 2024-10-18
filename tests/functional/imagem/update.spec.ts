import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

test.group('Imagem update', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('atualizar uma imagem de usuário com sucesso')

  test('atualizar uma imagem de pet com sucesso')

  test('falhar ao atualizar por uma imagem de pet sem informar o index')

  test('falhar ao atualizar uma imagem com index maior do que 2')

  test('falhar caso uma imagem de pet não for encontrada')

  test('falhar caso uma imagem de pet com index maior do que a quantidade armazenada')

  test('exigir autenticação e autorizção para atualizar imagem de um usuário')

  test('exigir autenticação e autorizção para que somente o dono de um pet possa atualizar imagem')

  test('exigir imagem no corpo da requisição')

  test('permitir imagem no formato jpg')

  test('permitir imagem no formato jpeg')

  test('permitir imagem no formato png')

  test('proibir imagem fora dos formatos jpg, jpeg e png')

  test('proibir imagem com tamanho maior do que 2 MB')
})
