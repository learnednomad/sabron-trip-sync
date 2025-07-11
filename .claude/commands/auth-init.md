You are tasked with performing a comprehensive analysis of an authentication workflow. Your goal is to provide a detailed breakdown of the system's components, processes, and data flow. Please follow these instructions carefully to complete the task:

First, carefully read and analyze the authentication system and provide the description in the following XML format:

<authentication_system_description>
{{AUTHENTICATION_SYSTEM_DESCRIPTION}}
</authentication_system_description>

Based on the provided description, perform the following analyses:

1. Key Data Models:
   Identify and describe the key data models used in the authentication system. This may include user models, session models, token models, etc. For each model, list its attributes and their purposes.

2. Authentication Workflow and APIs:
   Outline the authentication workflow, including the APIs involved. Describe the sequence of steps for login, sign up, and logout processes. Include details on API endpoints, request/response formats, and any security measures implemented.

3. Files Handling Authentication:
   List all files that handle authentication and explain how they work together. This should include frontend files, backend files, and any middleware or utility files specifically related to authentication.

4. Login, Sign Up, and Logout Trace:
   Provide a detailed trace of the login, sign up, and logout processes from the frontend to the database. Include all steps, components, and data transformations involved in each process.

5. Zustand Implementation and User Data:
   Analyze the Zustand implementation for managing authentication state. Describe how user data is stored and managed using Zustand. Identify the specific user data returned by the getUserInfo endpoint after login.

6. Zustand Implementation Document:
   Create a separate document detailing the Zustand implementation for authentication. Include code snippets, state structure, and methods used for managing authentication state.

7. User Data Document:
   Generate a document that captures all user data returned by the getUserInfo endpoint immediately after login. Explain how this data is passed to and used by various components of the app.

Your final output should be structured as follows:

<authentication_analysis>
<key_data_models>
[Your analysis of key data models]
</key_data_models>

<authentication_workflow>
[Your analysis of the authentication workflow and APIs]
</authentication_workflow>

<authentication_files>
[Your analysis of files handling authentication]
</authentication_files>

<process_traces>
<login_trace>
[Detailed trace of the login process]
</login_trace>
<signup_trace>
[Detailed trace of the sign up process]
</signup_trace>
<logout_trace>
[Detailed trace of the logout process]
</logout_trace>
</process_traces>

<zustand_analysis>
[Your analysis of the Zustand implementation and user data management]
</zustand_analysis>
</authentication_analysis>

<zustand_implementation_doc>
[Detailed document on Zustand implementation for authentication]
</zustand_implementation_doc>

<user_data_doc>
[Document capturing user data returned by getUserInfo endpoint and its usage]
</user_data_doc>

Ensure that your analysis is thorough, accurate, and based solely on the information provided in the authentication system description. If any information is missing or unclear, state so in your analysis rather than making assumptions. Your final output should include only the content within the specified XML tags, without any additional commentary or explanations outside of these tags.