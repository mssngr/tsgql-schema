import {
  GraphQLBoolean,
  GraphQLFieldConfig,
  GraphQLFieldConfigArgumentMap,
  GraphQLFieldConfigMap,
  GraphQLFloat,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInputType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLString,
  GraphQLType,
  GraphQLUnionType,
  GraphQLError,
  Kind,
} from 'graphql'
import { Project } from 'ts-morph'

export default function () {
  const project = new Project()
  const sourceFile = project.addSourceFileAtPath(__dirname + '../../../schema.ts')
  const query = sourceFile.getInterface('Query')
  if (query) {
    const fields = query.getMethods().reduce((accum, method) => {
      const fieldName = method.getName()
      const args: GraphQLFieldConfigArgumentMap = method
        .getParameters()
        .reduce((accum, param) => ({ [param.getName()]: GraphQLString }), {})
      const fieldConfig: GraphQLFieldConfig<unknown, unknown> = { args, type: GraphQLString }
      return { ...accum, [fieldName]: fieldConfig }
    }, {})

    return new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields,
      }),
      // mutation: new GraphQLObjectType({ name: 'Mutation' }),
    })
  }
}
