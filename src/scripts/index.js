import { retrieveWindowWidth, 
         retrieveWindowHeight, 
         checkIfDesktopToMobile, 
         checkIfMobileToDesktop, 
         testPlatform } from './utils';
import Game from './game';



const widthLimit = 960;
let platform;
let winW, winH;
let game;


/*
    Groups of functions to call when window is first loaded
*/
window.addEventListener('load', (event) => {
    platform = testPlatform();
    winW = retrieveWindowWidth(platform);
    winH = retrieveWindowHeight(platform);
    console.log('=== On Init ===: (' + winW + ", " + winH + ")");

    // ================ Main content goes here =================
    game = new Game();
    game.init(winW, winH);
    // ================ Main content ends here =================

    if (winW <= widthLimit) {
        // ================ Mobild resize calls go here =================
        game.onResize(winW, winH);
        // ================ Mobild resize calls go here =================
    }
});

/*
    Groups of functions to call when window is resized
*/
window.addEventListener('resize', (event) => {
    const newWinW = retrieveWindowWidth(platform);
    const newWinH = retrieveWindowHeight(platform);
    const ifDToM = checkIfDesktopToMobile(winW, newWinW, widthLimit);
    const ifMToD = checkIfMobileToDesktop(winW, newWinW, widthLimit);
    winW = newWinW;
    winH = newWinH;
    console.log('=== On Resize ===: (' + newWinW + ", " + newWinH + ")");

    // ================ Resize calls go here =================
    game.onResize(winW, winH);
    // ================ Resize calls go here =================

    if (ifDToM || ifMToD) {
        // ================ Resize calls go here =================
        // ================ Resize calls go here =================
    }
});
