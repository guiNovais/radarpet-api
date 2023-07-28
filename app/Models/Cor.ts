import { DateTime } from 'luxon'
import { BaseModel, ManyToMany, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Pet from './Pet'

export default class Cor extends BaseModel {
  public static table = 'cores'

  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public valor: string

  @manyToMany(() => Pet, {
    pivotTable: 'cores_pets',
  })
  public pets: ManyToMany<typeof Pet>
}

export enum Opcoes {
  Amarelo = 'Amarelo',
  Azul = 'Azul',
  Branco = 'Branco',
  Cinza = 'Cinza',
  Laranja = 'Laranja',
  Preto = 'Preto',
  Roxo = 'Roxo',
  Verde = 'Verde',
  Vermelho = 'Vermelho',
}
