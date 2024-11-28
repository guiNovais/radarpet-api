// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Mail from '@ioc:Adonis/Addons/Mail'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Token, { Status, Tipo } from 'App/Models/Token'
import Usuario from 'App/Models/Usuario'
import DefinePasswordValidator from 'App/Validators/DefinePasswordValidator'
import { DateTime } from 'luxon'

export default class PasswordsController {
  public async define({ request, response }: HttpContextContract) {
    const body = await request.validate(DefinePasswordValidator)
    const token = await Token.findByOrFail('valor', body.token)

    if (token.tipo !== Tipo.Definir) return response.badRequest()
    if (token.status !== Status.Ativo) return response.badRequest()
    if (token.createdAt <= DateTime.now().minus({ hours: 1 })) return response.badRequest()

    await Usuario.updateOrCreate({ id: token.usuarioId }, { password: body.password })
    await token.merge({ status: Status.Inativo }).save()
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
