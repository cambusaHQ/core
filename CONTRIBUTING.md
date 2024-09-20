# Contributing to Cambusa

First off, thank you for considering contributing to Cambusa! 🎉 Your involvement helps make this project better for everyone.

## Code of Conduct

Please read and follow our Code of Conduct to ensure a welcoming and respectful environment for all contributors.

## How Can I Contribute?

### Reporting Bugs

If you find a bug in Cambusa, please [open an issue](https://github.com/enricodeleo/cambusa/issues/new/choose) and provide the following information:

- **Description**: A clear and concise description of what the bug is.
- **Steps to Reproduce**: Detailed steps to reproduce the behavior.
- **Expected Behavior**: What you expected to happen.
- **Screenshots**: If applicable, add screenshots to help explain your problem.
- **Environment**: Include your OS, Node.js version, and any other relevant information.

### Requesting Features

Have an idea for a new feature or enhancement? We'd love to hear it! Please [open an issue](https://github.com/enricodeleo/cambusa/issues/new/choose)  with the following:

- **Feature Description**: A clear and concise description of the feature.
- **Use Case**: Explain how this feature would be useful.
- **Examples**: Provide examples or scenarios where this feature would be beneficial.

### Pull Requests

Pull requests are the primary way to propose changes to the project. We actively welcome your pull requests.

#### Development Setup

1. Fork the Repository: Click the Fork button at the top right of the Cambusa GitHub repository to create your own fork.
2. Clone Your Fork:
```bash
git clone https://github.com/your-username/cambusa.git
cd cambusa
```
3. Install Dependencies: Ensure you have Bun installed as it's used for running the CLI.
```bash
bun install
```
4. Configure the Project: Update the config/datastore.js with your database configuration as needed.

#### Creating a Feature Branch

Create a new branch for your feature or bugfix:

```bash
git checkout -b feature/your-feature-name
```

**Committing Changes**

1. Follow the Conventional Commits Specification:
  - Use commit messages like:
    - feat: add new authentication module
    - fix: resolve issue with controller generation
    - docs: update contributing guidelines
2. Write Clear Commit Messages: Ensure your commit messages are descriptive and concise.
3. Example Commit:
```bash
git commit -m "feat: implement user authentication"
```

**Pushing Changes**

Push your changes to your fork:

```bash
git push origin feature/your-feature-name
```

**Submitting a Pull Request**

1. Navigate to the Original Repository:
  - Go to the Cambusa GitHub repository.
2. Create a Pull Request:
  - Click the New pull request button.
  - Select your fork and the branch you pushed your changes to.
  - Provide a clear title and description for your pull request.
3. Describe Your Changes:
  - Explain what you've done and why.
  - Reference any related issues using keywords like Closes #issue-number.
4. Submit the Pull Request:
  - Click Create pull request.

**Guidelines for Pull Requests**

- Ensure Code Quality: Follow the project's coding style and guidelines.
- Include Tests: If applicable, add or update tests to cover your changes.
- Update Documentation: Modify the README.md or other relevant documentation if your changes affect usage or configuration.
- Be Responsive: Engage in discussions if maintainers request changes or clarifications.

### Style Guides

- Language: JavaScript (ES6+) or TypeScript if specified.
- Linting and Formatting: Ensure your code passes the project's linting rules.
- Use tools like ESLint and Prettier for consistent code formatting (`bun run lint` or `bun run format`)
- Naming Conventions:
  - Use `camelCase` for variables and functions.
  - Use `PascalCase` for classes, components, models.

### Commit Messages

- Structure:
  - `<type>: <subject>`
- Types:
  - `feat`: A new feature
  - `fix`: A bug fix
  - `docs`: Documentation only changes
  - `style`: Changes that do not affect the meaning of the code (white-space, formatting)
  - `refactor`: A code change that neither fixes a bug nor adds a feature
  - `test`: Adding missing or correcting existing tests
  - `chore`: Changes to the build process or auxiliary tools and libraries
- Examples:
  - `feat`: add user authentication module
  - `fix`: resolve issue with controller generation
  - `docs`: update contributing guidelines

### Documentation

- Inline Comments: Use comments to explain complex logic or decisions within the code.
- `README.md`: Ensure that the README.md remains up-to-date with the latest changes and usage instructions.
- API Documentation: If applicable, maintain detailed API documentation for easy reference.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
