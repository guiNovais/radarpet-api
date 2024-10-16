import { test } from '@japa/runner'
import UsuarioFactory from 'Database/factories/UsuarioFactory'

test.group('Usuario show', () => {
  test('recuperar todas as informações de um usuario', async ({ client, assert }) => {
    const usuario = await UsuarioFactory.create()
    const response = await client.get(`/usuarios/${usuario.id}`)

    response.assertStatus(200)
    assert.exists(response.body()['nome'])
    assert.exists(response.body()['email'])
    assert.exists(response.body()['telefone'])

    assert.equal(response.body()['nome'], usuario.nome)
    assert.equal(response.body()['email'], usuario.email)
    assert.equal(response.body()['telefone'], usuario.telefone)
  })

  test('falhar caso um usuário não for encontrado', async ({ client }) => {
    const response = await client.patch('/usuarios/-1')
    response.assertStatus(404)
  })
})
