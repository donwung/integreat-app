import { fireEvent } from '@testing-library/react'
import { mocked } from 'jest-mock'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { cityContentPath, CityModelBuilder, PoiModelBuilder, POIS_ROUTE, prepareFeatureLocations } from 'api-client'

import useFeatureLocations from '../../hooks/useFeatureLocations'
import { renderWithRouterAndTheme } from '../../testing/render'
import PoisPage from '../PoisPage'
import { RoutePatterns } from '../index'

jest.mock('react-i18next')
jest.mock('../../utils/getUserLocation', () => async () => ({ status: 'ready', coordinates: [10.8, 48.3] }))
jest.mock('../../hooks/useFeatureLocations')

describe('PoisPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const cities = new CityModelBuilder(2).build()
  const pois = new PoiModelBuilder(2).build()
  const city = cities[0]!
  const languageCode = 'ar'
  const poi0 = pois[0]!
  const poi1 = pois[1]!
  const features = prepareFeatureLocations(pois, null)

  const pathname = cityContentPath({ route: POIS_ROUTE, cityCode: city.code, languageCode })

  const renderPois = () =>
    renderWithRouterAndTheme(
      <Routes>
        <Route
          path={RoutePatterns[POIS_ROUTE]}
          element={<PoisPage city={city} pathname={pathname} languageCode={languageCode} cityCode={city.code} />}>
          <Route element={null} path=':slug' />
        </Route>
      </Routes>,
      { pathname: '/locations' }
    )

  it('should render a list with all pois', () => {
    mocked(useFeatureLocations).mockImplementation(() => ({
      data: { pois, features },
      loading: false,
      error: null,
      refresh: jest.fn(),
    }))
    const { getByText } = renderPois()
    expect(getByText(poi0.location.name)).toBeTruthy()
    expect(getByText(poi1.location.name)).toBeTruthy()
  })

  it('should render an error', () => {
    mocked(useFeatureLocations).mockImplementation(() => ({
      data: null,
      loading: false,
      error: new Error('Something went wrong'),
      refresh: jest.fn(),
    }))
    const { getByText } = renderPois()
    expect(getByText('error:unknownError')).toBeTruthy()
  })

  it('should render poi details page when list item was clicked', () => {
    mocked(useFeatureLocations).mockImplementation(() => ({
      data: { pois, features },
      loading: false,
      error: null,
      refresh: jest.fn(),
    }))
    const { getByText, getByLabelText } = renderPois()
    fireEvent.click(getByLabelText(poi0.location.name))
    expect(getByText(poi0.location.name)).toBeTruthy()
    expect(getByText(poi0.location.address!)).toBeTruthy()
    expect(getByText(poi0.content)).toBeTruthy()
  })

  it('should switch between pois using the PanelNavigation on poi details page', () => {
    mocked(useFeatureLocations).mockImplementation(() => ({
      data: { pois, features },
      loading: false,
      error: null,
      refresh: jest.fn(),
    }))
    const { getByText, getByLabelText } = renderPois()
    fireEvent.click(getByLabelText(poi0.location.name))
    fireEvent.click(getByText('pois:detailsNextPoi'))
    expect(getByText(poi1.location.name)).toBeTruthy()
    expect(getByText(poi1.location.address!)).toBeTruthy()
    expect(getByText(poi1.content)).toBeTruthy()
    fireEvent.click(getByText('pois:detailsPreviousPoi'))
    expect(getByText(poi0.location.name)).toBeTruthy()
    expect(getByText(poi0.location.address!)).toBeTruthy()
    expect(getByText(poi0.content)).toBeTruthy()
  })

  it('should calculate correct language change paths', () => {
    mocked(useFeatureLocations).mockImplementation(() => ({
      data: { pois, features },
      loading: false,
      error: null,
      refresh: jest.fn(),
    }))
    const { getByTestId, getByLabelText } = renderPois()
    fireEvent.click(getByLabelText(poi0.location.name))
    expect(getByTestId('en')).toHaveAttribute('href', poi0.availableLanguages.get('en'))
    expect(getByTestId('de')).toHaveAttribute('href', poi0.availableLanguages.get('de'))
    // Pathname is not correctly updated, therefore the pathname does not include the slug
    expect(getByTestId('ar')).toHaveAttribute('href', '/augsburg/ar/locations')
  })
})
