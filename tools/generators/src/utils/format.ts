import prettier from 'prettier';

export async function formatCode(code: string): Promise<string> {
  try {
    return await prettier.format(code, {
      parser: 'typescript',
      singleQuote: true,
      trailingComma: 'es5',
      tabWidth: 2,
      semi: true,
      printWidth: 80,
    });
  } catch (error) {
    console.warn('Failed to format code:', error);
    return code;
  }
}