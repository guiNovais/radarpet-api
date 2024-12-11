import Mail from '@ioc:Adonis/Addons/Mail'
import { FakeMailManagerContract } from '@ioc:Adonis/Addons/Mail'
import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Token from 'App/Models/Token'
import UsuarioFactory from 'Database/factories/UsuarioFactory'

test.group('Usuario password reset', (group) => {
  let mailer: FakeMailManagerContract

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    mailer = Mail.fake()
  })

  group.each.teardown(async () => {
    await Database.rollbackGlobalTransaction()
    Mail.restore()
  })

  test('enviar email de redefinição de senha com sucesso', async ({ client, assert }) => {
    const usuario = await UsuarioFactory.create()

    const response = await client.post(`/password/reset/${usuario.id}`)
    response.assertStatus(200)

    const token = await Token.findByOrFail('usuarioId', usuario.id)
    assert.isTrue(
      mailer.exists((mail) => {
        return (
          mail.subject === 'Ative sua conta RadarPet' &&
          mail.text === `Seu código de ativação do RadarPet é: ${token.valor}`
        )
      })
    )
  })

  test('falhar caso um usuario não esteja armazenado', async ({ client }) => {
    const response = await client.post(`/password/reset/1`)
    response.assertStatus(404)
  })
})
