import React, { memo, ReactElement } from 'react'
import styled from 'styled-components/native'

import { DateFormatter, EventModel, parseHTML } from 'api-client'

import EventPlaceholder1 from '../assets/EventPlaceholder1.jpg'
import EventPlaceholder2 from '../assets/EventPlaceholder2.jpg'
import EventPlaceholder3 from '../assets/EventPlaceholder3.jpg'
import { EXCERPT_MAX_LINES } from '../constants'
import ListItem from './ListItem'

const Description = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.contentFontRegular};
`

const placeholderThumbnails = [EventPlaceholder1, EventPlaceholder2, EventPlaceholder3]

type EventListItemProps = {
  event: EventModel
  language: string
  navigateToEvent: () => void
  formatter: DateFormatter
}

const EventListItem = ({ formatter, language, event, navigateToEvent }: EventListItemProps): ReactElement => {
  const thumbnail = event.thumbnail || placeholderThumbnails[event.path.length % placeholderThumbnails.length]!
  const content = parseHTML(event.content)

  return (
    <ListItem thumbnail={thumbnail} title={event.title} language={language} navigateTo={navigateToEvent}>
      <Description>{event.date.toFormattedString(formatter)}</Description>
      <Description numberOfLines={EXCERPT_MAX_LINES}>{content}</Description>
    </ListItem>
  )
}

export default memo(EventListItem)
