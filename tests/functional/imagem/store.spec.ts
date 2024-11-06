import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import PetFactory from 'Database/factories/PetFactory'
import UsuarioFactory from 'Database/factories/UsuarioFactory'
import { createReadStream, readFile } from 'fs'
import Drive from '@ioc:Adonis/Core/Drive'
import ImagemFactory from 'Database/factories/ImagemFactory'

test.group('Imagem store', (group) => {
  const assets = './tests/functional/imagem/assets'

  group.each.setup(async () => {
    Drive.fake()
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  group.each.teardown(async () => {
    Drive.restore()
  })

  test('armazenar uma imagem de usuário com sucesso', async ({ client, assert }) => {
    const usuario = await UsuarioFactory.create()
    const response = await client
      .post('/imagens')
      .file('imagem', createReadStream(`${assets}/imagem-512x512.jpg`))
      .loginAs(usuario)

    response.assertStatus(200)

    assert.isNotNull(response.body().fileName)
    assert.isNotNull(response.body().usuarioId)
    assert.isTrue(await Drive.fake().exists(response.body().fileName))

    const storagedFile = await Drive.fake().get(response.body().fileName)
    assert.equal(response.body().usuarioId, usuario.id)
    readFile(`${assets}/imagem-512x512.jpg`, async (err, data) => {
      assert.isNull(err)
      assert.isTrue(storagedFile.equals(data))
    })
  })

  test('armazenar uma imagem de pet com sucesso', async ({ client, assert }) => {
    const usuario = await UsuarioFactory.create()
    const pet = await PetFactory.merge({ usuarioId: usuario.id }).create()
    const response = await client
      .post('/imagens')
      .file('imagem', createReadStream(`${assets}/imagem-512x512.jpg`))
      .field('petId', pet.id)
      .loginAs(usuario)

    response.assertStatus(200)

    assert.isNotNull(response.body().fileName)
    assert.isNotNull(response.body().petId)
    assert.isTrue(await Drive.fake().exists(response.body().fileName))

    const storagedFile = await Drive.fake().get(response.body().fileName)
    assert.equal(response.body().petId, pet.id)
    readFile(`${assets}/imagem-512x512.jpg`, async (err, data) => {
      assert.isNull(err)
      assert.isTrue(storagedFile.equals(data))
    })
  })

  test('exigir autenticação e autorizção para armazenar imagem de um usuário', async ({
    client,
  }) => {
    await UsuarioFactory.create()
    const response = await client
      .post('/imagens')
      .file('imagem', createReadStream(`${assets}/imagem-512x512.jpg`))

    response.assertStatus(401)
  })

  test('exigir autenticação e autorizção para que somente o dono de um pet possa armazenar imagem', async ({
    client,
  }) => {
    const fulano = await UsuarioFactory.create()
    const pet = await PetFactory.merge({ usuarioId: fulano.id }).create()
    let response = await client
      .post('/imagens')
      .file('imagem', createReadStream(`${assets}/imagem-512x512.jpg`))
      .field('petId', pet.id)

    response.assertStatus(401)

    const cicrano = await UsuarioFactory.create()
    response = await client
      .post('/imagens')
      .file('imagem', createReadStream(`${assets}/imagem-512x512.jpg`))
      .field('petId', pet.id)
      .loginAs(cicrano)

    response.assertStatus(401)
  })

  test('exigir imagem no corpo da requisição', async ({ client }) => {
    const usuario = await UsuarioFactory.create()
    const response = await client.post('/imagens').loginAs(usuario)
    response.assertStatus(422)
  })

  test('permitir imagem no formato jpg', async ({ client, assert }) => {
    const usuario = await UsuarioFactory.create()
    const pet = await PetFactory.merge({ usuarioId: usuario.id }).create()

    const response = await client
      .post('/imagens')
      .file('imagem', createReadStream(`${assets}/imagem-512x512.jpg`))
      .field('petId', pet.id)
      .loginAs(usuario)

    response.assertStatus(200)

    assert.isNotNull(response.body().fileName)
    assert.isNotNull(response.body().petId)
    assert.isTrue(await Drive.fake().exists(response.body().fileName))

    const storagedFile = await Drive.fake().get(response.body().fileName)
    assert.equal(response.body().petId, pet.id)
    readFile(`${assets}/imagem-512x512.jpg`, async (err, data) => {
      assert.isNull(err)
      assert.isTrue(storagedFile.equals(data))
    })
  })

  test('permitir imagem no formato jpeg', async ({ client, assert }) => {
    const usuario = await UsuarioFactory.create()
    const pet = await PetFactory.merge({ usuarioId: usuario.id }).create()

    const response = await client
      .post('/imagens')
      .file('imagem', createReadStream(`${assets}/imagem-512x512.jpeg`))
      .field('petId', pet.id)
      .loginAs(usuario)

    response.assertStatus(200)

    assert.isNotNull(response.body().fileName)
    assert.isNotNull(response.body().petId)
    assert.isTrue(await Drive.fake().exists(response.body().fileName))

    const storagedFile = await Drive.fake().get(response.body().fileName)
    assert.equal(response.body().petId, pet.id)
    readFile(`${assets}/imagem-512x512.jpeg`, async (err, data) => {
      assert.isNull(err)
      assert.isTrue(storagedFile.equals(data))
    })
  })

  test('permitir imagem no formato png', async ({ client, assert }) => {
    const usuario = await UsuarioFactory.create()
    const pet = await PetFactory.merge({ usuarioId: usuario.id }).create()

    const response = await client
      .post('/imagens')
      .file('imagem', createReadStream(`${assets}/imagem-512x512.png`))
      .field('petId', pet.id)
      .loginAs(usuario)

    response.assertStatus(200)

    assert.isNotNull(response.body().fileName)
    assert.isNotNull(response.body().petId)
    assert.isTrue(await Drive.fake().exists(response.body().fileName))

    const storagedFile = await Drive.fake().get(response.body().fileName)
    assert.equal(response.body().petId, pet.id)
    readFile(`${assets}/imagem-512x512.png`, async (err, data) => {
      assert.isNull(err)
      assert.isTrue(storagedFile.equals(data))
    })
  })

  test('proibir imagem fora dos formatos jpg, jpeg e png', async ({ client }) => {
    const usuario = await UsuarioFactory.create()
    const pet = await PetFactory.merge({ usuarioId: usuario.id }).create()

    const response = await client
      .post('/imagens')
      .file('imagem', createReadStream(`${assets}/imagem-512x512.webp`))
      .field('petId', pet.id)
      .loginAs(usuario)

    response.assertStatus(422)
  })

  test('proibir imagem com tamanho maior do que 2 MB', async ({ client }) => {
    const usuario = await UsuarioFactory.create()
    const pet = await PetFactory.merge({ usuarioId: usuario.id }).create()

    const response = await client
      .post('/imagens')
      .file('imagem', createReadStream(`${assets}/imagem-6mb.jpg`))
      .field('petId', pet.id)
      .loginAs(usuario)

    response.assertStatus(422)
  })

  test('proibir que um usuário tenha mais do que uma imagem', async ({ client }) => {
    const usuario = await UsuarioFactory.create()
    await ImagemFactory.merge({ usuarioId: usuario.id }).create()

    const response = await client
      .post('/imagens')
      .file('imagem', createReadStream(`${assets}/imagem-512x512.jpg`))
      .loginAs(usuario)

    response.assertStatus(400)
  })

  test('proibir que um pet tenha mais do que 3 imagens', async ({ client }) => {
    const usuario = await UsuarioFactory.create()
    const pet = await PetFactory.merge({ usuarioId: usuario.id }).create()
    await ImagemFactory.merge({ petId: pet.id }).createMany(3)

    const response = await client
      .post('/imagens')
      .file('imagem', createReadStream(`${assets}/imagem-512x512.jpg`))
      .field('petId', pet.id)
      .loginAs(usuario)

    response.assertStatus(400)
  })
})
