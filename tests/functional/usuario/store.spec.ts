import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Usuario from 'App/Models/Usuario'
import UsuarioFactory from 'Database/factories/UsuarioFactory'

test.group('Usuario store', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('armazenar um usuário com sucesso', async ({ client, assert }) => {
    const usuario = (await UsuarioFactory.merge({ id: undefined }).make()).toJSON()
    usuario.password = '$Wn29Q%k'

    const response = await client.post('/usuarios').json(usuario)
    response.assertStatus(200)
    assert.equal(response.body().nome, usuario.nome)
    assert.equal(response.body().email, usuario.email)
    assert.equal(response.body().telefone, usuario.telefone)

    const usuarioPersistido = await Usuario.findOrFail(response.body()['id'])
    assert.equal(usuarioPersistido.nome, usuario.nome)
    assert.equal(usuarioPersistido.email, usuario.email)
    assert.equal(usuarioPersistido.telefone, usuario.telefone)
    assert.notEqual(usuarioPersistido.password, usuario.password)
  })

  test('exigir parâmetros obrigatórios ao armazenar um usuário', async ({ client }) => {
    const response = await client.post('/usuarios').json({})
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        { rule: 'required', field: 'nome', message: 'required validation failed' },
        { rule: 'required', field: 'email', message: 'required validation failed' },
        { rule: 'required', field: 'telefone', message: 'required validation failed' },
      ],
    })
  })

  test('validar email do usuário', async ({ client }) => {
    const usuario = await UsuarioFactory.merge({ email: 'foo' }).create()
    const response = await client.post('/usuarios').json(usuario)
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [{ rule: 'email', field: 'email', message: 'email validation failed' }],
    })
  })

  test('validar telefone do usuário', async ({ client }) => {
    const usuario = await UsuarioFactory.merge({ telefone: 'foo' }).create()
    const response = await client.post('/usuarios').json(usuario)
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [{ rule: 'regex', field: 'telefone', message: 'regex validation failed' }],
    })
  })

  test('proibir nome do usuário maior do que 25 caracteres', async ({ client }) => {
    const usuario = await UsuarioFactory.merge({
      id: undefined,
      nome: 'Consectetur sit fugiat mollit dolore irure est non elit ea aliquip aute consequat incididunt sit.',
    }).make()
    const response = await client.post('/usuarios').json(usuario)
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
})
