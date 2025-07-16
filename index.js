const REGX_OS = /^[A-Z]\w+\W+\d+\.\d+(?:\.\d+)?\s+\((?:\w+;\s+(?:\w+;\s+)?)?(\w[^;\)]+)\s+(\d+(?:[_\.]\d[_\.\d]*)?)\b/;
const REGX_CLIENT = {
  CRAWLER2: /\((?<browserName>[\w\-]*[Bb]ot[\w\-]*)\/(?<browserVersion>\d[\d\._]*)\b/i,
  SAFARI: /\b(?:Mac|iPhone|iPad).*\s+Version\/(?<browserVersion>\d+\.\d+(?:\.\d+)?)\s+(?<browserName>(?:[A-Z]\w+\/\w+\s+)?Safari)/i,
  EDGE_OPR_VIV_YA_FIREFOX: /\bGecko.*?\s+(?<browserName>(?:Edg|OPR|Viv|Ya|F)\w*)\/(?<browserVersion>\d[\d\.]+)/i,
  CHROME: /\bGecko\W+(?<browserName>Ch?r\w+)\/(?<browserVersion>\d[\d\.]+)/i,
  CRAWLER: /compatible\W+(?<browserName>\w[^\/\)]+)(?:;|\/(?<browserVersion>\d[\d\._]+))/i,
};

function parseOs(userAgent) {
  if (typeof userAgent === "string") {
    const matches = userAgent.match(REGX_OS);
    if (matches) {
      return { os: matches[1], osVersion: matches[2] };
    }
  }
  return { os: "unknown", osVersion: "unknown" };
}

function parseBrowser(userAgent) {
  if (typeof userAgent === "string") {
    const clients = Object.keys(REGX_CLIENT);
    for (let i = 0; i < clients.length; i++) {
      const client = clients[i];
      const match = REGX_CLIENT[client].exec(userAgent);
      if (match) {
        const { browserName, browserVersion } = match.groups;
        return { browserName, browserVersion };
        break;
      }
    }
  }
  return { browserName: "unknown", browserVersion: "unknown" };
}

module.exports = { parseOs, parseBrowser }
