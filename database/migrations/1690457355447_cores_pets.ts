import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'cores_pets'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.integer('cor_id').unsigned().references('cores.id')
      table.integer('pet_id').unsigned().references('pets.id')
      table.unique(['cor_id', 'pet_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
