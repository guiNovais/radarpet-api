import Coordenadas from 'App/Models/Coordenada'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Coordenadas, ({ faker }) => {
  return {
    latitude: faker.number.float({ min: -90, max: 90, precision: 0.000001 }),
    longitude: faker.number.float({ min: -180, max: 180, precision: 0.000001 }),
  } as Coordenadas
}).build()
