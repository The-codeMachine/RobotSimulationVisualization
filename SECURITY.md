# Security Policy

## Supported Versions

Security fixes are generally provided for the latest stable release of Robot Simulation.

Because the project is currently in early development, older releases may not receive security fixes.

| Version               | Supported |
| --------------------- | --------- |
| Latest stable release | Yes       |
| Older releases        | No        |
| Development versions  | No        |

## Reporting a Vulnerability

If you believe you have discovered a security vulnerability in Robot Simulation, **do not create a public GitHub issue**.

Instead, report the vulnerability privately to the project maintainer through the private security contact mechanism provided by the repository.

A security report should include:

* A description of the vulnerability.
* The affected version or commit.
* Steps required to reproduce the issue.
* A proof of concept, if available and safe to provide.
* The potential impact of the vulnerability.
* Any suggested mitigation or fix, if known.

Please provide enough information to reproduce and investigate the issue.

## What to Report

Examples of security issues include:

* Vulnerabilities that could cause memory corruption.
* Buffer overflows or out-of-bounds access.
* Use-after-free or other unsafe memory behavior.
* Unexpected code execution.
* Authentication or authorization vulnerabilities, if applicable.
* Vulnerabilities introduced through dependencies.
* Build or distribution mechanisms that expose users to malicious code.
* Other issues that could allow an attacker to compromise a system using Robot Simulation.

Not every bug is a security vulnerability. Ordinary crashes, incorrect simulation behavior, and feature requests should generally be reported through the project's normal issue tracker.

## Responsible Disclosure

Please allow the maintainer reasonable time to investigate and address a security vulnerability before publicly disclosing technical details.

Once a fix or mitigation is available, the project may publish a security advisory describing the issue and affected versions.

## Accidental Disclosure of Secrets

If you accidentally commit a password, API key, private key, token, or other secret:

1. Immediately revoke or rotate the exposed credential.
2. Notify the project maintainer privately.
3. Do not rely on simply deleting the file or commit.

Removing a secret from Git history does not necessarily make the secret safe again.

## Security Expectations for Contributors

Contributors should:

* Avoid introducing unnecessary dependencies.
* Keep dependencies reasonably up to date.
* Validate data received from external sources.
* Avoid undefined behavior and unsafe memory operations.
* Never commit credentials or other secrets.
* Consider security implications when modifying file, network, serialization, or dependency-related code.

Security should be considered when designing and reviewing changes, even when a feature does not appear security-sensitive.

## Disclaimer

Robot Simulation is an actively developed project. No guarantee is made that all vulnerabilities will be identified or that every reported vulnerability will be fixed.
