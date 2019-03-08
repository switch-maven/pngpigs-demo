const { Model } = require('objection');
const plivo = require('plivo');

class Account extends Model {
  static get tableName () {
    return 'accounts'
  }

  static sendVerification(mobile, code) {
    const client = new plivo.Client();
    return client.messages.create(
      "610402540888", // src (should create a number, PNG not supported in Plivo)
      mobile, // dst (destination)
      `${code} is your code for verifying account with phone number ${mobile}.`, // text
    )
  }

  // This object defines the relations to other models.
  static get relationMappings () {
    return {
      assets: {
        relation: Model.HasManyRelation,
        // The related model. This can be either a Model subclass constructor or an
        // absolute file path to a module that exports one.
        modelClass: Asset,
        join: {
          from: 'accounts.id',
          to: 'assets.account_id'
        }
      }
    }
  }
}

class Asset extends Model {
  static get tableName () {
    return 'assets'
  }

  // This object defines the relations to other models.
  static get relationMappings () {
    return {
      events: {
        relation: Model.HasManyRelation,
        // The related model. This can be either a Model subclass constructor or an
        // absolute file path to a module that exports one.
        modelClass: Event,
        join: {
          from: 'assets.id',
          to: 'events.asset_id'
        }
      },
      owner: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account,
        join: {
          from: 'assets.account_id',
          to: 'accounts.id'
        }
      }
    }
  }
}

class Event extends Model {
  static get tableName () {
    return 'events'
  }

  static get virtualAttributes () {
    return ['time']
  }

  time () {
    return this.created_at
  }
}

module.exports = {
  Account,
  Asset,
  Event
}
