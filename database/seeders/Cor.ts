import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Cor from 'App/Models/Cor'

export default class extends BaseSeeder {
  public async run() {
    await Cor.createMany([
      { valor: 'Amarelo' },
      { valor: 'Azul' },
      { valor: 'Branco' },
      { valor: 'Cinza' },
      { valor: 'Laranja' },
      { valor: 'Preto' },
      { valor: 'Roxo' },
      { valor: 'Verde' },
      { valor: 'Vermelho' },
    ])
  }
}
