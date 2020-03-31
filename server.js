const fetch = require('node-fetch')
const chalk = require('chalk')

const handleZone = async (settings, argv) => {
  switch (argv[3]) {
    case 'info':
      if (!argv[4])
        return console.log(
          chalk.red('Error:'),
          'Please include the zone you need info from!'
        )
      await zoneInfo(settings, argv)
      break
    case 'add':
      if (!argv[4])
        return console.log(
          chalk.red('Error:'),
          'Please include the zone you want to add!'
        )
      await zoneAdd(settings, argv)
      break
    case 'remove':
      if (!argv[4])
        return console.log(
          chalk.red('Error:'),
          'Please include the zone you want to remove!'
        )
      await zoneRemove(settings, argv)
      break
    default:
      break
  }
}

const handleRecord = async (settings, argv) => {
  switch (argv[3]) {
    case 'add':
      if (!argv[4])
        return console.log(
          chalk.red('Error:'),
          'Please include the zone you want to add the record to!'
        )
      if (!argv[5])
        return console.log(
          chalk.red('Error:'),
          'Please include the record you want to add the zone!'
        )
      await recordAdd(settings, argv)
      break
    case 'remove':
      if (!argv[4])
        return console.log(
          chalk.red('Error:'),
          'Please include the zone you want to remove the record from!'
        )
      if (!argv[5])
        return console.log(
          chalk.red('Error:'),
          'Please include the record you want to remove from the zone!'
        )
      await recordRemove(settings, argv)
      break
    default:
      break
  }
}

const zoneInfo = async (settings, argv) => {
  const requestBody = {
    zone: argv[4],
    token: settings.token
  }

  const request = await fetch(useSSL(settings) + '/zone-info', {
    method: 'post',
    body: JSON.stringify(requestBody),
    headers: { 'Content-Type': 'application/json' }
  })
  const { success, records, error } = await request.json()
  if (error) return console.log(chalk.red('Error:'), error)
  console.log('')
  console.log('Records for', chalk.cyan.bold(argv[4] + '.'))
  console.log(
    chalk.cyan('--------- ID --------- | ----------  Record --------')
  )
  Object.keys(records[argv[4]]).map(item => {
    console.log(item.padding(23) + `|  ${records[argv[4]][item]}`)
  })
  console.log('')
}

const zoneAdd = async (settings, argv) => {
  const requestBody = {
    zone: argv[4],
    token: settings.token
  }

  const request = await fetch(useSSL(settings) + '/zone-add', {
    method: 'post',
    body: JSON.stringify(requestBody),
    headers: { 'Content-Type': 'application/json' }
  })
  const { success, record, error } = await request.json()
  if (error) return console.log(chalk.red('Error:'), error)
  console.log('')
  console.log(chalk.cyan.bold(argv[4] + '.'), 'was added to the server.')
  console.log('To activate the the zone please add the following records:')
  console.log('')
  console.log(chalk.cyan('--- Type --- | ----------  Record --------'))
  console.log('NS'.padding(13) + `|  ${settings.server}`)
  console.log('TXT'.padding(13) + `|  ${record}`)
  console.log('')
}

const zoneRemove = async (settings, argv) => {
  const requestBody = {
    zone: argv[4],
    token: settings.token
  }

  const request = await fetch(useSSL(settings) + '/zone-remove', {
    method: 'post',
    body: JSON.stringify(requestBody),
    headers: { 'Content-Type': 'application/json' }
  })

  const { success, error } = await request.json()
  if (error) return console.log(chalk.red('Error:'), error)
  console.log('')
  console.log(chalk.cyan.bold(argv[4] + '.'), 'was removed.')
  console.log('')
}

const recordAdd = async (settings, argv) => {
  const requestBody = {
    zone: argv[4],
    record: argv[5],
    token: settings.token
  }

  const request = await fetch(useSSL(settings) + '/record-add', {
    method: 'post',
    body: JSON.stringify(requestBody),
    headers: { 'Content-Type': 'application/json' }
  })

  const { success, record, error } = await request.json()
  if (error) return console.log(chalk.red('Error:'), error)
  console.log('')
  console.log(chalk.green('Record added!'))
  console.log('ID: ', chalk.cyan.bold(record))
}

const recordRemove = async (settings, argv) => {
  const requestBody = {
    zone: argv[4],
    record: argv[5],
    token: settings.token
  }

  const request = await fetch(useSSL(settings) + '/record-remove', {
    method: 'post',
    body: JSON.stringify(requestBody),
    headers: { 'Content-Type': 'application/json' }
  })

  const { success, record, error } = await request.json()
  if (error) return console.log(chalk.red('Error:'), error)
  console.log('')
  console.log('Record removed from', chalk.cyan.bold(argv[4] + '.'))
  console.log('')
}

const useSSL = settings => {
  return settings.ssl
    ? 'https://' + settings.server
    : 'http://' + settings.server
}

module.exports = {
  handleZone,
  handleRecord,
  zoneAdd,
  zoneRemove,
  zoneInfo,
  recordAdd,
  recordRemove
}

String.prototype.padding = function(n, c) {
  var val = this.valueOf()
  if (Math.abs(n) <= val.length) {
    return val
  }
  var m = Math.max(Math.abs(n) - this.length || 0, 0)
  var pad = Array(m + 1).join(String(c || ' ').charAt(0))
  //      var pad = String(c || ' ').charAt(0).repeat(Math.abs(n) - this.length);
  return n < 0 ? pad + val : val + pad
  //      return (n < 0) ? val + pad : pad + val;
}
