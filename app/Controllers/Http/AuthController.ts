import Mail from '@ioc:Adonis/Addons/Mail'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Token, { Status, Tipo } from 'App/Models/Token'
import Usuario from 'App/Models/Usuario'
import VerifyTokenValidator from 'App/Validators/VerifyTokenValidator'
import { DateTime } from 'luxon'

export default class AuthController {
  public async login({ auth, request }: HttpContextContract) {
    return await auth.use('api').attempt(request.input('email'), request.input('password'))
  }

  public async verify({ request }: HttpContextContract) {
    const { token } = await request.validate(VerifyTokenValidator)

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

  public async reset({ request }: HttpContextContract) {
    const { usuarioId } = request.params()
    const usuario = await Usuario.findOrFail(usuarioId)
    const token = await Token.create({
      usuarioId,
      status: Status.Ativo,
      tipo: Tipo.Verificar,
      valor: cuid(),
    })

    await Mail.send((message) => {
      message
        .from('no-reply@example.com')
        .to(usuario.email)
        .subject('Ative sua conta RadarPet')
        .text(`Seu código de ativação do RadarPet é: ${token.valor}`)
    })
  }
}
