// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Imagem from 'App/Models/Imagem'
import Pet from 'App/Models/Pet'
import ImagemStoreValidator from 'App/Validators/ImagemStoreValidator'

export default class ImagensController {
  public async store({ request, response, auth }) {
    const usuario = await auth.use('api').authenticate()
    const body = await request.validate(ImagemStoreValidator)
    let pet: Pet | null = null

    if (body.petId) {
      pet = await Pet.findOrFail(body.petId)
      if (usuario.id !== pet.usuarioId) return response.unauthorized()
      await pet.load('imagem')
      if (pet.imagem.length >= 3) return response.badRequest()
    } else {
      await usuario.load('imagem')
      if (usuario.imagem) return response.badRequest()
    }

    await body.imagem.moveToDisk('./')

    const data = pet
      ? {
          fileName: body.imagem.fileName,
          petId: pet.id,
        }
      : {
          fileName: body.imagem.fileName,
          usuarioId: usuario.id,
        }
    return new Imagem().fill(data).save()
  }
}
