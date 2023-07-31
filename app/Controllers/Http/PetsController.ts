//import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Pet from 'App/Models/Pet'
import { Situacao } from 'App/Models/Situacao'
import PetIndexValidator from 'App/Validators/PetIndexValidator'
import { DateTime } from 'luxon'
import PetStoreValidator from 'App/Validators/PetStoreValidator'
import PetUpdateValidator from 'App/Validators/PetUpdateValidator'
import Coordenada from 'App/Models/Coordenada'
import Cor from 'App/Models/Cor'

export default class PetsController {
  public async index({ request }) {
    await request.validate(PetIndexValidator)

    const anoPassado = DateTime.now().minus({ year: 1 }).toISO()!

    return await Pet.query()
      .where('visto_as', '>', anoPassado)
      .andWhere('situacao', Situacao.Perdido)
  }

  public async show({ request }) {
    const pet = await Pet.findOrFail(request.routeParams.id)
    await pet.load('vistoEm')
    await pet.load('cores')
    return pet
  }

  public async store({ request, auth }) {
    await request.validate(PetStoreValidator)
    const usuario = await auth.use('api').authenticate()

    const pet = await new Pet()
      .fill({
        nome: request.body()['nome'],
        especie: request.body()['especie'],
        situacao: request.body()['situacao'],
        comentario: request.body()['comentario'],
        vistoAs: DateTime.fromISO(request.body()['vistoAs']),
        usuarioId: usuario.id,
      })
      .save()

    const vistoEm = new Coordenada()
    vistoEm.latitude = request.body().vistoEm.latitude
    vistoEm.longitude = request.body().vistoEm.longitude
    vistoEm.petId = pet.id
    await vistoEm.save()
    await pet.load('vistoEm')

    const cores = await Cor.query().whereIn('valor', request.body().cores)
    const ids = cores.map((e) => e.id)
    await pet.related('cores').attach(ids)
    await pet.load('cores')

    return pet
  }

  public async update({ request, response, auth }) {
    await request.validate(PetUpdateValidator)
    const usuario = await auth.use('api').authenticate()

    const pet = await Pet.findOrFail(request.routeParams.id)
    if (pet.usuarioId !== usuario.id) return response.unauthorized()

    pet.merge({
      nome: request.body()['nome'],
      especie: request.body()['especie'],
      situacao: request.body()['situacao'],
      comentario: request.body()['comentario'],
    })
    await pet.save()

    if (request.body()['vistoAs']) {
      pet.vistoAs = DateTime.fromISO(request.body()['vistoAs'])
    }

    if (request.body()['cores']) {
      const cores = await Cor.query().whereIn('valor', request.body()['cores'])
      await pet.related('cores').detach()
      await pet.related('cores').attach(cores.map((cor) => cor.id))
      await pet.load('cores')
    }

    if (request.body()['vistoEm']) {
      const coordenadas = await Coordenada.findByOrFail('petId', pet.id)
      coordenadas.merge({
        latitude: request.body()['vistoEm'].latitude,
        longitude: request.body()['vistoEm'].longitude,
      })
      await coordenadas.save()
      await pet.load('vistoEm')
    }

    return pet
  }

  public async destroy({ request, response, auth }) {
    const usuario = await auth.use('api').authenticate()
    const pet = await Pet.findOrFail(request.routeParams.id)
    if (pet.usuarioId !== usuario.id) return response.unauthorized()
    return pet.delete()
  }
}
