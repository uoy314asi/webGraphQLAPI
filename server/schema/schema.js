const { projects, clients } = require('../sampleData.js')

// Mongoose models
const Project = require('../models/Project.js')
const Client = require('../models/Client.js')

const {
	GraphQLObjectType,
	GraphQLID,
	GraphQLString,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull,
	GraphQLEnumType,
} = require('graphql')

// Project Type
const ProjectType = new GraphQLObjectType({
	name: 'Project',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		// image: { type: GraphQLString },
		description: { type: GraphQLString },
		status: { type: GraphQLString },
		client: {
			type: ClientType,
			resolve(parent, args) {
				return Client.findById(parent.clientId)
			},
		},
	}),
})

// CLient Type
const ClientType = new GraphQLObjectType({
	name: 'Client',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		email: { type: GraphQLString },
		phone: { type: GraphQLString },
	}),
})

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		projects: {
			type: new GraphQLList(ProjectType),
			resolve(parent, args) {
				return Project.find()
			},
		},
		project: {
			type: ProjectType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				return Project.findById(args.id)
			},
		},
		clients: {
			type: new GraphQLList(ClientType),
			resolve(parent, args) {
				return Client.find()
			},
		},
		client: {
			type: ClientType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				return Client.findById(args.id)
			},
		},
	},
})

// Mutations

const mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		// Add Client
		addClient: {
			type: ClientType,
			args: {
				name: { type: GraphQLNonNull(GraphQLString) },
				email: { type: GraphQLNonNull(GraphQLString) },
				phone: { type: GraphQLNonNull(GraphQLString) },
			},
			resolve(parent, args) {
				const client = new Client({
					name: args.name,
					email: args.email,
					phone: args.phone,
				})
				return client.save()
			},
		},
		// Delete Client
		deleteClient: {
			type: ClientType,
			args: {
				id: { type: GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args) {
				return Client.findByIdAndRemove(args.id)
			},
		},
		// Add a project
		addProject: {
			type: ProjectType,
			args: {
				name: { type: GraphQLNonNull(GraphQLString) },
				// image: { type: GraphQLNonNull(GraphQLString) },
				description: { type: GraphQLNonNull(GraphQLString) },
				status: {
					type: new GraphQLEnumType({
						name: 'ProjectStatus',
						values: {
							new: { value: 'Not Started' },
							progress: { value: 'In Progress' },
							completed: { value: 'Completed' },
						},
					}),
					defaultValue: 'Not Started',
				},
				clientId: { type: GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args) {
				const project = new Project({
					name: args.name,
					// image: args.image,
					description: args.description,
					status: args.status,
					clientId: args.clientId,
				})
				return project.save()
			},
		},
		// Delete a project
		deleteProject: {
			type: ProjectType,
			args: {
				id: { type: GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args) {
				return Project.findByIdAndRemove(args.id)
			},
		},
		// Update a project
		updateProject: {
			type: ProjectType,
			args: {
				id: { type: GraphQLNonNull(GraphQLID) },
				name: { type: GraphQLString },
				// image: { type: GraphQLString },
				description: { type: GraphQLString },
				status: {
					type: new GraphQLEnumType({
						name: 'ProjectStatusUpdated',
						values: {
							new: { value: 'Not Started' },
							progress: { value: 'In Progress' },
							completed: { value: 'Completed' },
						},
					}),
				},
			},
			resolve(parent, args) {
				return Project.findByIdAndUpdate(
					args.id,
					{
						$set: {
							name: args.name,
							// image: args.image,
							description: args.description,
							status: args.status,
						},
					},
					{ new: true }
				)
			},
		},
	},
})

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation,
})
