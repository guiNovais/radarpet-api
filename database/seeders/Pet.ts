import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Pet from 'App/Models/Pet'
import { Situacao } from 'App/Models/Situacao'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  public async run() {
    const agora = DateTime.now()
    await Pet.createMany([
      { situacao: Situacao.Perdido, vistoAs: agora },
      { situacao: Situacao.Perdido, vistoAs: agora },
      { situacao: Situacao.Perdido, vistoAs: agora },
    ])
  }
}
