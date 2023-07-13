import Pet from 'App/Models/Pet'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { Situacao } from 'App/Models/Situacao'
import { DateTime } from 'luxon'

export default Factory.define(Pet, () => {
  return {
    vistoAs: DateTime.now(),
    situacao: Situacao.Perdido,
  }
}).build()
