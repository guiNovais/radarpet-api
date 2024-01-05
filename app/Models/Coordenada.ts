import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Pet from './Pet'

export default class Coordenada extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public latitude: number

  @column()
  public longitude: number

  @column()
  public petId: number

  @belongsTo(() => Pet)
  public pet: BelongsTo<typeof Pet>
}
