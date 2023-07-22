import { test } from '@japa/runner'
import Coordenada from 'App/Models/Coordenada'

import Pet from 'App/Models/Pet'
import Usuario from 'App/Models/Usuario'
import CoordenadaFactory from 'Database/factories/CoordenadaFactory'
import PetFactory from 'Database/factories/PetFactory'
import UsuarioFactory from 'Database/factories/UsuarioFactory'

test.group('Pet store', () => {
  test('armazenar um pet com sucesso', async ({ client, assert }) => {
    const usuario = await UsuarioFactory.create()
    const pet = (await PetFactory.merge({ id: undefined, usuarioId: usuario.id }).make()).toJSON()
    pet.vistoEm = (await CoordenadaFactory.merge({ petId: undefined }).make()).toJSON()

    const response = await client.post('/pets').json(pet)
    response.assertStatus(200)
    assert.equal(response.body().nome, pet.nome)
    assert.equal(response.body().especie, pet.especie)
    assert.equal(response.body().cor, pet.cor)
    assert.equal(response.body().situacao, pet.situacao)
    assert.equal(response.body().vistoAs, pet.vistoAs)
    assert.equal(response.body().vistoEm.latitude, pet.vistoEm.latitude)
    assert.equal(response.body().vistoEm.longitude, pet.vistoEm.longitude)
    assert.equal(response.body().usuarioId, pet.usuarioId)

    const petPersistido = await Pet.findOrFail(response.body()['id'])
    const coordenadasPersistidas = await Coordenada.findByOrFail('petId', response.body()['id'])
    const usuarioPersistido = await Usuario.findOrFail(usuario.id)
    assert.equal(petPersistido.nome, pet.nome)
    assert.equal(petPersistido.especie, pet.especie)
    assert.equal(petPersistido.cor, pet.cor)
    assert.equal(petPersistido.situacao, pet.situacao)
    assert.equal(petPersistido.usuarioId, usuario.id)
    assert.equal(petPersistido.vistoAs.toISO(), pet.vistoAs)
    assert.equal(coordenadasPersistidas.latitude, pet.vistoEm.latitude)
    assert.equal(coordenadasPersistidas.longitude, pet.vistoEm.longitude)
    assert.equal(usuarioPersistido.nome, usuario.nome)
    assert.equal(usuarioPersistido.telefone, usuario.telefone)
    assert.equal(usuarioPersistido.email, usuario.email)
  })

  test('exigir parâmetros obrigatórios ao armazenar um pet', async ({ client }) => {
    const response = await client.post('/pets').json({})
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        { rule: 'required', field: 'nome', message: 'required validation failed' },
        { rule: 'required', field: 'especie', message: 'required validation failed' },
        { rule: 'required', field: 'cor', message: 'required validation failed' },
        { rule: 'required', field: 'vistoAs', message: 'required validation failed' },
        { rule: 'required', field: 'vistoEm', message: 'required validation failed' },
        { rule: 'required', field: 'usuarioId', message: 'required validation failed' },
      ],
    })
  })

  test('exigir que os parâmetros enumerados sejam válidos', async ({ client }) => {
    const response = await client.post('/pets').json(
      await PetFactory.merge({
        cor: 'foo',
        especie: 'bar',
        situacao: 'baz',
      } as any).make()
    )

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          rule: 'enum',
          field: 'especie',
          message: 'enum validation failed',
        },
        {
          rule: 'enum',
          field: 'cor',
          message: 'enum validation failed',
        },
        {
          rule: 'enum',
          field: 'situacao',
          message: 'enum validation failed',
        },
      ],
    })
  })

  test('proibir nome do pet maior do que 25 caracteres', async ({ client, assert }) => {
    const pet = await PetFactory.merge({
      nome: 'Minim cupidatat fugiat eu id cillum elit pariatur in in.',
    }).make()
    const response = await client.post('pets').json(pet)
    response.assertStatus(422)
    assert.deepInclude(response.body().errors, {
      rule: 'maxLength',
      field: 'nome',
      message: 'maxLength validation failed',
      args: { maxLength: 25 },
    })
  })

  test('proibir comentário maior do que 280 caracteres', async ({ client, assert }) => {
    const pet = await PetFactory.merge({
      comentario:
        'Cillum pariatur labore est irure consequat officia occaecat sunt nulla quis est. Cillum sint amet non ea ex occaecat consequat. Dolor ullamco tempor consequat labore minim ipsum anim Lorem. Minim reprehenderit deserunt labore consectetur minim est reprehenderit velit cupidatat aliqua ullamco sunt dolore. Enim ad et id quis quis do incididunt nostrud anim excepteur. Elit officia eu do velit anim eu voluptate elit Lorem. Non elit qui elit aute Lorem dolor.',
    }).make()
    const response = await client.post('pets').json(pet)
    response.assertStatus(422)
    assert.deepInclude(response.body().errors, {
      rule: 'maxLength',
      field: 'comentario',
      message: 'maxLength validation failed',
      args: { maxLength: 280 },
    })

    test('permitir comentário vazio', async ({ client }) => {
      const coordenadas = (await CoordenadaFactory.make()).toJSON()
      const pet = (await PetFactory.make()).toJSON()
      pet.vistoEm = coordenadas
      delete pet.comentario
      const response = await client.post('pets').json(pet)
      response.assertStatus(200)
    })
  })
})
