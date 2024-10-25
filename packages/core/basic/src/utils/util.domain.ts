//域名是否匹配，支持通配符
function match(targetDomains: string | string[], inDomains: string[]) {
  if (!targetDomains || targetDomains.length == 0) {
    return false;
  }
  if (!inDomains || inDomains.length == 0) {
    return false;
  }

  if (typeof targetDomains === 'string') {
    targetDomains = [targetDomains];
  }
  for (let targetDomain of targetDomains) {
    let matched = false;
    if (targetDomain.startsWith('.')) {
      targetDomain = '*' + targetDomain;
    }
    for (let inDomain of inDomains) {
      if (inDomain.startsWith('.')) {
        inDomain = '*' + inDomain;
      }
      if (targetDomain === inDomain) {
        matched = true;
        break;
      }

      if (!inDomain.startsWith('*.')) {
        //不可能匹配
        continue;
      }
      //子域名匹配通配符即可
      const firstDotIndex = targetDomain.indexOf('.');
      const targetDomainSuffix = targetDomain.substring(firstDotIndex + 1);
      if (targetDomainSuffix === inDomain.substring(2)) {
        matched = true;
        break;
      }
    }
    //有一个没有匹配上，就失败
    if (!matched) {
      return false;
    }
    //这个匹配上了，检查下一个
  }
  //没有提前return 全部匹配上了
  return true;
}

export const domainUtils = {
  match,
};
