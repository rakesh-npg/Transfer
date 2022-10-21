import Database from '@ioc:Adonis/Lucid/Database'
import { excludeCustomers } from 'App/Data/Constants'
import { CmpBo } from 'App/Services'

const METER_TYPES = ['ELEC', 'GAS'] as const

type MeterType = typeof METER_TYPES[number]

type GetMultiple = {
  customerIds?: number[]
  siteIds?: number[]
  meterIds?: number[]
  circuitIds?: number[]
  meterType?: MeterType[]
  applyFilters?: Boolean
}

class Circuits {
  public async getMultiple({ circuitIds, applyFilters }: GetMultiple) {
    const maybeCircuits = await CmpBo.Circuits.getMultiple()

    if (applyFilters) {
      const maybeCustomers = await CmpBo.Customers.getMultiple()
      if (!maybeCustomers.length) return []
      const customers = maybeCustomers
        .filter((c) => c.missingExcelAlert)
        .filter((f) => !excludeCustomers.includes(f.id))
      if (!customers.length) return []
      const circuits = maybeCircuits.filter((f) =>
        customers.map((m) => m.id).includes(f.customer.id)
      )
      return circuits.filter((circuit) => circuit.manufacturer === 1)
    }
    return circuitIds?.length
      ? maybeCircuits.filter(
          (circuit) => circuitIds?.includes(circuit.id) && circuit.manufacturer === 1
        )
      : maybeCircuits
  }

  public getNonStreamingQuery(circuitIds: number[]) {
    return Database.from('circuit_details')
      .select(
        'customer_id',
        'customer',
        Database.raw("string_agg(cast(circuit_id as varchar),',') as circuits"),
        Database.raw('count(circuit_id) as count')
      )
      .whereIn('circuit_id', circuitIds)
      .groupBy('customer_id', 'customer')
  }
}

export default new Circuits()
