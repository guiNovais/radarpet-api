import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Cor, { Opcoes } from 'App/Models/Cor'

export default class extends BaseSeeder {
  public async run() {
    await Cor.createMany([
      { valor: Opcoes.Amarelo },
      { valor: Opcoes.Azul },
      { valor: Opcoes.Branco },
      { valor: Opcoes.Cinza },
      { valor: Opcoes.Laranja },
      { valor: Opcoes.Preto },
      { valor: Opcoes.Roxo },
      { valor: Opcoes.Verde },
      { valor: Opcoes.Vermelho },
    ])
  }
}
