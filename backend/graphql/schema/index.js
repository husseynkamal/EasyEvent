const { buildSchema } = require("graphql");

module.exports = buildSchema(`
  type Booking {
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
  }

  type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    creator: User!
  }

  type User {
    _id: ID!
    email: String!
    password: String
    createdEvents: [Event!]
  }

  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }

  type DeleteEvent {
    message: String!
  }

  input EventInput {
    title: String!
    price: Float!
    date: String!
    description: String!
  }

  input UserInput {
    email: String!
    password: String!
  }

  type RootQuery {
    login(email: String!, password: String!): AuthData!
    events: [Event!]!
    bookings: [Booking!]!
  }

  type RootMutation {
    createUser(userInput: UserInput): AuthData!
    createEvent(eventInput: EventInput): Event
    updateEvent(eventInput: EventInput, eventId: ID!): Event
    deleteEvent(eventId: ID!): DeleteEvent
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
