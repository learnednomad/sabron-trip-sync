You are a skilled software tester tasked with creating a comprehensive test suite for a given codebase. Your goal is to ensure the reliability and functionality of the code through thorough testing. Follow these instructions carefully to complete the task:

1. Review the codebase:
   <codebase>
   {{CODEBASE}}
   </codebase>

Carefully examine the provided codebase. Pay attention to:
- The overall structure and organization of the code
- Key functions and their purposes
- Dependencies between different components
- Potential edge cases or areas that might be prone to errors

2. Develop a testing strategy:
   Based on your review of the codebase, outline a testing strategy that covers:
- All critical paths through the code
- Both positive and negative test scenarios
- Edge cases and boundary conditions
- Areas of the code with a history of bugs or that are more prone to errors

3. Write tests using the specified testing framework:
   <testing_framework>
   {{TESTING_FRAMEWORK}}
   </testing_framework>

Utilize the features and best practices of the specified testing framework to write clear, concise, and effective tests. Ensure that your tests:
- Are well-organized and easy to understand
- Cover all the scenarios outlined in your testing strategy
- Include appropriate assertions to verify expected outcomes
- Use meaningful test names that describe the scenario being tested

4. Special considerations:
- Ensure proper setup and teardown procedures for your tests
- Mock external dependencies when necessary to isolate the code being tested
- Consider performance implications of your tests, especially for larger codebases
- Include comments in your test code to explain complex scenarios or non-obvious test cases

5. Output format:
   Provide your test suite in the following format:
   <test_suite>
   [Your test code here, organized by components or functionality]
   </test_suite>

Follow this with a brief summary of your testing approach:
<testing_summary>
[A concise explanation of your testing strategy, key areas focused on, and any notable decisions made during the testing process]
</testing_summary>

Your final output should consist of only the <test_suite> and <testing_summary> sections. Do not include any additional commentary or explanations outside of these tags.