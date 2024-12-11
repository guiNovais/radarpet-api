import Hash from '@ioc:Adonis/Core/Hash'
import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { Status, Tipo } from 'App/Models/Token'
import TokenFactory from 'Database/factories/TokenFactory'
import UsuarioFactory from 'Database/factories/UsuarioFactory'
import { DateTime } from 'luxon'

test.group('Usuario password define', (group) => {
  group.each.setup(async () => {
    Hash.fake()
    await Database.beginGlobalTransaction()
  })

  group.each.teardown(async () => {
    Hash.restore()
    await Database.rollbackGlobalTransaction()
  })

  const password = '$Wn29Q%k'

  test('definir senha com sucesso', async ({ client, assert }) => {
    const token = await TokenFactory.merge({
      usuarioId: (await UsuarioFactory.create()).id,
      status: Status.Ativo,
      tipo: Tipo.Definir,
    }).create()

    const response = await client.post('/password/define').json({ token: token.valor, password })
    response.assertStatus(200)

    await token.load('usuario')
    assert.isTrue(await Hash.verify(await Hash.make(password), token.usuario.password))
  })

  test('falhar caso o token não seja de definição', async ({ client }) => {
    const usuario = await UsuarioFactory.create()
    const token = await TokenFactory.merge({
      usuarioId: usuario.id,
      status: Status.Ativo,
      tipo: Tipo.Verificar,
    }).create()

    const response = await client.post('/password/define').json({ token: token.valor, password })

    response.assertStatus(400)
  })

  test('falhar caso o token esteja expirado', async ({ client }) => {
    const usuario = await UsuarioFactory.create()
    const token = await TokenFactory.merge({
      createdAt: DateTime.now().minus({ hours: 1, minutes: 1 }),
      usuarioId: usuario.id,
      status: Status.Ativo,
      tipo: Tipo.Definir,
    }).create()

    const response = await client.post('/password/define').json({ token: token.valor, password })

    response.assertStatus(400)
  })

  test('falhar caso o token já tenha sido utilizado', async ({ client }) => {
    const usuario = await UsuarioFactory.create()
    const token = await TokenFactory.merge({
      usuarioId: usuario.id,
      status: Status.Ativo,
      tipo: Tipo.Definir,
    }).create()

    const response1 = await client
      .post('/password/define')
      .json({ token: token.valor, password: password })
    response1.assertStatus(200)

    const response2 = await client.post('/password/define').json({ token: token.valor, password })
    response2.assertStatus(400)
  })

  test('falhar caso a senha tenha menos do que 8 caracteres', async ({ client }) => {
    const usuario = await UsuarioFactory.create()
    const token = await TokenFactory.merge({
      usuarioId: usuario.id,
      status: Status.Ativo,
      tipo: Tipo.Definir,
    }).create()

    const response = await client
      .post('/password/define')
      .json({ token: token.valor, password: 'Ab1' })

    response.assertStatus(422)
  })

  test('falhar caso a senha tenha mais do que 16 caracteres', async ({ client }) => {
    const token = await TokenFactory.merge({
      usuarioId: (await UsuarioFactory.create()).id,
      status: Status.Ativo,
      tipo: Tipo.Definir,
    }).create()

    const response = await client.post('/password/define').json({
      token: token.valor,
      password: 'Ex labore et tempor deserunt consectetur consectetur 123.',
    })

    response.assertStatus(422)
  })

  test('falhar caso a senha não tenha ao menos uma letra maiúscula', async ({ client }) => {
    const token = await TokenFactory.merge({
      usuarioId: (await UsuarioFactory.create()).id,
      status: Status.Ativo,
      tipo: Tipo.Definir,
    }).create()

    const response = await client.post('/password/define').json({
      token: token.valor,
      password: password.toUpperCase(),
    })

    response.assertStatus(422)
  })

  test('falhar caso a senha não tenha ao menos uma letra minúscula', async ({ client }) => {
    const token = await TokenFactory.merge({
      usuarioId: (await UsuarioFactory.create()).id,
      status: Status.Ativo,
      tipo: Tipo.Definir,
    }).create()

    const response = await client.post('/password/define').json({
      token: token.valor,
      password: password.toLowerCase(),
    })

    response.assertStatus(422)
  })

  test('falhar caso a senha não tenha ao menos um algarismo numérico', async ({ client }) => {
    const token = await TokenFactory.merge({
      usuarioId: (await UsuarioFactory.create()).id,
      status: Status.Ativo,
      tipo: Tipo.Definir,
    }).create()

    const response = await client.post('/password/define').json({
      token: token.valor,
      password: 'Abcdefgh',
    })

    response.assertStatus(422)
  })
})
