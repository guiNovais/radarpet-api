import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Cor from 'App/Models/Cor'

export default class extends BaseSeeder {
  public async run() {
    await Cor.createMany([
      { id: 1, valor: 'Amarelo' },
      { id: 2, valor: 'Azul' },
      { id: 3, valor: 'Branco' },
      { id: 4, valor: 'Cinza' },
      { id: 5, valor: 'Laranja' },
      { id: 6, valor: 'Preto' },
      { id: 7, valor: 'Roxo' },
      { id: 8, valor: 'Verde' },
      { id: 9, valor: 'Vermelho' },
    ])
  }
}
