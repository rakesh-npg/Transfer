import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { cellColor, DataHealthRange, headerMapping, omitFields } from 'App/Data/Constants'

import { CircuitsRepo, LogRepo, TempHealthStatusRepo } from 'App/Repositories'
import ClickHouse from 'App/Repositories/ClickHouse'
import { Slack } from 'App/Services'
import { Workbook } from 'exceljs'
import { DateTime } from 'luxon'
import path from 'path'
import Env from '@ioc:Adonis/Core/Env'
import fs from 'fs'
import * as Domain from 'App/Domain'
export default class StreamingDataAlertsController {
  public async getStreamingData({ request, token, response }: HttpContextContract) {
    const maybeCircuits = await CircuitsRepo.getMultiple({ applyFilters: true })

    if (!maybeCircuits.length) return response.noContent()
    const circuitIds = maybeCircuits.map((c) => c.id)

    const chResult = await ClickHouse.getDataPoints(circuitIds)

    if (!chResult.length) return response.noContent()

    await TempHealthStatusRepo.truncateTable()
    await TempHealthStatusRepo.bulkInsert(chResult)
    const healthCheck = await this.generateHealthCheckXlsx()

    if (!healthCheck.success) return healthCheck
    LogRepo.insert(Domain.Log.slackFileUpload(request.ips(), token.uid))
    await this.slackFileUpload(healthCheck.filePath!, healthCheck.xlFileName!)

    return {
      sucess: true,
      message: 'Slack alert sent successfully',
    }
  }

  public async generateHealthCheckXlsx() {

    // const maybeCircuits = await CircuitsRepo.getMultiple({ applyFilters: true })

    
    // const circuitIds = maybeCircuits.map((c) => c.id)

    // const chResult = await ClickHouse.getDataPoints(circuitIds)


    // await TempHealthStatusRepo.truncateTable()
    // await TempHealthStatusRepo.bulkInsert(chResult)
   

    const endDate = DateTime.now().toFormat('yyyy-MM-dd')
    const startDate = DateTime.now().minus({ days: 7 }).toFormat('yyyy-MM-dd')
    const startDay = DateTime.now().minus({ days: 7 }).toFormat('MMM_dd_yyyy')

    let datesForSelectQuery = [`ct.dt_${startDay} ${startDay}`]
    let crossTabNames = [`crosstab.dt_${startDay}`]
    let crossTabDataType = [`dt_${startDay} text`]

    const totalDays =
      DateTime.fromISO(endDate).diff(DateTime.fromISO(startDate), 'days').toObject().days! - 1
    for (let i = 1; i <= totalDays; i++) {
      let d = DateTime.fromISO(startDate).plus({ days: i }).toFormat('yyyy-MM-dd')
      let day = DateTime.fromISO(startDate).plus({ days: i }).toFormat('MMM_dd_yyyy')
      if (d <= endDate) datesForSelectQuery.push(`ct.dt_${day} ${day}`)
      crossTabNames.push(`crosstab.dt_${day}`)
      crossTabDataType.push(`dt_${day} text`)
    }

    const ch7dayMissingData = await TempHealthStatusRepo.getChHealthStatus(
      datesForSelectQuery,
      crossTabNames,
      crossTabDataType
    )

    if (!ch7dayMissingData.length) return { success: false, message: 'No missing circuit' }
    const excelHeaderName = Object.keys(ch7dayMissingData[0])
    const columnsNames = excelHeaderName
      .map((el) => {
        if (omitFields.includes(el)) return {}
        const date = !headerMapping[el]
          ? DateTime.fromFormat(el, 'MMM_dd_yyyy').toFormat('dd-MMM-yyyy')
          : ''
        return {
          header: headerMapping[el] ? headerMapping[el].name : date || '',
          key: el,
          width: headerMapping[el] ? headerMapping[el].width : 20,
        }
      })
      .filter((d) => Object.keys(d).length)

    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet()

    worksheet.columns = columnsNames

    worksheet.getRow(1).font = {
      bold: true,
    }
    ch7dayMissingData.map((md, i) => {
      worksheet.addRow(md)

      if (i > 0) {
        cellColor.map((cell: any) => {
          let rawStatus = worksheet.getCell(`${cell}${i + 1}`).value?.toString()

          let circuitType = 'ELEC'

          let splittedStatus = rawStatus ? rawStatus.split('-') : []
          if (splittedStatus.length > 1) {
            let status = splittedStatus.length ? splittedStatus[1].toLowerCase().trim() : null
            let count = splittedStatus.length ? Number(splittedStatus[0].trim()) : 0

            let ranges = DataHealthRange[circuitType][status]

            if (Object.keys(ranges).length && count >= ranges.start && count <= ranges.end) {
              worksheet.getCell(`${cell}${i + 1}`).value = `${count} - ${ranges.name || status}`
              worksheet.getCell(`${cell}${i + 1}`).font = {
                color: {
                  argb: ranges.color,
                },
              }
            }
          }
        })
      }
    })
    worksheet.views = [
      {
        state: 'frozen',
        xSplit: 4,
        ySplit: 1,
        topLeftCell: 'D1',
      },
    ]

    const currentDate = DateTime.now().toFormat('yyyy-MM-dd-HH-mm-ss')

    const filePath = path.resolve(__dirname, `../../Downloads/HealthCheck_${currentDate}.xlsx`)

    await workbook.xlsx.writeFile(path.resolve(filePath))

    let xlFileName = `HealthCheck_${currentDate}.xlsx`
    return { success: true, filePath, xlFileName }
  }

  public async slackFileUpload(fileName: string, xlFileName: string) {
    const result = await Slack.files.upload({
      channels: Env.get('MISSING_ALERT_SLACK_CHANNEL'),
      filename: xlFileName,
      file: fs.createReadStream(path.resolve(fileName)),
    })
    fs.unlinkSync(path.resolve(fileName))
    return result
  }
}
