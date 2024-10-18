import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

test.group('Imagem store', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('armazenar uma imagem de usuário com sucesso')

  test('armazenar uma imagem de pet com sucesso')

  test('exigir autenticação e autorizção para armazenar imagem de um usuário')

  test('exigir autenticação e autorizção para que somente o dono de um pet possa armazenar imagem')

  test('exigir imagem no corpo da requisição')

  test('permitir imagem no formato jpg')

  test('permitir imagem no formato jpeg')

  test('permitir imagem no formato png')

  test('proibir imagem fora dos formatos jpg, jpeg e png')

  test('proibir imagem com tamanho maior do que 2 MB')

  test('proibir que um usuário tenha mais do que uma imagem')

  test('proibir que um pet tenha mais do que 3 imagens')
})
