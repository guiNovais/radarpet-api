import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Pet from 'App/Models/Pet'

export default class ImagensController {
  public async store({ request }: HttpContextContract) {
    const pet = await Pet.findOrFail(request.param('pet'))
    const imagem = request.file('imagem')
    await imagem?.moveToDisk('./')
  }
}
