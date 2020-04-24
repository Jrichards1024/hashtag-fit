let { Model, snakeCaseMappers } = require('objection');
let Password = require('objection-password')();

class User extends Password(Model) {
  static get tableName() {
    return 'users';
  }

  static get columnNameMappers() {
    return snakeCaseMappers();
  }
  static get relationMappings() {
    let Message = require('./messages');
    let messageInfo = require('./messageInfo')
    return {
      userInfo: {
        relation: Model.HasManyRelation,
        modelClass: Message,
        join: {
          from: 'users.id',
          to: 'messages.user_id'
        }
      },
      user: {
        relation:Model.HasOneThroughRelation,
        modelClass: Message,
        join: {
          from: 'users.user_name',
          through: {
            from: 'users.users_id',
            to: 'messages.user_id'
          },
          to: 'messages.user_name'
        }
      },
      MessageRelation: {
        relation:Model.ManyToManyRelation,
        modelClass: Message,
        join: {
          from: 'users.id',
          through: {
            from: 'messageInfo.user_id',
            to: 'messageInfo.message_id',
          to: 'messages.id'}
        }
      },
      userCombineMessageInfo: {
        relation: Model.HasManyRelation,
        modelClass: messageInfo,
        join: {
          from: 'users_id',
          to: 'messageInfo.user_id'
        }
      }
    }

  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['userName','firstName','lastName','email', 'password'],

      properties: {
        id: { type: 'integer' },
        userName: {type: 'string'},
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
      },
    };
  }
}

module.exports = User;
