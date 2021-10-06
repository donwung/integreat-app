import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { LanguageModel, NEWS_ROUTE, ChangeLanguageModalRouteType, NewsType } from 'api-client'
import { ThemeType } from 'build-configs'

import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import withTheme from '../hocs/withTheme'
import { StateType } from '../redux/StateType'
import { StoreActionType } from '../redux/StoreActionType'
import ChangeLanguageModal from './ChangeLanguageModal'

type OwnPropsType = {
  route: RoutePropType<ChangeLanguageModalRouteType>
  navigation: NavigationPropType<ChangeLanguageModalRouteType>
}
type StatePropsType = {
  currentLanguage: string
  languages: Array<LanguageModel>
  availableLanguages: Array<string>
  newsType: NewsType | undefined
}
type DispatchPropsType = {
  changeLanguage: (newLanguage: string, newsType: NewsType | undefined) => void
}
type PropsType = OwnPropsType & StatePropsType & DispatchPropsType

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const { currentLanguage, languages, availableLanguages, previousKey } = ownProps.route.params
  const newsRouteMapping = state.cityContent?.routeMapping
  const route = newsRouteMapping && newsRouteMapping[previousKey]
  const newsType = route?.routeType === NEWS_ROUTE ? route.type : undefined
  return {
    currentLanguage,
    languages,
    availableLanguages,
    newsType
  }
}

type DispatchType = Dispatch<StoreActionType>

const mapDispatchToProps = (dispatch: DispatchType, ownProps: OwnPropsType): DispatchPropsType => {
  const { cityCode, previousKey } = ownProps.route.params
  return {
    changeLanguage: (newLanguage: string, newsType: NewsType | undefined) => {
      dispatch({
        type: 'SWITCH_CONTENT_LANGUAGE',
        params: {
          newLanguage,
          city: cityCode
        }
      })

      if (newsType) {
        dispatch({
          type: 'FETCH_NEWS',
          params: {
            city: cityCode,
            language: newLanguage,
            newsId: null,
            type: newsType,
            key: previousKey,
            criterion: {
              forceUpdate: false,
              shouldRefreshResources: false
            }
          }
        })
      }
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTheme<
    PropsType & {
      theme: ThemeType
    }
  >(ChangeLanguageModal)
)
