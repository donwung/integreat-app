// @flow

import * as React from 'react'

import { Linking, ScrollView } from 'react-native'
import { SprungbrettJobModel, ExtraModel } from '@integreat-app/integreat-api-client'
import SprungbrettListItem from './SprungbrettListItem'
import type { TFunction } from 'react-i18next'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import List from '../../../modules/common/components/List'
import Caption from '../../../modules/common/components/Caption'

type PropsType = {|
  sprungbrettJobs: Array<SprungbrettJobModel>,
  t: TFunction,
  theme: ThemeType,
  sprungbrettExtra: ExtraModel,
  t: TFunction
|}

class SprungbrettExtra extends React.Component<PropsType> {
  openJobInBrowser = (url: string) => () => {
    Linking.openURL(url)
  }

  renderSprungbrettListItem = (job: SprungbrettJobModel): React.Node => (
    <SprungbrettListItem key={job.id} job={job} openJobInBrowser={this.openJobInBrowser(job.url)}
                         theme={this.props.theme} />
  )

  render () {
    const {sprungbrettExtra, sprungbrettJobs, t, theme} = this.props

    return <ScrollView>
        <Caption title={sprungbrettExtra.title} theme={this.props.theme} />
        <List noItemsMessage={t('noOffersAvailable')}
              renderItem={this.renderSprungbrettListItem}
              items={sprungbrettJobs}
              theme={theme} />
      </ScrollView>
  }
}

export default SprungbrettExtra
