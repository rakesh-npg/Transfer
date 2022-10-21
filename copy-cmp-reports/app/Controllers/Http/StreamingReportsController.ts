import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CircuitsRepo, ClickHouseRepo } from 'App/Repositories'
import { Streaming } from 'App/Validators'

export default class StreamingReportsController {
  /**
   * getNonStreamingCircuit
   */
  public async getNonStreamingCircuit({ response, request }: HttpContextContract) {
    const { circuitIds, meterIds, siteIds, customerIds } = await request.validate(
      Streaming.NonStreamingGetValidator
    )

    const maybeCircuits = await CircuitsRepo.getMultiple({
      circuitIds,
      meterIds,
      siteIds,
      customerIds,
    })

    if (!maybeCircuits.length) return response.noContent()

    const now = new Date()
    const currentDate: any = now.toJSON().slice(0, 10).replace(/-/g, '-')
    let pastTwoDay: any = new Date(now.setDate(now.getDate() - 1))
    pastTwoDay = pastTwoDay.toJSON().slice(0, 10).replace(/-/g, '-')

    // const cIds = maybeCircuits.map(c => c.id)
    const maybeRecords = await ClickHouseRepo.getNonStreamingCircuitsClickHouse(
      circuitIds!,
      pastTwoDay,
      currentDate
    )
    if (!maybeRecords.length) return response.noContent()

    const nonStreamingCustomers = await CircuitsRepo.getNonStreamingQuery(circuitIds!)

    return nonStreamingCustomers
  }
}
