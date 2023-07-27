import { BaseModel, HasOne, ManyToMany, column, hasOne, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Coordenada from './Coordenada'
import Cor from './Cor'
import { Especie } from './Especie'
import { Situacao } from './Situacao'
import Usuario from './Usuario'

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
  public especie: Especie

  @column()
  public situacao: Situacao

  @column()
  public comentario?: string

  @column.dateTime({ serializeAs: 'vistoAs' })
  public vistoAs: DateTime

  @hasOne(() => Coordenada, { serializeAs: 'vistoEm' })
  public vistoEm: HasOne<typeof Coordenada>

  @hasOne(() => Usuario)
  public usuario: HasOne<typeof Usuario>

  @column({ serializeAs: 'usuarioId' })
  public usuarioId: number

  @manyToMany(() => Cor, {
    pivotTable: 'cores_pets',
  })
  public cores: ManyToMany<typeof Cor>
}
