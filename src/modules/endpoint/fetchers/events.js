// @flow

import { createAction } from 'redux-actions'
import moment from 'moment'
import { apiUrl } from '../constants'
import EventModel from '../models/EventModel'
import type { Dispatch } from 'redux-first-router/dist/flow-types'

type Params = {
  city: string,
  language: string
}

const EVENTS_FETCHED = 'EVENTS_FETCHED'

const urlMapper = (params: Params): string => `${apiUrl}/${params.city}/${params.language}/wp-json/extensions/v0/modified_content/events?since=1970-01-01T00:00:00Z`

const mapper = (json: any): Array<EventModel> =>
  json
    .filter(event => event.status === 'publish')
    .map(event => new EventModel({
      id: event.id,
      title: event.title,
      content: event.content,
      thumbnail: event.thumbnail,
      address: event.location.address,
      town: event.location.town,
      startDate: moment(`${event.event.start_date} ${event.event.start_time}`),
      endDate: moment(`${event.event.end_date} ${event.event.end_time}`),
      allDay: event.event.all_day !== '0',
      excerpt: event.excerpt,
      availableLanguages: event.available_languages
    }))
    .filter(event => event.startDate.isValid())
    .filter(event => event.startDate.isAfter(moment()))
    .sort((event1, event2) => {
      if (event1.startDate.isBefore(event2.startDate)) { return -1 }
      if (event1.startDate.isAfter(event2.startDate)) { return 1 }
      return 0
    })

const fetcher = (dispatch: Dispatch, params: Params): Promise<Array<EventModel>> =>
  fetch(urlMapper(params))
    .then(result => result.json())
    .then(json => mapper(json))
    .then(events => {
      dispatch(createAction(EVENTS_FETCHED)(events))
      return events
    })

export default fetcher
