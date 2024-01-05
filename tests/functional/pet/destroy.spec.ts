import { test } from '@japa/runner'
import Coordenada from 'App/Models/Coordenada'
import Pet from 'App/Models/Pet'
import PetFactory from 'Database/factories/PetFactory'

test.group('Pet destroy', () => {
  test('remover um pet com sucesso', async ({ client, assert }) => {
    const pet = await PetFactory.create()
    const response = await client.delete(`pets/${pet.id}`)
    response.assertStatus(200)

    assert.isNull(await Pet.find(pet.id))
  })

  test('falhar caso um pet não for encontrado', async ({ client }) => {
    const response = await client.delete('pets/-1')
    response.assertStatus(404)
  })

  test('remover os dados de coordenadas ao remover um pet', async ({ client, assert }) => {
    const pet = await PetFactory.create()
    const response = await client.delete(`pets/${pet.id}`)
    response.assertStatus(200)

    assert.isNull(await Coordenada.findBy('petId', pet.id))
  })
})
