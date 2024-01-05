/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import { validator } from '@ioc:Adonis/Core/Validator'

validator.rule('latitude', (value, _, options) => {
  if (typeof value !== 'string') {
    return
  }

  if (!value.match(/^-?\d{1,3}\.\d{6}$/)) {
    options.errorReporter.report(
      options.pointer,
      'latitude',
      'latitude validation failed',
      options.arrayExpressionPointer
    )
    return
  }

  const latitude = parseFloat(value)

  if (latitude > 90 || latitude < -90) {
    options.errorReporter.report(
      options.pointer,
      'latitude',
      'range validation failed',
      options.arrayExpressionPointer
    )
  }
})

validator.rule('longitude', (value, _, options) => {
  if (typeof value !== 'string') {
    return
  }

  if (!value.match(/^-?\d{1,3}\.\d{6}$/)) {
    options.errorReporter.report(
      options.pointer,
      'longitude',
      'longitude validation failed',
      options.arrayExpressionPointer
    )
    return
  }

  const longitude = parseFloat(value)

  if (longitude > 90 || longitude < -90) {
    options.errorReporter.report(
      options.pointer,
      'longitude',
      'range validation failed',
      options.arrayExpressionPointer
    )
  }
})
