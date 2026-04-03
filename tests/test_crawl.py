"""
Test that claudebuttons are discoverable by web crawlers.

Uses crawl4ai to crawl the local demo page and verifies:
  1. Hidden <a data-cb-crawl> links are present in the DOM
  2. Links contain correct href, data-platform, data-command attributes
  3. Cowork buttons with skill-url expose the hosted skill URL as href
  4. JSON-LD structured data can be generated and contains valid schema
  5. Page markdown extracted by the crawler contains button metadata
"""

import asyncio
import json
import re
import sys

from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig

PAGE_URL = "http://localhost:5237/examples/index.html"


async def crawl_page():
    browser_cfg = BrowserConfig(headless=True)
    run_cfg = CrawlerRunConfig(
        js_code=[
            # Inject structured data before the crawl snapshot
            "if (window.ClaudeButtons && window.ClaudeButtons.injectStructuredData) { window.ClaudeButtons.injectStructuredData(); }"
        ],
        wait_until="networkidle",
    )

    async with AsyncWebCrawler(config=browser_cfg) as crawler:
        result = await crawler.arun(url=PAGE_URL, config=run_cfg)
        return result


def test_crawl_links(html: str):
    """Verify hidden <a data-cb-crawl> links exist and have correct attributes."""
    print("\n== Test: Crawlable Links ==")

    links = re.findall(r'<a[^>]*data-cb-crawl[^>]*>.*?</a>', html, re.DOTALL)
    assert len(links) > 0, "FAIL: No <a data-cb-crawl> links found in DOM"
    print(f"  Found {len(links)} crawlable links")

    cc_links = [l for l in links if 'data-platform="claude-code"' in l]
    cw_links = [l for l in links if 'data-platform="cowork"' in l]
    print(f"  Claude Code links: {len(cc_links)}")
    print(f"  Cowork links:      {len(cw_links)}")
    assert len(cc_links) > 0, "FAIL: No Claude Code crawl links"
    assert len(cw_links) > 0, "FAIL: No Cowork crawl links"

    # Verify Claude Code links point to claude.ai/code
    for link in cc_links[:3]:
        href = re.search(r'href="([^"]*)"', link)
        assert href, f"FAIL: No href in link: {link[:80]}"
        assert "claude.ai/code" in href.group(1), f"FAIL: Claude Code link doesn't point to claude.ai/code: {href.group(1)[:80]}"
        assert 'data-command=' in link, f"FAIL: Missing data-command: {link[:80]}"
        assert 'data-full-command=' in link, f"FAIL: Missing data-full-command: {link[:80]}"

    # Verify Cowork links with skill-url point to the skill file
    skill_links = [l for l in cw_links if 'data-skill-url=' in l]
    if skill_links:
        href = re.search(r'href="([^"]*)"', skill_links[0])
        assert href, "FAIL: Skill link missing href"
        assert "example.com" in href.group(1), f"FAIL: Skill link doesn't point to skill URL: {href.group(1)}"
        print(f"  Skill URL link verified: {href.group(1)[:80]}")
    else:
        print("  (No skill-url cowork buttons on page — skipping skill link test)")

    # Cowork links without skill-url should point to claude.ai/cowork
    no_skill = [l for l in cw_links if 'data-skill-url=' not in l]
    if no_skill:
        href = re.search(r'href="([^"]*)"', no_skill[0])
        assert href, "FAIL: Cowork link missing href"
        assert "claude.ai/cowork" in href.group(1), f"FAIL: Cowork link doesn't point to claude.ai/cowork: {href.group(1)[:80]}"

    print("  PASS")


def test_aria_attributes(html: str):
    """Verify ARIA attributes are set on button elements."""
    print("\n== Test: ARIA Attributes ==")

    cc_buttons = re.findall(r'<claude-code-button[^>]*>', html)
    cw_buttons = re.findall(r'<cowork-button[^>]*>', html)

    assert len(cc_buttons) > 0, "FAIL: No claude-code-button elements found"
    assert len(cw_buttons) > 0, "FAIL: No cowork-button elements found"
    print(f"  Found {len(cc_buttons)} Claude Code buttons, {len(cw_buttons)} Cowork buttons")

    for btn in cc_buttons[:3]:
        assert 'role="button"' in btn, f"FAIL: Missing role=button: {btn[:80]}"
        assert 'tabindex="0"' in btn, f"FAIL: Missing tabindex=0: {btn[:80]}"
        assert 'aria-label="Run on Claude Code:' in btn, f"FAIL: Missing/wrong aria-label: {btn[:80]}"

    for btn in cw_buttons[:3]:
        assert 'role="button"' in btn, f"FAIL: Missing role=button: {btn[:80]}"
        assert 'tabindex="0"' in btn, f"FAIL: Missing tabindex=0: {btn[:80]}"
        assert 'aria-label="Run on Cowork:' in btn, f"FAIL: Missing/wrong aria-label: {btn[:80]}"

    # Check aria-haspopup on buttons with popup (default)
    has_popup = [b for b in cc_buttons if 'aria-haspopup="dialog"' in b]
    print(f"  Buttons with aria-haspopup=dialog: {len(has_popup)}")
    assert len(has_popup) > 0, "FAIL: No buttons have aria-haspopup"

    print("  PASS")


def test_json_ld(html: str):
    """Verify JSON-LD structured data is injected and valid."""
    print("\n== Test: JSON-LD Structured Data ==")

    match = re.search(
        r'<script[^>]*data-claudebuttons-jsonld[^>]*>(.*?)</script>',
        html,
        re.DOTALL,
    )
    assert match, "FAIL: No <script data-claudebuttons-jsonld> found"

    raw = match.group(1).strip()
    data = json.loads(raw)

    assert data.get("@context") == "https://schema.org", f"FAIL: Wrong @context: {data.get('@context')}"
    assert data.get("@type") == "WebPage", f"FAIL: Wrong @type: {data.get('@type')}"

    actions = data.get("potentialAction", [])
    assert len(actions) > 0, "FAIL: No potentialAction entries"
    print(f"  Found {len(actions)} actions in JSON-LD")

    cc_actions = [a for a in actions if "Claude Code" in a.get("name", "")]
    cw_actions = [a for a in actions if "Cowork" in a.get("name", "")]
    print(f"  Claude Code actions: {len(cc_actions)}")
    print(f"  Cowork actions:      {len(cw_actions)}")
    assert len(cc_actions) > 0, "FAIL: No Claude Code actions"
    assert len(cw_actions) > 0, "FAIL: No Cowork actions"

    # Check structure of a Claude Code action
    cc = cc_actions[0]
    assert cc["@type"] == "Action", f"FAIL: Wrong action type: {cc['@type']}"
    assert "target" in cc, "FAIL: Missing target in action"
    assert cc["target"]["@type"] == "EntryPoint", f"FAIL: Wrong target type"
    assert "urlTemplate" in cc["target"], "FAIL: Missing urlTemplate"
    assert "claude.ai/code" in cc["target"]["urlTemplate"], "FAIL: urlTemplate doesn't reference claude.ai/code"
    assert "object" in cc, "FAIL: Missing object in Claude Code action"
    assert cc["object"]["@type"] == "SoftwareSourceCode", "FAIL: Wrong object type for Claude Code"

    # Check a Cowork action with skill URL
    cw_with_skill = [a for a in cw_actions if "object" in a and "downloadUrl" in a.get("object", {})]
    if cw_with_skill:
        cw = cw_with_skill[0]
        assert cw["object"]["@type"] == "SoftwareApplication", "FAIL: Wrong object type for Cowork skill"
        assert cw["object"]["downloadUrl"], "FAIL: Empty downloadUrl"
        print(f"  Skill downloadUrl: {cw['object']['downloadUrl'][:80]}")
    else:
        print("  (No Cowork skill actions — skipping skill object test)")

    print("  PASS")


def test_markdown_content(markdown: str):
    """Verify the crawler's markdown extraction picks up button text."""
    print("\n== Test: Markdown Extraction ==")

    assert len(markdown) > 100, f"FAIL: Markdown too short ({len(markdown)} chars)"
    print(f"  Markdown length: {len(markdown)} chars")

    assert "Run on Claude Code" in markdown, "FAIL: 'Run on Claude Code' not found in markdown"
    assert "Run on Cowork" in markdown, "FAIL: 'Run on Cowork' not found in markdown"

    # Check that realistic commands appear in the extracted text
    realistic_terms = ["Next.js", "Tailwind", "CI/CD", "GraphQL", "Docker"]
    found = [t for t in realistic_terms if t in markdown]
    print(f"  Found {len(found)}/{len(realistic_terms)} realistic command terms: {found}")
    assert len(found) >= 2, f"FAIL: Too few realistic terms found in markdown"

    print("  PASS")


def test_links_in_result(links: dict):
    """Verify crawl4ai extracted the hidden links."""
    print("\n== Test: Extracted Links ==")

    internal = links.get("internal", [])
    external = links.get("external", [])
    all_links = internal + external

    all_hrefs = [l.get("href", "") if isinstance(l, dict) else str(l) for l in all_links]

    claude_links = [h for h in all_hrefs if "claude.ai/code" in h]
    cowork_links = [h for h in all_hrefs if "claude.ai/cowork" in h]
    skill_links = [h for h in all_hrefs if "example.com" in h and "skill" in h.lower()]

    print(f"  Total links extracted: {len(all_hrefs)}")
    print(f"  Claude Code deep links: {len(claude_links)}")
    print(f"  Cowork deep links:      {len(cowork_links)}")
    print(f"  Skill file links:       {len(skill_links)}")

    assert len(claude_links) > 0, "FAIL: No claude.ai/code links extracted"
    assert len(cowork_links) > 0, "FAIL: No claude.ai/cowork links extracted"

    if skill_links:
        print(f"  First skill link: {skill_links[0][:100]}")

    print("  PASS")


async def main():
    print(f"Crawling {PAGE_URL} ...")
    result = await crawl_page()

    if not result.success:
        print(f"FAIL: Crawl failed — {result.error_message}")
        sys.exit(1)

    print(f"Crawl succeeded. Status: {result.status_code}")

    html = result.html or ""
    markdown = result.markdown or ""

    passed = 0
    failed = 0
    tests = [
        ("Crawl Links", lambda: test_crawl_links(html)),
        ("ARIA Attributes", lambda: test_aria_attributes(html)),
        ("JSON-LD", lambda: test_json_ld(html)),
        ("Markdown", lambda: test_markdown_content(markdown)),
        ("Extracted Links", lambda: test_links_in_result(result.links or {})),
    ]

    for name, fn in tests:
        try:
            fn()
            passed += 1
        except AssertionError as e:
            print(f"  {e}")
            failed += 1
        except Exception as e:
            print(f"  ERROR in {name}: {e}")
            failed += 1

    print(f"\n{'='*50}")
    print(f"Results: {passed} passed, {failed} failed out of {len(tests)} tests")
    print(f"{'='*50}")

    sys.exit(1 if failed > 0 else 0)


if __name__ == "__main__":
    asyncio.run(main())
