"""End-to-end smoke test for Voyagr.

Flow:
    1. Sign up a brand-new user + tenant
    2. Sign in with the same credentials
    3. Create a published page from the dashboard
    4. Visit the tenant subdomain (HTTP) and confirm the page renders publicly

Usage:
    python scripts/e2e_smoke.py [--apex https://voyagr.globusdemos.com] [--headed]
"""
from __future__ import annotations

import argparse
import random
import string
import sys
import time
from urllib.parse import urlparse

from playwright.sync_api import (
    Page,
    TimeoutError as PlaywrightTimeoutError,
    sync_playwright,
)


def rand(n: int = 6) -> str:
    return "".join(random.choices(string.ascii_lowercase, k=n))


def log(msg: str) -> None:
    print(f"[e2e] {msg}", flush=True)


def attach_log_listeners(page: Page, label: str) -> None:
    page.on(
        "console",
        lambda m: print(f"[browser:{label}:{m.type}] {m.text}", flush=True),
    )
    page.on(
        "pageerror",
        lambda e: print(f"[browser:{label}:pageerror] {e}", flush=True),
    )
    page.on(
        "requestfailed",
        lambda r: print(
            f"[browser:{label}:requestfailed] {r.method} {r.url} "
            f"-> {r.failure}",
            flush=True,
        ),
    )

    def on_response(r):
        if r.request.method == "POST":
            loc = r.headers.get("location") or "-"
            ct = r.headers.get("content-type", "")
            print(
                f"[browser:{label}:resp] POST {r.url} -> {r.status} "
                f"loc={loc} ct={ct}",
                flush=True,
            )

    page.on("response", on_response)


def run(apex: str, headed: bool) -> int:
    apex = apex.rstrip("/")
    parsed = urlparse(apex)
    apex_host = parsed.hostname or ""

    suffix = rand(6)
    email = f"e2e-{suffix}@example.com"
    password = "TestPass123!"
    tenant_name = f"E2E Travel {suffix}"
    tenant_slug = f"e2e{suffix}"
    page_slug = f"hello-{rand(4)}"
    page_title = f"Hello from {tenant_slug}"
    page_content = (
        "This page was created by the Voyagr E2E smoke test. "
        f"Marker: marker-{suffix}-OK"
    )

    log(f"apex={apex} tenant_slug={tenant_slug} email={email}")
    tenant_protocol = "http" if apex_host == "lvh.me" or "localhost" in apex_host else "http"
    tenant_base = f"{tenant_protocol}://{tenant_slug}.{apex_host}"
    log(f"tenant_base={tenant_base} (HTTP — no wildcard cert yet)")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=not headed)
        ctx = browser.new_context(ignore_https_errors=True)
        page = ctx.new_page()
        attach_log_listeners(page, "admin")
        try:
            # ---------------------------------------------------------------
            log("step 1: open sign-up")
            page.goto(f"{apex}/sign-up", wait_until="networkidle")
            page.wait_for_selector('input[name="email"]', timeout=10_000)

            log("step 2: fill sign-up form")
            page.fill('input[name="name"]', f"E2E User {suffix}")
            page.fill('input[name="email"]', email)
            page.fill('input[name="password"]', password)
            page.fill('input[name="tenantName"]', tenant_name)
            page.fill('input[name="tenantSlug"]', tenant_slug)

            log("step 3: submit sign-up")
            page.click('button[type="submit"]')
            page.wait_for_url("**/sign-in*", timeout=30_000)
            log(f"after sign-up url = {page.url}")

            # ---------------------------------------------------------------
            log("step 4: fill sign-in form")
            page.wait_for_selector('input[name="email"]', timeout=10_000)
            page.fill('input[name="email"]', email)
            page.fill('input[name="password"]', password)

            log("step 5: submit sign-in")
            page.click('button[type="submit"]')
            page.wait_for_url("**/dashboard", timeout=20_000)
            log(f"after sign-in url = {page.url}")

            # ---------------------------------------------------------------
            log("step 6: navigate to create-page form")
            page.goto(f"{apex}/dashboard/pages/new", wait_until="networkidle")
            page.wait_for_selector('input[name="title"]', timeout=10_000)

            log("step 7: fill page form")
            page.fill('input[name="title"]', page_title)
            page.fill('input[name="slug"]', page_slug)
            page.fill('textarea[name="content"]', page_content)
            page.check('input[name="published"]')

            log("step 8: submit page form")
            page.click('button:has-text("Create page")')
            page.wait_for_url("**/dashboard/pages", timeout=30_000)
            log(f"after create-page url = {page.url}")

            log("step 9: confirm new page is in the list")
            page.wait_for_selector(f'text="{page_title}"', timeout=10_000)

            # ---------------------------------------------------------------
            log("step 10: open tenant subdomain home page (new tab)")
            tenant_page = ctx.new_page()
            attach_log_listeners(tenant_page, "tenant")
            tenant_page.goto(tenant_base, wait_until="networkidle")
            log(f"tenant home url = {tenant_page.url}")
            tenant_page.wait_for_selector(f'text="{tenant_name}"', timeout=10_000)
            tenant_page.wait_for_selector(f'text="{page_title}"', timeout=10_000)

            log("step 11: open the page itself by slug")
            tenant_page.goto(
                f"{tenant_base}/{page_slug}", wait_until="networkidle"
            )
            body = tenant_page.content()
            marker = f"marker-{suffix}-OK"
            if marker not in body:
                tenant_page.screenshot(path=f"e2e-tenant-page-{int(time.time())}.png")
                raise RuntimeError(
                    f"Marker '{marker}' not found in tenant page body. "
                    f"URL={tenant_page.url} status=? body_len={len(body)}"
                )
            log(f"marker found in page content")

            log("ALL STEPS PASSED")
            print("EMAIL:", email)
            print("TENANT SUBDOMAIN:", tenant_base)
            print("PAGE URL:", f"{tenant_base}/{page_slug}")
            return 0

        except (PlaywrightTimeoutError, Exception) as exc:
            log(f"FAILED at url={page.url}")
            log(f"error: {exc!r}")
            try:
                shot = f"e2e-fail-{int(time.time())}.png"
                page.screenshot(path=shot, full_page=True)
                log(f"screenshot saved: {shot}")
            except Exception:
                pass
            try:
                with open(f"e2e-fail-{int(time.time())}.html", "w", encoding="utf-8") as f:
                    f.write(page.content())
            except Exception:
                pass
            return 1
        finally:
            ctx.close()
            browser.close()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apex", default="https://voyagr.globusdemos.com")
    parser.add_argument("--headed", action="store_true")
    args = parser.parse_args()
    return run(args.apex, args.headed)


if __name__ == "__main__":
    sys.exit(main())
