//import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Pet from 'App/Models/Pet'
import { Situacao } from 'App/Models/Situacao'
import PetIndexValidator from 'App/Validators/PetIndexValidator'
import { DateTime } from 'luxon'
import PetStoreValidator from 'App/Validators/PetStoreValidator'

export default class PetsController {
  public async index({ request }) {
    await request.validate(PetIndexValidator)

    const anoPassado = DateTime.now().minus({ year: 1 }).toISO()!

    return await Pet.query()
      .where('visto_as', '>', anoPassado)
      .andWhere('situacao', Situacao.Perdido)
  }

  public async show({ request }) {
    return await Pet.findOrFail(request.routeParams.id)
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
    return await pet.save()
  }
}
