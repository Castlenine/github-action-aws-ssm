<div align="center">

# `aws-ssm-command`

[![github-actions.badge]][github-actions] [![contribution.badge]][contribution]

Execute remote commands or scripts on AWS EC2 instances using AWS Systems Manager (SSM)
</div>

## Contents

- [Requirements](#requirements)
- [Usage example](#usage-example)
- [Action inputs](#action-inputs)
- [Action outputs](#action-outputs)
- [Error Handling](#error-handling)
- [AWS Documentation](#aws-documentation)

## Requirements

1. Assign the AWS IAM role `AmazonSSMFullAccess` or more restrictive permissions to your IAM user
2. Ensure your EC2 instance has an IAM role that includes `AmazonSSMFullAccess` or more restrictive permissions

## Usage example

```yaml
name: AWS SSM Command example

on:
  push:
    branches: [master, main]

jobs:
  start:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout the latest code
        uses: actions/checkout@v4

      - name: AWS SSM Command
        uses: Castlenine/aws-ssm-command@v1
        id: ssm
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # You can inject any environment variable in the command execution. Don't use "-" for the environment name. Use "_" instead. Make sure that your environment variables are not creating a conflict. Any environment variable with 'SSM_IGNORE' in the name will not be exported in the command execution
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}
          instance-ids: ${{ secrets.INSTANCE_ID }}
          working-directory: '/home/ubuntu'
          command: 'echo "Hello World from Github Actions"'
          comment: 'Command executed by Github Actions'

      - name: Capture SSM command outputs
        run: echo "Requested at ${{ steps.ssm.outputs.request-date-time }} for ${{ steps.ssm.outputs.request-id }} and the status is ${{ steps.ssm.outputs.command-status-details }}" && echo "The command output is ${{ steps.ssm.outputs.command-output }}"
```

```yaml
name: AWS SSM Command example with bash script

on:
  push:
    branches: [master, main]

jobs:
  start:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout the latest code
        uses: actions/checkout@v4

      - name: AWS SSM Command
        uses: Castlenine/aws-ssm-command@v1
        id: ssm
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # You can inject any environment variable in the command execution. Don't use "-" for the environment name. Use "_" instead. Make sure that your environment variables are not creating a conflict. Any environment variable with 'SSM_IGNORE' in the name will not be exported in the command execution
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}
          instance-ids: ${{ secrets.INSTANCE_ID }}
          working-directory: '/home/ubuntu'
          script-parent-folder-path: '.github' # Without the last '/'. Can be the main parent folder or with subfolders
          command: '.github/scripts/example.sh' # Must be in the parent folder path. Default is '.github'
          comment: 'Bash script executed by Github Actions'

      - name: Capture SSM command outputs
        run: echo "Requested at ${{ steps.ssm.outputs.request-date-time }} for ${{ steps.ssm.outputs.request-id }} and the status is ${{ steps.ssm.outputs.command-status-details }}" && echo "The command output is ${{ steps.ssm.outputs.command-output }}"
```

## Action inputs

| Inputs name                 | Required | Default value                              | Description                                                             |
| --------------------------- | -------- | ------------------------------------------ | ----------------------------------------------------------------------- |
| `aws-access-key-id`         | Yes      | -                                          | AWS access key ID                                                       |
| `aws-secret-access-key`     | Yes      | -                                          | AWS secret access key                                                   |
| `aws-region`                | Yes      | -                                          | AWS region of the instance                                              |
| `instance-ids`              | Yes      | -                                          | AWS EC2 Instance ID or IDs                                              |
| `command`                   | No       | `'echo "Hello World from Github Actions"'` | Command to execute                                                      |
| `user`                      | No       | `'root'`                                   | User to execute the command as                                          |
| `home-env`                  | No       | `'/home/ubuntu'`                           | Environment variable HOME to export in the command                      |
| `working-directory`         | No       | `'/home/ubuntu'`                           | Command working directory                                               |
| `script-parent-folder-path` | No       | `'.github'`                                | Script parent folder path if the command is a script file               |
| `wait-for-completion`       | No       | `'true'`                                   | Whether to wait for the command to complete before finishing the action |
| `polling-interval-seconds`  | No       | `'5'`                                      | Polling interval in seconds when waiting for command completion         |
| `timeout-seconds`           | No       | `'1200'`                                   | Timeout in seconds when waiting for command completion                  |
| `comment`                   | No       | `'Executed by Github Actions'`             | Comment for the command                                                 |
| `action-outputs`            | No       | `'true'`                                   | If the action have outputs                                              |
| `console-log`               | No       | `'true'`                                   | If the command response and result have a console log                   |

## Action outputs

`action-outputs` must be `'true'` if you want to capture the outputs

| Outputs name             | Description                                           |
| ------------------------ | ----------------------------------------------------- |
| `request-id`             | A unique identifier for the requested command (UUID)  |
| `request-date-time`      | The date and time the requested command was requested |
| `request-status`         | Status of the requested command execution             |
| `request-status-details` | Detailed status of the requested command execution    |
| `command-status`         | Status of the finished command execution              |
| `command-status-details` | Detailed status of the finished command execution     |
| `command-output`         | Output of the finished command execution              |
| `command-error`          | Error of the finished command execution               |

## Error handling

[AWS SSM errors](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/ssm/command/SendCommandCommand/#Throws:~:text=to%20this%20request.-,Throws,-Name)

## AWS Documentation

- [AWS SSM](https://docs.aws.amazon.com/systems-manager/latest/userguide/what-is-systems-manager.html)
- [AWS SSM SendCommand](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/ssm/command/SendCommandCommand/)

[github-actions]: https://github.com/marketplace/actions/aws-ssm-command
[github-actions.badge]: https://img.shields.io/badge/GitHub_Actions-2088FF?logo=github-actions&logoColor=white
[contribution]: https://github.com/Castlenine/aws-ssm-github-action
[contribution.badge]: https://img.shields.io/badge/contributions-welcome-green
