import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import UsuarioFactory from 'Database/factories/UsuarioFactory'

test.group('Usuario login', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('usuário autenticado com sucesso', async ({ client, assert }) => {
    const usuario = await UsuarioFactory.merge({
      password: 'MH!84#rb',
    }).create()

    const response = await client.post('/login').json({
      email: usuario.email,
      password: 'MH!84#rb',
    })

    response.assertStatus(200)
    assert.property(response.body(), 'token')
  })

  test('falhar caso a senha esteja errada', async ({ client }) => {
    const usuario = await UsuarioFactory.merge({
      password: 'F88!t9$r',
    }).create()

    const response = await client.post('/login').json({
      email: usuario.email,
      password: '7vB#$F$7',
    })
    response.assertStatus(400)
  })
})
