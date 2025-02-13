import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import OfferModel from '../models/OfferModel'
import { JsonOfferPostType, JsonOfferType } from '../types'

export const OFFERS_ENDPOINT_NAME = 'offers'

const createPostMap = (jsonPost: JsonOfferPostType): Map<string, string> => {
  const map = new Map()
  Object.keys(jsonPost).forEach(key => map.set(key, jsonPost[key]))
  return map
}

type ParamsType = {
  city: string
  language: string
}
export default (baseUrl: string): Endpoint<ParamsType, Array<OfferModel>> =>
  new EndpointBuilder<ParamsType, Array<OfferModel>>(OFFERS_ENDPOINT_NAME)
    .withParamsToUrlMapper(params => `${baseUrl}/${params.city}/${params.language}/wp-json/extensions/v3/extras/`)
    .withMapper((json: Array<JsonOfferType>) =>
      json.map(
        offer =>
          new OfferModel({
            alias: offer.alias,
            title: offer.name,
            path: offer.url,
            thumbnail: offer.thumbnail,
            postData: offer.post ? createPostMap(offer.post) : undefined,
          })
      )
    )
    .build()
