import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Pet from 'App/Models/Pet'
import Usuario from 'App/Models/Usuario'
import PetFactory from 'Database/factories/PetFactory'
import UsuarioFactory from 'Database/factories/UsuarioFactory'

test.group('Usuario destroy', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('remover um usuário com sucesso', async ({ client, assert }) => {
    const usuario = await UsuarioFactory.create()
    const response = await client.delete('/usuarios').loginAs(usuario)
    response.assertStatus(200)

    assert.isNull(await Usuario.find(usuario.id))
  })

  test('remover os dados de pets ao remover um usuário', async ({ client, assert }) => {
    const usuario = await UsuarioFactory.create()
    await PetFactory.merge({ usuarioId: usuario.id }).create()

    const response = await client.delete('/usuarios').loginAs(usuario)
    response.assertStatus(200)
    assert.isNull(await Pet.findBy('usuarioId', usuario.id))
  })
})
