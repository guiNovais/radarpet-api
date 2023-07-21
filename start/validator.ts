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
  if (typeof value !== 'number') {
    return
  }

  if (value > 90 || value < -90) {
    options.errorReporter.report(
      options.pointer,
      'latitude',
      'range validation failed',
      options.arrayExpressionPointer
    )
  }
})

validator.rule('longitude', (value, _, options) => {
  if (typeof value !== 'number') {
    return
  }
  if (value > 180 || value < -180) {
    options.errorReporter.report(
      options.pointer,
      'longitude',
      'range validation failed',
      options.arrayExpressionPointer
    )
  }
})
