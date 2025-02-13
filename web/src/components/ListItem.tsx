import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

import { StyledCleanLink } from './CleanLink'

const ListItemContainer = styled.article`
  border-bottom: 2px solid ${props => props.theme.colors.themeColor};
  display: flex;
`

const Thumbnail = styled.img`
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  padding: 15px 5px;
  object-fit: contain;
`

export const Description = styled.div`
  display: flex;
  height: 100%;
  min-width: 1px; /* needed to enable line breaks for too long words, exact value doesn't matter */
  flex-direction: column;
  flex-grow: 1;
  padding: 15px 10px 0;
  overflow-wrap: anywhere;

  > * {
    padding-bottom: 10px;
  }
`

const Title = styled.div`
  font-weight: 700;
`

const FullWidthLink = styled(StyledCleanLink)`
  flex: 1;
`

type ListItemProps = {
  thumbnail?: string
  path: string
  title: string
  children?: ReactNode
}

const ListItem: React.FC<ListItemProps> = ({ path, title, thumbnail, children }: ListItemProps): ReactElement => (
  <ListItemContainer dir='auto'>
    <FullWidthLink to={path}>
      {!!thumbnail && <Thumbnail alt='' src={thumbnail} />}
      <Description>
        <Title dir='auto'>{title}</Title>
        {children}
      </Description>
    </FullWidthLink>
  </ListItemContainer>
)

export default ListItem
