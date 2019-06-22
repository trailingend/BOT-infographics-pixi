
export const retrieveWindowWidth = (platform) => {
    if( window.screen.width && ! platform.isDesktop){
        return window.screen.width;
    } else if (window.innerWidth) {
        return window.innerWidth;
    } else {
        return document.documentElement.clientWidth;
    }
}

export const retrieveWindowHeight = (platform) => {
    if( window.screen.width && ! platform.isDesktop){
        return window.screen.height;
    } else if ( window.innerHeight ){
        return window.innerHeight;
    } else {
        return document.documentElement.clientHeight;
    }
}

export const checkIfDesktopToMobile = (oldW, newW, widthLimit) => {
    return newW <= widthLimit && oldW > widthLimit;
}

export const checkIfMobileToDesktop = (oldW, newW, widthLimit) => {
    return newW > widthLimit && oldW <= widthLimit;
}

export const testPlatform = () => {
    const ua = window.navigator.userAgent.toLowerCase();
    const platform = {
        isAndroid412: ua.match(/android 4\.1\.2/i) !== null,
        isDuos: ua.match(/gt\-s7562/i) !== null,
        isI9300: ua.match(/gt\-i9300/i) !== null,
        isI9500: ua.match(/gt\-i9500/i) !== null,
        hasTouch: ('ontouchstart' in window),
        isiPod: ua.match(/ipod/i) !== null,
        isiPad: ua.match(/ipad/i) !== null,
        isiPhone: ua.match(/iphone/i) !== null,
        isAndroid: ua.match(/android/i) !== null,
        isBustedAndroid: ua.match(/android 2\.[12]/) !== null,
        isIE: window.navigator.appName.indexOf("Microsoft") != -1,
        isIE10: ua.match(/msie 10/) !== null,
        isIE11: ua.match(/trident.*rv\:11\./) !== null,
        isEdge: ua.indexOf('edge/')>0,
        isChrome: ua.match(/Chrome/gi) !== null,
        isFirefox: ua.match(/firefox/gi) !== null,
        isSafari: ua.indexOf('safari') != -1 && ua.indexOf('chrome') == -1,
        isWebkit: ua.match(/webkit/gi) !== null,
        isGecko: ua.match(/gecko/gi) !== null,
        isOpera: ua.match(/opera/gi) !== null,
        isMac: ua.match('mac') !== null,
        isIOS8: ua.match(/(iphone|ipod|ipad).* os 8_/) !== null,
        isIOS10: ua.match(/(iphone|ipod|ipad).* os 10_/) !== null,
        supportsSvg: !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect
    }
    platform.isMobile = platform.isiPhone || platform.isAndroid;
    platform.isTablet = platform.isiPad;
    platform.isDesktop = !(platform.isMobile || platform.isTablet);
    platform.isIE = platform.isIE10 || platform.isIE11 || platform.isEdge;
    platform.isIos = platform.isiPhone || platform.isiPad;
    window.platform = platform;
    return platform;
}

export const itemPositions = {
    'road': { x: 1090, y: 864, w: 2076, h: 1265 },
    'mask': { x: 519, y: 386, w: 697, h: 583 },
    'hospital1': { x: 514, y: 356, w: 713, h: 654, delay: 0 },
    'building1': { x: 1306, y: 376, w: 366, h: 370, delay: 0.1 },
    'house1': { x: 863, y: 834, w: 272, h: 207, delay: 0.2 },
    'house2': [{ x: 658, y: 963, w: 223, h: 188, delay: 0.2 },
               { x: 1579, y: 722, w: 222, h: 188, delay: 0.2 }],
    'house3': { x: 1375, y: 837, w: 205, h: 218, delay: 0.2 },
    'house4': [{ x: 1533, y: 930, w: 206, h: 192, delay: 0.2 },
               { x: 1132, y: 993, w: 206, h: 192, delay: 0.2 }],
    'house5': { x: 1720, y: 830, w: 197, h: 210, delay: 0.2 },
    'fountain1': { x: 1145, y: 578, w: 316, h: 203, delay: 0 },
    'bench1': [{ x: 738, y: 758, w: 69, h: 63 },
               { x: 642, y: 812, w: 69, h: 63 },
               { x: 650, y: 709, w: 69, h: 63 },
               { x: 550, y: 769, w: 69, h: 63 },
               { x: 567, y: 688, w: 69, h: 63 },
               { x: 467, y: 742, w: 69, h: 63 },
               { x: 536, y: 602, w: 69, h: 63 },
               { x: 419, y: 671, w: 69, h: 63 }],
    'bench2': [{ x: 1179, y: 466, w: 69, h: 63 },
               { x: 1103, y: 422, w: 69, h: 63 }],
    'tree1': [{ x: 276, y: 706, w: 77, h: 113 },
              { x: 198, y: 662, w: 77, h: 113 },
              { x: 125, y: 614, w: 77, h: 113 },
              { x: 48, y: 560, w: 77, h: 113 },
              { x: 142, y: 505, w: 77, h: 113 },
              { x: 881, y: 303, w: 77, h: 113 },
              { x: 958, y: 347, w: 77, h: 113 }],
    'tree2': [{ x: 784, y: 735, w: 37, h: 43 },
              { x: 690, y: 786, w: 37, h: 43 },
              { x: 584, y: 844, w: 37, h: 43 },
              { x: 492, y: 853, w: 37, h: 43 },
              { x: 702, y: 686, w: 37, h: 43 },
              { x: 601, y: 735, w: 37, h: 43 },
              { x: 495, y: 796, w: 37, h: 43 },
              { x: 419, y: 805, w: 37, h: 43 },
              { x: 622, y: 649, w: 37, h: 43 },
              { x: 516, y: 711, w: 37, h: 43 },
              { x: 416, y: 762, w: 37, h: 43 }],
    'tree3': [{ x: 1110, y: 333, w: 54, h: 87 },
              { x: 1458, y: 520, w: 54, h: 87 }],
    'light1': [{ x: 365, y: 679, w: 22, h: 99 },
               { x: 898, y: 377, w: 22, h: 99 }],
    'sign1': { x: 990, y: 683, w: 36, h: 95 },
    'traffic1': { x: 1027, y: 825, w: 28, h: 117 },

}

export const hospitalInfo = [{
        name: 'All',
        color: '0xf15d3f',   
    }, {
        name: 'Vancouver',
        color: '0xff822e',   
    }, {
        name: 'Richmond',
        color: '0xffcf04',   
    }, {
        name: 'Costal',
        color: '0xaed630',   
    }, {
        name: 'North Vancouver',
        color: '0x739849',   
    }, {
        name: 'Squamish',
        color: '0x44c8f5',   
    }, {
        name: 'Powell River',
        color: '0x0c5d8f',   
    }, {
        name: 'Sechelt',
        color: '0x904799',   
    }, {
        name: 'Whistler & Pemberton',
        color: '0xf46ea5',   
    }];

    export const maskPath = [
        0, 232.1,
        0.6, 473.2,
        190.1, 583,
        387, 465.3,
        419.7, 486.3, 
        689.8, 326.9,
        689.4, 292.7,
        691.7, 256.6,
        696.1, 253.9,
        697.5, 164.1,
        666.9, 118.5,
        666.7, 79.3,
        484.4, 0
    ];
