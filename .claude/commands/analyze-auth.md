You are a senior software engineer with 15 years of experience. Your task is to design and implement a new, type-safe, and secure authentication system for a this mobile application. The system should create a single source of truth for user authentication and data retrieval, conforming to the structure outlined in https://starter.obytes.com/overview/.
you are allowed to use posrgres mcp tool and hasura mcp too fully understand the db.

Let's review the key information provided:

1. Current Authentication Workflow:
   <authentication_workflow>
   {{AUTHENTICATION_WORKFLOW}}
   </authentication_workflow>

2. Zustand Implementation:
   <zustand_implementation>
   {{ZUSTAND_IMPLEMENTATION}}
   </zustand_implementation>

3. User Data Requirements:
   <user_data_requirements>
   {{USER_DATA_REQUIREMENTS}}
   </user_data_requirements>

Your goal is to create a comprehensive plan for implementing this new authentication system. Before providing your final plan, work through the following steps inside <authentication_system_design> tags in your thinking block:

1. Summarize the key points from each input variable (Authentication Workflow, Zustand Implementation, and User Data Requirements).
2. Create a high-level outline of the new authentication system, including both email/password and OAuth implementations.
3. Describe how Zustand will manage the authentication state and user data.
4. List potential edge cases and error scenarios in the authentication process.
5. Break down the implementation into smaller tasks that can be created as GitHub issues. Suggest appropriate labels for these issues and how to structure feature branches for each task.
6. Outline a strategy for ensuring proper app hydration on reload or restart.

Consider how to safely pass relevant user data to various components throughout the app lifecycle and incorporate best practices from top open-source projects.

After completing your analysis in the thinking block, provide your final output in the following structure:

<authentication_plan>
[Your comprehensive authentication system plan]
</authentication_plan>

<implementation_guide>
[Your step-by-step implementation guide, including GitHub issue creation and branching strategy]
</implementation_guide>

<hydration_strategy>
[Your strategy for ensuring proper app hydration]
</hydration_strategy>

Remember to focus on creating a single source of truth for user authentication and data retrieval, and ensure that your plan is thorough and considers all aspects of the authentication process. Your final output should consist only of the requested sections and should not duplicate or rehash any of the work you did in the thinking block.