from __future__ import annotations

import argparse
import hashlib
import re
import shutil
import sys
from datetime import datetime
from pathlib import Path

DEFAULT_SOURCE_DIR = Path(r"D:\Desktop\运营自动筛选店铺存储文档")
ALLOWED_SUFFIXES = {".xlsx", ".xls", ".xlsm", ".csv", ".tsv"}
DATED_FILE_PATTERN = re.compile(r"^(.*?-)\d{8}(\.[^.]+)$")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="同步最新表格到目标目录，并清理旧版本")
    parser.add_argument("--source-dir", default=str(DEFAULT_SOURCE_DIR), help="源目录，默认使用固定数据目录")
    parser.add_argument("--target-dir", default=".", help="目标目录，默认使用当前工作目录")
    parser.add_argument("--dry-run", action="store_true", help="仅预览，不实际复制和删除")
    return parser.parse_args()


def list_root_sheets(directory: Path) -> list[Path]:
    return sorted(
        [
            file_path
            for file_path in directory.iterdir()
            if file_path.is_file() and file_path.suffix.lower() in ALLOWED_SUFFIXES
        ],
        key=lambda file_path: (file_path.stat().st_mtime_ns, file_path.name),
        reverse=True,
    )


def select_latest_sheet(source_dir: Path) -> Path:
    if not source_dir.exists() or not source_dir.is_dir():
        raise FileNotFoundError(f"源目录不存在：{source_dir}")
    files = list_root_sheets(source_dir)
    if not files:
        raise FileNotFoundError(f"源目录根目录未找到表格文件：{source_dir}")
    return files[0]


def find_old_versions(target_dir: Path, latest_name: str) -> list[Path]:
    match = DATED_FILE_PATTERN.match(latest_name)
    if not match:
        return []
    prefix, suffix = match.groups()
    candidates = []
    for file_path in target_dir.iterdir():
        if not file_path.is_file():
            continue
        if file_path.name == latest_name:
            continue
        if file_path.suffix.lower() != suffix.lower():
            continue
        if file_path.name.startswith(prefix) and DATED_FILE_PATTERN.match(file_path.name):
            candidates.append(file_path)
    return sorted(candidates, key=lambda file_path: file_path.name)


def sha256_for_file(file_path: Path) -> str:
    digest = hashlib.sha256()
    with file_path.open("rb") as file_obj:
        for chunk in iter(lambda: file_obj.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def sync_latest_sheet(source_dir: Path, target_dir: Path, dry_run: bool) -> int:
    latest_source_file = select_latest_sheet(source_dir)
    target_dir.mkdir(parents=True, exist_ok=True)
    latest_target_file = target_dir / latest_source_file.name
    old_versions = find_old_versions(target_dir, latest_source_file.name)
    latest_modified_at = datetime.fromtimestamp(latest_source_file.stat().st_mtime).strftime("%Y-%m-%d %H:%M:%S")

    print(f"源目录：{source_dir}")
    print(f"目标目录：{target_dir}")
    print(f"最新文件：{latest_source_file.name}")
    print(f"最新文件时间：{latest_modified_at}")

    if dry_run:
        print("模式：预演")
        print(f"将复制到：{latest_target_file}")
        if old_versions:
            print("将删除旧文件：")
            for file_path in old_versions:
                print(f"- {file_path.name}")
        else:
            print("将删除旧文件：无")
        return 0

    shutil.copy2(latest_source_file, latest_target_file)
    deleted_files: list[str] = []
    for file_path in old_versions:
        file_path.unlink()
        deleted_files.append(file_path.name)

    source_hash = sha256_for_file(latest_source_file)
    target_hash = sha256_for_file(latest_target_file)
    hashes_match = source_hash == target_hash

    print(f"已复制：{latest_target_file.name}")
    if deleted_files:
        print("已删除旧文件：")
        for file_name in deleted_files:
            print(f"- {file_name}")
    else:
        print("已删除旧文件：无")
    print(f"源文件 SHA-256：{source_hash}")
    print(f"目标文件 SHA-256：{target_hash}")
    print(f"哈希一致：{'是' if hashes_match else '否'}")

    if not hashes_match:
        print("错误：复制后的文件哈希不一致", file=sys.stderr)
        return 1

    remaining_files = find_old_versions(target_dir, latest_source_file.name)
    if remaining_files:
        print("警告：目标目录仍存在旧版本文件", file=sys.stderr)
        for file_path in remaining_files:
            print(f"- {file_path.name}", file=sys.stderr)
        return 1

    print("最终保留文件：")
    print(f"- {latest_target_file.name}")
    return 0


def main() -> int:
    args = parse_args()
    source_dir = Path(args.source_dir).expanduser().resolve()
    target_dir = Path(args.target_dir).expanduser().resolve()
    try:
        return sync_latest_sheet(source_dir=source_dir, target_dir=target_dir, dry_run=args.dry_run)
    except Exception as exc:
        print(f"执行失败：{exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
