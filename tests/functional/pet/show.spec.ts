import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Cor from 'App/Models/Cor'
import CoordenadaFactory from 'Database/factories/CoordenadaFactory'
import PetFactory from 'Database/factories/PetFactory'
import { sampleSize } from 'lodash'
import { DateTime } from 'luxon'

test.group('Pet show', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('recuperar todas as informações de um pet', async ({ client, assert }) => {
    const pet = await PetFactory.create()
    const coordenadas = await CoordenadaFactory.merge({ petId: pet.id }).create()
    const cores = sampleSize(await Cor.all(), 2)
    await pet.related('cores').attach(cores.map((cor) => cor.id))

    const response = await client.get(`/pets/${pet.id}`)
    response.assertStatus(200)

    assert.exists(response.body()['nome'])
    assert.exists(response.body()['especie'])
    assert.exists(response.body()['cores'])
    assert.exists(response.body()['situacao'])
    assert.exists(response.body()['vistoAs'])
    assert.exists(response.body()['vistoEm'])
    assert.exists(response.body()['cores'])

    assert.equal(response.body()['id'], pet.id)
    assert.equal(response.body()['nome'], pet.nome)
    assert.equal(response.body()['especie'], pet.especie)
    assert.equal(response.body()['situacao'], pet.situacao)
    assert.equal(response.body()['comentario'], pet.comentario)
    assert.equal(DateTime.fromISO(response.body()['vistoAs']).toMillis(), pet.vistoAs.toMillis())
    assert.equal(response.body()['vistoEm']['latitude'], coordenadas.latitude)
    assert.equal(response.body()['vistoEm']['longitude'], coordenadas.longitude)
    assert.sameDeepMembers(
      response.body()['cores'].map((cor) => cor.valor),
      cores.map((cor) => cor.valor)
    )
  })

  // TODO teste falhar caso um pet não for encontrado
})
