import { cuid } from '@ioc:Adonis/Core/Helpers'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Token, { Status, Tipo } from 'App/Models/Token'
import { DateTime } from 'luxon'

export default class AuthController {
  public async login({ auth, request }: HttpContextContract) {
    return await auth.use('api').attempt(request.input('email'), request.input('password'))
  }

  public async logout({ auth }) {
    return await auth.use('api').logout()
  }

  public async token({ request }: HttpContextContract) {
    const token = await request.param('id')

    const umaHoraAtras = DateTime.now().minus({ hours: 1 }).toFormat('yyyy-MM-dd HH:mm:ss')
    const verifyToken = await Database.query()
      .select('*')
      .from('operation_tokens as ot')
      .where('ot.valor', '=', token)
      .andWhere('ot.tipo', '=', Tipo.Verificar)
      .andWhere('ot.status', '=', Status.Ativo)
      .andWhere('ot.created_at', '>=', umaHoraAtras)
      .orderBy('ot.created_at', 'desc')
      .firstOrFail()

    const defineToken = await Token.create({
      tipo: Tipo.Definir,
      status: Status.Ativo,
      usuarioId: verifyToken.usuario_id,
      valor: cuid(),
    })

    await Token.updateOrCreate({ id: verifyToken.id }, { status: Status.Inativo })

    return defineToken
  }
}
