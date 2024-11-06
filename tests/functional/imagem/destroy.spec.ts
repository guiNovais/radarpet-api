import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Usuario from 'App/Models/Usuario'
import Drive from '@ioc:Adonis/Core/Drive'
import ImagemFactory from 'Database/factories/ImagemFactory'
import PetFactory from 'Database/factories/PetFactory'
import UsuarioFactory from 'Database/factories/UsuarioFactory'
import Pet from 'App/Models/Pet'

test.group('Imagem destroy', (group) => {
  group.each.setup(async () => {
    Drive.fake()
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  group.each.teardown(async () => {
    Drive.restore()
  })

  test('remover uma imagem de usuário com sucesso', async ({ client, assert }) => {
    const usuario = await UsuarioFactory.create()
    ImagemFactory.merge({ usuarioId: usuario.id }).create()

    const response = await client.delete('/imagens').loginAs(usuario)

    response.assertStatus(200)
    const usuarioAtualizado = await Usuario.findOrFail(usuario.id)
    await usuarioAtualizado.load('imagem')
    assert.isNull(usuarioAtualizado.imagem)
  })

  test('remover uma imagem de pet com sucesso', async ({ client, assert }) => {
    const usuario = await UsuarioFactory.create()
    const pet = await PetFactory.merge({ usuarioId: usuario.id }).create()
    await ImagemFactory.merge({ petId: pet.id }).create()

    const response = await client
      .delete(`/imagens`)
      .fields({ petId: pet.id, index: 0 })
      .loginAs(usuario)

    response.assertStatus(200)
    const petAtualizado = await Pet.findOrFail(pet.id)
    await petAtualizado.load('imagem')
    assert.isUndefined(pet.imagem)
  })

  test('falhar ao remover por uma imagem de pet sem informar o index', async ({ client }) => {
    const usuario = await UsuarioFactory.create()
    const pet = await PetFactory.merge({ usuarioId: usuario.id }).create()

    const response = await client.delete(`/imagens`).fields({ petId: pet.id }).loginAs(usuario)

    response.assertStatus(422)
  })

  test('falhar ao remover uma imagem com index maior do que 2', async ({ client }) => {
    const usuario = await UsuarioFactory.create()
    const pet = await PetFactory.merge({ usuarioId: usuario.id }).create()

    const response = await client
      .delete(`/imagens`)
      .fields({ petId: pet.id, index: 3 })
      .loginAs(usuario)

    response.assertStatus(422)
  })

  test('falhar caso uma imagem de pet não for encontrada', async ({ client }) => {
    const usuario = await UsuarioFactory.create()
    const pet = await PetFactory.merge({ usuarioId: usuario.id }).create()

    const response = await client
      .delete(`/imagens`)
      .fields({ petId: pet.id, index: 0 })
      .loginAs(usuario)

    response.assertStatus(404)
  }).tags(['imagem'])

  test('falhar caso uma imagem de pet com index maior do que a quantidade armazenada', async ({
    client,
  }) => {
    const usuario = await UsuarioFactory.create()
    const pet = await PetFactory.merge({ usuarioId: usuario.id }).create()
    await ImagemFactory.merge({ petId: pet.id }).create()

    const response = await client
      .delete(`/imagens`)
      .fields({ petId: pet.id, index: 1 })
      .loginAs(usuario)

    response.assertStatus(404)
  })

  test('exigir autenticação e autorizção para remover imagem de um usuário', async ({ client }) => {
    const usuario = await UsuarioFactory.create()
    ImagemFactory.merge({
      usuarioId: usuario.id,
      fileName: 'imagem-512x512.jpg',
    }).create()

    const response = await client.delete('/imagens')

    response.assertStatus(401)
  })

  test('exigir autenticação e autorizção para que somente o dono de um pet possa remover imagem', async ({
    client,
  }) => {
    const fulano = await UsuarioFactory.create()
    const pet = await PetFactory.merge({ usuarioId: fulano.id }).create()
    await ImagemFactory.merge({ petId: pet.id }).create()

    const cicrano = await UsuarioFactory.create()
    const response = await client
      .delete('/imagens')
      .fields({ petId: pet.id, index: 0 })
      .loginAs(cicrano)

    response.assertStatus(401)
  })
})
