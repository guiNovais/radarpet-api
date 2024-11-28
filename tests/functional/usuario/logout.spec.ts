import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import PetFactory from 'Database/factories/PetFactory'
import UsuarioFactory from 'Database/factories/UsuarioFactory'

test.group('Usuario logout', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  const password = 'FB`Y!Mb!'

  test('deslogar usuário com sucesso', async ({ client }) => {
    const { id, email } = await UsuarioFactory.merge({ password }).create()
    const token = (await client.post('/login').json({ email, password })).body().token
    await client.post('/logout').header('Authorization', `bearer ${token}`)

    const protectedApiResponse = await client
      .post('/pets')
      .json({
        ...(await PetFactory.make()).toJSON(),
        usuarioId: id,
        cores: ['Preto'],
        vistoEm: { latitude: 0, longitude: 0 },
      })
      .header('Authorization', `bearer ${token}`)

    protectedApiResponse.assertStatus(401)
  })
})
