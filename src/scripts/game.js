import * as PIXI from 'pixi.js';
import { TweenMax, TimelineLite, Linear, Power3, PixiPlugin } from "gsap/All";
import { itemPositions, hospitalInfo, 
         maskPath, textSetting, 
         ambulanceAnimationInfo, carAnimationInfo } from './utils';

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
import '../assets/images/tree1.png';
import '../assets/images/tree2.png';
import '../assets/images/tree3.png';
import '../assets/images/sign1.png';
import '../assets/images/light1.png';
import '../assets/images/traffic1.png';
import '../assets/images/ambulance1.png';
import '../assets/images/ambulance2.png';
import '../assets/images/car1.png';
import '../assets/images/car2.png';

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
        this.text = null;
        this.camera = null;
        this.container = null;
        this.loader = null;
        this.itemNames = ['road', 'fountain1', 'tree1', 'hospital1',
                          'building1', 'car1', 'car2', 'ambulance1', 'ambulance2', 
                          'tree3', 'bench1', 'bench2', 
                          'house1', 'house2', 'house3', 'house4', 'house5',
                          'tree2', 'light1', 'traffic1', 'sign1'
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

        this.setupText('all');
        this.colorSwap('all');

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
                    if (key === 'ambulance2') {
                        this.initHidden(spriteItem, itemPos);
                    } else {
                        this.initLiftUp(spriteItem, itemPos);
                        this.animateLiftUp(spriteItem, itemPos, 0, itemPos.delay, 0);
                    }
                    this.container.addChild(spriteItem);
                    multiSprites.push(spriteItem);    
                });
            
                if (key === 'tree1') {
                    this.container.addChild(this.graphics);
                    this.container.addChild(this.text);
                    this.animateLiftUp(this.graphics, 'mask', 0, itemPositions['mask'].delay, 0);
                    this.animateLiftUp(this.text, 'text', 0, itemPositions['text'].delay, 0);
                }

                this.sprites[key] = multiSprites;
            } else {
                let spriteItem = new PIXI.Sprite(value.texture);
                
                if (key === 'car1' || key === 'car2') {
                    this.initHidden(spriteItem, itemPositions[key]);
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

    initHidden(spriteItem, itemPos) {
        spriteItem.anchor.set(0.5);
        spriteItem.x = itemPos.x * this.scale;
        spriteItem.y = itemPos.y * this.scale;
        spriteItem.width = itemPos.w * this.scale;
        spriteItem.height = itemPos.h * this.scale;
        spriteItem.alpha = 0;
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
        animation2.fromTo(spriteItem, 0.3, {
            alpha: 0,
        }, {
            alpha: 1,
        });
    }

    animateFade(spriteItem, itemPos, delay=Math.random(), 
                                     delayBase=0, 
                                     delayCount=0) {
        var animation = new TimelineLite();
        animation.delay(delayBase + delay * delayCount);
        animation.fromTo(spriteItem, 0.5, {
            alpha: 0,
        }, {
            alpha: 1,
        });
    }

    animateWithTimeline(spriteItem1, spriteItem2, speed, info) {
        const initScaleX1 = spriteItem1.scale.x;
        const initScaleX2 = spriteItem2.scale.x;
        var animation = new TimelineLite();

        info.forEach(animationInfo => {
            const spriteItem = (animationInfo.whichSprite === 'first') ? spriteItem1 : spriteItem2;
            const initScaleX = (animationInfo.whichSprite === 'first') ? initScaleX1 : initScaleX2;
            if (animationInfo.name === 'location') {
                animation.to(spriteItem, speed / 7 * animationInfo.timeProportion, {
                    x: animationInfo.x * this.scale,
                    y: animationInfo.y * this.scale,
                    alpha: animationInfo.alpha,
                    ease: animationInfo.ease
                });
            } else if (animationInfo.name === 'opacity') {
                animation.to(spriteItem, 0, {
                    alpha: animationInfo.alpha,
                    ease: animationInfo.ease
                });
            } else if (animationInfo.name === 'reflect') {
                animation.to(spriteItem.scale, 0, {
                    x: animationInfo.reflectScale * initScaleX,
                    ease: animationInfo.ease
                });
            }
        });
    }

    animateAmbulance(spriteItem1, spriteItem2) {
        const speed = 1;
        this.animateWithTimeline(spriteItem1, spriteItem2, speed, ambulanceAnimationInfo);
    }

    animateCar(spriteItem1, spriteItem2) {
        const speed = 2;
        this.animateWithTimeline(spriteItem1, spriteItem2, speed, carAnimationInfo);
    }

    startAnimationLoop() {
        const ambulance1 = this.sprites.ambulance1[1];
        const ambulance2 = this.sprites.ambulance2[1];
        const car1 = this.sprites.car1;
        const car2 = this.sprites.car2;
        setTimeout(() => {
            this.animateCar(car1, car2);
        }, 6000);
        setTimeout(() => {
            this.animateAmbulance(ambulance1, ambulance2);
        }, 12000);
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

    colorSwap(term) {
        const item = hospitalInfo.find((elem)=> { return elem.site == term; });
        TweenMax.to(this.graphics, 0.8, {
            pixi: {tint: item.color}
        });
    }

    setupText(term='all') {
        const item = hospitalInfo.find((elem)=> { return elem.site == term; });
        const style = new PIXI.TextStyle({
            fill: "white",
            fontSize: 60,
            fontWeight: 700,
            letterSpacing: 2,
            wordWrap: true,
            wordWrapWidth: 500            
        });
        this.text = new PIXI.Text(item.name, style);
        this.text.anchor.set(0.5)
        this.text.x = itemPositions.text.x * this.scale;
        this.text.y = itemPositions.text.y * this.scale;
        this.text.alpha = 0;
        this.text.skew.y = -0.5;
    }

    textSwap(term) {
        const item = hospitalInfo.find((elem)=> { return elem.site == term; });
        this.text.text = item.name;
        this.text.scale.x = item.scale;
        this.text.scale.y = item.scale;

        var animation = new TimelineLite();
        animation.fromTo(this.text, 0.8, {
            alpha: 0
        }, {
            alpha: 1
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