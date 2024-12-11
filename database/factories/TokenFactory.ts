import Token from 'App/Models/Token'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { cuid } from '@ioc:Adonis/Core/Helpers'

export default Factory.define(Token, ({ faker }) => {
  return {
    valor: cuid(),
  }
}).build()
