import { test } from '@japa/runner'
import Pet from 'App/Models/Pet'
import CoordenadaFactory from 'Database/factories/CoordenadaFactory'
import PetFactory from 'Database/factories/PetFactory'

test.group('Pet update', () => {
  test('atualizar todos os parâmetros de pet', async ({ client, assert }) => {
    const antigo = await PetFactory.create()
    const novo = await PetFactory.make()
    const response = await client.patch(`/pets/${antigo.id}`).json(novo)
    response.assertStatus(200)

    assert.equal(response.body()['nome'], novo.nome)
    assert.equal(response.body()['especie'], novo.especie)
    assert.equal(response.body()['cor'], novo.cor)
    assert.equal(response.body()['situacao'], novo.situacao)
    assert.equal(response.body()['comentario'], novo.comentario)
    assert.equal(response.body()['vistoAs'], novo.vistoAs.toISO())
    assert.equal(response.body()['vistoEm'], novo.vistoEm)

    const persistido = await Pet.findOrFail(antigo.id)
    assert.equal(persistido.nome, novo.nome)
    assert.equal(persistido.especie, novo.especie)
    assert.equal(persistido.cor, novo.cor)
    assert.equal(persistido.situacao, novo.situacao)
    assert.equal(persistido.comentario, novo.comentario)
    assert.equal(persistido.vistoAs.toISO(), novo.vistoAs.toISO())
    assert.equal(persistido.vistoEm, novo.vistoEm)
  })

  test('atualizar cada parâmetro de pet individualmente', async ({ client, assert }) => {
    let antigo = await PetFactory.create()
    const id = antigo.id
    await CoordenadaFactory.merge({ petId: id }).create()
    await antigo.load('vistoEm')

    const novo = (await PetFactory.make()).toJSON()
    novo.vistoEm = (await CoordenadaFactory.make()).toJSON()

    let response = await client.patch(`/pets/${id}`).json({ nome: novo.nome })
    let persistido = await Pet.findOrFail(id)
    await persistido.load('vistoEm')
    response.assertStatus(200)
    assert.equal(response.body()['nome'], novo.nome)
    assert.equal(persistido.nome, novo.nome)
    assert.equal(persistido.especie, antigo.especie)
    assert.equal(persistido.cor, antigo.cor)
    assert.equal(persistido.situacao, antigo.situacao)
    assert.equal(persistido.comentario, antigo.comentario)
    assert.equal(persistido.vistoAs.toISO(), antigo.vistoAs.toISO())
    assert.equal(persistido.vistoEm.latitude, antigo.vistoEm.latitude)
    assert.equal(persistido.vistoEm.longitude, antigo.vistoEm.longitude)

    response = await client.patch(`/pets/${id}`).json({ especie: novo.especie })
    persistido = await Pet.findOrFail(id)
    await persistido.load('vistoEm')
    response.assertStatus(200)
    assert.equal(response.body()['especie'], novo.especie)
    assert.equal(persistido.nome, novo.nome)
    assert.equal(persistido.especie, novo.especie)
    assert.equal(persistido.cor, antigo.cor)
    assert.equal(persistido.situacao, antigo.situacao)
    assert.equal(persistido.comentario, antigo.comentario)
    assert.equal(persistido.vistoAs.toISO(), antigo.vistoAs.toISO())
    assert.equal(persistido.vistoEm.latitude, antigo.vistoEm.latitude)
    assert.equal(persistido.vistoEm.longitude, antigo.vistoEm.longitude)

    response = await client.patch(`/pets/${id}`).json({ cor: novo.cor })
    persistido = await Pet.findOrFail(id)
    await persistido.load('vistoEm')
    response.assertStatus(200)
    assert.equal(response.body()['cor'], novo.cor)
    assert.equal(persistido.nome, novo.nome)
    assert.equal(persistido.especie, novo.especie)
    assert.equal(persistido.cor, novo.cor)
    assert.equal(persistido.situacao, antigo.situacao)
    assert.equal(persistido.comentario, antigo.comentario)
    assert.equal(persistido.vistoAs.toISO(), antigo.vistoAs.toISO())
    assert.equal(persistido.vistoEm.latitude, antigo.vistoEm.latitude)
    assert.equal(persistido.vistoEm.longitude, antigo.vistoEm.longitude)

    response = await client.patch(`/pets/${id}`).json({ situacao: novo.situacao })
    persistido = await Pet.findOrFail(id)
    await persistido.load('vistoEm')
    response.assertStatus(200)
    assert.equal(response.body()['situacao'], novo.situacao)
    assert.equal(persistido.nome, novo.nome)
    assert.equal(persistido.especie, novo.especie)
    assert.equal(persistido.cor, novo.cor)
    assert.equal(persistido.situacao, novo.situacao)
    assert.equal(persistido.comentario, antigo.comentario)
    assert.equal(persistido.vistoAs.toISO(), antigo.vistoAs.toISO())
    assert.equal(persistido.vistoEm.latitude, antigo.vistoEm.latitude)
    assert.equal(persistido.vistoEm.longitude, antigo.vistoEm.longitude)

    response = await client.patch(`/pets/${id}`).json({ comentario: novo.comentario })
    persistido = await Pet.findOrFail(id)
    await persistido.load('vistoEm')
    response.assertStatus(200)
    assert.equal(response.body()['comentario'], novo.comentario)
    assert.equal(persistido.nome, novo.nome)
    assert.equal(persistido.especie, novo.especie)
    assert.equal(persistido.cor, novo.cor)
    assert.equal(persistido.situacao, novo.situacao)
    assert.equal(persistido.comentario, novo.comentario)
    assert.equal(persistido.vistoAs.toISO(), antigo.vistoAs.toISO())
    assert.equal(persistido.vistoEm.latitude, antigo.vistoEm.latitude)
    assert.equal(persistido.vistoEm.longitude, antigo.vistoEm.longitude)

    response = await client.patch(`/pets/${id}`).json({ vistoAs: novo.vistoAs })
    persistido = await Pet.findOrFail(id)
    await persistido.load('vistoEm')
    response.assertStatus(200)
    assert.equal(response.body()['vistoAs'], novo.vistoAs)
    assert.equal(persistido.nome, novo.nome)
    assert.equal(persistido.especie, novo.especie)
    assert.equal(persistido.cor, novo.cor)
    assert.equal(persistido.situacao, novo.situacao)
    assert.equal(persistido.comentario, novo.comentario)
    assert.equal(persistido.vistoAs.toISO(), novo.vistoAs)
    assert.equal(persistido.vistoEm.latitude, antigo.vistoEm.latitude)
    assert.equal(persistido.vistoEm.longitude, antigo.vistoEm.longitude)

    response = await client.patch(`/pets/${id}`).json({ vistoEm: novo.vistoEm })
    persistido = await Pet.findOrFail(id)
    await persistido.load('vistoEm')
    response.assertStatus(200)
    assert.equal(response.body()['vistoEm'].latitude, novo.vistoEm.latitude)
    assert.equal(response.body()['vistoEm'].longitude, novo.vistoEm.longitude)
    assert.equal(persistido.nome, novo.nome)
    assert.equal(persistido.especie, novo.especie)
    assert.equal(persistido.cor, novo.cor)
    assert.equal(persistido.situacao, novo.situacao)
    assert.equal(persistido.comentario, novo.comentario)
    assert.equal(persistido.vistoAs.toISO(), novo.vistoAs)
    assert.equal(persistido.vistoEm.latitude, novo.vistoEm.latitude)
    assert.equal(persistido.vistoEm.longitude, novo.vistoEm.longitude)
  })

  test('exigir que os parâmetros enumerados sejam válidos', async ({ client }) => {
    const pet = await PetFactory.create()
    const response = await client.patch(`/pets/${pet.id}`).json(
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
    const pet = await PetFactory.make()
    const response = await client.patch('/pets/-1').json(pet)
    response.assertStatus(404)
  })
})
