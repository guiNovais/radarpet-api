import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Coordenada from 'App/Models/Coordenada'
import Cor from 'App/Models/Cor'
import Pet from 'App/Models/Pet'
import CoordenadaFactory from 'Database/factories/CoordenadaFactory'
import PetFactory from 'Database/factories/PetFactory'
import UsuarioFactory from 'Database/factories/UsuarioFactory'

test.group('Pet update', () => {
  test('atualizar todos os parâmetros de pet', async ({ client, assert }) => {
    const usuario = await UsuarioFactory.create()
    const antigo = (await PetFactory.merge({ usuarioId: usuario.id }).create()).toJSON()
    const id = antigo.id
    await CoordenadaFactory.merge({ petId: antigo.id }).create()
    const novo = (await PetFactory.make()).toJSON()
    novo.vistoEm = (await CoordenadaFactory.make()).toJSON()
    novo.cores = ['Preto', 'Branco']

    const response = await client.patch(`/pets/${id}`).json(novo).loginAs(usuario)

    response.assertStatus(200)

    assert.notEmpty(response.body()['nome'])
    assert.notEmpty(response.body()['especie'])
    assert.notEmpty(response.body()['situacao'])
    assert.notEmpty(response.body()['comentario'])
    assert.notEmpty(response.body()['vistoAs'])
    assert.notEmpty(response.body()['vistoEm'])
    assert.notEmpty(response.body()['cores'])

    assert.equal(response.body()['nome'], novo.nome)
    assert.equal(response.body()['especie'], novo.especie)
    assert.equal(response.body()['situacao'], novo.situacao)
    assert.equal(response.body()['comentario'], novo.comentario)
    assert.equal(response.body()['vistoAs'], novo.vistoAs)
    assert.containsSubset(response.body()['vistoEm'], novo.vistoEm)
    assert.sameDeepMembers(
      response.body().cores.map((cor) => cor.valor),
      novo.cores
    )

    const petPersistido = await Pet.findOrFail(id)
    const coordenadasPersistidas = await Coordenada.findByOrFail('petId', id)
    const coresPersistidas = (
      await Database.query()
        .select('valor')
        .from('cores as c')
        .innerJoin('cores_pets as cp', 'cp.cor_id', 'c.id')
        .innerJoin('pets as p', 'p.id', 'cp.pet_id')
        .where('p.id', '=', petPersistido.id)
    ).map((cor) => cor.valor)

    assert.equal(petPersistido.nome, novo.nome)
    assert.equal(petPersistido.especie, novo.especie)
    assert.equal(petPersistido.situacao, novo.situacao)
    assert.equal(petPersistido.comentario, novo.comentario)
    assert.equal(petPersistido.vistoAs.toISO(), novo.vistoAs)
    assert.containsSubset(coordenadasPersistidas, novo.vistoEm)
    assert.sameDeepMembers(coresPersistidas, novo.cores)
  })

  test('atualizar cada parâmetro de pet individualmente', async ({ client, assert }) => {
    const usuario = await UsuarioFactory.create()
    let antigo = await PetFactory.merge({ usuarioId: usuario.id }).create()
    const id = antigo.id
    await CoordenadaFactory.merge({ petId: id }).create()
    await antigo.load('vistoEm')
    await antigo
      .related('cores')
      .attach((await Cor.query().whereIn('valor', ['Preto', 'Branco'])).map((cor) => cor.id))
    await antigo.load('cores')

    const novo = (await PetFactory.make()).toJSON()
    novo.vistoEm = (await CoordenadaFactory.make()).toJSON()
    novo.cores = ['Laranja']

    let response = await client.patch(`/pets/${id}`).json({ nome: novo.nome }).loginAs(usuario)
    let persistido = await Pet.findOrFail(id)
    await persistido.load('vistoEm')
    await persistido.load('cores')
    response.assertStatus(200)
    assert.equal(response.body()['nome'], novo.nome)
    assert.equal(persistido.nome, novo.nome)
    assert.equal(persistido.especie, antigo.especie)
    assert.equal(persistido.situacao, antigo.situacao)
    assert.equal(persistido.comentario, antigo.comentario)
    assert.equal(persistido.vistoAs.toISO(), antigo.vistoAs.toISO())
    assert.equal(persistido.vistoEm.latitude, antigo.vistoEm.latitude)
    assert.equal(persistido.vistoEm.longitude, antigo.vistoEm.longitude)
    assert.sameDeepMembers(
      persistido.cores.map((cor) => cor.valor),
      ['Preto', 'Branco']
    )

    response = await client.patch(`/pets/${id}`).json({ especie: novo.especie }).loginAs(usuario)
    persistido = await Pet.findOrFail(id)
    await persistido.load('vistoEm')
    await persistido.load('cores')
    response.assertStatus(200)
    assert.equal(response.body()['especie'], novo.especie)
    assert.equal(persistido.nome, novo.nome)
    assert.equal(persistido.especie, novo.especie)
    assert.equal(persistido.situacao, antigo.situacao)
    assert.equal(persistido.comentario, antigo.comentario)
    assert.equal(persistido.vistoAs.toISO(), antigo.vistoAs.toISO())
    assert.equal(persistido.vistoEm.latitude, antigo.vistoEm.latitude)
    assert.equal(persistido.vistoEm.longitude, antigo.vistoEm.longitude)
    assert.sameDeepMembers(
      persistido.cores.map((cor) => cor.valor),
      ['Preto', 'Branco']
    )

    response = await client.patch(`/pets/${id}`).json({ situacao: novo.situacao }).loginAs(usuario)
    persistido = await Pet.findOrFail(id)
    await persistido.load('vistoEm')
    await persistido.load('cores')
    response.assertStatus(200)
    assert.equal(response.body()['situacao'], novo.situacao)
    assert.equal(persistido.nome, novo.nome)
    assert.equal(persistido.especie, novo.especie)
    assert.equal(persistido.situacao, novo.situacao)
    assert.equal(persistido.comentario, antigo.comentario)
    assert.equal(persistido.vistoAs.toISO(), antigo.vistoAs.toISO())
    assert.equal(persistido.vistoEm.latitude, antigo.vistoEm.latitude)
    assert.equal(persistido.vistoEm.longitude, antigo.vistoEm.longitude)
    assert.sameDeepMembers(
      persistido.cores.map((cor) => cor.valor),
      ['Preto', 'Branco']
    )

    response = await client
      .patch(`/pets/${id}`)
      .json({ comentario: novo.comentario })
      .loginAs(usuario)
    persistido = await Pet.findOrFail(id)
    await persistido.load('vistoEm')
    await persistido.load('cores')
    response.assertStatus(200)
    assert.equal(response.body()['comentario'], novo.comentario)
    assert.equal(persistido.nome, novo.nome)
    assert.equal(persistido.especie, novo.especie)
    assert.equal(persistido.situacao, novo.situacao)
    assert.equal(persistido.comentario, novo.comentario)
    assert.equal(persistido.vistoAs.toISO(), antigo.vistoAs.toISO())
    assert.equal(persistido.vistoEm.latitude, antigo.vistoEm.latitude)
    assert.equal(persistido.vistoEm.longitude, antigo.vistoEm.longitude)
    assert.sameDeepMembers(
      persistido.cores.map((cor) => cor.valor),
      ['Preto', 'Branco']
    )

    response = await client.patch(`/pets/${id}`).json({ vistoAs: novo.vistoAs }).loginAs(usuario)
    persistido = await Pet.findOrFail(id)
    await persistido.load('vistoEm')
    await persistido.load('cores')
    response.assertStatus(200)
    assert.equal(response.body()['vistoAs'], novo.vistoAs)
    assert.equal(persistido.nome, novo.nome)
    assert.equal(persistido.especie, novo.especie)
    assert.equal(persistido.situacao, novo.situacao)
    assert.equal(persistido.comentario, novo.comentario)
    assert.equal(persistido.vistoAs.toISO(), novo.vistoAs)
    assert.equal(persistido.vistoEm.latitude, antigo.vistoEm.latitude)
    assert.equal(persistido.vistoEm.longitude, antigo.vistoEm.longitude)
    assert.sameDeepMembers(
      persistido.cores.map((cor) => cor.valor),
      ['Preto', 'Branco']
    )

    response = await client.patch(`/pets/${id}`).json({ vistoEm: novo.vistoEm }).loginAs(usuario)
    persistido = await Pet.findOrFail(id)
    await persistido.load('vistoEm')
    await persistido.load('cores')
    response.assertStatus(200)
    assert.containsSubset(response.body()['vistoEm'], novo.vistoEm)
    assert.equal(persistido.nome, novo.nome)
    assert.equal(persistido.especie, novo.especie)
    assert.equal(persistido.situacao, novo.situacao)
    assert.equal(persistido.comentario, novo.comentario)
    assert.equal(persistido.vistoAs.toISO(), novo.vistoAs)
    assert.equal(persistido.vistoEm.latitude, novo.vistoEm.latitude)
    assert.equal(persistido.vistoEm.longitude, novo.vistoEm.longitude)
    assert.sameDeepMembers(
      persistido.cores.map((cor) => cor.valor),
      ['Preto', 'Branco']
    )

    response = await client.patch(`/pets/${id}`).json({ cores: novo.cores }).loginAs(usuario)
    persistido = await Pet.findOrFail(id)
    await persistido.load('vistoEm')
    await persistido.load('cores')
    response.assertStatus(200)
    assert.sameDeepMembers(
      response.body()['cores'].map((cor) => cor.valor),
      novo.cores
    )
    assert.equal(persistido.nome, novo.nome)
    assert.equal(persistido.especie, novo.especie)
    assert.equal(persistido.situacao, novo.situacao)
    assert.equal(persistido.comentario, novo.comentario)
    assert.equal(persistido.vistoAs.toISO(), novo.vistoAs)
    assert.equal(persistido.vistoEm.latitude, novo.vistoEm.latitude)
    assert.equal(persistido.vistoEm.longitude, novo.vistoEm.longitude)
    assert.sameDeepMembers(
      persistido.cores.map((cor) => cor.valor),
      novo.cores
    )
  })

  test('exigir que os parâmetros enumerados sejam válidos', async ({ client }) => {
    const pet = (await PetFactory.create()).toJSON()
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
    const pet = await PetFactory.create()
    const response = await client
      .patch(`pets/${pet.id}`)
      .json({ nome: 'Nulla aliquip et occaecat ullamco nisi dolore reprehenderit fugiat mollit.' })
    response.assertStatus(422)
    assert.deepInclude(response.body().errors, {
      rule: 'maxLength',
      field: 'nome',
      message: 'maxLength validation failed',
      args: { maxLength: 25 },
    })
  })

  test('proibir comentário maior do que 280 caracteres', async ({ client, assert }) => {
    const pet = await PetFactory.create()
    const response = await client.patch(`pets/${pet.id}`).json({
      comentario:
        'Amet laborum aute amet eu non dolore. Cillum excepteur dolore ipsum veniam cillum est excepteur labore reprehenderit. Voluptate voluptate occaecat laboris culpa et pariatur nostrud tempor exercitation minim aliqua et. Adipisicing officia tempor nostrud aute magna sit labore. Mollit nulla elit id id. Lorem eiusmod ex cupidatat ex incididunt ut laborum anim duis ipsum ipsum.',
    })
    response.assertStatus(422)
    assert.deepInclude(response.body().errors, {
      rule: 'maxLength',
      field: 'comentario',
      message: 'maxLength validation failed',
      args: { maxLength: 280 },
    })
  })

  test('falhar caso um pet não for encontrado', async ({ client }) => {
    const usuario = await UsuarioFactory.create()
    const pet = await PetFactory.make()
    const response = await client.patch('/pets/-1').json(pet).loginAs(usuario)
    response.assertStatus(404)
  })

  test('proibir um usuário de alterar um pet de outro usuário', async ({ client }) => {
    const fulano = await UsuarioFactory.create()
    const cicrano = await UsuarioFactory.create()
    const pet = await PetFactory.merge({ usuarioId: fulano.id }).create()

    const response = await client.patch(`/pets/${pet.id}`).loginAs(cicrano)
    response.assertStatus(401)
  })
})
