import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  Form: a.model({
    userId: a.string(),
    createdAt: a.datetime().default(() => new Date().toISOString()),
    published: a.boolean().default(false),
    name: a.string(),
    description: a.string().default(""),
    content: a.string().default("[]"),
    visits: a.integer().default(0),
    submissions: a.integer().default(0),
    shareURL: a.string(),
    FormSubmissions: a.hasMany('FormSubmissions', 'formId') // One-to-many relationship
  }).authorization(allow => [allow.publicApiKey()]),

  FormSubmissions: a.model({
    formId: a.string(),
    createdAt: a.datetime().default(() => new Date().toISOString()),
    content: a.string(),
    form: a.belongsTo('Form', 'formId')
  }).authorization(allow => [allow.publicApiKey()])
});

// Used for code completion / highlighting when making requests from frontend
export type Schema = ClientSchema<typeof schema>;

// defines the data resource to be deployed
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 }
  }
});
