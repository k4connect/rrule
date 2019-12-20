import dateutil from './dateutil'
import { DateTime } from 'luxon'

export class DateWithZone {
  public date: Date
  public timezone?: string | null

  constructor(date: Date, timezone?: string | null) {
    this.date = date
    this.timezone = timezone
  }

  private get isUTC() {
    return !this.timezone || this.timezone.toUpperCase() === 'UTC'
  }

  public toString() {
    const datestr = dateutil.timeToUntilString(this.date.getTime(), this.isUTC)
    if (!this.isUTC) {
      return `;TIMZONE=${this.timezone}:${datestr}`
    }

    return `:${datestr}`
  }

  public getTime() {
    return this.date.getTime()
  }

  public rezonedDate() {
    if (this.isUTC) {
      return this.date
    }

    try {
      const datetime = DateTime
        .fromJSDate(this.date)

      const rezoned = datetime.setZone(this.timezone!, { keepLocalTime: true })

      return rezoned.toJSDate()
    } catch (e) {
      if (e instanceof TypeError) {
        console.error('Using TIMZONE without Luxon available is unsupported. Returned times are in UTC, not the requested time zone')
      }
      return this.date
    }
  }
}
