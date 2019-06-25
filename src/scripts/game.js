import * as PIXI from 'pixi.js';
import { TweenMax, TimelineLite, Linear, Power3, PixiPlugin } from "gsap/All";
import { itemPositions, hospitalInfo, maskPath } from './utils';

import '../assets/images/road.png';
import '../assets/images/bench1.png';
import '../assets/images/bench2.png';
import '../assets/images/house1.png';
import '../assets/images/house2.png';
import '../assets/images/house3.png';
import '../assets/images/house4.png';
import '../assets/images/house5.png';
import '../assets/images/fountain1.png';
import '../assets/images/building1.png';
import '../assets/images/hospital1.png';
import '../assets/images/mask.svg';
import '../assets/images/car1.png';
import '../assets/images/ambulance1.png';
import '../assets/images/tree1.png';
import '../assets/images/tree2.png';
import '../assets/images/tree3.png';
import '../assets/images/sign1.png';
import '../assets/images/light1.png';
import '../assets/images/traffic1.png';
import '../assets/images/ambulance1.png';

PixiPlugin.registerPIXI(PIXI);

class Game {
    constructor() {
        this.body = document.querySelector("body");
        this.stageContainer = document.querySelector('#main-stage');
        this.stageSize = [1915, 1080];
        this.maskPos = itemPositions.mask;
        this.positions = itemPositions;

        this.app = null;
        this.graphics = null;
        this.camera = null;
        this.container = null;
        this.loader = null;
        this.itemNames = ['road', 'fountain1', 'tree1', 'hospital1',
                          'mask', 'building1', 'tree3', 'bench1', 'bench2',
                          'house1', 'house2', 'house3', 'house4', 'house5',
                          'tree2', 'light1', 'traffic1', 'sign1', 'ambulance1'
                          ];
        this.sprites = {};

        this.ifReady = false;
        this.isDragging = false;
        this.isMouseDown = false;

        this.pointerStartPos;
        this.containerStartPos;
        this.zoomed = false;
        this.scale = 1; 
        this.yAnimationOffset = 20;
        this.displayHRatio = 1070 / 1212;
        this.displayWRatio = 1920 / 2119;
        this.displayWOffset = 35;
        
    }

    init(winW, winH) {
        this.stageSize = [winW, winH];
        if (winW / winH < 1) this.scale = winW / 1915;
        else this.scale = winH / 1080;
        this.loader = new PIXI.Loader();
        this.loadAssets(winW, winH);
        this.setupStage(winW, winH);
    }

    setupStage(winW, winH) {
        this.app = new PIXI.Application({
            width: winW, 
            height: winH, 
            // resolution: window.devicePixelRatio,
            antialias: false, 
            backgroundColor : 0xd4dc5f
        });
        this.stageContainer.appendChild(this.app.view);
        this.app.renderer.view.style['transform'] = 'translatez(0)'

        this.container = new PIXI.Container();
        this.container.x = 0;
        this.container.y = 0;
        this.app.stage.addChild(this.container);

        this.graphics = new PIXI.Graphics();
        this.graphics.lineStyle(0);
        this.graphics.beginFill(0xffffff);
        this.graphics.drawPolygon(maskPath)
        this.graphics.endFill();
        this.graphics.position.x = this.maskPos.x * this.scale;
        this.graphics.position.y = this.maskPos.y * this.scale;
        this.graphics.width = this.maskPos.w * this.scale;
        this.graphics.height = this.maskPos.h * this.scale;
        this.graphics.alpha = 0;
        // this.graphics.tint = hospitalInfo[0].color;
        console.log(this.graphics);
        this.colorSwap(2);

        this.container.interactive = true;
        this.container.on('pointerdown', (e) => { this.onPressDown(e); });
        this.container.on('pointermove', (e) => { this.onPressMove(e); });
        this.container.on('pointerup', (e) => { this.onPressUp(e); });
        this.container.on('pointerupoutside', (e) => { this.onPressUp(e); });
        
    }

    loadAssets() {
        this.itemNames.forEach((item) => {
            if (item === 'mask') this.loader.add(item,`assets/images/${item}.svg`);
            else this.loader.add(item,`assets/images/${item}.png`);
        });
        this.loader.load((loader, resources) => {
            this.ifReady = true;
            this.body.classList.remove("loading");
            this.displayAssets(resources);
        });
    }

    displayAssets(resources) {
        let delayCount = 0;
        Object.entries(resources).forEach((item) => {
            const key = item[0];
            const value = item[1];
            
            if (Array.isArray(itemPositions[key])) {
                let multiSprites = [];

                itemPositions[key].forEach((itemPos) => {
                    let spriteItem = new PIXI.Sprite(value.texture);
                    this.initLiftUp(spriteItem, itemPos);
                    this.animateLiftUp(spriteItem, itemPos, 0,
                                                            itemPos.delay, 
                                                            0);
                    this.container.addChild(spriteItem);
                    multiSprites.push(spriteItem);    
                });
            
                if (key === 'tree1') {
                    this.container.addChild(this.graphics);
                    this.animateLiftUp(this.graphics, 'mask', 0, itemPositions['mask'].delay, 0);
                }

                this.sprites[key] = multiSprites;
            } else {
                let spriteItem = new PIXI.Sprite(value.texture);
                
                if (key === 'road') {
                    this.initStatic(spriteItem, itemPositions[key]);
                    this.container.addChild(spriteItem);
                    
                } else {
                    this.initLiftUp(spriteItem, itemPositions[key]);
                    this.animateLiftUp(spriteItem, itemPositions[key], 0, itemPositions[key].delay, 0);
                    this.container.addChild(spriteItem);
                } 
                this.sprites[key] = spriteItem;
                delayCount++;
            }
        });
        this.centerContainer();
        this.startAnimationLoop();
    }

    initStatic(spriteItem, itemPos) {
        spriteItem.anchor.set(0.5);
        spriteItem.x = itemPos.x * this.scale;
        spriteItem.y = itemPos.y * this.scale;
        spriteItem.width = itemPos.w * this.scale;
        spriteItem.height = itemPos.h * this.scale;
    }

    initGrowAndBounce(spriteItem, itemPos) {
        spriteItem.anchor.set(0.5);
        spriteItem.x = itemPos.x * this.scale;
        spriteItem.y = itemPos.y * this.scale;
        spriteItem.width = 0;
        spriteItem.height = 0;
    }

    animateGrowAndBounce(spriteItem, itemPos, delay=Math.random() + 0.2) {
        var animation = new TimelineLite()
        animation.delay(delay);
        animation.fromTo(spriteItem, 0.2, {
            width: 0, 
            height: 0,
        }, {
            width: itemPos.w * this.scale * 1.05, 
            height: itemPos.h * this.scale * 1.05,
        }).to(spriteItem, 0.15, {
            width: itemPos.w * this.scale * 0.98, 
            height: itemPos.h * this.scale * 0.98, 
        }).to(spriteItem, 0.17, {
            width: itemPos.w * this.scale * 1.01, 
            height: itemPos.h * this.scale * 1.01, 
        }).to(spriteItem, 0.2, {
            width: itemPos.w * this.scale, 
            height: itemPos.h * this.scale, 
        });
    }

    initLiftUp(spriteItem, itemPos) {
        spriteItem.anchor.set(0.5);
        spriteItem.x = itemPos.x * this.scale;
        spriteItem.y = itemPos.y * this.scale + this.yAnimationOffset;
        spriteItem.width = itemPos.w * this.scale;
        spriteItem.height = itemPos.h * this.scale;
        spriteItem.alpha = 0;
    }

    animateLiftUp(spriteItem, itemPos, delay=Math.random(), 
                                       delayBase=0, 
                                       delayCount=0) {
        var animation = new TimelineLite();
        var animation2 = new TimelineLite();
        animation.delay(delayBase + delay * delayCount);
        animation.fromTo(spriteItem, 1, {
            y: itemPos.y * this.scale + this.yAnimationOffset, 
            ease: Expo.easeOut
        }, {
            y: itemPos.y * this.scale, 
            ease: Expo.easeOut
        });
        animation2.delay(delayBase + delay * delayCount);
        animation2.fromTo(spriteItem, 0.5, {
            alpha: 0,
        }, {
            alpha: 1,
        });
    }

    animateAmbulance(spriteItem) {
        var animation = new TimelineLite();
        animation.fromTo(spriteItem, 5, {
            x: 779 * this.scale,
            y: 521 * this.scale, 
            ease: Linear.easeNone
        }, {
            x: 670 * this.scale,
            y: 582 * this.scale, 
            ease: Linear.easeNone
        }).to(spriteItem.scale, 0, {
            x: - this.scale,
            ease: Linear.easeNone
        }).to(spriteItem, 15, {
            x: 1099 * this.scale,
            y: 827 * this.scale,
            ease: Linear.easeNone
        });
    }

    startAnimationLoop() {
        const ambulance = this.sprites.ambulance1[1];
        setTimeout(() => {
            this.animateAmbulance(ambulance);
        }, 6000);
        
    }

    onPressDown(e) {
        if (e.data.global.y < window.innerHeight && this.ifReady) {
            this.pointerStartPos = {
                x: e.data.global.x, 
                y: e.data.global.y
            };
            this.isMouseDown = true;
        }
    }

    onPressUp(e) {
        this.body.classList.remove('dragging');
        if (this.isMouseDown && this.ifReady) {
            this.isMouseDown = false;
            if(! this.isDragging) {
                const position = e.data.getLocalPosition(this.graphics);
                const x = position.x;
                const y = position.y;
                console.log("=== on click on screen === " + x + ", "+ y);
            }
            this.isDragging = false;
        }
    }

    onPressMove(e) {
        const scale = 1;
        const currPos = e.data.global;
        if (this.isMouseDown) {	 
            if (! this.isDragging) {
                if (Math.abs(this.pointerStartPos.x - currPos.x) > 5 || Math.abs(this.pointerStartPos.y - currPos.y) > 5) {
                    this.containerStartPos = {
                        x: this.container.position.x, 
                        y: this.container.position.y
                    };
                    this.isDragging = true;
                    this.body.classList.add('dragging');
                }
            } else {
                const newPos = ((currPos.x - this.pointerStartPos.x) / scale) + this.containerStartPos.x;
                this.container.position.x = newPos;
            }
        }
    }

    colorSwap(index) {
        TweenMax.to(this.graphics, 0.8, {
            pixi: {tint: hospitalInfo[index].color}
        });
    }

    zoom(offset, zoomLevel) {
        const scale =  zoomLevel;
        const x = offset.x - (window.innerWidth / 2);
        const y = offset.y - (window.innerHeight / 2);
        const newX = this.graphics.position.x - x;
        const newY = this.graphics.position.y - y;
    
        TweenMax.to(this.container.scale, 0.5, {
            x: scale, 
            y: scale, 
            ease: Power3.easeInOut
        });
        TweenMax.to(this.graphics.position, 0.5, {
            x: newX, 
            y: newY, 
            ease: Power3.easeInOut
        });
    }

    onResize(winW, winH) {
        this.app.renderer.resize(winW, winH);
        
        const ratioWH = winW / winH;
        if (winW / winH < 1) {
            const newScale = (winW / this.stageSize[0])
            this.container.scale.x = newScale;
            this.container.scale.y = newScale;
        } else if (winH != this.stageSize[1]) {
            const newScale = (winH / this.stageSize[1])
            this.container.scale.x = newScale;
            this.container.scale.y = newScale;
        } else {
            this.container.scale.x = 1;
            this.container.scale.y = 1;
        }
        
        this.centerContainer();
    }

    centerContainer() {
        const displayWidth = this.container.width * this.displayWRatio;
        this.container.position.x = - (displayWidth - this.app.screen.width) / 2 + this.displayWOffset * this.displayWRatio;
        
        const displayHeight = this.container.height * this.displayHRatio;
        if (displayHeight >= this.app.screen.height) this.container.position.y = 0;
        else this.container.position.y = (this.app.screen.height - displayHeight) / 2;
    }

    obDesktopToMobile() {

    }

    onMobileToDesktop() {

    }
}

export default Game;