import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { Situacao } from './Situacao'

export default class Pet extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public nome: string

  @column()
  public especie: string

  @column()
  public cor: string

  @column()
  public situacao: Situacao

  @column()
  public comentario?: string

  @column.dateTime({ serializeAs: 'vistoAs' })
  public vistoAs: DateTime
}
