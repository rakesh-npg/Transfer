import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import View from '@ioc:Adonis/Core/View'
import { CircuitsRepo, ClickHouseRepo } from 'App/Repositories'
import { CmpBo, HtmlToPdf, Mailgun } from 'App/Services'
import { MissingPdf } from 'App/Validators'
import { DateTime } from 'luxon'
import path from 'path'
import fs from 'fs/promises'
import StreamingDataAlertsController from './StreamingDataAlertsController'
import { excludeSites } from 'App/Data/Constants'
const SDC = new StreamingDataAlertsController()

type CircuitDetails = {
  customerid: number
  customerName: string
  ctid: number
  site_id: number
  siteName: string
  meterName: string
  macIDs: string
  lastStreamingDate: string
  currentStatus?: string
}
export default class MissingPdfsController {
  public async missingPdfReport({ response, request }: HttpContextContract) {
    const payload = await request.validate(MissingPdf.MissingPdfReportValidator)
 
    const data: any = await this.commonFunction(payload)
    if (!data.status) return response.noContent()

    this.formatPdfData(data)

    const pdfFileName: string = `Missing_Report_${data.result.currentDate2}`
    const pdfFileSrc = path.resolve(__dirname, `../../Downloads/${pdfFileName}.pdf`)
    const htmlContent = await View.render('missing_pdf', data.result)
    await HtmlToPdf.convert({
      value: htmlContent,
      key: pdfFileSrc,
    })

    if (payload.emailFlag && payload.recipientsTo?.length) {
      const recipientsTo = payload.recipientsTo.join(',')
      const recipientsCC = payload.recipientsCC ? payload.recipientsCC.join(',') : ''
      const recipientsBCC = payload.recipientsBCC ? payload.recipientsBCC.join(',') : ''

      const file = {
        filename: `${pdfFileName}.pdf`,
        data: await fs.readFile(pdfFileSrc),
      }

      const attachment = [file]
      const healthCheckFile: any = await SDC.generateHealthCheckXlsx()

      if (healthCheckFile.success) {
        const file2 = {
          filename: `Health Check ${healthCheckFile.xlFileName}`,
          data: await fs.readFile(healthCheckFile.filePath),
        }
        attachment.push(file2)
      }

      const messageData = {
        from: 'clearVUE-support <clearVUE-support@support.clearvuesystems.com>',
        to: recipientsTo,
        cc: recipientsCC,
        bcc: recipientsBCC,
        subject: `Missing Report as on ${data.result.currentDate2}`,
        // text: ``,
        attachment,
        html: `<p>Hi All,<br><br> Please find the missing report and 7 day streaming health check report attached along with this email. The missing report could be download from the CMP, by clicking on 'Report' -> 'Missing Report' on the left hand menu.
      <br><br><br> Thanks and Regards, <br> Clearvue Support Team </p>`,
      }

      let mailStatus = await Mailgun.sendMail(messageData)

      await fs.unlink(pdfFileSrc)
      await fs.unlink(healthCheckFile.filePath)

      if (mailStatus.status === 200)
        return response.send({
          msg: 'Mail successfully sent',
          recipientsTo,
          recipientsCC,
          recipientsBCC,
        })
      else return response.send({ msg: 'Mail not sent', err: mailStatus.message })
    }
    await fs.unlink(pdfFileSrc)
    return response.download(path.resolve(__dirname, `../../Downloads/${pdfFileName}.pdf`))
   
  }

  protected async commonFunction(payload) {
    const maybeCircuits = await CircuitsRepo.getMultiple({ applyFilters: true })
    if (!maybeCircuits.length) return false
    let filteredCircuits: any[]
    if (payload.circuitIds && payload.customersIds && payload.meterIds) {
      filteredCircuits = maybeCircuits.filter(
        (f) =>
          payload.circuitIds.includes(f.id) &&
          payload.customerIds.includes(f.customer.id) &&
          payload.meterIds.includes(f.meterId)
      )
    } else if (payload.siteIds && payload.customersIds) {
      filteredCircuits = maybeCircuits.filter(
        (f) => payload.siteIds.includes(f.site.id) && payload.customerIds.includes(f.customer.id)
      )
    } else if (payload.siteIds && payload.meterIds) {
      filteredCircuits = maybeCircuits.filter(
        (f) => payload.siteIds.includes(f.site.id) && payload.meterIds.includes(f.meterId)
      )
    } else if (payload.customerIds && payload.meterIds) {
      filteredCircuits = maybeCircuits.filter(
        (f) => payload.customerIds.includes(f.customer.id) && payload.meterIds.includes(f.meterId)
      )
    } else if (payload.customerIds) {
      filteredCircuits = maybeCircuits.filter((f) => payload.customerIds.includes(f.customer.id))
    } else if (payload.siteIds) {
      filteredCircuits = maybeCircuits.filter((f) => payload.siteIds.includes(f.site.id))
    } else if (payload.meterIds) {
      filteredCircuits = maybeCircuits.filter((f) => payload.meterIds.includes(f.meterId))
    } else {
      const circuits = await CircuitsRepo.getMultiple({ applyFilters: true })
      if (!circuits.length) return false
      filteredCircuits = circuits
    }

    filteredCircuits = filteredCircuits.filter((f) => !excludeSites.includes(f.site.id))

    const currentDateTime = DateTime.now()
    const currentDate = currentDateTime.toFormat('yyyy-MM-dd')
    const yesterdayDate = currentDateTime.minus({ day: 1 }).toFormat('yyyy-MM-dd')
    const past14Day = currentDateTime.minus({ day: 14 }).toFormat('yyyy-MM-dd')

    const missingData = await ClickHouseRepo.getNonStreamingCircuitsClickHouse(
      filteredCircuits.map((c) => c.id),
      yesterdayDate,
      currentDate
    )
    if (!missingData.length) return { status: 0, message: 'No Data', result: [] }
    const circuitIds = missingData.map((c) => c.circuit_id)

    const nonStreamingCustomers = await CmpBo.Eniscope.getMultiple(
      circuitIds,
      currentDate,
      past14Day
    )
    let eniscopeDate: any = {}
    if (nonStreamingCustomers.length != 0) {
      nonStreamingCustomers.map((data: any) => {
        eniscopeDate[data.circuitId] = { last_stream_date: data.lastStreamDate }
      })
    }

    const circuitDetails = await CircuitsRepo.getMultiple({ circuitIds })
    const circuitDetailsIds = circuitDetails.map((c) => c.id)

    const lastUpdatedDate = await ClickHouseRepo.getDate(circuitDetailsIds)
    let indexedLastUpdatedDate = {}
    if (lastUpdatedDate.length) {
      lastUpdatedDate.map((data: any) => {
        indexedLastUpdatedDate[data.circuit_id] = data.last_updated_time
      })
    }

    const circuitsDetails: CircuitDetails[] = []
    let circuitsData = {}
    circuitDetails.map((val: any) => {
      // console.log({i,val})
      let circuit = {
        customerid: val.customer.id,
        customerName: val.customer.name,
        ctid: val.id,
        site_id: val.site.id,
        siteName: val.site.name,
        meterName: val.meter.meterName,
        macIDs: val.macId,
        lastStreamingDate: indexedLastUpdatedDate[val.id] || 'No Data in CH',
      }

      circuitsData[val.circuit_id] = circuit
      circuitsDetails.push(circuit)
    })

    let finalRes: any = []
    circuitsDetails.map((val) => {
      val.currentStatus = 'N/A in Eniscope'
      // finalRes.push(val)
      if (eniscopeDate[val.ctid]) {
        let esDate = this.maxDate(eniscopeDate[val.ctid].last_stream_date)
        let chDate = val.lastStreamingDate
        if (chDate < esDate) {
          // let msg = 'Has data'
          // console.log(new Date(chDate), new Date(esDate));
          
          var daylist = this.getDaysArray(new Date(chDate), new Date(esDate))
          // console.log(daylist)
          val.currentStatus = daylist
          finalRes.push(val)
        }

      } else {
        finalRes.push(val)
      }
    })

    /* Group by mac_id with max_date - starts */
    let groupByMacId: any = this.groupByKey(finalRes, 'macIDs', { omitKey: true })
    let newArr: any = []
    for (let obj in groupByMacId) {
      let temp = groupByMacId[obj]
      let plucked = await this.pluck(temp)
      let minDate = this.minDate(plucked)
      let finalObj = {
        macId: obj,
        lastStreamDate: minDate,
        customerId: temp[0].customerid,
        customerName: temp[0].customerName,
        siteId: temp[0].site_id,
        siteName: temp[0].siteName,
        meterName: temp[0].meterName,
        currentStatus: temp[0].currentStatus,
      }
      newArr.push(finalObj)
    }
    let groupByCustomer: any = this.groupByKey(newArr, 'customerName', { omitKey: true })

    let customerArr: any = []
    for (let obj in groupByCustomer) {
      let temp = groupByCustomer[obj]
      let macDateStatusArr: any = []
      temp.map((a: any) => {
        macDateStatusArr.push({
          macId: a.macId,
          date: this.formatDate(a.lastStreamDate),
          status: a.currentStatus,
          siteId: a.siteId,
          siteName: a.siteName,
          meterName: a.meterName,
        })
      })

      let finalObj = {
        macDateStatusArr,
        customerName: obj,
        customerId: groupByCustomer[obj][0].customerId,
        siteName: groupByCustomer[obj][0].siteName,
        siteId: groupByCustomer[obj][0].siteId,
      }
      customerArr.push(finalObj)
    }
    /* Group by mac_id with max_date - ends */

    const date = new Date()
    const formattedDate = date
      .toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
      .replace(/ /g, '-')

    let data = {
      currentDate: formattedDate,
      currentDate2: currentDate,
      endDate: past14Day,
      starDate: yesterdayDate,
      missingData: customerArr,
    }

    // console.log(data)
    return { status: 1, result: data }
  }

  public maxDate = (arr: any) =>
    arr.reduce((first: any, second: any) => (first > second ? first : second))

  public minDate = (arr: any) =>
    arr.reduce((first: any, second: any) => (first < second ? first : second))

  public groupByKey = (list: any, key: any, { omitKey = false }) =>
    list.reduce(
      (hash: any, { [key]: value, ...rest }) => ({
        ...hash,
        [value]: (hash[value] || []).concat(omitKey ? { ...rest } : { [key]: value, ...rest }),
      }),
      {}
    )

  public formatDate = (date: string) => date.split(' ')[0].split('-').reverse().join('.')

  public pluck = (temp: any) => temp.map((a: any) => a.lastStreamingDate)

  public formatPdfData = (data: any) => {
    const formatted: any = []

    data.result.missingData.map((el: any) => {
      el.macDateStatusArr.map((ms: any) => {
        let splitted = {
          customerName: el.customerName,
          customerId: el.customerId,
          siteName: ms.siteName,
          siteId: ms.siteId,
          macId: ms.macId,
          date: ms.date,
          status: ms.status,
          meterName: ms.meterName,
        }
        formatted.push(splitted)
      })
    })

    return (data.result.missingData = formatted)
  }
  public getDaysArray = (s: Date, e: Date) => {
    const startDate = DateTime.fromISO(s.toISOString().split('T')[0]).plus({day: 1})
    const endDate = DateTime.fromISO(e.toISOString().split('T')[0])
    let r: any = {}
    // console.log(startDate, 's');
    // console.log(endDate, 'e');
    
    for (var d = startDate; d <= endDate; d=d.plus({day: 1})) {
      // console.log('ada', startDate.toString());
      
      let shortMonth = startDate.monthShort
      let day = startDate.day
      // console.log(day, 'Day');
      
      r[shortMonth] ? (r[shortMonth] += ', ' + day) : (r[shortMonth] = day.toString())
    }

    let statusString = 'Has data for '
    
    for (let i in r) {
      statusString += `${i} ${r[i]} `
    }
    return statusString
  }

  public sortDate = (array: any) => {
    array.sort((a: any, b: any) => a.date.getTime() - b.date.getTime())
  }
}
