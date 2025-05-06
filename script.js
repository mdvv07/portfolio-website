const fetch = require('node-fetch');
const IPCIDR = require('ip-cidr');

async function fetchCloudflareIPs() {
  const response = await fetch('https://api.cloudflare.com/client/v4/ips');
  const data = await response.json();
  return {
    ipv4: data.result.ipv4_cidrs,
    ipv6: data.result.ipv6_cidrs
  };
}

function isIPInRange(ip, cidrs) {
  return cidrs.some(cidr => {
    const range = new IPCIDR(cidr);
    return range.contains(ip);
  });
}

(async () => {
  const { ipv4, ipv6 } = await fetchCloudflareIPs();

  const testIP = '104.16.0.1'; 

  if (isIPInRange(testIP, ipv4)) {
    console.log(`${testIP} is a Cloudflare IPv4`);
  } else if (isIPInRange(testIP, ipv6)) {
    console.log(`${testIP} is a Cloudflare IPv6`);
  } else {
    console.log(`${testIP} is NOT a Cloudflare IP`);
  }
})();
