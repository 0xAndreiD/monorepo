import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CompanyTaskItem = {
  __typename?: 'CompanyTaskItem';
  id: Scalars['ID'];
  description: Scalars['String'];
  isCompleted: Scalars['Boolean'];
};

export type CompanyTaskList = {
  __typename?: 'CompanyTaskList';
  name: Scalars['String'];
  tasks: Array<CompanyTaskItem>;
};

export enum CompletionStatus {
  Complete = 'Complete',
  InProgress = 'InProgress',
  Upcoming = 'Upcoming'
}

export type LaunchStep = {
  __typename?: 'LaunchStep';
  heading: Scalars['String'];
  date?: Maybe<Scalars['String']>;
  tasks: Array<Scalars['String']>;
  ctaLink?: Maybe<Link>;
  status: CompletionStatus;
};

export type Link = {
  __typename?: 'Link';
  body: Scalars['String'];
  href: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  portalNextStepsSetTaskCompletion: CompanyTaskItem;
};


export type MutationPortalNextStepsSetTaskCompletionArgs = {
  id: Scalars['ID'];
  isCompleted: Scalars['Boolean'];
};

export type NextSteps = {
  __typename?: 'NextSteps';
  customer: CompanyTaskList;
  vendor: CompanyTaskList;
};

export type PortalDocument = {
  __typename?: 'PortalDocument';
  id: Scalars['ID'];
  title: Scalars['String'];
  href: Scalars['String'];
  isCompleted: Scalars['Boolean'];
};

export type PortalDocumentList = {
  __typename?: 'PortalDocumentList';
  name: Scalars['String'];
  documents: Array<PortalDocument>;
};

export type PortalDocumentsCard = {
  __typename?: 'PortalDocumentsCard';
  customer: PortalDocumentList;
  vendor: PortalDocumentList;
};

export type Query = {
  __typename?: 'Query';
  getLaunchRoadmap: Array<LaunchStep>;
  getNextSteps: NextSteps;
  getDocuments: PortalDocumentsCard;
  getUploadTransactionId: Scalars['ID'];
};


export type QueryGetLaunchRoadmapArgs = {
  id: Scalars['ID'];
};


export type QueryGetNextStepsArgs = {
  id: Scalars['ID'];
};


export type QueryGetDocumentsArgs = {
  id: Scalars['ID'];
};

export type PortalNextStepsSetTaskCompletionMutationVariables = Exact<{
  id: Scalars['ID'];
  isCompleted: Scalars['Boolean'];
}>;


export type PortalNextStepsSetTaskCompletionMutation = (
  { __typename?: 'Mutation' }
  & { portalNextStepsSetTaskCompletion: (
    { __typename?: 'CompanyTaskItem' }
    & Pick<CompanyTaskItem, 'id' | 'isCompleted' | 'description'>
  ) }
);

export type PortalQueryVariables = Exact<{ [key: string]: never; }>;


export type PortalQuery = (
  { __typename?: 'Query' }
  & { getLaunchRoadmap: Array<(
    { __typename?: 'LaunchStep' }
    & Pick<LaunchStep, 'heading' | 'date' | 'tasks' | 'status'>
    & { ctaLink?: Maybe<(
      { __typename?: 'Link' }
      & Pick<Link, 'body' | 'href'>
    )> }
  )>, getNextSteps: (
    { __typename?: 'NextSteps' }
    & { customer: (
      { __typename?: 'CompanyTaskList' }
      & CompanyTaskListFragmentFragment
    ), vendor: (
      { __typename?: 'CompanyTaskList' }
      & CompanyTaskListFragmentFragment
    ) }
  ), getDocuments: (
    { __typename?: 'PortalDocumentsCard' }
    & { customer: (
      { __typename?: 'PortalDocumentList' }
      & Pick<PortalDocumentList, 'name'>
      & { documents: Array<(
        { __typename?: 'PortalDocument' }
        & DocumentsListFragmentFragment
      )> }
    ), vendor: (
      { __typename?: 'PortalDocumentList' }
      & Pick<PortalDocumentList, 'name'>
      & { documents: Array<(
        { __typename?: 'PortalDocument' }
        & DocumentsListFragmentFragment
      )> }
    ) }
  ) }
);

export type DocumentsListFragmentFragment = (
  { __typename?: 'PortalDocument' }
  & Pick<PortalDocument, 'id' | 'title' | 'href' | 'isCompleted'>
);

export type CompanyTaskListFragmentFragment = (
  { __typename?: 'CompanyTaskList' }
  & Pick<CompanyTaskList, 'name'>
  & { tasks: Array<(
    { __typename?: 'CompanyTaskItem' }
    & Pick<CompanyTaskItem, 'id' | 'description' | 'isCompleted'>
  )> }
);

export const DocumentsListFragmentFragmentDoc = gql`
    fragment DocumentsListFragment on PortalDocument {
  id
  title
  href
  isCompleted
}
    `;
export const CompanyTaskListFragmentFragmentDoc = gql`
    fragment CompanyTaskListFragment on CompanyTaskList {
  name
  tasks {
    id
    description
    isCompleted
  }
}
    `;
export const PortalNextStepsSetTaskCompletionDocument = gql`
    mutation portalNextStepsSetTaskCompletion($id: ID!, $isCompleted: Boolean!) {
  portalNextStepsSetTaskCompletion(id: $id, isCompleted: $isCompleted) {
    id
    isCompleted
    description
  }
}
    `;
export type PortalNextStepsSetTaskCompletionMutationFn = Apollo.MutationFunction<PortalNextStepsSetTaskCompletionMutation, PortalNextStepsSetTaskCompletionMutationVariables>;

/**
 * __usePortalNextStepsSetTaskCompletionMutation__
 *
 * To run a mutation, you first call `usePortalNextStepsSetTaskCompletionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePortalNextStepsSetTaskCompletionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [portalNextStepsSetTaskCompletionMutation, { data, loading, error }] = usePortalNextStepsSetTaskCompletionMutation({
 *   variables: {
 *      id: // value for 'id'
 *      isCompleted: // value for 'isCompleted'
 *   },
 * });
 */
export function usePortalNextStepsSetTaskCompletionMutation(baseOptions?: Apollo.MutationHookOptions<PortalNextStepsSetTaskCompletionMutation, PortalNextStepsSetTaskCompletionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PortalNextStepsSetTaskCompletionMutation, PortalNextStepsSetTaskCompletionMutationVariables>(PortalNextStepsSetTaskCompletionDocument, options);
      }
export type PortalNextStepsSetTaskCompletionMutationHookResult = ReturnType<typeof usePortalNextStepsSetTaskCompletionMutation>;
export type PortalNextStepsSetTaskCompletionMutationResult = Apollo.MutationResult<PortalNextStepsSetTaskCompletionMutation>;
export type PortalNextStepsSetTaskCompletionMutationOptions = Apollo.BaseMutationOptions<PortalNextStepsSetTaskCompletionMutation, PortalNextStepsSetTaskCompletionMutationVariables>;
export const PortalDocument = gql`
    query portal {
  getLaunchRoadmap(id: 1) {
    heading
    date
    tasks
    ctaLink {
      body
      href
    }
    status
  }
  getNextSteps(id: 1) {
    customer {
      ...CompanyTaskListFragment
    }
    vendor {
      ...CompanyTaskListFragment
    }
  }
  getDocuments(id: 1) {
    customer {
      name
      documents {
        ...DocumentsListFragment
      }
    }
    vendor {
      name
      documents {
        ...DocumentsListFragment
      }
    }
  }
}
    ${CompanyTaskListFragmentFragmentDoc}
${DocumentsListFragmentFragmentDoc}`;

/**
 * __usePortalQuery__
 *
 * To run a query within a React component, call `usePortalQuery` and pass it any options that fit your needs.
 * When your component renders, `usePortalQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePortalQuery({
 *   variables: {
 *   },
 * });
 */
export function usePortalQuery(baseOptions?: Apollo.QueryHookOptions<PortalQuery, PortalQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PortalQuery, PortalQueryVariables>(PortalDocument, options);
      }
export function usePortalLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PortalQuery, PortalQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PortalQuery, PortalQueryVariables>(PortalDocument, options);
        }
export type PortalQueryHookResult = ReturnType<typeof usePortalQuery>;
export type PortalLazyQueryHookResult = ReturnType<typeof usePortalLazyQuery>;
export type PortalQueryResult = Apollo.QueryResult<PortalQuery, PortalQueryVariables>;

      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {}
};
      export default result;
    