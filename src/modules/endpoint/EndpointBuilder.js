// @flow

import Endpoint from './Endpoint'
import type { MapResponseType } from './MapResponseType'
import type { MapParamsToUrlType } from './MapParamsToUrlType'

/**
 * Helper class to build a {@link Endpoint}
 */
class EndpointBuilder<P, T> {
  _name: string
  _paramsToUrlMapper: MapParamsToUrlType<P>
  _mapper: MapResponseType<P, T>
  _responseOverride: ?T
  _errorOverride: ?Error

  /**
   * Creates a new endpoint builder
   * @param {string} name The name of the endpoint to build
   */
  constructor (name: string) {
    this._name = name
  }

  /**
   * Adds a state to url mapper to the builder
   * @param paramsToUrlMapper The paramsToUrlMapper which is mapping the params to a url
   * @return {EndpointBuilder} The builder itself
   */
  withParamsToUrlMapper (paramsToUrlMapper: MapParamsToUrlType<P>): EndpointBuilder<P, T> {
    this._paramsToUrlMapper = paramsToUrlMapper
    return this
  }

  /**
   * Adds a json mapper to the builder
   * @param mapper The mapper which maps json from our cms to models
   * @return {EndpointBuilder} The builder itself
   */
  withMapper (mapper: MapResponseType<P, T>): EndpointBuilder<P, T> {
    this._mapper = mapper
    return this
  }

  /**
   * Overrides value from the API response. Useful for testing.
   * @param responseOverride {*} The response
   * @return {EndpointBuilder} The builder itself
   */
  withResponseOverride (responseOverride: T): EndpointBuilder<P, T> {
    this._responseOverride = responseOverride
    return this
  }

  /**
   * Fetcher throws an error. Useful for testing.
   * @param errorOverride {*} The error
   * @return {EndpointBuilder} The builder itself
   */
  withErrorOverride (errorOverride: Error): EndpointBuilder<P, T> {
    this._errorOverride = errorOverride
    return this
  }

  /**
   * Checks the data and builds the endpoint
   * @return {Endpoint} The final endpoint
   */
  build (): Endpoint<P, T> {
    if (!this._name) {
      throw Error('You have to set a name to build an endpoint!')
    }

    if (!this._paramsToUrlMapper) {
      throw Error('You have to set a url mapper to build an endpoint!')
    }

    if (!this._mapper) {
      throw Error('You have to set a mapper to build an endpoint!')
    }

    return new Endpoint(this._name, this._paramsToUrlMapper, this._mapper, this._responseOverride, this._errorOverride)
  }
}

export default EndpointBuilder
