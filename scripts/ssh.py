"""SSH helper for the Voyagr deployment server.

Usage:
    python scripts/ssh.py "uname -a; node -v"
    python scripts/ssh.py --upload local.txt /remote/path/file.txt

Reads creds from local.env (gitignored). Never log the password.
"""
from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

import paramiko


def load_env(path: Path) -> dict[str, str]:
    env: dict[str, str] = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def connect(env: dict[str, str]) -> paramiko.SSHClient:
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(
        hostname=env["SSH_HOST"],
        port=int(env.get("SSH_PORT", "22")),
        username=env["SSH_USER"],
        password=env["SSH_PASSWORD"],
        timeout=20,
        allow_agent=False,
        look_for_keys=False,
    )
    return client


def run(
    client: paramiko.SSHClient,
    command: str,
    sudo_password: str | None = None,
) -> int:
    if sudo_password is not None:
        command = f"sudo -S -p '' bash -c {shlex_quote(command)}"
    stdin, stdout, stderr = client.exec_command(command, get_pty=False, timeout=600)
    if sudo_password is not None:
        stdin.write(sudo_password + "\n")
        stdin.flush()
        stdin.channel.shutdown_write()
    out = stdout.read()
    err = stderr.read()
    rc = stdout.channel.recv_exit_status()
    if out:
        sys.stdout.buffer.write(out)
        sys.stdout.flush()
    if err:
        sys.stderr.buffer.write(err)
        sys.stderr.flush()
    return rc


def shlex_quote(s: str) -> str:
    import shlex
    return shlex.quote(s)


def upload(client: paramiko.SSHClient, local: str, remote: str) -> None:
    sftp = client.open_sftp()
    try:
        sftp.put(local, remote)
    finally:
        sftp.close()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("command", nargs="?", help="Shell command to run on the server")
    parser.add_argument("--sudo", action="store_true", help="Run command via sudo using SSH_PASSWORD")
    parser.add_argument("--upload", nargs=2, metavar=("LOCAL", "REMOTE"))
    parser.add_argument(
        "--env",
        default=str(Path(__file__).resolve().parent.parent / "local.env"),
        help="Path to env file (default: project local.env)",
    )
    args = parser.parse_args()

    env = load_env(Path(args.env))
    client = connect(env)
    try:
        if args.upload:
            upload(client, args.upload[0], args.upload[1])
            print(f"uploaded {args.upload[0]} -> {args.upload[1]}")
            return 0
        if not args.command:
            parser.error("provide a command or --upload")
        sudo_pw = env["SSH_PASSWORD"] if args.sudo else None
        return run(client, args.command, sudo_password=sudo_pw)
    finally:
        client.close()


if __name__ == "__main__":
    sys.exit(main())
