let { Model, snakeCaseMappers} = require('objection');

class messageInfo extends Model {
  static get columnNameMappers() {
    /*
      In JavaScript we want camel case (e.g., createdAt), but
      in SQL we want snake case (e.g., created_at).

      snakeCaseMappers tells Objection to translate between
      the two.
    */
    return snakeCaseMappers();
  }

  static get tableName() {
    return 'messageInfo';
  }

  static get relationMappings() {
    let Message = require('./messages');
    let User = require('./User')

    return {
      messageCombineMessageInfo: {
        relation: Model.BelongsToOneRelation,
        modelClass: Message,
        join: {
          from: 'messageInfo.message_id',
          to: 'messages.id'
        }
      },
      userCombineMessageInfo: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'messageInfo.user_id',
          to: 'users.id'
        }
      }

      }
    }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: {type:'integer'},
        userId: { type: 'integer' },
        messageId: {type: 'integer'},
        userName: {type: 'string'},
        comments: {type:'string'},
        likes: {type:'integer'},
      }
    };
  }
}

module.exports = messageInfo;
