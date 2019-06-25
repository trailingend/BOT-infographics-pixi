
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
    'road': { x: 1045, y: 717, w: 2076, h: 1011, delay: 0 },
    'mask': { x: 122, y: 76, w: 697, h: 583, delay: 0 },
    'hospital1': { x: 469, y: 336, w: 713, h: 654, delay: 0 },
    'building1': { x: 1261, y: 355, w: 366, h: 370, delay: 0.1 },
    'house1': { x: 818, y: 813, w: 272, h: 207, delay: 0.2 },
    'house2': [{ x: 613, y: 943, w: 222, h: 188, delay: 0.2 },
               { x: 1534, y: 702, w: 222, h: 188, delay: 0.2 }],
    'house3': { x: 1347, y: 810, w: 205, h: 218, delay: 0.2 },
    'house4': [{ x: 1087, y: 973, w: 206, h: 192, delay: 0.2 },
               { x: 1529, y: 917, w: 206, h: 192, delay: 0.2 }],
    'house5': { x: 1742, y: 758, w: 272, h: 278, delay: 0.2 },
    'fountain1': { x: 1102, y: 563, w: 316, h: 203, delay: 0.3 },
    'bench1': [{ x: 693, y: 738, w: 69, h: 63, delay: 1.3 },
               { x: 597, y: 792, w: 69, h: 63, delay: 1.8 },
               { x: 605, y: 689, w: 69, h: 63, delay: 2.1 },
               { x: 505, y: 749, w: 69, h: 63, delay: 1.9 },
               { x: 522, y: 668, w: 69, h: 63, delay: 1.4 },
               { x: 422, y: 722, w: 69, h: 63, delay: 1.9 },
               { x: 491, y: 582, w: 69, h: 63, delay: 1.6 },
               { x: 374, y: 651, w: 69, h: 63, delay: 1.5 }],
    'bench2': [{ x: 1131, y: 446, w: 69, h: 63, delay: 2 },
               { x: 1058, y: 401, w: 69, h: 63, delay: 1.7 }],
    'tree1': [{ x: 230, y: 686, w: 77, h: 113, delay: 0.4 },
              { x: 153, y: 642, w: 77, h: 113, delay: 0.5 },
              { x: 80, y: 594, w: 77, h: 113, delay: 0.6 },
              { x: 3, y: 540, w: 77, h: 113, delay: 0.7 },
              { x: 96, y: 485, w: 77, h: 113, delay: 0.8 },
              { x: 836, y: 283, w: 77, h: 113, delay: 0.9 },
              { x: 913, y: 327, w: 77, h: 113, delay: 1 }],
    'tree2': [{ x: 737, y: 711, w: 37, h: 43, delay: 2.4 },
              { x: 645, y: 766, w: 37, h: 43, delay: 2.6 },
              { x: 539, y: 824, w: 37, h: 43, delay: 2.2 },
              { x: 447, y: 833, w: 37, h: 43, delay: 2.55 },
              { x: 657, y: 666, w: 37, h: 43, delay: 2.35 },
              { x: 556, y: 715, w: 37, h: 43, delay: 2.7 },
              { x: 450, y: 776, w: 37, h: 43, delay: 2.25 },
              { x: 374, y: 785, w: 37, h: 43, delay: 2.5 },
              { x: 577, y: 629, w: 37, h: 43, delay: 2.45 },
              { x: 471, y: 691, w: 37, h: 43, delay: 2.65 },
              { x: 371, y: 742, w: 37, h: 43, delay: 2.3 }],
    'tree3': [{ x: 1065, y: 313, w: 54, h: 87, delay: 1.1 },
              { x: 1413, y: 500, w: 54, h: 87, delay: 1.2 }],
    'light1': [{ x: 320, y: 659, w: 22, h: 99, delay: 4.2 },
               { x: 853, y: 357, w: 22, h: 99, delay: 4.2 }],
    'sign1': { x: 945, y: 663, w: 36, h: 95, delay: 2.8 },
    'traffic1': { x: 982, y: 805, w: 28, h: 117, delay: 3.5 },
    'ambulance1': [{ x: 734, y: 488, w: 114, h: 103, delay: 3.1 },
                   { x: 779, y: 521, w: 114, h: 103, delay: 3.2 }]

}

export const hospitalInfo = [{
        name: 'All',
        color: '#f15d3f',   
    }, {
        name: 'Vancouver',
        color: '#ff822e',   
    }, {
        name: 'Richmond',
        color: '#ffcf04',   
    }, {
        name: 'Costal',
        color: '#aed630',   
    }, {
        name: 'North Vancouver',
        color: '#739849',   
    }, {
        name: 'Squamish',
        color: '#44c8f5',   
    }, {
        name: 'Powell River',
        color: '#0c5d8f',   
    }, {
        name: 'Sechelt',
        color: '#904799',   
    }, {
        name: 'Whistler & Pemberton',
        color: '#f46ea5',   
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
