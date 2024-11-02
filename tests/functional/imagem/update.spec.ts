import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import ImagemFactory from 'Database/factories/ImagemFactory'
import UsuarioFactory from 'Database/factories/UsuarioFactory'
import { createReadStream, readFile } from 'fs'
import Drive from '@ioc:Adonis/Core/Drive'
import PetFactory from 'Database/factories/PetFactory'

test.group('Imagem update', (group) => {
  const assets = './tests/functional/imagem/assets'

  group.each.setup(async () => {
    Drive.fake()
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  group.each.teardown(async () => {
    Drive.restore()
  })

  test('atualizar uma imagem de usuário com sucesso', async ({ client, assert }) => {
    const usuario = await UsuarioFactory.create()
    ImagemFactory.merge({
      usuarioId: usuario.id,
      fileName: 'imagem-1.jpg',
    }).create()

    const response = await client
      .patch('/imagens')
      .file('imagem', createReadStream(`${assets}/imagem-2.jpg`))
      .loginAs(usuario)

    response.assertStatus(200)
    assert.equal(response.body().usuarioId, usuario.id)

    const storagedFile = await Drive.get(response.body().fileName)
    readFile(`${assets}/imagem-2.jpg`, async (err, data) => {
      assert.isNull(err)
      assert.isTrue(storagedFile.equals(data))
    })
  })

  test('atualizar uma imagem de pet com sucesso', async ({ client, assert }) => {
    const usuario = await UsuarioFactory.create()
    const pet = await PetFactory.merge({ usuarioId: usuario.id }).create()
    await ImagemFactory.merge({ petId: pet.id, fileName: `imagem-1.jpg` }).create()

    const response = await client
      .patch(`/imagens`)
      .fields({ petId: pet.id, index: 0 })
      .file('imagem', createReadStream(`${assets}/imagem-2.jpg`))
      .loginAs(usuario)

    const storagedFile = await Drive.get(response.body().fileName)

    response.assertStatus(200)
    assert.equal(response.body().petId, pet.id)
    readFile(`${assets}/imagem-2.jpg`, async (err, data) => {
      assert.isNull(err)
      assert.isTrue(storagedFile.equals(data))
    })
  })

  test('falhar ao atualizar por uma imagem de pet sem informar o index', async ({ client }) => {
    const usuario = await UsuarioFactory.create()
    const pet = await PetFactory.merge({ usuarioId: usuario.id }).create()

    const response = await client
      .patch(`/imagens`)
      .fields({ petId: pet.id })
      .file('imagem', createReadStream(`${assets}/imagem-512x512.jpg`))
      .loginAs(usuario)

    response.assertStatus(422)
  })

  test('falhar ao atualizar uma imagem com index maior do que 2', async ({ client }) => {
    const usuario = await UsuarioFactory.create()
    const pet = await PetFactory.merge({ usuarioId: usuario.id }).create()

    const response = await client
      .patch(`/imagens`)
      .fields({ petId: pet.id, index: 3 })
      .file('imagem', createReadStream(`${assets}/imagem-512x512.jpg`))
      .loginAs(usuario)

    response.assertStatus(422)
  })

  test('falhar caso uma imagem de pet não for encontrada', async ({ client }) => {
    const usuario = await UsuarioFactory.create()
    const pet = await PetFactory.merge({ usuarioId: usuario.id }).create()

    const response = await client
      .patch(`/imagens`)
      .fields({ petId: pet.id, index: 0 })
      .file('imagem', createReadStream(`${assets}/imagem-512x512.jpg`))
      .loginAs(usuario)

    response.assertStatus(404)
  })

  test('falhar caso uma imagem de pet com index maior do que a quantidade armazenada', async ({
    client,
  }) => {
    const usuario = await UsuarioFactory.create()
    const pet = await PetFactory.merge({ usuarioId: usuario.id }).create()
    await ImagemFactory.merge({ petId: pet.id }).create()

    const response = await client
      .patch(`/imagens`)
      .fields({ petId: pet.id, index: 1 })
      .file('imagem', createReadStream(`${assets}/imagem-512x512.jpg`))
      .loginAs(usuario)

    response.assertStatus(404)
  })

  test('exigir autenticação e autorizção para atualizar imagem de um usuário', async ({
    client,
  }) => {
    const usuario = await UsuarioFactory.create()
    ImagemFactory.merge({
      usuarioId: usuario.id,
      fileName: 'imagem-1.jpg',
    }).create()

    const response = await client
      .patch('/imagens')
      .file('imagem', createReadStream(`${assets}/imagem-2.jpg`))

    response.assertStatus(401)
  })

  test('exigir autenticação e autorizção para que somente o dono de um pet possa atualizar imagem', async ({
    client,
  }) => {
    const fulano = await UsuarioFactory.create()
    const pet = await PetFactory.merge({ usuarioId: fulano.id }).create()
    await ImagemFactory.merge({ petId: pet.id }).create()

    const cicrano = await UsuarioFactory.create()
    const response = await client
      .patch('/imagens')
      .file('imagem', createReadStream(`${assets}/imagem-512x512.jpg`))
      .fields({ petId: pet.id, index: 0 })
      .loginAs(cicrano)

    response.assertStatus(401)
  })

  test('exigir imagem no corpo da requisição', async ({ client }) => {
    const usuario = await UsuarioFactory.create()
    const pet = await PetFactory.merge({ usuarioId: usuario.id }).create()
    await ImagemFactory.merge({ petId: pet.id, fileName: `imagem-1.jpg` }).create()

    const response = await client
      .patch(`/imagens`)
      .fields({ petId: pet.id, index: 0 })
      .loginAs(usuario)

    response.assertStatus(422)
  })

  test('permitir imagem no formato jpg', async ({ client, assert }) => {
    const usuario = await UsuarioFactory.create()
    const pet = await PetFactory.merge({ usuarioId: usuario.id }).create()
    await ImagemFactory.merge({ petId: pet.id, fileName: `imagem-512x512.jpg` }).create()

    const response = await client
      .patch(`/imagens`)
      .fields({ petId: pet.id, index: 0 })
      .file('imagem', createReadStream(`${assets}/imagem-512x512.jpg`))
      .loginAs(usuario)

    response.assertStatus(200)

    assert.isNotNull(response.body().fileName)
    assert.isNotNull(response.body().petId)
    console.log(`response.body(): ${JSON.stringify(response.body())}`)
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
    await ImagemFactory.merge({ petId: pet.id, fileName: `imagem-512x512.jpeg` }).create()

    const response = await client
      .patch(`/imagens`)
      .fields({ petId: pet.id, index: 0 })
      .file('imagem', createReadStream(`${assets}/imagem-512x512.jpeg`))
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
    await ImagemFactory.merge({ petId: pet.id, fileName: `imagem-512x512.jpg` }).create()

    const response = await client
      .patch(`/imagens`)
      .fields({ petId: pet.id, index: 0 })
      .file('imagem', createReadStream(`${assets}/imagem-512x512.png`))
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
    await ImagemFactory.merge({ petId: pet.id, fileName: `imagem-1.jpg` }).create()

    const response = await client
      .patch(`/imagens`)
      .fields({ petId: pet.id, index: 0 })
      .file('imagem', createReadStream(`${assets}/imagem-512x512.webp`))
      .loginAs(usuario)

    response.assertStatus(422)
  })

  test('proibir imagem com tamanho maior do que 2 MB', async ({ client }) => {
    const usuario = await UsuarioFactory.create()
    ImagemFactory.merge({
      usuarioId: usuario.id,
      fileName: 'imagem-512x512.jpg',
    }).create()

    const response = await client
      .patch('/imagens')
      .file('imagem', createReadStream(`${assets}/imagem-6mb.jpg`))
      .loginAs(usuario)

    response.assertStatus(422)
  })
})
