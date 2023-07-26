import Pet from 'App/Models/Pet'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { Situacao } from 'App/Models/Situacao'
import { DateTime } from 'luxon'
import { Especie } from 'App/Models/Especie'
import { sample } from 'lodash'

export default Factory.define(Pet, ({ faker }) => {
  return {
    nome: faker.person.firstName(),
    especie: sample(Especie),
    situacao: sample(Situacao),
    comentario: faker.lorem.paragraph(),
    vistoAs: DateTime.now().startOf('second'),
  }
}).build()
