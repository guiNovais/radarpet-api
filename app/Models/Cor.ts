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
