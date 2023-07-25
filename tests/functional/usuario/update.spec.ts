import { test } from '@japa/runner'
import Usuario from 'App/Models/Usuario'
import UsuarioFactory from 'Database/factories/UsuarioFactory'

test.group('Usuario update', () => {
  test('atualizar todos os parâmetros de um usuário', async ({ client, assert }) => {
    const antigo = await UsuarioFactory.create()
    const novo = await UsuarioFactory.make()
    const response = await client.patch(`/usuarios/${antigo.id}`).json(novo)
    response.assertStatus(200)

    assert.equal(response.body()['nome'], novo.nome)
    assert.equal(response.body()['email'], novo.email)
    assert.equal(response.body()['telefone'], novo.telefone)

    const persistido = await Usuario.findOrFail(antigo.id)
    assert.equal(persistido.nome, novo.nome)
    assert.equal(persistido.email, novo.email)
    assert.equal(persistido.telefone, novo.telefone)
  })

  test('atualizar cada parâmetros de um usuário individualmente', async ({ client, assert }) => {
    let antigo = await UsuarioFactory.create()
    const id = antigo.id

    const novo = (await UsuarioFactory.make()).toJSON()

    let response = await client.patch(`/usuarios/${id}`).json({ nome: novo.nome })
    let persistido = await Usuario.findOrFail(id)
    response.assertStatus(200)
    assert.equal(response.body()['nome'], novo.nome)
    assert.equal(persistido.nome, novo.nome)
    assert.equal(persistido.telefone, antigo.telefone)
    assert.equal(persistido.email, antigo.email)

    response = await client.patch(`/usuarios/${id}`).json({ telefone: novo.telefone })
    persistido = await Usuario.findOrFail(id)
    response.assertStatus(200)
    assert.equal(response.body()['telefone'], novo.telefone)
    assert.equal(persistido.nome, novo.nome)
    assert.equal(persistido.telefone, novo.telefone)
    assert.equal(persistido.email, antigo.email)

    response = await client.patch(`/usuarios/${id}`).json({ email: novo.email })
    persistido = await Usuario.findOrFail(id)
    response.assertStatus(200)
    assert.equal(response.body()['email'], novo.email)
    assert.equal(persistido.nome, novo.nome)
    assert.equal(persistido.telefone, novo.telefone)
    assert.equal(persistido.email, novo.email)
  })

  test('validar email do usuário', async ({ client }) => {
    const antigo = await UsuarioFactory.create()
    const novo = await UsuarioFactory.merge({ id: undefined, email: 'foo' }).make()
    const response = await client.patch(`/usuarios/${antigo.id}`).json(novo)
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [{ rule: 'email', field: 'email', message: 'email validation failed' }],
    })
  })

  test('validar telefone do usuário', async ({ client }) => {
    const antigo = await UsuarioFactory.create()
    const novo = await UsuarioFactory.merge({ id: undefined, telefone: 'foo' }).make()
    const response = await client.patch(`/usuarios/${antigo.id}`).json(novo)
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [{ rule: 'regex', field: 'telefone', message: 'regex validation failed' }],
    })
  })

  test('proibir nome do usuário maior do que 25 caracteres', async ({ client }) => {
    const antigo = await UsuarioFactory.create()
    const novo = await UsuarioFactory.merge({
      id: undefined,
      nome: 'Cillum veniam nulla sit proident voluptate do eu.',
    }).make()
    const response = await client.patch(`/usuarios/${antigo.id}`).json(novo)
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          rule: 'maxLength',
          field: 'nome',
          message: 'maxLength validation failed',
          args: { maxLength: 25 },
        },
      ],
    })
  })

  test('falhar caso um usuário não for encontrado', async ({ client }) => {
    const usuario = await UsuarioFactory.make()
    const response = await client.patch('/usuarios/-1').json(usuario)
    response.assertStatus(404)
  })
})
