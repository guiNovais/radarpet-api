//import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Pet from 'App/Models/Pet'
import { Situacao } from 'App/Models/Situacao'
import PetIndexValidator from 'App/Validators/PetIndexValidator'
import { DateTime } from 'luxon'
import PetStoreValidator from 'App/Validators/PetStoreValidator'
import PetUpdateValidator from 'App/Validators/PetUpdateValidator'
import Coordenada from 'App/Models/Coordenada'

export default class PetsController {
  public async index({ request }) {
    await request.validate(PetIndexValidator)

    const anoPassado = DateTime.now().minus({ year: 1 }).toISO()!

    return await Pet.query()
      .where('visto_as', '>', anoPassado)
      .andWhere('situacao', Situacao.Perdido)
  }

  public async show({ request }) {
    return await Pet.query()
      .select()
      .where('id', request.routeParams.id)
      .preload('vistoEm')
      .firstOrFail()
  }

  public async store({ request }) {
    await request.validate(PetStoreValidator)
    const pet = new Pet().fill({
      nome: request.body()['nome'],
      especie: request.body()['especie'],
      cor: request.body()['cor'],
      situacao: request.body()['situacao'],
      comentario: request.body()['comentario'],
      vistoAs: DateTime.fromISO(request.body()['vistoAs']),
    })
    let result = (await pet.save()).toJSON() as any

    const vistoEm = new Coordenada()
    vistoEm.latitude = request.body().vistoEm.latitude
    vistoEm.longitude = request.body().vistoEm.longitude
    vistoEm.petId = pet.id
    result.vistoEm = (await vistoEm.save()).toJSON()

    return result
  }

  public async update({ request }) {
    await request.validate(PetUpdateValidator)
    const pet = await Pet.findOrFail(request.routeParams.id)
    if (request.body()['vistoAs']) pet.vistoAs = DateTime.fromISO(request.body()['vistoAs'])

    pet.merge({
      nome: request.body()['nome'],
      especie: request.body()['especie'],
      cor: request.body()['cor'],
      situacao: request.body()['situacao'],
      comentario: request.body()['comentario'],
    })

    return await pet.save()
  }

  public async destroy({ request }) {
    const pet = await Pet.findOrFail(request.routeParams.id)
    return pet.delete()
  }
}
