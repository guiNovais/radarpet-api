import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Usuario from './Usuario'
import Pet from './Pet'

export default class Imagem extends BaseModel {
  public static table = 'imagens'

  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column({ serializeAs: 'fileName' })
  public fileName: string

  @column({ serializeAs: 'usuarioId' })
  public usuarioId: number

  @belongsTo(() => Usuario)
  public usuario: BelongsTo<typeof Usuario>

  @column({ serializeAs: 'petId' })
  public petId: number

  @belongsTo(() => Pet)
  public pet: BelongsTo<typeof Pet>
}
