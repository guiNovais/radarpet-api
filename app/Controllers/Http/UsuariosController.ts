// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Usuario from 'App/Models/Usuario'
import UsuarioStoreValidator from 'App/Validators/UsuarioStoreValidator'

export default class UsuariosController {
  public async show({ request }) {
    return Usuario.findOrFail(request.routeParams.id)
  }

  public async store({ request }) {
    await request.validate(UsuarioStoreValidator)
    return Usuario.create(request.body())
  }
}
