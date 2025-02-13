import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components/native'

import { contentDirection } from '../constants/contentDirection'
import SimpleImage, { ImageSourceType } from './SimpleImage'
import Pressable from './base/Pressable'
import Text from './base/Text'

const ListItemView = styled.View<{ language: string }>`
  flex-direction: ${props => contentDirection(props.language)};
  padding: 15px 5px 0;
`
const StyledPressable = styled(Pressable)`
  flex-direction: column;
  padding-bottom: 10px;
  border-bottom-width: 2px;
  border-bottom-color: ${props => props.theme.colors.themeColor};
`
const Thumbnail = styled(SimpleImage)`
  width: 75px;
  height: 75px;
  flex-shrink: 0;
`
const Description = styled.View`
  height: 100%;
  flex-direction: column;
  flex: 1;
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  padding: 0 10px;
`
const Title = styled(Text)`
  font-weight: 700;
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
  color: ${props => props.theme.colors.textColor};
`

type ListItemProps = {
  thumbnail: ImageSourceType
  title: string
  language: string
  children?: ReactNode
  navigateTo: () => void
}

const ListItem = ({ language, title, thumbnail, children, navigateTo }: ListItemProps): ReactElement => (
  <StyledPressable onPress={navigateTo}>
    <ListItemView language={language}>
      {!!thumbnail && <Thumbnail source={thumbnail} />}
      <Description>
        <Title>{title}</Title>
        {children}
      </Description>
    </ListItemView>
  </StyledPressable>
)

export default ListItem
