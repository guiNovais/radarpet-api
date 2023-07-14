import { test } from '@japa/runner'

test.group('Pet store', () => {
  test('armazenar um pet com sucesso')

  test('exigir parâmetros obrigatórios ao armazenar um pet')

  test('exigir que os parâmetros enumerados sejam válidos')

  test('proibir nome do pet maior do que 25 caracteres')

  test('proibir comentário maior do que 280 caracteres')

  test('permitir comentário ausente')
})
