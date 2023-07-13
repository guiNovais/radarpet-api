// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Pet from 'App/Models/Pet'
import { Situacao } from 'App/Models/Situacao'
import PetIndexValidator from 'App/Validators/PetIndexValidator'
import { DateTime } from 'luxon'

export default class PetsController {
  public async index({ request }) {
    await request.validate(PetIndexValidator)

    const anoPassado = DateTime.now().minus({ year: 1 }).toISO()!

    return await Pet.query()
      .where('visto_as', '>', anoPassado)
      .andWhere('situacao', Situacao.Perdido)
  }
}
