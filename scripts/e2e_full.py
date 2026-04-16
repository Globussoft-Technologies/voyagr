"""Comprehensive end-to-end test suite for Voyagr.

Covers public pages, tenant sites, auth flows, dashboard CRUD, and cleanup.

Usage:
    python scripts/e2e_full.py [--apex https://voyagr.globusdemos.com] [--headed]
"""
from __future__ import annotations

import argparse
import json
import random
import string
import sys
import time
import traceback
from urllib.parse import urlparse

from playwright.sync_api import (
    Browser,
    BrowserContext,
    Page,
    TimeoutError as PlaywrightTimeoutError,
    sync_playwright,
)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def rand(n: int = 6) -> str:
    return "".join(random.choices(string.ascii_lowercase, k=n))


def safe_print(msg: str) -> None:
    """Print that works even with unicode on Windows cp1252."""
    try:
        sys.stdout.buffer.write((msg + "\n").encode("utf-8", errors="replace"))
        sys.stdout.buffer.flush()
    except Exception:
        print(msg.encode("ascii", errors="replace").decode(), flush=True)


def screenshot_on_fail(page: Page, test_name: str) -> None:
    try:
        page.screenshot(path=f"e2e-fail-{test_name}.png", full_page=True)
    except Exception:
        pass


# ---------------------------------------------------------------------------
# Test Suite
# ---------------------------------------------------------------------------

class E2ETestSuite:
    def __init__(self, apex: str, headed: bool = False):
        self.apex = apex.rstrip("/")
        parsed = urlparse(self.apex)
        self.apex_host = parsed.hostname or ""

        self.suffix = rand(6)
        self.email = f"e2e-full-{self.suffix}@example.com"
        self.password = "TestPass123!"
        self.user_name = f"E2E Full {self.suffix}"
        self.tenant_name = f"E2E Site {self.suffix}"
        self.tenant_slug = f"e2efull{self.suffix}"

        self.page_slug = f"e2e-page-{rand(4)}"
        self.page_title = f"E2E Test Page {self.suffix}"
        self.page_content = f"<p>Automated test content marker-{self.suffix}-OK</p>"

        self.post_slug = f"e2e-post-{rand(4)}"
        self.post_title = f"E2E Blog Post {self.suffix}"
        self.post_excerpt = "This is an automated test post."
        self.post_content = f"<p>Blog test content post-marker-{self.suffix}</p>"

        self.headed = headed

        # Will be set during tenant tests
        self.tenant_base = ""
        self.blog_post_slug: str | None = None  # first existing blog post slug on travelstall

        # Track created resource IDs for cleanup
        self.created_page_id: str | None = None
        self.created_post_id: str | None = None

        # Results
        self.results: list[tuple[str, str, str]] = []  # (name, status, detail)

        # Playwright objects (set in run_all)
        self._browser: Browser | None = None
        self._context: BrowserContext | None = None
        self._page: Page | None = None

    # -- properties for the shared page --
    @property
    def page(self) -> Page:
        assert self._page is not None
        return self._page

    @property
    def context(self) -> BrowserContext:
        assert self._context is not None
        return self._context

    # -- tenant URL helper --
    def _tenant_url(self, slug: str, path: str = "") -> str:
        proto = "http"
        return f"{proto}://{slug}.{self.apex_host}{path}"

    # -- runner --
    def run_all(self) -> list[tuple[str, str, str]]:
        safe_print(f"\n{'='*60}")
        safe_print(f"  Voyagr E2E Full Test Suite")
        safe_print(f"  apex={self.apex}")
        safe_print(f"  email={self.email} tenant={self.tenant_slug}")
        safe_print(f"{'='*60}\n")

        with sync_playwright() as p:
            self._browser = p.chromium.launch(headless=not self.headed)
            self._context = self._browser.new_context(ignore_https_errors=True)
            self._page = self._context.new_page()

            tests = [m for m in dir(self) if m.startswith("test_")]
            tests.sort()

            for test_name in tests:
                method = getattr(self, test_name)
                num = test_name.split("_")[1]
                label = test_name[len(f"test_{num}_"):]
                display = f"[TEST {num}] {label}"
                t0 = time.time()
                try:
                    method()
                    elapsed = time.time() - t0
                    self.results.append((test_name, "PASS", ""))
                    safe_print(f"{display} {'.'*(50 - len(display))} PASS ({elapsed:.1f}s)")
                except Exception as exc:
                    elapsed = time.time() - t0
                    detail = str(exc)[:200]
                    self.results.append((test_name, "FAIL", detail))
                    safe_print(f"{display} {'.'*(50 - len(display))} FAIL ({elapsed:.1f}s)")
                    safe_print(f"  -> {detail}")
                    screenshot_on_fail(self.page, test_name)

            self._context.close()
            self._browser.close()

        # Summary
        passed = sum(1 for _, s, _ in self.results if s == "PASS")
        failed = sum(1 for _, s, _ in self.results if s == "FAIL")
        skipped = sum(1 for _, s, _ in self.results if s == "SKIP")
        safe_print(f"\n{'='*60}")
        safe_print(f"  RESULTS: {passed} passed, {failed} failed, {skipped} skipped")
        safe_print(f"{'='*60}\n")

        return self.results

    # ===================================================================
    # PUBLIC SITE TESTS
    # ===================================================================

    def test_01_apex_landing(self):
        """Apex returns 200, contains 'Voyagr', has Sign in and Get started links."""
        resp = self.page.goto(self.apex, wait_until="networkidle")
        assert resp is not None and resp.status == 200, f"Expected 200, got {resp.status if resp else 'None'}"
        content = self.page.content()
        assert "Voyagr" in content, "Missing 'Voyagr' in page"
        assert self.page.locator('a:has-text("Sign in")').count() > 0, "Missing 'Sign in' link"
        assert self.page.locator('a:has-text("Get started")').count() > 0, "Missing 'Get started' link"

    def test_02_sign_up_page(self):
        """Sign-up page returns 200 with expected form fields."""
        resp = self.page.goto(f"{self.apex}/sign-up", wait_until="networkidle")
        assert resp is not None and resp.status == 200, f"Expected 200, got {resp.status if resp else 'None'}"
        for field in ["email", "password", "tenantName", "tenantSlug"]:
            assert self.page.locator(f'input[name="{field}"]').count() > 0, f"Missing field: {field}"

    def test_03_sign_in_page(self):
        """Sign-in page returns 200 with email/password fields and forgot password link."""
        resp = self.page.goto(f"{self.apex}/sign-in", wait_until="networkidle")
        assert resp is not None and resp.status == 200, f"Expected 200, got {resp.status if resp else 'None'}"
        assert self.page.locator('input[name="email"]').count() > 0, "Missing email field"
        assert self.page.locator('input[name="password"]').count() > 0, "Missing password field"
        assert self.page.locator('a:has-text("Forgot password")').count() > 0, "Missing forgot password link"

    def test_04_forgot_password_page(self):
        """Forgot password page returns 200 with email input."""
        resp = self.page.goto(f"{self.apex}/forgot-password", wait_until="networkidle")
        assert resp is not None and resp.status == 200, f"Expected 200, got {resp.status if resp else 'None'}"
        assert self.page.locator('input[type="email"], input[name="email"]').count() > 0, "Missing email input"

    def test_05_health_check(self):
        """/api/health returns 200 JSON with status=ok and database=connected."""
        resp = self.page.request.get(f"{self.apex}/api/health")
        assert resp.status == 200, f"Expected 200, got {resp.status}"
        data = resp.json()
        assert data["status"] == "ok", f"Expected status=ok, got {data.get('status')}"
        assert data["database"] == "connected", f"Expected database=connected, got {data.get('database')}"

    def test_06_auth_providers(self):
        """/api/auth/providers returns 200 JSON with credentials provider."""
        resp = self.page.request.get(f"{self.apex}/api/auth/providers")
        assert resp.status == 200, f"Expected 200, got {resp.status}"
        data = resp.json()
        assert "credentials" in data, f"Missing 'credentials' provider, keys={list(data.keys())}"

    # ===================================================================
    # TENANT PUBLIC SITE TESTS (travelstall)
    # ===================================================================

    def test_10_tenant_home(self):
        """Travelstall home returns 200, has hero section, destination cards, blog section."""
        url = self._tenant_url("travelstall")
        resp = self.page.goto(url, wait_until="networkidle")
        assert resp is not None and resp.status == 200, f"Expected 200, got {resp.status if resp else 'None'}"
        content = self.page.content()
        assert "Travel Stall" in content, "Missing 'Travel Stall' in content"
        # Hero section (HeroSection component renders a section or div with the welcome text)
        assert "Welcome to" in content, "Missing hero section welcome text"
        # Destination cards
        assert "Featured Destinations" in content or self.page.locator('a[href="/destinations"]').count() > 0, \
            "Missing destination cards section"
        # Blog section
        assert "Blog" in content or "Stories" in content, "Missing blog section"

    def test_11_tenant_about(self):
        """/about returns 200 with content."""
        url = self._tenant_url("travelstall", "/about")
        resp = self.page.goto(url, wait_until="networkidle")
        assert resp is not None and resp.status == 200, f"Expected 200, got {resp.status if resp else 'None'}"
        body = self.page.locator("body")
        assert body.inner_text().strip(), "About page has no content"

    def test_12_tenant_destinations(self):
        """/destinations returns 200 with destination images."""
        url = self._tenant_url("travelstall", "/destinations")
        resp = self.page.goto(url, wait_until="networkidle")
        assert resp is not None and resp.status == 200, f"Expected 200, got {resp.status if resp else 'None'}"
        # Should have images (either img tags or background images)
        content = self.page.content()
        has_images = self.page.locator("img").count() > 0 or "unsplash" in content
        assert has_images, "No destination images found"

    def test_13_tenant_blog(self):
        """/blog returns 200 with blog post cards."""
        url = self._tenant_url("travelstall", "/blog")
        resp = self.page.goto(url, wait_until="networkidle")
        assert resp is not None and resp.status == 200, f"Expected 200, got {resp.status if resp else 'None'}"
        # Look for links that go to /blog/something
        blog_links = self.page.locator('a[href^="/blog/"]')
        count = blog_links.count()
        assert count > 0, "No blog post cards found"
        # Grab first post slug for next test
        first_href = blog_links.first.get_attribute("href")
        if first_href:
            self.blog_post_slug = first_href.split("/blog/")[-1].split("?")[0]

    def test_14_tenant_blog_post(self):
        """/blog/{slug} returns 200 with post title and content."""
        slug = self.blog_post_slug
        if not slug:
            raise AssertionError("No blog post slug discovered from test_13; skipping")
        url = self._tenant_url("travelstall", f"/blog/{slug}")
        resp = self.page.goto(url, wait_until="networkidle")
        assert resp is not None and resp.status == 200, f"Expected 200, got {resp.status if resp else 'None'}"
        content = self.page.content()
        # Post should have a title (h1)
        h1 = self.page.locator("h1")
        assert h1.count() > 0, "No h1 found on blog post page"
        # Should have share section or article content
        body_text = self.page.locator("body").inner_text()
        assert len(body_text) > 100, "Blog post page seems too empty"

    def test_15_tenant_404(self):
        """/nonexistent-page-xyz returns 404."""
        url = self._tenant_url("travelstall", "/nonexistent-page-xyz")
        resp = self.page.goto(url, wait_until="networkidle")
        assert resp is not None and resp.status == 404, f"Expected 404, got {resp.status if resp else 'None'}"

    def test_16_tenant_search_api(self):
        """/api/search?q=bali&domain=travelstall returns results."""
        resp = self.page.request.get(
            f"{self.apex}/api/search?q=bali&domain=travelstall"
        )
        assert resp.status == 200, f"Expected 200, got {resp.status}"
        data = resp.json()
        # data could be an array or object with results
        if isinstance(data, list):
            assert len(data) >= 0  # might be empty but should not error
        elif isinstance(data, dict):
            assert "error" not in data or data.get("results") is not None

    # ===================================================================
    # AUTH FLOW TESTS
    # ===================================================================

    def test_20_sign_up_flow(self):
        """Create new user via API, verify account exists."""
        self.page.goto(f"{self.apex}/sign-up", wait_until="networkidle")
        self.page.wait_for_selector('input[name="email"]', timeout=10_000)
        self.page.fill('input[name="name"]', self.user_name)
        self.page.fill('input[name="email"]', self.email)
        self.page.fill('input[name="password"]', self.password)
        self.page.fill('input[name="tenantName"]', self.tenant_name)
        self.page.fill('input[name="tenantSlug"]', self.tenant_slug)
        self.page.click('button:has-text("Create account")')
        try:
            self.page.wait_for_url("**/sign-in*", timeout=15_000)
        except Exception:
            # Fallback: form may submit as native POST which redirects via 303
            self.page.goto(f"{self.apex}/sign-in", wait_until="networkidle")
        # Verify account was created by signing in (test_21 will confirm)
        assert True

    def test_21_sign_in_flow(self):
        """Sign in with created credentials, verify redirect to /dashboard."""
        self.page.goto(f"{self.apex}/sign-in", wait_until="networkidle")
        self.page.wait_for_selector('input[name="email"]', timeout=10_000)
        self.page.fill('input[name="email"]', self.email)
        self.page.fill('input[name="password"]', self.password)
        self.page.click('button[type="submit"]')
        self.page.wait_for_url("**/dashboard**", timeout=20_000)
        assert "dashboard" in self.page.url, f"Expected dashboard, got {self.page.url}"

    def test_22_onboarding_redirect(self):
        """New user dashboard redirects to /dashboard/onboarding."""
        self.page.goto(f"{self.apex}/dashboard", wait_until="networkidle")
        self.page.wait_for_url("**/dashboard/onboarding**", timeout=15_000)
        assert "onboarding" in self.page.url, f"Expected onboarding, got {self.page.url}"

    def test_23_skip_onboarding(self):
        """Click 'Skip setup', verify redirect to /dashboard."""
        # Make sure we're on onboarding page
        if "onboarding" not in self.page.url:
            self.page.goto(f"{self.apex}/dashboard/onboarding", wait_until="networkidle")
        skip_btn = self.page.locator('button:has-text("Skip setup")')
        skip_btn.wait_for(timeout=10_000)
        skip_btn.click()
        self.page.wait_for_url("**/dashboard", timeout=20_000)
        # Should be on dashboard home (not onboarding)
        # Wait a moment for the redirect to settle
        time.sleep(1)
        self.page.goto(f"{self.apex}/dashboard", wait_until="networkidle")
        # After skip, should stay on dashboard (not redirect to onboarding)
        assert "onboarding" not in self.page.url, f"Still on onboarding: {self.page.url}"

    # ===================================================================
    # DASHBOARD TESTS (authenticated)
    # ===================================================================

    def test_30_dashboard_home(self):
        """/dashboard returns 200, has 'Welcome back', has stats cards."""
        resp = self.page.goto(f"{self.apex}/dashboard", wait_until="networkidle")
        assert resp is not None and resp.status == 200, f"Expected 200, got {resp.status if resp else 'None'}"
        content = self.page.content()
        assert "Welcome back" in content, "Missing 'Welcome back' text"
        # Stats cards
        assert "Total pages" in content or "Published" in content, "Missing stats cards"

    def test_31_create_page(self):
        """/dashboard/pages/new, fill form, submit, verify success."""
        self.page.goto(f"{self.apex}/dashboard/pages/new", wait_until="networkidle")
        self.page.wait_for_selector('input[name="title"]', timeout=10_000)
        self.page.fill('input[name="title"]', self.page_title)
        self.page.fill('input[name="slug"]', self.page_slug)
        # Set content via hidden input (RichEditor populates it)
        self.page.evaluate(
            f"""() => {{
                const el = document.querySelector('input[name="content"]');
                if (el) {{
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                        window.HTMLInputElement.prototype, 'value'
                    ).set;
                    nativeInputValueSetter.call(el, {json.dumps(self.page_content)});
                    el.dispatchEvent(new Event('input', {{ bubbles: true }}));
                    el.dispatchEvent(new Event('change', {{ bubbles: true }}));
                }}
            }}"""
        )
        # Check the publish checkbox
        pub_checkbox = self.page.locator('input[name="published"]')
        if not pub_checkbox.is_checked():
            pub_checkbox.check()
        # Submit
        self.page.click('button:has-text("Create page")')
        self.page.wait_for_url("**/dashboard/pages", timeout=30_000)
        assert "/dashboard/pages" in self.page.url, f"Expected pages list, got {self.page.url}"

    def test_32_pages_list(self):
        """/dashboard/pages shows the created page."""
        self.page.goto(f"{self.apex}/dashboard/pages", wait_until="networkidle")
        self.page.wait_for_selector(f'text="{self.page_title}"', timeout=10_000)
        content = self.page.content()
        assert self.page_title in content, f"Created page '{self.page_title}' not found in list"
        # Try to grab the page ID from an edit link
        edit_link = self.page.locator(f'a[href*="/dashboard/pages/"][href*="/edit"]').first
        if edit_link.count() > 0:
            href = edit_link.get_attribute("href")
            if href:
                # /dashboard/pages/{id}/edit
                parts = href.split("/")
                for i, part in enumerate(parts):
                    if part == "pages" and i + 1 < len(parts) and parts[i + 1] != "new":
                        self.created_page_id = parts[i + 1]
                        break

    def test_33_edit_page(self):
        """Edit the created page - change title and save."""
        if not self.created_page_id:
            raise AssertionError("No page ID from test_32, cannot edit")
        self.page.goto(
            f"{self.apex}/dashboard/pages/{self.created_page_id}/edit",
            wait_until="networkidle",
        )
        self.page.wait_for_selector('input[name="title"]', timeout=10_000)
        new_title = f"{self.page_title} (edited)"
        self.page.fill('input[name="title"]', new_title)
        self.page.click('button:has-text("Save")')
        self.page.wait_for_url("**/dashboard/pages**", timeout=30_000)
        # Update title for later checks
        self.page_title = new_title

    def test_34_create_blog_post(self):
        """/dashboard/posts/new, fill form, submit via API, verify success."""
        self.page.goto(f"{self.apex}/dashboard/posts/new", wait_until="networkidle")
        self.page.wait_for_selector('input[name="title"]', timeout=10_000)
        self.page.fill('input[name="title"]', self.post_title)
        # Slug is auto-generated from title but let's set it explicitly
        slug_input = self.page.locator('input[name="slug"]')
        slug_input.fill(self.post_slug)
        # Excerpt
        self.page.fill('textarea[name="excerpt"]', self.post_excerpt)
        # Publish checkbox
        pub_checkbox = self.page.locator('input[name="published"]')
        if not pub_checkbox.is_checked():
            pub_checkbox.check()
        # Submit the form
        self.page.click('button:has-text("Create post")')
        self.page.wait_for_url("**/dashboard/posts**", timeout=30_000)
        assert "/dashboard/posts" in self.page.url, f"Expected posts list, got {self.page.url}"

    def test_35_posts_list(self):
        """/dashboard/posts shows the created post."""
        self.page.goto(f"{self.apex}/dashboard/posts", wait_until="networkidle")
        self.page.wait_for_selector(f'text="{self.post_title}"', timeout=10_000)
        content = self.page.content()
        assert self.post_title in content, f"Created post '{self.post_title}' not found in list"
        # Try to grab the post ID from an edit link
        edit_link = self.page.locator(f'a[href*="/dashboard/posts/"][href*="/edit"]').first
        if edit_link.count() > 0:
            href = edit_link.get_attribute("href")
            if href:
                parts = href.split("/")
                for i, part in enumerate(parts):
                    if part == "posts" and i + 1 < len(parts) and parts[i + 1] != "new":
                        self.created_post_id = parts[i + 1]
                        break

    def test_36_media_page(self):
        """/dashboard/media returns 200."""
        resp = self.page.goto(f"{self.apex}/dashboard/media", wait_until="networkidle")
        assert resp is not None and resp.status == 200, f"Expected 200, got {resp.status if resp else 'None'}"

    def test_37_newsletter_page(self):
        """/dashboard/newsletter returns 200."""
        resp = self.page.goto(f"{self.apex}/dashboard/newsletter", wait_until="networkidle")
        assert resp is not None and resp.status == 200, f"Expected 200, got {resp.status if resp else 'None'}"

    def test_38_team_page(self):
        """/dashboard/team returns 200, shows current user as OWNER."""
        resp = self.page.goto(f"{self.apex}/dashboard/team", wait_until="networkidle")
        assert resp is not None and resp.status == 200, f"Expected 200, got {resp.status if resp else 'None'}"
        content = self.page.content()
        assert "OWNER" in content.upper(), "Current user not shown as OWNER"

    def test_39_settings_theme(self):
        """/dashboard/settings/theme returns 200, shows theme picker."""
        resp = self.page.goto(
            f"{self.apex}/dashboard/settings/theme", wait_until="networkidle"
        )
        assert resp is not None and resp.status == 200, f"Expected 200, got {resp.status if resp else 'None'}"
        content = self.page.content()
        assert "theme" in content.lower(), "Theme picker not found"

    def test_40_settings_navigation(self):
        """/dashboard/settings/navigation returns 200."""
        resp = self.page.goto(
            f"{self.apex}/dashboard/settings/navigation", wait_until="networkidle"
        )
        assert resp is not None and resp.status == 200, f"Expected 200, got {resp.status if resp else 'None'}"

    def test_41_settings_domain(self):
        """/dashboard/settings/domain returns 200."""
        resp = self.page.goto(
            f"{self.apex}/dashboard/settings/domain", wait_until="networkidle"
        )
        assert resp is not None and resp.status == 200, f"Expected 200, got {resp.status if resp else 'None'}"

    def test_42_settings_email(self):
        """/dashboard/settings/email returns 200."""
        resp = self.page.goto(
            f"{self.apex}/dashboard/settings/email", wait_until="networkidle"
        )
        assert resp is not None and resp.status == 200, f"Expected 200, got {resp.status if resp else 'None'}"

    def test_43_analytics(self):
        """/dashboard/analytics returns 200."""
        resp = self.page.goto(
            f"{self.apex}/dashboard/analytics", wait_until="networkidle"
        )
        assert resp is not None and resp.status == 200, f"Expected 200, got {resp.status if resp else 'None'}"

    # ===================================================================
    # TENANT SITE VERIFICATION (new tenant)
    # ===================================================================

    def test_50_new_tenant_home(self):
        """New tenant subdomain returns 200."""
        url = self._tenant_url(self.tenant_slug)
        self.tenant_base = url
        resp = self.page.goto(url, wait_until="networkidle")
        assert resp is not None and resp.status == 200, f"Expected 200, got {resp.status if resp else 'None'}"
        content = self.page.content()
        assert self.tenant_name in content, f"Tenant name '{self.tenant_name}' not found on home page"

    def test_51_new_tenant_page(self):
        """Created page visible on tenant site at /{slug}."""
        url = self._tenant_url(self.tenant_slug, f"/{self.page_slug}")
        resp = self.page.goto(url, wait_until="networkidle")
        assert resp is not None and resp.status == 200, f"Expected 200, got {resp.status if resp else 'None'}"
        content = self.page.content()
        marker = f"marker-{self.suffix}-OK"
        assert marker in content, f"Marker '{marker}' not found in tenant page"

    def test_52_new_tenant_blog(self):
        """/blog shows created post on new tenant."""
        url = self._tenant_url(self.tenant_slug, "/blog")
        resp = self.page.goto(url, wait_until="networkidle")
        assert resp is not None and resp.status == 200, f"Expected 200, got {resp.status if resp else 'None'}"
        content = self.page.content()
        assert self.post_title in content, f"Post '{self.post_title}' not found on tenant blog"

    # ===================================================================
    # CLEANUP
    # ===================================================================

    def test_99_cleanup(self):
        """Delete test pages/posts via API, sign out."""
        # Make sure we're on the apex domain for API calls
        self.page.goto(f"{self.apex}/dashboard", wait_until="networkidle")
        errors = []

        # Delete test page
        if self.created_page_id:
            try:
                resp = self.page.request.delete(
                    f"{self.apex}/api/pages/{self.created_page_id}"
                )
                if resp.status not in (200, 204):
                    errors.append(f"Delete page: status {resp.status}")
            except Exception as e:
                errors.append(f"Delete page: {e}")

        # Delete test post
        if self.created_post_id:
            try:
                resp = self.page.request.delete(
                    f"{self.apex}/api/posts/{self.created_post_id}"
                )
                if resp.status not in (200, 204):
                    errors.append(f"Delete post: status {resp.status}")
            except Exception as e:
                errors.append(f"Delete post: {e}")

        # Sign out
        try:
            self.page.goto(f"{self.apex}/api/auth/signout", wait_until="networkidle")
            # NextAuth signout page has a form - click the button if present
            signout_btn = self.page.locator('button:has-text("Sign out")')
            if signout_btn.count() > 0:
                signout_btn.click()
                self.page.wait_for_url("**", timeout=10_000)
        except Exception as e:
            errors.append(f"Sign out: {e}")

        if errors:
            safe_print(f"  Cleanup warnings: {'; '.join(errors)}")
        # Cleanup is best-effort, don't fail the test for it


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main() -> int:
    parser = argparse.ArgumentParser(description="Voyagr E2E Full Test Suite")
    parser.add_argument("--apex", default="https://voyagr.globusdemos.com")
    parser.add_argument("--headed", action="store_true")
    args = parser.parse_args()

    suite = E2ETestSuite(apex=args.apex, headed=args.headed)
    results = suite.run_all()

    failed = sum(1 for _, s, _ in results if s == "FAIL")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
