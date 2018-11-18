// @flow

import React from 'react'
import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from '../types'
import { getSprungbrettPath, SPRUNGBRETT_ROUTE } from '../sprungbrett'
import RouteConfig from './RouteConfig'
import SprungbrettExtraPage from '../../../../routes/sprungbrett/containers/SprungbrettExtraPage'
import Payload from '../../../endpoint/Payload'
import SprungbrettModel from '../../../endpoint/models/SprungbrettJobModel'
import ExtraModel from '../../../endpoint/models/ExtraModel'

type RequiredPayloadType = {|extras: Payload<Array<ExtraModel>>, sprungbrettJobs: Payload<Array<SprungbrettModel>>|}

const renderSprungbrettPage = ({ sprungbrettJobs, extras }: RequiredPayloadType) =>
  <SprungbrettExtraPage sprungbrettJobs={sprungbrettJobs.data} extras={extras.data} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType =>
  ({sprungbrettJobs: payloads.sprungbrettJobsPayload, extras: payloads.extrasPayload})

const getLanguageChangePath = ({location, language}: GetLanguageChangePathParamsType) =>
  getSprungbrettPath({city: location.payload.city, language})

const getPageTitle = ({t, cityName}: GetPageTitleParamsType) =>
  `${t('pageTitles.sprungbrett')} - ${cityName}`

const sprungbrettRouteConfig: RouteConfig<RequiredPayloadType> = new RouteConfig({
  name: SPRUNGBRETT_ROUTE,
  renderPage: renderSprungbrettPage,
  getRequiredPayloads,
  getLanguageChangePath,
  getPageTitle
})

export default sprungbrettRouteConfig
