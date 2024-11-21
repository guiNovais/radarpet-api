import { DateTime } from 'luxon'
import {
  BaseModel,
  HasMany,
  HasOne,
  beforeSave,
  column,
  hasMany,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'
import Pet from './Pet'
import Hash from '@ioc:Adonis/Core/Hash'
import Imagem from './Imagem'

export default class Usuario extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public nome: string

  @column()
  public email: string

  @column()
  public telefone: string

  @hasMany(() => Pet)
  public pet: HasMany<typeof Pet>

  @column({ serializeAs: null })
  public password: string

  @hasOne(() => Imagem)
  public imagem: HasOne<typeof Imagem>

  @beforeSave()
  public static async hashPassword(usuario: Usuario) {
    if (usuario.$dirty.password) {
      usuario.password = await Hash.make(usuario.password)
    }
  }
}
