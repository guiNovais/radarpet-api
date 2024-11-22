import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Usuario from './Usuario'

export default class Token extends BaseModel {
  public static table = 'operation_tokens'

  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public valor: string

  @column({ serializeAs: 'usuarioId' })
  public usuarioId: number

  @belongsTo(() => Usuario)
  public usuario: BelongsTo<typeof Usuario>

  @column()
  public tipo: Tipo

  @column()
  public status: Status
}

export enum Tipo {
  Verificar = 'Verificar',
  Definir = 'Definir',
}

export enum Status {
  Ativo = 'Ativo',
  Inativo = 'Inativo',
}
