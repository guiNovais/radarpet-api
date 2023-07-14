import { test } from '@japa/runner'
import Pet from 'App/Models/Pet'

test.group('Pet show', () => {
  test('recuperar todas as informações de um pet', async ({ client, assert }) => {
    const pet = await Pet.firstOrFail()
    const response = await client.get(`/pets/${pet.id}`)

    response.assertStatus(200)

    assert.exists(response.body()['nome'])
    assert.exists(response.body()['especie'])
    assert.exists(response.body()['cor'])
    assert.exists(response.body()['situacao'])
    assert.exists(response.body()['vistoAs'])

    assert.equal(response.body()['id'], pet.id)
    assert.equal(response.body()['nome'], pet.nome)
    assert.equal(response.body()['especie'], pet.especie)
    assert.equal(response.body()['cor'], pet.cor)
    assert.equal(response.body()['situacao'], pet.situacao)
    assert.equal(response.body()['comentario'], pet.comentario)
    assert.equal(response.body()['vistoAs'], pet.vistoAs.toISO())
  })
})
