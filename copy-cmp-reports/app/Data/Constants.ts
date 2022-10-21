export const excludeCustomers = [113, 115, 1, 92, 61, 134, 78]
export const excludeSites = [30278, 30167, 30141, 30265]

export const DataHealthRange = {
  ELEC: {
    'healthy': {
      name: 'Healthy',
      start: 1440,
      end: 1440,
      color: '518e3d',
    },
    'partial': {
      name: 'Partial',
      start: 1400,
      end: 1439,
      color: '597af7',
    },
    'un healthy': {
      name: 'Un Healthy',
      start: 0,
      end: 1399,
      color: 'FF0000',
    },
  },
  GAS: {
    'healthy': {
      name: 'Healthy',
      start: 48,
      end: 48,
      color: '518e3d',
    },
    'partial': {
      name: 'Partial',
      start: 46,
      end: 47,
      color: '597af7',
    },
    'un healthy': {
      name: 'Un Healthy',
      start: 0,
      end: 45,
      color: 'FF0000',
    },
  },
  ELECTRALINK: {
    'healthy': {
      name: 'Healthy',
      start: 48,
      end: 48,
      color: '518e3d',
    },
    'partial': {
      name: 'Partial',
      start: 46,
      end: 47,
      color: '597af7',
    },
    'un healthy': {
      name: 'Un Healthy',
      start: 0,
      end: 45,
      color: 'FF0000',
    },
  },
}

export const headerMapping: any = {
  customer: {
    name: 'Customer Name',
    width: 20,
  },
  site: {
    name: 'Site Name',
    width: 20,
  },
  mac_id: {
    name: 'MAC ID',
    width: 20,
  },
  circuit_id: {
    name: 'Circuit ID',
    width: 10,
  },
  circuit: {
    name: 'Circuit Name',
    width: 20,
  },
}

export const omitFields = ['circuit_type', 'is_electralink_circuit']

export const cellColor = ['F', 'G', 'H', 'I', 'J', 'K', 'L']
