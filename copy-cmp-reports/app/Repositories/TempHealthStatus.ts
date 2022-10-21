import Database from '@ioc:Adonis/Lucid/Database'
import TempHealthStatus from 'App/Models/TempHealthStatus'
import { CircuitsRepo } from '.'

type HealthStatusDetails = {
  circuitId: number
  dataCount: number
  healthStatus: string
  cmpDate: Date
}

class TempHealthStatusRepo {
  public getMultiple() {
    return TempHealthStatus.query().then((d) => d.map((s) => s.toObject()))
  }

  public async getChHealthStatus(
    datesForSelectQuery: String[],
    crossTabNames: String[],
    crossTabDataType: String[]
  ): Promise<any[]> {
    const maybeCircuits = await Database.rawQuery(`SELECT
        ct.circuit_id,
        ${datesForSelectQuery}
    from (
            SELECT crosstab.circuit_id, ${crossTabNames}
            FROM crosstab(
                    $$
                    SELECT
                        c.circuit_id,
                        c.cmp_date,
                        Concat(
                            c.data_count,
                            ' - ',
                            CASE
                                WHEN c.data_count BETWEEN 1400 AND 1439 THEN 'Partial'
                                WHEN c.data_count < 1400 THEN 'Un Healthy'
                                ELSE 'Healthy'
                            END
                        )
                    FROM (
                            SELECT
                                b.circuit_id,
                                b.cmp_date,
                                Sum(b.data_count) data_count
                            FROM (
                                    SELECT
                                        a.circuit_id,
                                        a.cmp_date,
                                        a.data_count
                                    FROM
                                        temp_health_status a
                                ) b
                            GROUP BY
                                b.circuit_id,
                                b.cmp_date
                        ) c
                    ORDER BY
                        c.circuit_id,
                        c.cmp_date $$
                ) crosstab (
                    circuit_id integer,
                    ${crossTabDataType}
                )
        ) ct`)

    if (!maybeCircuits.rows.length) return []

    const circuitIds = maybeCircuits.rows.map((m) => m.circuit_id)
    const dbCircuits = await CircuitsRepo.getMultiple({ circuitIds })

    return maybeCircuits.rows.map((circuit) => {
      const circuitDetails = dbCircuits.find((f) => f.id === circuit.circuit_id)

      return {
        customer: circuitDetails.customer.name,
        site: circuitDetails.site.name,
        mac_id: circuitDetails.macId,
        circuit_id: circuit.circuit_id,
        circuit: circuitDetails.name,
        ...circuit,
        circuit_type: circuitDetails.meter.meterType,
      }
    })
  }

  public bulkInsert(healthStatusDetails: HealthStatusDetails[]) {
    return TempHealthStatus.createMany(healthStatusDetails)
  }

  public truncateTable() {
    return TempHealthStatus.truncate()
  }
}

export default new TempHealthStatusRepo()
