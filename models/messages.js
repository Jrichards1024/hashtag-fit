let { Model, snakeCaseMappers } = require('objection');

class Message extends Model {
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
    return 'messages';
  }

  static get relationMappings() {
    let User = require('./User');
    let messageInfo = require('./messageInfo');

    return {

      messageCombineMessageInfo: {
        relation: Model.HasManyRelation,
        modelClass: messageInfo,
        join: {
          from: 'messages.id',
          to: 'messageInfo.message_id'
        }
      },
      userInfo: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'messages.user_id',
          to: 'users.id'
        }
      },
      messageInfoTwo: {
        relation: Model.HasManyRelation,
        modelClass: messageInfo,
        join: {
          from: 'messages.user_id',
          to: 'messageInfo.user_id'
        }
      },
    }
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'imageLink',
        'hashtag',
      ],
      properties: {
        id: {type:'integer'},
        userId: { type: 'integer' },
        imageLink: {type:'string'},
        hashtag: {type:'string'},
        caption: { type: 'string', minLength: 1 }
      }
    };
  }
}

module.exports = Message;
