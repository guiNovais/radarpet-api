// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Usuario from 'App/Models/Usuario'

export default class UsuariosController {
  public async show({ request }) {
    return Usuario.findOrFail(request.routeParams.id)
  }
}
