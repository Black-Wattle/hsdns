const path = require('path')
const homedir = require('os').homedir()
const flatCache = require('flat-cache')
const cache = flatCache.load('config', path.resolve(homedir + '/.hsdns'))
const crypto = require('crypto')

// Setup Default server
const defaultServer = 'dns.hsd.tools'

let argv = process.argv // Args
let argc = process.argv.length // Arg length

;(async () => {
  switch (argv[2]) {
    case 'add':
      break
    case 'remove':
      break
    case 'server':
      const serverObj = {
        server: argv[3],
        token: settings.token
      }
      cache.setKey('settings', serverObj)
      cache.save()
      console.log(`Now using ${argv[3]} as the server`)
      break

    case 'reset':
      console.error(`WARNING!`)
      console.log('You are trying to reset the CLI and delete your keys.')
      console.log(
        "If you are sure you want to do this type: 'hsdns delete-my-keys'"
      )
      break
    case 'delete-my-keys':
      const object = {
        server: defaultServer,
        token: generateToken()
      }
      cache.setKey('settings', object)
      cache.save()
      console.log(`You've reset the CLI`)
      break
    default:
      console.log('Could not find that command!')
      console.log('-------------------')
      outputHelp()
      break
  }
})()

// Generate random token
const generateToken = () => {
  /// generate key
  return crypto.randomBytes(48).toString('hex')
}

// Help commands
const outputHelp = () => {
  console.log('      addZone <HSD zone name>')
  console.log('      getRecords <HSD url>')
  console.log('      addRecord <HSD url> <record type> <value>')
  console.log('      removeRecord <HSD url> <record type> <value>')
  console.log('      server <server-ip>')
  console.log('      reset - Resets the CLI')
}

// Check if this is first run
let settings = cache.getKey('settings')
if (!settings) {
  console.log('Welcome to hsdns!')
  console.log(
    'Your credentials have been setup. You can now use the following commands:'
  )
  outputHelp()

  // Create Settings
  const settingObj = {
    server: defaultServer,
    token: generateToken()
  }
  cache.setKey('settings', settingObj)
  cache.save()
  return
}
