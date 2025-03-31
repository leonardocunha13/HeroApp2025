import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  Form: a.model({
    userId: a.string(),
    createdAt: a.string().default('now'),
    published: a.boolean().default(false),
    name: a.string(),
    description: a.string(),
    content: a.string().default('[]'),
    visits: a.integer().default(0),
    submissions: a.integer().default(0),
    shareURL: a.string(), // no unique constraint
    client: a.string(),
    formSubmissions: a.hasMany('FormSubmissions', 'formId'),
  }),

  FormSubmissions: a.model({
    id: a.integer().required(),
    createdAt: a.string().default('now'),
    formId: a.id(),
    content: a.string().required(),
    // 2. Create a belongsTo relationship with Form
    form: a.belongsTo('Form', 'formId'),
  }),
}).authorization((allow) => allow.publicApiKey());  // API key authorization

// Used for code completion / highlighting when making requests from frontend
export type Schema = ClientSchema<typeof schema>;

// Defines the data resource to be deployed
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 },
  },
});
