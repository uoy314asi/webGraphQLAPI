import { gql } from '@apollo/client'

const ADD_PROJECT = gql`
	mutation addProject(
		$name: String!
		# $image: String!
		$description: String!
		$status: ProjectStatus!
		$clientId: ID!
	) {
		addProject(
			name: $name
			# image: $image
			description: $description
			status: $status
			clientId: $clientId
		) {
			id
			name
			# image
			description
			status
			client {
				id
				name
				email
				phone
			}
		}
	}
`

const DELETE_PROJECT = gql`
	mutation DeleteProject($id: ID!) {
		deleteProject(id: $id) {
			id
		}
	}
`

const UPDATE_PROJECT = gql`
	mutation updateProject(
		$id: ID!
		$name: String!
		# $image: String!
		$description: String!
		$status: ProjectStatusUpdated!
	) {
		updateProject(
			id: $id
			name: $name
			# image: $image
			description: $description
			status: $status
		) {
			id
			name
			# image
			description
			status
			client {
				id
				name
				email
				phone
			}
		}
	}
`

export { ADD_PROJECT, DELETE_PROJECT, UPDATE_PROJECT }
