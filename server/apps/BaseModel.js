import fs from 'fs'


export default class BaseModel {
    constructor(fields) {
        if (!('id' in fields)) this.id = Date.now().toString(36) + Math.random().toString(36).substring(2)
        Object.entries(fields).forEach(
            ([key, value]) =>
                this[key] = Object.getPrototypeOf(value.constructor).name === 'BaseModel' ?
                    value.id : value
        )
    }

    serialize() {
        return Object.fromEntries(
            Object.getOwnPropertyNames(this).map(
                property => [property, this[property]]
            )
        )
    }

    async save(file, callback=()=>{}) {
        await fs.readFile(
            file,
            async (error,
                   buffer
            ) => {
                let data = JSON.parse(buffer)
                let log = data.find(element => element.id === this.serialize().id)
                if(log) {
                    data[data.indexOf(log)] = this.serialize()
                } else {
                    data.push(this.serialize())
                }
                await fs.writeFile(
                    file,
                    JSON.stringify(data),
                    async (error) => {callback()}
                )
            }
        )
    }

    static find(query) {
        return JSON.parse(
            fs.readFileSync(this.file)
        ).filter(
            instance => Object.entries(query).every(
                ([key, value]) => instance[key] === value
            )
        ).map(data => new this.prototype.constructor(data))
    }

    static findOne(query) {
        return this.find(query)[0]
    }

    static findById(id) {
        return this.findOne({id: id})
    }

    static async deleteOne(query, callback=()=>{}) {
        const data = JSON.parse(
            fs.readFileSync(this.file)
        ).filter(
            instance => Object.entries(query).every(
                ([key, value]) => instance[key] !== value
            )
        )
        await fs.writeFile(
            this.file,
            JSON.stringify(data),
            async (error) => {callback()}
        )
    }

    static async deleteMany(queries, callback=()=>{}) {
        const data = JSON.parse(
            fs.readFileSync(this.file)
        ).filter(
            instance => queries.every(
                query => Object.entries(query).every(
                    ([key, value]) => instance[key] !== value
                )
            )
        )
        await fs.writeFile(
            this.file,
            JSON.stringify(data),
            async (error) => {callback()}
        )
    }

    static async findByIdAndRemove(id, callback=()=>{}) {
        await this.deleteOne({id: id}, callback)
    }
}
