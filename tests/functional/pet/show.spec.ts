import { test } from '@japa/runner'
import CoordenadaFactory from 'Database/factories/CoordenadaFactory'
import PetFactory from 'Database/factories/PetFactory'

test.group('Pet show', () => {
  test('recuperar todas as informações de um pet', async ({ client, assert }) => {
    const pet = await PetFactory.create()
    const coordenadas = await CoordenadaFactory.merge({ petId: pet.id }).create()
    const response = await client.get(`/pets/${pet.id}`)

    response.assertStatus(200)

    assert.exists(response.body()['nome'])
    assert.exists(response.body()['especie'])
    assert.exists(response.body()['cor'])
    assert.exists(response.body()['situacao'])
    assert.exists(response.body()['vistoAs'])
    assert.exists(response.body()['vistoEm'])

    assert.equal(response.body()['id'], pet.id)
    assert.equal(response.body()['nome'], pet.nome)
    assert.equal(response.body()['especie'], pet.especie)
    assert.equal(response.body()['cor'], pet.cor)
    assert.equal(response.body()['situacao'], pet.situacao)
    assert.equal(response.body()['comentario'], pet.comentario)
    assert.equal(response.body()['vistoAs'], pet.vistoAs.toISO())
    assert.equal(response.body()['vistoEm']['latitude'], coordenadas.latitude)
    assert.equal(response.body()['vistoEm']['longitude'], coordenadas.longitude)
  })

  // TODO teste falhar caso um pet não for encontrado
})
