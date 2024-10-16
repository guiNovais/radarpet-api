import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Coordenada from 'App/Models/Coordenada'
import Cor from 'App/Models/Cor'
import Pet from 'App/Models/Pet'
import Usuario from 'App/Models/Usuario'

import CoordenadaFactory from 'Database/factories/CoordenadaFactory'
import PetFactory from 'Database/factories/PetFactory'
import UsuarioFactory from 'Database/factories/UsuarioFactory'
import { sampleSize } from 'lodash'
import { DateTime } from 'luxon'

test.group('Pet store', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('armazenar um pet com sucesso', async ({ client, assert }) => {
    const usuario = await UsuarioFactory.create()
    const pet = (await PetFactory.merge({ id: undefined, usuarioId: usuario.id }).make()).toJSON()
    pet.vistoEm = (await CoordenadaFactory.merge({ petId: undefined }).make()).toJSON()
    pet.cores = ['Preto', 'Branco']

    const response = await client.post('/pets').json(pet).loginAs(usuario)
    response.assertStatus(200)

    assert.notEmpty(response.body().nome)
    assert.notEmpty(response.body().especie)
    assert.notEmpty(response.body().cores)
    assert.notEmpty(response.body().situacao)
    assert.notEmpty(response.body().vistoAs)
    assert.notEmpty(response.body().vistoEm)
    assert.isNotNull(response.body().usuarioId)

    assert.equal(response.body().nome, pet.nome)
    assert.equal(response.body().especie, pet.especie)
    assert.equal(response.body().situacao, pet.situacao)
    assert.equal(response.body().vistoAs, pet.vistoAs)
    assert.equal(response.body().vistoEm.latitude, pet.vistoEm.latitude)
    assert.equal(response.body().vistoEm.longitude, pet.vistoEm.longitude)
    assert.equal(response.body().usuarioId, usuario.id)
    assert.sameDeepMembers(
      response.body().cores.map((cor) => cor.valor),
      pet.cores
    )

    const petPersistido = await Pet.findOrFail(response.body()['id'])
    const coordenadasPersistidas = await Coordenada.findByOrFail('petId', response.body()['id'])
    const usuarioPersistido = await Usuario.findOrFail(usuario.id)
    const coresPersistidas = (
      await Database.query()
        .select('valor')
        .from('cores as c')
        .innerJoin('cores_pets as cp', 'cp.cor_id', 'c.id')
        .innerJoin('pets as p', 'p.id', 'cp.pet_id')
        .where('p.id', '=', petPersistido.id)
    ).map((cor) => cor.valor)

    assert.equal(petPersistido.nome, pet.nome)
    assert.equal(petPersistido.especie, pet.especie)
    assert.equal(petPersistido.situacao, pet.situacao)
    assert.equal(petPersistido.usuarioId, usuario.id)
    assert.isAtLeast(petPersistido.vistoAs, DateTime.fromISO(pet.vistoAs))
    assert.isAtMost(petPersistido.vistoAs, DateTime.fromISO(pet.vistoAs).plus({ seconds: 5 }))
    assert.equal(coordenadasPersistidas.latitude, pet.vistoEm.latitude)
    assert.equal(coordenadasPersistidas.longitude, pet.vistoEm.longitude)
    assert.equal(usuarioPersistido.nome, usuario.nome)
    assert.equal(usuarioPersistido.telefone, usuario.telefone)
    assert.equal(usuarioPersistido.email, usuario.email)
    assert.sameDeepMembers(coresPersistidas, pet.cores)
  })

  test('exigir parâmetros obrigatórios ao armazenar um pet', async ({ client }) => {
    const response = await client.post('/pets').json({})
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        { rule: 'required', field: 'nome', message: 'required validation failed' },
        { rule: 'required', field: 'especie', message: 'required validation failed' },
        { rule: 'required', field: 'vistoAs', message: 'required validation failed' },
        { rule: 'required', field: 'vistoEm', message: 'required validation failed' },
        { rule: 'required', field: 'usuarioId', message: 'required validation failed' },
        { rule: 'required', field: 'cores', message: 'required validation failed' },
      ],
    })
  })

  test('exigir que os parâmetros enumerados sejam válidos', async ({ client }) => {
    const pet = (await PetFactory.make()).toJSON()
    pet.especie = 'bar'
    pet.situacao = 'baz'
    pet.cores = ['qux']

    const response = await client.post('/pets').json(pet)
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
          field: 'situacao',
          message: 'enum validation failed',
        },
        {
          rule: 'enum',
          field: 'cores.0',
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
  })

  test('permitir comentário vazio', async ({ client }) => {
    const usuario = await UsuarioFactory.create()
    const coordenadas = (await CoordenadaFactory.make()).toJSON()
    const pet = (await PetFactory.merge({ usuarioId: usuario.id }).make()).toJSON()
    const cores = sampleSize(await Cor.all()).map((cor) => cor.valor, 2)

    pet.vistoEm = coordenadas
    pet.cores = cores
    delete pet.comentario

    const response = await client.post('pets').json(pet).loginAs(usuario)
    response.assertStatus(200)
  })

  test('permitir pet com várias cores', async ({ client }) => {
    const usuario = await UsuarioFactory.create()
    const pet = (
      await PetFactory.merge({
        id: undefined,
        usuarioId: usuario.id,
      } as any).make()
    ).toJSON()

    pet.vistoEm = (await CoordenadaFactory.merge({ petId: undefined }).make()).toJSON()
    pet.cores = sampleSize(await Cor.all(), 2).map((cor) => cor.valor)

    const response = await client.post('/pets').json(pet).loginAs(usuario)
    response.assertStatus(200)
  })
})
