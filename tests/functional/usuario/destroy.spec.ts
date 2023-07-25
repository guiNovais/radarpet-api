import { test } from '@japa/runner'
import Usuario from 'App/Models/Usuario'
import UsuarioFactory from 'Database/factories/UsuarioFactory'

test.group('Usuario destroy', () => {
  test('remover um usuário com sucesso', async ({ client, assert }) => {
    const usuario = await UsuarioFactory.create()
    const response = await client.delete(`/usuarios/${usuario.id}`)
    response.assertStatus(200)

    assert.isNull(await Usuario.find(usuario.id))
  })

  test('falhar caso um usuário não for encontrado', async ({ client }) => {
    const response = await client.delete('/pets/-1')
    response.assertStatus(404)
  })

  test('remover os dados de pets ao remover um usuário')
})
