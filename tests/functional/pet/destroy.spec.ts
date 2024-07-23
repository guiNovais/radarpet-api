import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Coordenada from 'App/Models/Coordenada'
import Pet from 'App/Models/Pet'
import PetFactory from 'Database/factories/PetFactory'
import UsuarioFactory from 'Database/factories/UsuarioFactory'

test.group('Pet destroy', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('remover um pet com sucesso', async ({ client, assert }) => {
    const usuario = await UsuarioFactory.create()
    const pet = await PetFactory.merge({ usuarioId: usuario.id }).create()
    const response = await client.delete(`pets/${pet.id}`).loginAs(usuario)
    response.assertStatus(200)

    assert.isNull(await Pet.find(pet.id))
  })

  test('falhar caso um pet não for encontrado', async ({ client }) => {
    const usuario = await UsuarioFactory.create()
    const response = await client.delete('pets/-1').loginAs(usuario)
    response.assertStatus(404)
  })

  test('remover os dados de coordenadas ao remover um pet', async ({ client, assert }) => {
    const usuario = await UsuarioFactory.create()
    const pet = await PetFactory.merge({ usuarioId: usuario.id }).create()
    const response = await client.delete(`pets/${pet.id}`).loginAs(usuario)
    response.assertStatus(200)

    assert.isNull(await Coordenada.findBy('petId', pet.id))
  })

  test('proibir um usuário de remover um pet de outro usuário', async ({ client }) => {
    const fulano = await UsuarioFactory.create()
    const cicrano = await UsuarioFactory.create()
    const pet = await PetFactory.merge({ usuarioId: fulano.id }).create()

    const response = await client.delete(`/pets/${pet.id}`).loginAs(cicrano)
    response.assertStatus(401)
  })
})
