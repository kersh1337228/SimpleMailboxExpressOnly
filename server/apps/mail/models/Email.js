import BaseModel from '../../BaseModel.js'
import User from '../../auth/models/User.js'
import path from "path";


export default class Email extends BaseModel {
    constructor(fields) {
        if (!('title' in fields)) fields.title = '<No title>'
        if (!('checked' in fields)) fields.checked = false
        if (!('sending_time' in fields)) fields.sending_time = new Date()
        super(fields)
    }

    static get file() {
        return path.resolve('apps', 'mail', 'models', 'emails.json')
    }

    async save(callback) {
        await super.save(Email.file, callback)
    }

    static async check_consistency() {
        const emails = Email.find({})
        emails.forEach(
            async email => {
                const [sender, recipient] = [
                    await User.findById(email.sender),
                    await User.findById(email.recipient)
                ]
                if (!(sender.emails.includes(email.id)) &&
                    !(recipient.emails.includes(email.id))) {
                    await Email.findByIdAndRemove(email.id)
                }
            }
        )
    }
}