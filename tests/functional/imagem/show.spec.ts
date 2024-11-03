import Drive from '@ioc:Adonis/Core/Drive'
import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import ImagemFactory from 'Database/factories/ImagemFactory'
import PetFactory from 'Database/factories/PetFactory'
import UsuarioFactory from 'Database/factories/UsuarioFactory'

test.group('Imagem show', (group) => {
  const assets = './tests/functional/imagem/assets'

  group.each.setup(async () => {
    Drive.fake()
    Drive.put('imagem-512x512.jpg', `${assets}/imagem-512x512.jpg`)
    Drive.put('imagem-1.jpg', `${assets}/imagem-1.jpg`)
    Drive.put('imagem-2.jpg', `${assets}/imagem-2.jpg`)
    Drive.put('imagem-3.jpg', `${assets}/imagem-3.jpg`)
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  group.each.teardown(async () => {
    Drive.restore()
  })

  test('recuperar uma imagem de usuário com sucesso', async ({ client, assert }) => {
    const usuario = await UsuarioFactory.create()
    await ImagemFactory.merge({ usuarioId: usuario.id, fileName: 'imagem-512x512.jpg' }).create()

    const response = await client.get(`/imagens?usuarioId=${usuario.id}`)

    response.assertStatus(200)
    assert.equal(`${assets}/imagem-512x512.jpg`, response.body())
  })

  test('recuperar uma imagem de pet com sucesso', async ({ client, assert }) => {
    const pet = await PetFactory.create()
    await ImagemFactory.merge({ petId: pet.id, fileName: 'imagem-512x512.jpg' }).create()

    const response = await client.get(`/imagens?petId=${pet.id}&index=0`)

    response.assertStatus(200)
    assert.equal(`${assets}/imagem-512x512.jpg`, response.body())
  })

  test('recuperar três imagens de um pet com sucesso', async ({ client, assert }) => {
    const pet = await PetFactory.create()
    await ImagemFactory.merge({ petId: pet.id, fileName: 'imagem-1.jpg' }).create()
    await ImagemFactory.merge({ petId: pet.id, fileName: 'imagem-2.jpg' }).create()
    await ImagemFactory.merge({ petId: pet.id, fileName: 'imagem-3.jpg' }).create()

    const response1 = await client.get(`/imagens?petId=${pet.id}&index=0`)
    const response2 = await client.get(`/imagens?petId=${pet.id}&index=1`)
    const response3 = await client.get(`/imagens?petId=${pet.id}&index=2`)

    response1.assertStatus(200)
    assert.equal(`${assets}/imagem-1.jpg`, response1.body())

    response2.assertStatus(200)
    assert.equal(`${assets}/imagem-2.jpg`, response2.body())

    response3.assertStatus(200)
    assert.equal(`${assets}/imagem-3.jpg`, response3.body())
  })

  test('falhar ao pesquisar por uma imagem de pet sem informar o index', async ({ client }) => {
    const response = await client.get(`/imagens?petId=0`)
    response.assertStatus(422)
  })

  test('falhar ao pesquisar uma imagem com index maior do que 2', async ({ client }) => {
    const response = await client.get(`/imagens?petId=0&index=3`)
    response.assertStatus(422)
  })

  test('falhar caso uma imagem de usuário não for encontrada', async ({ client }) => {
    const usuario = await UsuarioFactory.create()
    const response = await client.get(`/imagens?usuarioId=${usuario.id}`)

    response.assertStatus(404)
  })

  test('falhar caso uma imagem de pet não for encontrada', async ({ client }) => {
    const pet = await PetFactory.create()
    const response = await client.get(`/imagens?petId=${pet.id}&index=0`)
    response.assertStatus(404)
  })

  test('falhar caso uma imagem de pet com index maior do que a quantidade armazenada', async ({
    client,
  }) => {
    const pet = await PetFactory.create()
    await ImagemFactory.merge({ petId: pet.id }).create()

    const response = await client.get(`/imagens?petId=${pet.id}&index=1`)
    response.assertStatus(404)
  })
})
