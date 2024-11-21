import Factory from '@ioc:Adonis/Lucid/Factory'
import Usuario from 'App/Models/Usuario'

export default Factory.define(Usuario, async ({ faker }) => {
  return {
    nome: faker.person.firstName(),
    email: faker.internet.email(),
    telefone: faker.phone.number('(##) 9####-####'),
  }
}).build()
