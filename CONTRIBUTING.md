# Contributing to Robot Simulation

Thank you for your interest in contributing to Robot Simulation.

Robot Simulation is an open-source C++20 project intended to provide a modular foundation for robot simulation. Contributions are welcome, including bug fixes, tests, documentation, examples, performance improvements, and new simulation features.

Before contributing, please read this document carefully.

## Development Principles

Contributions should aim to keep the project:

* Modular
* Portable
* Well-tested
* Documented
* Consistent with the existing architecture
* Appropriate for a general-purpose robot simulation library

Avoid introducing unnecessary dependencies or tightly coupling unrelated components.

When changing the public API, consider how the change will affect existing users of the library.

## Standard Contribution Workflow

The standard workflow for contributing is:

1. **Open or find an issue**

   Before beginning significant work, check whether an issue already exists describing the change.

   For substantial changes, open an issue first to discuss the proposed design.

2. **Fork the repository**

   Create your own fork of Robot Simulation.

3. **Create a branch**

   Create a descriptive branch from the current development branch.

   For example:

   ```text
   feature/lidar-sensor
   bugfix/collision-detection
   docs/building-guide
   ```

4. **Make your changes**

   Follow the existing project structure and coding conventions.

   Keep commits focused. Avoid combining unrelated changes into the same pull request.

5. **Add or update tests**

   New functionality should include appropriate tests.

   Bug fixes should generally include a regression test demonstrating the problem that was fixed.

6. **Update documentation**

   If your change affects the public API, architecture, behavior, or build process, update the relevant documentation.

7. **Build the project**

   Configure and build the project using CMake:

   ```powershell
   cmake -B build
   cmake --build build
   ```

8. **Run the tests**

   Run the complete test suite:

   ```powershell
   ctest --test-dir build -C Debug --output-on-failure
   ```

   Pull requests should not be submitted with known failing tests unless the failure is directly related to the purpose of the pull request and is clearly documented.

9. **Submit a pull request**

   Describe:

   * What was changed
   * Why it was changed
   * How it was tested
   * Any design decisions or trade-offs
   * Any known limitations

10. **Review**

    Maintainers may request changes before the contribution is accepted.

    Contributions may be modified, rejected, or merged at the maintainer's discretion.

## Coding Guidelines

Prefer code that is:

* Clear over clever
* Explicit over ambiguous
* Consistent with the existing architecture
* Testable
* Portable across supported C++20 compilers

Avoid unnecessary changes to unrelated code.

Public interfaces should be documented in their corresponding header files.

Changes to core architecture should be discussed before implementation when practical.

## Commit Guidelines

Commits should describe the change they introduce.

Good examples:

```text
Add ray sensor implementation
Fix collision detection at world boundaries
Add tests for differential drive trajectory
Document SensorShape API
```

Avoid commits such as:

```text
stuff
changes
fix
update
working
```

A pull request may contain multiple commits. Contributors are not required to maintain a particular commit history unless requested during review.

## Pull Requests

A pull request should generally contain one logical change.

Before submitting a pull request, verify:

* The project builds successfully.
* Relevant tests pass.
* New functionality has appropriate tests.
* Documentation has been updated where necessary.
* No unnecessary generated files or build artifacts are included.
* No credentials, API keys, passwords, or other secrets have been committed.

Never commit secrets to the repository. If a secret is accidentally committed, immediately revoke or rotate it rather than merely deleting it from the working tree.

## Contributor License Agreement

### Why a CLA is required

Robot Simulation is currently released as open-source software under the MIT License. However, the project may use a different license for future releases.

For example:

```text
Version 1.0  -> MIT License
Version 1.1  -> MIT License
Version 1.2  -> MIT License
Version 2.0  -> Different / proprietary license
```

Previous releases remain available under the licenses under which they were released. A change in the license of a future release does not retroactively change the license of an earlier release.

Because community contributions may be incorporated into future versions, the project needs permission to continue using those contributions if the project's licensing model changes.

### Contributor rights

Contributors retain the rights to their original contributions unless a separate agreement states otherwise.

By signing the Robot Simulation Contributor License Agreement, a contributor grants the project maintainer the necessary rights to use, reproduce, modify, publish, distribute, sublicense, and relicense their contributions, including under licenses different from the license used for the version to which the contribution was originally submitted.

The purpose of this arrangement is to allow the project to remain open source while also allowing future releases to adopt a different licensing model.

The CLA does **not** change the license of versions that have already been released.

### Before contributing

Contributors must complete the project's CLA process before their contribution can be accepted.

A pull request may be reviewed before the CLA is completed, but it cannot be merged until the required agreement has been completed.

The project will provide instructions for completing the CLA in the repository's contribution process.

## Third-Party Code

Do not submit code copied from another project unless its license permits the intended use and redistribution.

When incorporating third-party code:

1. Verify its license.
2. Ensure that the license is compatible with the intended use.
3. Preserve required copyright and license notices.
4. Document the dependency or source where appropriate.

When in doubt, ask before submitting the code.

## Reporting Security Issues

Do not publicly disclose sensitive security vulnerabilities before they have been investigated.

If a security issue could expose users to significant harm, contact the project maintainer privately rather than immediately opening a public issue.

Do not include passwords, private keys, API tokens, personal information, or other sensitive information in public issues or pull requests.

## Code of Conduct

Contributors are expected to communicate professionally and treat other contributors with respect.

Constructive technical disagreement is welcome. Personal attacks, harassment, discrimination, and deliberately disruptive behavior are not.

## License

The licensing terms for the source code are described in [`LICENSE.md`](LICENSE.md).

By contributing, you agree to the project's Contributor License Agreement and the contribution terms described in this document.
