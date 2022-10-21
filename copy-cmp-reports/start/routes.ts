import Route from '@ioc:Adonis/Core/Route'

// Route.group(() => {
//   Route.group(() => {
//     Route.get('/nonStreamingCircuitsReport', 'StreamingReportsController.getNonStreamingCircuit')
//     Route.get('/missingPdfReportEmail', 'MissingPdfsController.missingPdfReport')
//     Route.get('/streamingDataAlert', 'StreamingDataAlertsController.getStreamingData')

    
//     Route.get('/siteExcelReport','getSites.siteExcel')
//     //Logs
//     Route.group(() => {
//       Route.get(':id', 'LogsController.get')
//       Route.get('', 'LogsController.getMultiple')
//     })
//       .prefix('logs')
//       .middleware(['token', 'superAdminOnly'])
      
//   }).prefix('api')
// })
//   .prefix('cmp-reports')
//   .middleware(['token'])

Route.get('/customerExcel','CustomersController.customerExcel')
Route.get('/siteExcel', 'SitesController.sitesExcel')
Route.get('/test', 'TestsController.test').middleware(['token'])    