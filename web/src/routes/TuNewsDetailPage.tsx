import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'

import { createTunewsElementEndpoint, NotFoundError, TU_NEWS_TYPE, useLoadFromEndpoint } from 'api-client'

import { CityRouteProps } from '../CityContentSwitcher'
import TunewsIcon from '../assets/TunewsActiveLogo.png'
import CityContentLayout, { CityContentLayoutProps } from '../components/CityContentLayout'
import CityContentToolbar from '../components/CityContentToolbar'
import FailureSwitcher from '../components/FailureSwitcher'
import Helmet from '../components/Helmet'
import LoadingSpinner from '../components/LoadingSpinner'
import Page from '../components/Page'
import { tunewsApiBaseUrl } from '../constants/urls'
import DateFormatterContext from '../contexts/DateFormatterContext'
import { TU_NEWS_DETAIL_ROUTE } from './index'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const StyledBanner = styled.div`
  position: relative;
  display: flex;
  height: 60px;
  overflow: hidden;
  align-items: center;
  margin: 25px 0;
  background-color: ${props => props.theme.colors.tunewsThemeColorLight};
  border-radius: 11px;
`
const StyledBannerImage = styled.img`
  max-height: 100%;
`
const StyledTitle = styled.div`
  display: flex;
  width: 205px;
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.tunewsThemeColor};
  color: ${props => props.theme.colors.backgroundColor};
  font-size: 20px;
  font-weight: 700;
`

const TuNewsDetailPage = ({ city, pathname, cityCode, languageCode }: CityRouteProps): ReactElement | null => {
  const newsId = useParams().newsId!
  const formatter = useContext(DateFormatterContext)
  const navigate = useNavigate()
  const { t } = useTranslation('news')

  const {
    data: newsModel,
    loading,
    error: newsError,
  } = useLoadFromEndpoint(createTunewsElementEndpoint, tunewsApiBaseUrl, { id: parseInt(newsId, 10) })

  if (!city) {
    return null
  }

  const pageTitle = `${newsModel?.title ?? t('pageTitle')} - ${city.name}`

  // Language change is not possible between tuNews detail views because we don't know the id of other languages
  const languageChangePaths = city.languages.map(({ code, name }) => ({ path: null, name, code }))
  const locationLayoutParams: Omit<CityContentLayoutProps, 'isLoading'> = {
    city,
    languageChangePaths,
    route: TU_NEWS_DETAIL_ROUTE,
    languageCode,
    Toolbar: (
      <CityContentToolbar
        hasFeedbackOption={false}
        route={TU_NEWS_DETAIL_ROUTE}
        languageCode={languageCode}
        pageTitle={pageTitle}
      />
    ),
  }

  if (loading) {
    return (
      <CityContentLayout isLoading {...locationLayoutParams}>
        <LoadingSpinner />
      </CityContentLayout>
    )
  }

  if (!newsModel) {
    const error =
      !newsError || newsError instanceof NotFoundError
        ? new NotFoundError({
            type: TU_NEWS_TYPE,
            id: pathname,
            city: cityCode,
            language: languageCode,
          })
        : newsError

    return (
      <CityContentLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcher error={error} />
      </CityContentLayout>
    )
  }

  return (
    <CityContentLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={city} />
      <StyledContainer>
        <>
          <StyledBanner>
            <StyledTitle>
              <StyledBannerImage src={TunewsIcon} alt='' />
            </StyledTitle>
          </StyledBanner>
          <Page
            title={newsModel.title}
            content={newsModel.content}
            formatter={formatter}
            lastUpdateFormat='DDD'
            lastUpdate={newsModel.date}
            showLastUpdateText={false}
            onInternalLinkClick={navigate}
          />
        </>
      </StyledContainer>
    </CityContentLayout>
  )
}

export default TuNewsDetailPage
