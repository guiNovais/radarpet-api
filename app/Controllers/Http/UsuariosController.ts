// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Mail from '@ioc:Adonis/Addons/Mail'
import Usuario from 'App/Models/Usuario'
import UsuarioStoreValidator from 'App/Validators/UsuarioStoreValidator'
import UsuarioUpdateValidator from 'App/Validators/UsuarioUpdateValidator'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import Token, { Status, Tipo } from 'App/Models/Token'

export default class UsuariosController {
  public async show({ request }) {
    return Usuario.findOrFail(request.routeParams.id)
  }

  public async store({ request }) {
    const body = await request.validate(UsuarioStoreValidator)
    const usuario = await Usuario.create(body)

    const token = cuid()
    await Token.create({
      usuarioId: usuario.id,
      valor: token,
      tipo: Tipo.Verificar,
      status: Status.Ativo,
    })

    await Mail.send((message) => {
      message
        .from('no-reply@example.com')
        .to(body.email)
        .subject('Ative sua conta RadarPet')
        .text(`Seu código de ativação do RadarPet é: ${token}`)
    })

    return usuario
  }

  public async update({ request, auth }) {
    await request.validate(UsuarioUpdateValidator)
    const usuarioAutenticado = await auth.use('api').authenticate()
    const usuario = await Usuario.findOrFail(usuarioAutenticado.id)

    usuario.merge({
      nome: request.body()['nome'],
      telefone: request.body()['telefone'],
      email: request.body()['email'],
    })

    return usuario.save()
  }

  public async destroy({ auth }) {
    const usuarioAutenticado = await auth.use('api').authenticate()
    const usuario = await Usuario.findOrFail(usuarioAutenticado.id)
    return usuario.delete()
  }
}
