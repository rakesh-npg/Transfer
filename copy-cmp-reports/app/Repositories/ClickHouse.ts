import { ClickHouse as ClickHouseService, ClickHouseStream } from 'App/Services'

type Result = {
  circuitId: number
  cmpDate: Date
  dataCount: number
  healthStatus: string
}

class ClickHouse {
  public getNonStreamingCircuitsClickHouse(
    circuitIds: number[],
    startDate: string,
    endDate: string
  ): Promise<any[]> {
    return ClickHouseService.query(
      `select s.circuit_id,s.cou from
      (select a.circuit_id,sum(b.c) cou from
      ( select cast(arrayJoin(range(toUnixTimestamp('${startDate}'),toUnixTimestamp('${endDate}'),86400)) as date) as ts ,
      cast(arrayJoin([${circuitIds}]) as UInt16)  as circuit_id) a
      left join( select circuit_id,toDate(source_ts) date,count(*) c from ${ClickHouseService.db}.${ClickHouseService.table}
      where active=1 and toDate(source_ts)>= '${startDate}' and toDate(source_ts)<= '${endDate}'
      group by circuit_id,date) b on a.ts=b.date and a.circuit_id=b.circuit_id group by circuit_id
      order by a.circuit_id) s where s.cou=0`
    ).toPromise()
  }

  public getDataPoints(circuitIds: number[]): Promise<any[]> {
    return new Promise((resolve) => {
      const result = ClickHouseStream.query(
        `select circuit_id,ts,c as record_count,multiIf(c<1440 and c>=1400 , 'Partial', c<=1399, 'Un Healthy', 'Healthy') AS health_status from (
            select toDate(source_ts) ts,circuit_id,count(*) c from ${ClickHouseStream.db}.${ClickHouseStream.table} where 
            toDate(source_ts)>= now() - INTERVAL 8 DAY and toDate(source_ts)<= now() - INTERVAL 1 DAY and circuit_id in 
            (${circuitIds}) and active=1 group by ts,circuit_id order by ts,circuit_id
            ) order by circuit_id,ts`
      ).stream()
      const rows: Result[] = []

      result.on('data', (row: any) => {
        let data = {
          circuitId: row.circuit_id,
          cmpDate: row.ts,
          dataCount: row.record_count,
          healthStatus: row.health_status,
        }
        rows.push(data)
      })
      result.on('end', () => {
        resolve(rows)
      })
    })
  }

  public getDate(circuitIds: number[]): Promise<any[]> {
    return ClickHouseService.query(
      `select circuit_id, max(source_ts) last_updated_time from ${ClickHouseService.db}.${ClickHouseService.table} where circuit_id in (${circuitIds}) and active = 1 group by circuit_id`
    ).toPromise()
  }
}
export default new ClickHouse()
