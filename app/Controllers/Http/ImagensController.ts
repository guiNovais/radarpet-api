// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Imagem from 'App/Models/Imagem'
import Pet from 'App/Models/Pet'
import ImagemStoreValidator from 'App/Validators/ImagemStoreValidator'
import Drive from '@ioc:Adonis/Core/Drive'
import Database from '@ioc:Adonis/Lucid/Database'
import ImagemShowValidator from 'App/Validators/ImagemShowValidator'

export default class ImagensController {
  public async show({ request, response }) {
    const queryParams = await request.validate(ImagemShowValidator)
    const keys = Object.keys(queryParams)

    if (keys.includes('usuarioId'))
      return await Drive.get(
        (
          await Imagem.findByOrFail('usuarioId', queryParams.usuarioId)
        ).fileName
      )

    const files = await Database.query()
      .select('file_name')
      .from('imagens as i')
      .innerJoin('pets as p', 'p.id', 'i.pet_id')
      .orderBy('i.updated_at')
    return files[queryParams.index]
      ? await Drive.get(files[queryParams.index].file_name)
      : response.notFound()
  }

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
