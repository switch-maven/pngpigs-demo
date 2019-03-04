const { Model } = require('objection');

class Account extends Model {

  static get tableName() {
    return 'accounts';
  }

  // This object defines the relations to other models.
  static get relationMappings() {
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
  static get tableName() {
    return 'assets';
  }

  // This object defines the relations to other models.
  static get relationMappings() {
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
      }
    }
  }
}

class Event extends Model {
  static get tableName() {
    return 'events';
  }

  static get virtualAttributes() {
    return ['time'];
  }

  time() {
    return this.created_at
  }
}

module.exports = {
  Account, Asset, Event
}
