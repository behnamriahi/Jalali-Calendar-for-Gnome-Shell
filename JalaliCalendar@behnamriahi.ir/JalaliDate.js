/*
 * Based on a code from http://www.tabibmuda.com/page.php?8
 */

var JalaliDate = {};

JalaliDate.intPart = function (floatNum) {
    if (floatNum < -0.0000001) {
        return Math.ceil(floatNum - 0.0000001);
    }
    return Math.floor(floatNum + 0.0000001);
};

JalaliDate.toJalali = function (y, m, d) {
    y = parseInt(y);
    m = parseInt(m);
    d = parseInt(d);

    let j, jd, l, n;
    if ((y > 1582) || ((y === 1582) && (m > 10)) || ((y === 1582) && (m === 10) && (d > 14))) {
        jd = JalaliDate.intPart((1461 * (y + 4800 + JalaliDate.intPart((m - 14) / 12))) / 4) +
            JalaliDate.intPart((367 * (m - 2 - 12 * (JalaliDate.intPart((m - 14) / 12)))) / 12) -
            JalaliDate.intPart((3 * (JalaliDate.intPart((y + 4900 + JalaliDate.intPart((m - 14) / 12)) / 100))) / 4) + d - 32075;
    } else {
        jd = 367 * y - JalaliDate.intPart((7 * (y + 5001 + JalaliDate.intPart((m - 9) / 7))) / 4) + JalaliDate.intPart((275 * m) / 9) + d + 1729777;
    }
    l = jd - 1948440 + 10632;
    n = JalaliDate.intPart((l - 1) / 10631);
    l = l - 10631 * n + 354;
    j = (JalaliDate.intPart((10985 - l) / 5316)) * (JalaliDate.intPart((50 * l) / 17719)) + (JalaliDate.intPart(l / 5670)) * (JalaliDate.intPart((43 * l) / 15238));
    l = l - (JalaliDate.intPart((30 - j) / 15)) * (JalaliDate.intPart((17719 * j) / 50)) - (JalaliDate.intPart(j / 16)) * (JalaliDate.intPart((15238 * j) / 43)) + 29;
    m = JalaliDate.intPart((24 * l) / 709);
    d = l - JalaliDate.intPart((709 * m) / 24);
    y = 30 * n + j - 30;

    return {year: y, month: m, day: d};
};

JalaliDate.fromJalali = function (y, m, d) {
    y = parseInt(y);
    m = parseInt(m);
    d = parseInt(d);

    let i, j, jd, k, l, n;
    jd = JalaliDate.intPart((11 * y + 3) / 30) + 354 * y + 30 * m - JalaliDate.intPart((m - 1) / 2) + d + 1948440 - 385;
    if (jd > 2299160) {
        l = jd + 68569;
        n = JalaliDate.intPart((4 * l) / 146097);
        l -= JalaliDate.intPart((146097 * n + 3) / 4);
        i = JalaliDate.intPart((4000 * (l + 1)) / 1461001);
        l = l - JalaliDate.intPart((1461 * i) / 4) + 31;
        j = JalaliDate.intPart((80 * l) / 2447);
        d = l - JalaliDate.intPart((2447 * j) / 80);
        l = JalaliDate.intPart(j / 11);
        m = j + 2 - 12 * l;
        y = 100 * (n - 49) + i + l;
    } else {
        j = jd + 1402;
        k = JalaliDate.intPart((j - 1) / 1461);
        l = j - 1461 * k;
        n = JalaliDate.intPart((l - 1) / 365) - JalaliDate.intPart(l / 1461);
        i = l - 365 * n + 30;
        j = JalaliDate.intPart((80 * i) / 2447);
        d = i - JalaliDate.intPart((2447 * j) / 80);
        i = JalaliDate.intPart(j / 11);
        m = j + 2 - 12 * i;
        y = 4 * k + n + i - 4716;
    }

    return {year: y, month: m, day: d};
};
