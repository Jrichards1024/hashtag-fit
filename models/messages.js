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
        userName: {type: 'string'},
        imageLink: {type:'string'},
        hashtag: {type:'array'},
        caption: { type: 'string', minLength: 1 }
      }
    };
  }
}

module.exports = Message;
