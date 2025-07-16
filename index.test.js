import { describe, it } from "node:test";
import assert from "node:assert";
import { parseOs, parseBrowser } from "./index.js";

const USER_AGENTS = {
  windows: "Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko",
  macbook: "Mozilla/5.0 (Macintosh; Intel Mac OS X 15_5_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.4 Safari/605.1.15",
  iphone: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.4 Mobile/15E148 Safari/604.1",
  ipad: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.4 Mobile/15E148 Safari/604.1",
  huawei: "Mozilla/5.0 (Linux; Android 12; HBP-LX9 Build/HUAWEIHBP-L29; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/99.0.4844.88 Mobile Safari/537.36",
  samsung: "Mozila/5.0 (Linux; Android 14; SM-S928B/DS) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.230 Mobile Safari/537.36",
  pixel: "Mozilla/5.0 (Linux; Android 14; Pixel 9 Build/AD1A.240411.003.A5; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/124.0.6367.54 Mobile Safari/537.36",
  motorola_moto_edge: "Dalvik/2.1.0 (Linux; U; Android 17; moto edge 30 neo Build/AP3A.241105.008)",
  playstation: "Mozilla/5.0 (PlayStation 4 3.11) AppleWebKit/537.73 (KHTML, like Gecko)",
  xbox: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; Xbox; Xbox Series X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.82 Safari/537.36 Edge/20.02",
  safari_desktop: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A",
  safari_iphone: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
  safari_ipad: "Mozilla/5.0 (iPad; CPU OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
  firefox_desktop: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0",
  firefox_iphone: "Mozilla/5.0 (iPhone; CPU iPhone OS 11_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/30.0 Mobile/15E148 Safari/605.1.15",
  firefox_android: "Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/84.0",
  edge_desktop: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.67",
  edge_ios: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 EdgiOS/138.3351.83 Mobile/15E148 Safari/605.1.15",
  edge_android: "Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.7204.46 Mobile Safari/537.36 EdgA/138.0.3351.77",
  opera_windows: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 OPR/73.0.3856.329",
  opera_mac: "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 OPR/73.0.3856.329",
  opera_linux: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 OPR/73.0.3856.329",
  opera_android: "Mozilla/5.0 (Linux; Android 10; VOG-L29) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Mobile Safari/537.36 OPR/61.1.3076.56625",
  vivaldi_windows: "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 Vivaldi/3.5",
  vivaldi_mac: "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 Vivaldi/3.5",
  vivaldi_linux: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 Vivaldi/3.5",
  yandex_windows: "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 YaBrowser/20.12.0 Yowser/2.5 Safari/537.36",
  yandex_mac: "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 YaBrowser/20.12.0 Yowser/2.5 Safari/537.36",
  yandex_linux: "Mozilla/5.0 (Linux; arm_64; Android 11; SM-G965F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 YaBrowser/20.12.29.180 Mobile Safari/537.36",
  yandex_iphone: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 YaBrowser/20.11.2.199 Mobile/15E148 Safari/604.1",
  chrome_chromeos: "Mozilla/5.0 (X11; CrOS x86_64 13505.63.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
  chrome_windows: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
  chrome_mac: "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
  chrome_linux: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
  chrome_android: "Mozilla/5.0 (Linux; Android 10; LM-Q720) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Mobile Safari/537.36",
  chrome_iphone: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.77 Mobile/15E148 Safari/604.1",
  chrome_ipad: "Mozilla/5.0 (iPod; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.77 Mobile/15E148 Safari/604.1",
  crawler_gpt: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.1; +https://openai.com/gptbot)",
  crawler_oai: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/2.0; +https://openai.com/bot)",
  crawler_anthropic: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ClaudeBot/1.0; +claudebot@anthropic.com)",
  crawler_perplexity: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)",
  crawler_google: "Mozilla/5.0 (compatible; Google-Extended/1.0; +http://www.google.com/bot.html)",
  crawler_bing: "Mozilla/5.0 (compatible; BingBot/1.0; +http://www.bing.com/bot.html)",
  crawler_amazon: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/600.2.5 (KHTML, like Gecko) Version/8.0.2 Safari/600.2.5 (Amazonbot/0.1; +https://developer.amazon.com/support/amazonbot)",
  crawler_apple: "Mozilla/5.0 (compatible; Applebot-Extended/1.0; +http://www.apple.com/bot.html)",
  crawler_fb: "Mozilla/5.0 (compatible; FacebookBot/1.0; +http://www.facebook.com/bot.html)",
  crawler_meta: "Mozilla/5.0 (compatible; meta-externalagent/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/crawler))",
  crawler_cohere: "Mozilla/5.0 (compatible; cohere-ai/1.0; +http://www.cohere.ai/bot.html)",
  crawler_mistral: "Mozilla/5.0 (compatible; MistralAI-User/1.0; +https://mistral.ai/bot)",
  crawler_yahoo: "Mozilla/5.0 (compatible; Yahoo! Slurp; http://help.yahoo.com/help/us/ysearch/slurp)"
};

describe("parseOs", () => {
  it("should parse Windows", () => {
    const ua = USER_AGENTS.windows;
    const out = parseOs(ua);

    assert.equal(out.os, "Windows NT");
    assert.equal(out.osVersion, "10.0");
  });

  it("should parse Macbook", () => {
    const ua = USER_AGENTS.macbook;
    const out = parseOs(ua);

    assert.equal(out.os, "Intel Mac OS X");
    assert.equal(out.osVersion, "15_5_3");
  });

  it("should parse iPhone", () => {
    const ua = USER_AGENTS.iphone
    const out = parseOs(ua);

    assert.equal(out.os, "CPU iPhone OS");
    assert.equal(out.osVersion, "18_5");
  });

  it("should parse iPad", () => {
    const ua = USER_AGENTS.ipad;
    const out = parseOs(ua);

    assert.equal(out.os, "CPU iPhone OS");
    assert.equal(out.osVersion, "18_3");
  });

  it("should parse Huawei", () => {
    const ua = USER_AGENTS.huawei;
    const out = parseOs(ua);

    assert.equal(out.os, "Android");
    assert.equal(out.osVersion, "12");
  });

  it("should parse Samsung", () => {
    const ua = USER_AGENTS.samsung;
    const out = parseOs(ua);

    assert.equal(out.os, "Android");
    assert.equal(out.osVersion, "14");
  });

  it("should parse Pixel", () => {
    const ua = USER_AGENTS.pixel;
    const out = parseOs(ua);

    assert.equal(out.os, "Android");
    assert.equal(out.osVersion, "14");
  });

  it("should parse Motorola Moto Edge", () => {
    const ua = USER_AGENTS.motorola_moto_edge;
    const out = parseOs(ua);

    assert.equal(out.os, "Android");
    assert.equal(out.osVersion, "17");
  });

  it("should parse Playstation", () => {
    const ua = USER_AGENTS.playstation;
    const out = parseOs(ua);

    assert.equal(out.os, "PlayStation 4");
    assert.equal(out.osVersion, "3.11");
  });

  it("should parse Xbox", () => {
    const ua = USER_AGENTS.xbox;
    const out = parseOs(ua);

    assert.equal(out.os, "Windows NT");
    assert.equal(out.osVersion, "10.0");
  });
});


describe("parseBrowser", () => {
  it("should parse Safari on Desktop", () => {
    const ua = USER_AGENTS.safari_desktop;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "Safari");
    assert.equal(out.browserVersion, "7.0.3");
  });

  it("should parse Safari on iPhone", () => {
    const ua = USER_AGENTS.safari_iphone;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "Mobile/15E148 Safari");
    assert.equal(out.browserVersion, "14.0");
  });

  it("should parse Safari on iPad", () => {
    const ua = USER_AGENTS.safari_ipad;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "Mobile/15E148 Safari");
    assert.equal(out.browserVersion, "14.0");
  });

  it("should parse Firefox on Desktop", () => {
    const ua = USER_AGENTS.firefox_desktop;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "Firefox");
    assert.equal(out.browserVersion, "84.0");
  });

  it("should parse Firefox on iPhone", () => {
    const ua = USER_AGENTS.firefox_iphone;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "FxiOS");
    assert.equal(out.browserVersion, "30.0");
  });

  it("should parse Firefox on Android", () => {
    const ua = USER_AGENTS.firefox_android;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "Firefox");
    assert.equal(out.browserVersion, "84.0");
  });

  it("should parse Edge on Desktop", () => {
    const ua = USER_AGENTS.edge_desktop;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "Edg");
    assert.equal(out.browserVersion, "114.0.1823.67");
  });

  it("should parse Edge on iOS", () => {
    const ua = USER_AGENTS.edge_ios;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "EdgiOS");
    assert.equal(out.browserVersion, "138.3351.83");
  });

  it("should parse Edge on Android", () => {
    const ua = USER_AGENTS.edge_android;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "EdgA");
    assert.equal(out.browserVersion, "138.0.3351.77");
  });

  it("should parse Opera on Desktop", () => {
    const ua = USER_AGENTS.edge_desktop;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "Edg");
    assert.equal(out.browserVersion, "114.0.1823.67");
  });

  it("should parse Opera on Windows", () => {
    const ua = USER_AGENTS.opera_windows;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "OPR");
    assert.equal(out.browserVersion, "73.0.3856.329");
  });

  it("should parse Opera on Mac", () => {
    const ua = USER_AGENTS.opera_mac;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "OPR");
    assert.equal(out.browserVersion, "73.0.3856.329");
  });

  it("should parse Opera on Linux", () => {
    const ua = USER_AGENTS.opera_linux;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "OPR");
    assert.equal(out.browserVersion, "73.0.3856.329");
  });

  it("should parse Opera on Android", () => {
    const ua = USER_AGENTS.opera_android;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "OPR");
    assert.equal(out.browserVersion, "61.1.3076.56625");
  });

  it("should parse Vivaldi on Windows", () => {
    const ua = USER_AGENTS.vivaldi_windows;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "Vivaldi");
    assert.equal(out.browserVersion, "3.5");
  });

  it("should parse Vivaldi on Mac", () => {
    const ua = USER_AGENTS.vivaldi_mac;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "Vivaldi");
    assert.equal(out.browserVersion, "3.5");
  });

  it("should parse Vivaldi on Linux", () => {
    const ua = USER_AGENTS.vivaldi_linux;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "Vivaldi");
    assert.equal(out.browserVersion, "3.5");
  });

  it("should parse Yandex on Windows", () => {
    const ua = USER_AGENTS.yandex_windows;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "YaBrowser");
    assert.equal(out.browserVersion, "20.12.0");
  });

  it("should parse Yandex on Mac", () => {
    const ua = USER_AGENTS.yandex_mac;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "YaBrowser");
    assert.equal(out.browserVersion, "20.12.0");
  });

  it("should parse Yandex on Linux", () => {
    const ua = USER_AGENTS.yandex_linux;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "YaBrowser");
    assert.equal(out.browserVersion, "20.12.29.180");
  });

  it("should parse Yandex on iPhone", () => {
    const ua = USER_AGENTS.yandex_iphone;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "YaBrowser");
    assert.equal(out.browserVersion, "20.11.2.199");
  });

  it("should parse Chrome on ChromeOS", () => {
    const ua = USER_AGENTS.chrome_chromeos;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "Chrome");
    assert.equal(out.browserVersion, "87.0.4280.88");
  });

  it("should parse Chrome on Windows", () => {
    const ua = USER_AGENTS.chrome_windows;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "Chrome");
    assert.equal(out.browserVersion, "87.0.4280.88");
  });

  it("should parse Chrome on Mac", () => {
    const ua = USER_AGENTS.chrome_mac;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "Chrome");
    assert.equal(out.browserVersion, "87.0.4280.88");
  });

  it("should parse Chrome on Linux", () => {
    const ua = USER_AGENTS.chrome_linux;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "Chrome");
    assert.equal(out.browserVersion, "87.0.4280.88");
  });

  it("should parse Chrome on iPhone", () => {
    const ua = USER_AGENTS.chrome_iphone;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "CriOS");
    assert.equal(out.browserVersion, "87.0.4280.77");
  });

  it("should parse Crawler for GPT", () => {
    const ua = USER_AGENTS.crawler_gpt;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "GPTBot");
    assert.equal(out.browserVersion, "1.1");
  });

  it("should parse Crawler for OpenAI", () => {
    const ua = USER_AGENTS.crawler_oai;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "ChatGPT-User");
    assert.equal(out.browserVersion, "2.0");
  });

  it("should parse Crawler for Anthropic", () => {
    const ua = USER_AGENTS.crawler_anthropic;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "ClaudeBot");
    assert.equal(out.browserVersion, "1.0");
  });

  it("should parse Crawler for Perplexity", () => {
    const ua = USER_AGENTS.crawler_perplexity;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "PerplexityBot");
    assert.equal(out.browserVersion, "1.0");
  });

  it("should parse Crawler for GoogleBot", () => {
    const ua = USER_AGENTS.crawler_google;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "Google-Extended");
    assert.equal(out.browserVersion, "1.0");
  });

  it("should parse Crawler for Bing", () => {
    const ua = USER_AGENTS.crawler_bing;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "BingBot");
    assert.equal(out.browserVersion, "1.0");
  });

  it("should parse Crawler for Amazon", () => {
    const ua = USER_AGENTS.crawler_amazon;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "Amazonbot");
    assert.equal(out.browserVersion, "0.1");
  });

  it("should parse Crawler for Apple", () => {
    const ua = USER_AGENTS.crawler_apple;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "Applebot-Extended");
    assert.equal(out.browserVersion, "1.0");
  });

  it("should parse Crawler for Facebook", () => {
    const ua = USER_AGENTS.crawler_fb;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "FacebookBot");
    assert.equal(out.browserVersion, "1.0");
  });

  it("should parse Crawler for Meta", () => {
    const ua = USER_AGENTS.crawler_meta;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "meta-externalagent");
    assert.equal(out.browserVersion, "1.1");
  });

  it("should parse Crawler for Cohere", () => {
    const ua = USER_AGENTS.crawler_cohere;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "cohere-ai");
    assert.equal(out.browserVersion, "1.0");
  });

  it("should parse Crawler for Mistral", () => {
    const ua = USER_AGENTS.crawler_mistral;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "MistralAI-User");
    assert.equal(out.browserVersion, "1.0");
  });

  it("should parse Crawler for Yahoo Slurp", () => {
    const ua = USER_AGENTS.crawler_yahoo;
    const out = parseBrowser(ua);

    assert.equal(out.browserName, "Yahoo! Slurp");
  });
});
