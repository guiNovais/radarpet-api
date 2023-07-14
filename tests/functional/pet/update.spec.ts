import { test } from '@japa/runner'

test.group('Pet update', () => {
  test('atualizar todos os parâmetros de pet')

  test('atualizar cada parâmetro de pet individualmente')

  test('exigir que os parâmetros enumerados sejam válidos')

  test('proibir nome do pet maior do que 25 caracteres')

  test('proibir comentário maior do que 280 caracteres')

  test('permitir comentário ausente')

  test('falhar caso um pet não for encontrado')
})
