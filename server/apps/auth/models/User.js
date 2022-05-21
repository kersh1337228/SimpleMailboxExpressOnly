import BaseModel from '../../BaseModel.js'
import Email from '../../mail/models/Email.js'
import path from 'path'


export default class User extends BaseModel {
    constructor(fields) {
        if (!('emails' in fields)) fields.emails = []
        super(fields)
    }

    static get file() {
        return path.resolve('apps', 'auth', 'models', 'users.json')
    }

    async save(callback) {
        await super.save(User.file, callback)
    }

    get_emails(filter='all') {
        let emails = this.emails.map(
            email_id => {
                let email = Email.findById(email_id)
                console.log(email)
                email.sender = User.findById(email.sender)
                email.recipient = User.findById(email.recipient)
                return email
            }
        )
        switch (filter) {
            case 'received':
                emails = emails.filter(email => email.recipient.id === this.id)
                break
            case 'sent':
                emails = emails.filter(email => email.sender.id === this.id)
                break
        }
        return emails.sort((a, b) => {
            return new Date(a.sending_time) < new Date(b.sending_time) ?
                1 : new Date(a.sending_time) > new Date(b.sending_time) ? -1 : 0
        })
    }
}
