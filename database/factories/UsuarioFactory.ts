import Usuario from 'App/Models/Usuario'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Usuario, ({ faker }) => {
  return {
    id: faker.number.int(),
    nome: faker.person.firstName(),
    email: faker.internet.email(),
    telefone: faker.phone.number('(##) 9####-####'),
  }
}).build()
