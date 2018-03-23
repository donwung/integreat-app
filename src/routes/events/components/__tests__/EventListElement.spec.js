import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment-timezone'

import EventListElement from '../EventListElement'
import EventModel from '../../../../modules/endpoint/models/EventModel'

describe('EventListElement', () => {
  const event = new EventModel({
    id: 1234,
    title: 'first Event',
    availableLanguages: {de: '1235', ar: '1236'},
    startDate: moment.tz('2017-11-27 19:30:00', 'UTC'),
    endDate: moment.tz('2017-11-27 21:30:00', 'UTC'),
    allDay: false,
    excerpt: ''
  })

  const city = 'augsburg'
  const language = 'en'

  it('should render', () => {
    expect(shallow(
      <EventListElement event={event} city={city} language={language} />
    )).toMatchSnapshot()
  })
})
