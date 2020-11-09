// @flow

import type { PoiRouteStateType, LanguageResourceCacheStateType, StateType } from '../../../modules/app/StateType'
import { connect } from 'react-redux'
import { type TFunction, withTranslation } from 'react-i18next'
import withRouteCleaner from '../../../modules/endpoint/hocs/withRouteCleaner'
import createNavigateToPoi from '../../../modules/app/createNavigateToPoi'
import type { Dispatch } from 'redux'
import type { StoreActionType, SwitchContentLanguageActionType } from '../../../modules/app/StoreActionType'
import type { NavigationStackProp } from 'react-navigation-stack'
import type { StatusPropsType } from '../../../modules/endpoint/hocs/withPayloadProvider'
import withPayloadProvider from '../../../modules/endpoint/hocs/withPayloadProvider'
import withTheme from '../../../modules/theme/hocs/withTheme'
import { CityModel, PoiModel } from '@integreat-app/integreat-api-client'
import * as React from 'react'
import createNavigateToInternalLink from '../../../modules/app/createNavigateToInternalLink'
import Pois from '../components/Pois'
import ErrorCodes from '../../../modules/error/ErrorCodes'

type ContainerPropsType = {|
  path: ?string,
  pois: $ReadOnlyArray<PoiModel>,
  cities: $ReadOnlyArray<CityModel>,
  cityCode: string,
  language: string,
  resourceCache: LanguageResourceCacheStateType,
  resourceCacheUrl: string,
  navigation: NavigationStackProp<*>,
  dispatch: Dispatch<StoreActionType>
|}

type RefreshPropsType = {|
  navigation: NavigationStackProp<*>,
  cityCode: string,
  language: string,
  path: ?string
|}

type OwnPropsType = {| navigation: NavigationStackProp<*>, t: TFunction |}
type StatePropsType = StatusPropsType<ContainerPropsType, RefreshPropsType>
type DispatchPropsType = {| dispatch: Dispatch<StoreActionType> |}
type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const createChangeUnavailableLanguage = (city: string, t: TFunction) => (
  dispatch: Dispatch<StoreActionType>, newLanguage: string
) => {
  const switchContentLanguage: SwitchContentLanguageActionType = {
    type: 'SWITCH_CONTENT_LANGUAGE',
    params: { newLanguage, city, t }
  }
  dispatch(switchContentLanguage)
}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const { t, navigation } = ownProps
  if (!state.cityContent) {
    return { status: 'routeNotInitialized' }
  }
  const { resourceCache, poisRouteMapping, switchingLanguage, languages } = state.cityContent
  const route: ?PoiRouteStateType = poisRouteMapping[navigation.state.key]
  if (!route) {
    return { status: 'routeNotInitialized' }
  }

  if (route.status === 'languageNotAvailable') {
    if (languages.status === 'error' || languages.status === 'loading') {
      console.error('languageNotAvailable status impossible if languages not ready')
      return {
        status: 'error',
        refreshProps: null,
        code: languages.code || ErrorCodes.UnknownError,
        message: languages.message || 'languages not ready'
      }
    }
    return {
      status: 'languageNotAvailable',
      availableLanguages: languages.models.filter(lng => route.allAvailableLanguages.has(lng.code)),
      cityCode: route.city,
      changeUnavailableLanguage: createChangeUnavailableLanguage(route.city, t)
    }
  }

  const refreshProps = {
    path: route.path,
    cityCode: route.city,
    language: route.language,
    navigation: ownProps.navigation
  }

  if (state.cities.status === 'error') {
    return { status: 'error', message: state.cities.message, code: state.cities.code, refreshProps }
  } else if (resourceCache.status === 'error') {
    return { status: 'error', message: resourceCache.message, code: resourceCache.code, refreshProps }
  } else if (route.status === 'error') {
    return { status: 'error', message: route.message, code: route.code, refreshProps }
  } else if (languages.status === 'error') {
    return { status: 'error', message: languages.message, code: languages.code, refreshProps }
  }

  if (state.resourceCacheUrl === null || state.cities.status === 'loading' || switchingLanguage ||
    route.status === 'loading' || languages.status === 'loading') {
    return { status: 'loading', progress: 0 }
  }

  const cities = state.cities.models

  return {
    status: 'success',
    refreshProps,
    innerProps: {
      path: route.path,
      pois: route.models,
      cities: cities,
      cityCode: route.city,
      language: route.language,
      resourceCache: resourceCache.value,
      resourceCacheUrl: state.resourceCacheUrl,
      navigation
    }
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>): DispatchPropsType => ({ dispatch })

const ThemedTranslatedPois = withTranslation('pois')(
  withTheme(Pois)
)

class PoisContainer extends React.Component<ContainerPropsType> {
  render () {
    const { dispatch, ...rest } = this.props
    return <ThemedTranslatedPois {...rest}
                                   navigateToPoi={createNavigateToPoi(dispatch, rest.navigation)}
                                   navigateToInternalLink={createNavigateToInternalLink(dispatch, rest.navigation)}
    />
  }
}

const refresh = (refreshProps: RefreshPropsType, dispatch: Dispatch<StoreActionType>) => {
  const { navigation, cityCode, language, path } = refreshProps
  const navigateToPoi = createNavigateToPoi(dispatch, navigation)
  navigateToPoi({ cityCode, language, path, forceRefresh: true, key: navigation.state.key })
}

export default withRouteCleaner<{| navigation: NavigationStackProp<*> |}>(
  withTranslation('error')(
    connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, mapDispatchToProps)(
      withPayloadProvider<ContainerPropsType, RefreshPropsType>(refresh)(
        PoisContainer
      ))))
