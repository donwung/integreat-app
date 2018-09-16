// @flow

import * as React from 'react'
import PlatformContext from '../../platform/PlatformContext'
import Platform from '../../platform/Platform'

import { Provider } from 'react-redux'
import I18nProvider from 'modules/i18n/containers/I18nProvider'
import createReduxStore from '../createReduxStore'
import CustomThemeProvider from '../../theme/containers/CustomThemeProvider'
import Navigator from './Navigator'
import IOSSafeAreaView from 'modules/platform/components/IOSSafeAreaView'
import AndroidStatusBarContainer from '../../platform/containers/AndroidStatusBarContainer'
import type { Store } from 'redux'
import type { StateType } from '../StateType'
import type { StoreActionType } from '../StoreActionType'

class App extends React.Component<{}, { waitingForStore: boolean }> {
  platform: Platform

  store: Store<StateType, StoreActionType>

  constructor () {
    super()
    this.state = {waitingForStore: true}
    const storeConfig = createReduxStore(() => { this.setState({waitingForStore: false}) }, false)
    this.store = storeConfig.store
    this.platform = new Platform()
  }

  render () {
    if (this.state.waitingForStore) {
      return null
    }

    return (
      <Provider store={this.store}>
        <I18nProvider>
          <CustomThemeProvider>
            <PlatformContext.Provider value={this.platform}>
              <AndroidStatusBarContainer />
              <IOSSafeAreaView>
                <Navigator />
              </IOSSafeAreaView>
            </PlatformContext.Provider>
          </CustomThemeProvider>
        </I18nProvider>
      </Provider>
    )
  }
}

export default App
