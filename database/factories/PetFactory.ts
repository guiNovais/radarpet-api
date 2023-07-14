import Pet from 'App/Models/Pet'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { Situacao } from 'App/Models/Situacao'
import { DateTime } from 'luxon'

export default Factory.define(Pet, ({ faker }) => {
  return {
    nome: faker.person.firstName(),
    especie: 'Cachorro',
    cor: 'Amarelo',
    situacao: Situacao.Perdido,
    comentario: faker.lorem.paragraph(),
    vistoAs: DateTime.now(),
  }
}).build()
