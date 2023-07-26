import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { Especie } from 'App/Models/Especie'
import { Situacao } from 'App/Models/Situacao'

export default class extends BaseSchema {
  protected tableName = 'pets'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.string('nome')
      table.enum('especie', Object.values(Especie))
      table.enum('situacao', Object.values(Situacao))
      table.string('comentario')
      table.timestamp('visto_as')
      table.integer('usuario_id').unique().unsigned().references('usuarios.id').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
