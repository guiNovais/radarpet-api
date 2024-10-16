// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Usuario from 'App/Models/Usuario'
import UsuarioStoreValidator from 'App/Validators/UsuarioStoreValidator'
import UsuarioUpdateValidator from 'App/Validators/UsuarioUpdateValidator'

export default class UsuariosController {
  public async show({ request }) {
    return Usuario.findOrFail(request.routeParams.id)
  }

  public async store({ request }) {
    await request.validate(UsuarioStoreValidator)
    return Usuario.create(request.body())
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
