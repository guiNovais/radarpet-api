import BaseSchema from '@ioc:Adonis/Lucid/Schema'

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
      table.string('especie')
      table.string('cor')
      table.string('situacao')
      table.string('comentario')
      table.timestamp('visto_as')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
