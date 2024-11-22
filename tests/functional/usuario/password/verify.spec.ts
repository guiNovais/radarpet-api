import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { Status, Tipo } from 'App/Models/Token'
import TokenFactory from 'Database/factories/TokenFactory'
import UsuarioFactory from 'Database/factories/UsuarioFactory'
import { DateTime } from 'luxon'

test.group('Usuario token verify', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('validar token com sucesso', async ({ client, assert }) => {
    const usuario = await UsuarioFactory.create()
    const verifyToken = await TokenFactory.merge({
      usuarioId: usuario.id,
      tipo: Tipo.Verificar,
      status: Status.Ativo,
    }).create()

    const response = await client.post(`/verify?token=${verifyToken.valor}`)
    response.assertStatus(200)

    await verifyToken.refresh()
    assert.equal(verifyToken.status, Status.Inativo)

    const defineToken = await Database.query()
      .select('*')
      .from('operation_tokens as ot')
      .innerJoin('usuarios as u', 'u.id', 'ot.usuario_id')
      .where('u.id', '=', usuario.id)
      .where('ot.tipo', '=', Tipo.Definir)
      .andWhere('ot.status', '=', Status.Ativo)
      .orderBy('ot.created_at', 'desc')
      .firstOrFail()
    assert.equal(response.body().valor, defineToken.valor)
  })

  test('falhar caso o token esteja expirado', async ({ client }) => {
    const usuario = await UsuarioFactory.create()
    const verifyToken = await TokenFactory.merge({
      createdAt: DateTime.now().minus({ hours: 1, minutes: 1 }),
      usuarioId: usuario.id,
      tipo: Tipo.Verificar,
      status: Status.Ativo,
    }).create()

    const response = await client.post(`/verify?token=${verifyToken.valor}`)
    response.assertStatus(404)
  })

  test('falhar caso o token já tenha sido utilizado', async ({ client }) => {
    const usuario = await UsuarioFactory.create()
    const verifyToken = await TokenFactory.merge({
      usuarioId: usuario.id,
      tipo: Tipo.Verificar,
      status: Status.Inativo,
    }).create()

    const response = await client.post(`/verify?token=${verifyToken.valor}`)
    response.assertStatus(404)
  })
})
