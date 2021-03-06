const SHA1 = require('./lib/sha1')

class BigBlueButtonApi {

  constructor(url, salt, mobileKey) {
    this.url = url;
    this.salt = salt;
    this.mobileKey = mobileKey;
  }

  paramInclude(input, _function) {
    var key, value, _match, _obj;
    _obj = new Object;
    _match = null;
    for (key in input) {
      value = input[key];
      if (_function.call(input, key, value)) _obj[key] = value;
    }
    return _obj;
  }

  paramsFor(param) {
    switch (param) {
      case "create":
        return [["meetingID", true], ["name", true], ["attendeePW", false], ["moderatorPW", false], ["welcome", false], ["dialNumber", false], ["voiceBridge", false], ["webVoice", false], ["logoutURL", false], ["maxParticipants", false], ["record", false], ["duration", false], [/meta_\w+/, false]];
      case "join":
        return [["fullName", true], ["meetingID", true], ["password", true], ["createTime", false], ["userID", false], ["webVoiceConf", false]];
      case "isMeetingRunning":
        return [["meetingID", true]];
      case "end":
        return [["meetingID", true], ["password", true]];
      case "getMeetingInfo":
        return [["meetingID", true], ["password", true]];
      case "getMeetings":
        return [["random", true]];
      case "getRecordings":
        return [["meetingID", true]];
      case "publishRecordings":
        return [["recordID", true], ["publish", true]];
      case "deleteRecordings":
        return [["recordID", true]];
    }
  }

  filterParams(params, method) {
    var filters, key, r, v;
    filters = this.paramsFor(method);
    if (!(filters != null) || filters.length === 0) {
      return {};
    } else {
      r = this.paramInclude(params, function(key, value) {
        var filter, _i, _len;
        for (_i = 0, _len = filters.length; _i < _len; _i++) {
          filter = filters[_i];
          if (filter[0] instanceof RegExp) {
            if (key.match(filter[0]) || key.match(/^custom_/)) return true;
          } else {
            if (key.match("^" + filter[0] + "$") || key.match(/^custom_/)) {
              return true;
            }
          }
        }
        return false;
      });
      for (key in r) {
        v = r[key];
        if (key.match(/^custom_/)) r[key.replace(/^custom_/, "")] = v;
      }
      for (key in r) {
        if (key.match(/^custom_/)) delete r[key];
      }
      return r;
    }
  }

  urlFor(method, params) {
    var checksum, key, param, paramList, query, url;
    params = this.filterParams(params, method);
    url = this.url;
    paramList = [];

    for (key in params) {
      param = params[key];
      if ((key != null) && (param != null)) {
        paramList.push("" + (encodeURIComponent(key)) + "=" + (encodeURIComponent(param)));
      }
    }

    if (paramList.length > 0) query = paramList.join("&");
    checksum = this.checksum(method, query);
    if (paramList.length > 0) {
      query = method + "?" + query;
      query += "&";
    } else {
      query = method + "?";
    }
    query += "checksum=" + checksum;

    return url + "/" + query;
  }

  urlForMobileApi(method, params) {
    var matched, oldPat, query, url;
    url = this.urlFor(method, params, true);
    oldPat = new RegExp("bigbluebutton\\/api\\/" + method + "\\?");
    url = url.replace(oldPat, "demo/mobile.jsp?action=" + method + "&");
    url = url.replace(/[&]?checksum=.*$/, "");
    if (!url.match(/action=getTimestamp/)) {
      url = url + "&timestamp=" + new Date().getTime();
    }
    query = "";
    matched = url.match(/\?(.*)$/);
    if ((matched != null) && (matched[1] != null)) query = matched[1];
    return url = url + "&checksum=" + this.checksum(method, query, true);
  }

  replaceMobileProtocol(url) {
    return url.replace(/http[s]?\:\/\//, "bigbluebutton://");
  }

  checksum(method, query, forMobile) {
    var str;
    query || (query = "");
    if ((forMobile != null) && forMobile) {
      str = query + this.mobileKey;
    } else {
      str = method + query + this.salt;
    }

    return SHA1(str);
  }

  getUrls(params) {
    var joinAtt, joinAttMobile, joinMod, joinModMobile, ret;
    if (params == null) params = {};
    params.random = Math.floor(Math.random() * 1000000000).toString();
    params.password = params.attendeePW;
    joinAtt = this.urlFor("join", params);
    joinAttMobile = this.replaceMobileProtocol(joinAtt);
    params.password = params.moderatorPW;
    joinMod = this.urlFor("join", params);
    joinModMobile = this.replaceMobileProtocol(joinMod);

    return {
      'create': this.urlFor("create", params),
      'join (as moderator)': joinMod,
      'join (as attendee)': joinAtt,
      'isMeetingRunning': this.urlFor("isMeetingRunning", params),
      'getMeetingInfo': this.urlFor("getMeetingInfo", params),
      'end': this.urlFor("end", params),
      'getMeetings': this.urlFor("getMeetings", params),
      'getRecordings': this.urlFor("getRecordings", params),
      'publishRecordings': this.urlFor("publishRecordings", params),
      'deleteRecordings': this.urlFor("deleteRecordings", params),
      'join from mobile (as moderator)': joinModMobile,
      'join from mobile (as attendee)': joinAttMobile,
      'mobile: getTimestamp': this.urlForMobileApi("getTimestamp", params),
      'mobile: getMeetings': this.urlForMobileApi("getMeetings", params),
      'mobile: create': this.urlForMobileApi("create", params)
    };
  }
}

module.exports = BigBlueButtonApi
