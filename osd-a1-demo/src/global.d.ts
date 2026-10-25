type AydaLocaleCode = 'tr' | 'de' | 'en'
interface AydaLocaleApi {
  key: string
  get: () => AydaLocaleCode
  set: (locale: AydaLocaleCode) => void
  t: (value: string, locale?: AydaLocaleCode) => string
  apply: (root: ParentNode) => void
}
interface Window { AydaLocale?: AydaLocaleApi }
