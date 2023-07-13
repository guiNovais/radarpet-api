declare module '@ioc:Adonis/Core/Validator' {
  interface Rules {
    latitude(): Rule
    longitude(): Rule
  }
}
