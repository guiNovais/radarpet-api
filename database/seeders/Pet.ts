import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Coordenada from 'App/Models/Coordenada'
import { Especie } from 'App/Models/Especie'
import Pet from 'App/Models/Pet'
import { Situacao } from 'App/Models/Situacao'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  public async run() {
    const agora = DateTime.now()
    await Pet.createMany([
      {
        id: 1,
        nome: 'Chico',
        especie: Especie.Cachorro,
        situacao: Situacao.Perdido,
        comentario:
          'Culpa ullamco commodo laboris aute. Fugiat minim Lorem aute nostrud adipisicing eu ea exercitation voluptate non. Lorem ad velit ipsum esse cillum et nisi culpa esse ullamco aliquip fugiat. Velit sit reprehenderit nisi eiusmod aliquip pariatur consectetur mollit. Nulla quis proident deserunt ad Lorem aliquip. Veniam consequat irure Lorem adipisicing pariatur.',
        vistoAs: agora,
      },
      {
        id: 2,
        nome: 'Pluto',
        especie: Especie.Cachorro,
        situacao: Situacao.Perdido,
        comentario:
          'Eiusmod velit ex id officia nulla nulla mollit commodo qui. Eiusmod aliquip ad cillum ipsum deserunt minim amet consequat. Ut adipisicing elit nisi cillum dolore deserunt adipisicing cillum nulla nulla eiusmod labore. Enim incididunt incididunt nulla aute aute ipsum deserunt Lorem do laboris mollit nulla.',
        vistoAs: agora,
      },
      {
        id: 3,
        nome: 'Mingau',
        especie: Especie.Gato,
        situacao: Situacao.Perdido,
        vistoAs: agora,
      },
    ])
    await Coordenada.createMany([
      {
        petId: 1,
        latitude: 0,
        longitude: 0,
      },
      {
        petId: 2,
        latitude: 0,
        longitude: 0,
      },
      {
        petId: 3,
        latitude: 0,
        longitude: 0,
      },
    ])
  }
}
