import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Pet from 'App/Models/Pet'
import { Situacao } from 'App/Models/Situacao'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  public async run() {
    const agora = DateTime.now()
    await Pet.createMany([
      {
        nome: 'Chico',
        especie: 'Cachorro',
        cor: 'Amarelo',
        situacao: Situacao.Perdido,
        comentario:
          'Culpa ullamco commodo laboris aute. Fugiat minim Lorem aute nostrud adipisicing eu ea exercitation voluptate non. Lorem ad velit ipsum esse cillum et nisi culpa esse ullamco aliquip fugiat. Velit sit reprehenderit nisi eiusmod aliquip pariatur consectetur mollit. Nulla quis proident deserunt ad Lorem aliquip. Veniam consequat irure Lorem adipisicing pariatur.',
        vistoAs: agora,
      },
      {
        nome: 'Pluto',
        especie: 'Cachorro',
        cor: 'Amarelo',
        situacao: Situacao.Perdido,
        comentario:
          'Eiusmod velit ex id officia nulla nulla mollit commodo qui. Eiusmod aliquip ad cillum ipsum deserunt minim amet consequat. Ut adipisicing elit nisi cillum dolore deserunt adipisicing cillum nulla nulla eiusmod labore. Enim incididunt incididunt nulla aute aute ipsum deserunt Lorem do laboris mollit nulla.',
        vistoAs: agora,
      },
      {
        nome: 'Mingau',
        especie: 'Gato',
        cor: 'Branco',
        situacao: Situacao.Perdido,
        vistoAs: agora,
      },
    ])
  }
}
