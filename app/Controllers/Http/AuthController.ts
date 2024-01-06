import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async login({ auth, request }: HttpContextContract) {
    return await auth.use('api').attempt(request.input('email'), request.input('password'))
  }
}
