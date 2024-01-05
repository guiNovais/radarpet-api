import { test } from '@japa/runner'
import Pet from 'App/Models/Pet'
import { Situacao } from 'App/Models/Situacao'
import PetFactory from 'Database/factories/PetFactory'
import { DateTime } from 'luxon'

test.group('Pet index', () => {
  test('recuperar todos os pets', async ({ client, assert }) => {
    const response = await client.get('/pets?latitude=0.000000&longitude=0.000000')
    response.assertStatus(200)
    assert.equal(response.body().length, 3)
  })

  test('exigir parâmetros de coordenadas', async ({ client }) => {
    const response = await client.get('/pets')
    response.assertStatus(422)

    response.assertBodyContains({
      errors: [
        { rule: 'required', field: 'latitude', message: 'required validation failed' },
        { rule: 'required', field: 'longitude', message: 'required validation failed' },
      ],
    })
  })

  test('validar valores máximos das coordenadas', async ({ client }) => {
    const response = await client.get('/pets?latitude=90.000001&longitude=180.000001')
    response.assertStatus(422)

    response.assertBodyContains({
      errors: [
        { rule: 'latitude', field: 'latitude', message: 'range validation failed' },
        { rule: 'longitude', field: 'longitude', message: 'range validation failed' },
      ],
    })
  })

  test('validar valores mínimos das coordenadas', async ({ client }) => {
    const response = await client.get('/pets?latitude=-90.000001&longitude=-180.000001')
    response.assertStatus(422)

    response.assertBodyContains({
      errors: [
        { rule: 'latitude', field: 'latitude', message: 'range validation failed' },
        { rule: 'longitude', field: 'longitude', message: 'range validation failed' },
      ],
    })
  })

  test('validar precisão das coordenadas', async ({ client }) => {
    const response = await client.get('/pets?latitude=0&longitude=0')
    response.assertStatus(422)

    response.assertBodyContains({
      errors: [
        { rule: 'latitude', field: 'latitude', message: 'latitude validation failed' },
        { rule: 'longitude', field: 'longitude', message: 'longitude validation failed' },
      ],
    })
  })

  test('recuperar apenas os pets vistos no ultumo ano', async ({ client, assert }) => {
    const anoPassado = DateTime.now().minus({ year: 1 })
    const pet = await PetFactory.merge({ vistoAs: anoPassado }).create()

    const response = await client.get('/pets?latitude=0.000000&longitude=0.000000')
    response.assertStatus(200)

    const ids = (response.body() as Pet[]).map((e) => e.id)
    assert.notInclude(ids, pet.id)
  })

  test('recuperar apenas os pets perdidos', async ({ client, assert }) => {
    const pet = await PetFactory.merge({ situacao: Situacao.Encontrado }).create()

    const response = await client.get('/pets?latitude=0.000000&longitude=0.000000')
    response.assertStatus(200)

    const ids = (response.body() as Pet[]).map((e) => e.id)
    assert.notInclude(ids, pet.id)
  })
})
