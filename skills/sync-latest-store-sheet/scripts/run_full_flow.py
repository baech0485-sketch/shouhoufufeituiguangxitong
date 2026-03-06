from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path

from sync_latest_store_sheet import DEFAULT_SOURCE_DIR, select_latest_sheet, sync_latest_sheet

PROJECT_ROOT = Path(__file__).resolve().parents[3]
IMPORT_SCRIPT = PROJECT_ROOT / 'scripts' / 'import-stores-from-xlsx.mjs'
REPAIR_SCRIPT = PROJECT_ROOT / 'scripts' / 'repair-store-statuses.mjs'


def configure_console() -> None:
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    if hasattr(sys.stderr, 'reconfigure'):
        sys.stderr.reconfigure(encoding='utf-8')


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='\u6267\u884c\u5b8c\u6574\u6d41\u7a0b\uff1a\u540c\u6b65\u6700\u65b0\u8868\u683c\u3001\u786e\u8ba4\u4e91\u6570\u636e\u5e93\u3001\u5bfc\u5165\u6570\u636e\u5e76\u56de\u7b97\u5e97\u94fa\u72b6\u6001')
    parser.add_argument('--source-dir', default=str(DEFAULT_SOURCE_DIR), help='\u6e90\u76ee\u5f55\uff0c\u9ed8\u8ba4\u4f7f\u7528\u56fa\u5b9a\u6570\u636e\u76ee\u5f55')
    parser.add_argument('--target-dir', default=str(PROJECT_ROOT), help='\u76ee\u6807\u76ee\u5f55\uff0c\u9ed8\u8ba4\u4f7f\u7528\u5f53\u524d\u9879\u76ee\u6839\u76ee\u5f55')
    parser.add_argument('--config-file', default='', help='\u9879\u76ee\u672c\u5730\u6570\u636e\u5e93\u914d\u7f6e\u6587\u4ef6\uff0c\u9ed8\u8ba4\u81ea\u52a8\u8bfb\u53d6 .env.mongodb-sync.local \u6216 .env.local')
    parser.add_argument('--sheet-file', default='', help='\u6307\u5b9a\u8981\u5bfc\u5165\u7684\u8868\u683c\u6587\u4ef6\uff1b\u4e0d\u4f20\u65f6\u81ea\u52a8\u4f7f\u7528\u540c\u6b65\u540e\u7684\u6700\u65b0\u8868\u683c')
    parser.add_argument('--skip-sync', action='store_true', help='\u8df3\u8fc7\u8868\u683c\u540c\u6b65\u6b65\u9aa4\uff0c\u76f4\u63a5\u6267\u884c\u6570\u636e\u5e93\u786e\u8ba4\u4e0e\u5bfc\u5165')
    parser.add_argument('--check-only', action='store_true', help='\u53ea\u505a\u68c0\u67e5\uff0c\u4e0d\u505a\u6b63\u5f0f\u5bfc\u5165\u548c\u72b6\u6001\u4fee\u6b63')
    return parser.parse_args()


def run_command(command: list[str], title: str) -> None:
    print(f"\n== {title} ==", flush=True)
    print('\u547d\u4ee4\uff1a' + ' '.join(command), flush=True)
    subprocess.run(command, cwd=PROJECT_ROOT, check=True)


def build_import_command(workbook_path: Path | None, config_file: str, check_only: bool) -> list[str]:
    command = ['node', str(IMPORT_SCRIPT.relative_to(PROJECT_ROOT))]
    if config_file:
        command.extend(['--config-file', config_file])
    if workbook_path is not None:
        command.append(str(workbook_path))
    if check_only:
        command.append('--check-only')
    return command


def build_repair_command(config_file: str, check_only: bool) -> list[str]:
    command = ['node', str(REPAIR_SCRIPT.relative_to(PROJECT_ROOT))]
    if config_file:
        command.extend(['--config-file', config_file])
    if check_only:
        command.append('--check-only')
    return command


def resolve_workbook_path(args: argparse.Namespace, source_dir: Path, target_dir: Path) -> Path | None:
    if args.sheet_file:
        return Path(args.sheet_file).expanduser().resolve()
    if args.skip_sync:
        return None
    latest_source_file = select_latest_sheet(source_dir)
    return target_dir / latest_source_file.name


def main() -> int:
    configure_console()
    args = parse_args()
    source_dir = Path(args.source_dir).expanduser().resolve()
    target_dir = Path(args.target_dir).expanduser().resolve()

    try:
        if not args.skip_sync:
            print('== \u6b65\u9aa4 1\uff1a\u540c\u6b65\u6700\u65b0\u8868\u683c ==', flush=True)
            sync_result = sync_latest_sheet(source_dir=source_dir, target_dir=target_dir, dry_run=False)
            if sync_result != 0:
                return sync_result
        else:
            print('== \u6b65\u9aa4 1\uff1a\u5df2\u8df3\u8fc7\u8868\u683c\u540c\u6b65 ==', flush=True)

        workbook_path = resolve_workbook_path(args, source_dir, target_dir)

        check_command = build_import_command(workbook_path, args.config_file, check_only=True)
        run_command(check_command, '\u6b65\u9aa4 2\uff1a\u786e\u8ba4\u4e91\u6570\u636e\u5e93\u76ee\u6807')

        if args.check_only:
            repair_check_command = build_repair_command(args.config_file, check_only=True)
            run_command(repair_check_command, '\u6b65\u9aa4 3\uff1a\u9884\u6f14\u72b6\u6001\u56de\u7b97\u6821\u9a8c')
            print('\n\u6d41\u7a0b\u7ed3\u675f\uff1a\u5df2\u5b8c\u6210\u6570\u636e\u5e93\u786e\u8ba4\u548c\u72b6\u6001\u6821\u9a8c\u9884\u6f14\uff0c\u672a\u6267\u884c\u6b63\u5f0f\u5bfc\u5165', flush=True)
            return 0

        import_command = build_import_command(workbook_path, args.config_file, check_only=False)
        run_command(import_command, '\u6b65\u9aa4 3\uff1a\u6b63\u5f0f\u5bfc\u5165\u4e91\u6570\u636e\u5e93')

        repair_command = build_repair_command(args.config_file, check_only=False)
        run_command(repair_command, '\u6b65\u9aa4 4\uff1a\u56de\u7b97\u5e76\u4fee\u6b63\u5e97\u94fa\u72b6\u6001')

        print('\n\u6d41\u7a0b\u5b8c\u6210\uff1a\u5df2\u540c\u6b65\u6700\u65b0\u8868\u683c\u3001\u5bfc\u5165\u4e91\u6570\u636e\u5e93\u5e76\u5b8c\u6210\u72b6\u6001\u56de\u7b97', flush=True)
        return 0
    except subprocess.CalledProcessError as exc:
        print(f'\u6d41\u7a0b\u5931\u8d25\uff1a\u547d\u4ee4\u6267\u884c\u8fd4\u56de\u975e\u96f6\u72b6\u6001 {exc.returncode}', file=sys.stderr)
        return exc.returncode
    except Exception as exc:
        print(f'\u6d41\u7a0b\u5931\u8d25\uff1a{exc}', file=sys.stderr)
        return 1


if __name__ == '__main__':
    raise SystemExit(main())
