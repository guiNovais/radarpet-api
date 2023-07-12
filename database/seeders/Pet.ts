import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Pet from 'App/Models/Pet'

export default class extends BaseSeeder {
  public async run() {
    await Pet.createMany([{}, {}, {}])
  }
}
