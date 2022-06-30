require('dotenv').config()

const Helpers = require('../lib/helpers')
const MailApi = require('../lib/api')
const EncConfig = require('../lib/config')

const main = async (initialDate = null) => {

  const config = EncConfig.decrypt()
  const client = new MailApi(config)

  const date = (initialDate? new Date(initialDate) : new Date())
  const timestamp = date.getTime()

  const from = `test+${timestamp}@theeye.io`
  const subject = `test#${timestamp}`

  const hashMail = Helpers.createHash(`${from}${subject}${date.toISOString()}`)

  const payload = {
    folder: config.folders.INBOX,
    from,
    subject,
    reception_date: date,
    mail_hash: hashMail,
    attachment_filename: `${subject}.pdf`,
    attachment_hash: hashMail,
    attachment_renamed: `${subject}.pdf`
  }

  console.log(payload)
  const response = await client.checkExists(payload)

  return response
}

main(process.argv[2])
  .then(console.log)
  .catch(console.error)

