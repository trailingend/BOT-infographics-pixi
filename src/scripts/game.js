import * as PIXI from 'pixi.js';
import { TweenMax, TimelineLite, Power3 } from "gsap/TweenMax";
import { itemPositions } from './utils';

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
import '../assets/images/car1.png';
import '../assets/images/ambulance1.png';
import '../assets/images/tree1.png';
import '../assets/images/tree2.png';
import '../assets/images/sign1.png';
import '../assets/images/light1.png';
import '../assets/images/traffic1.png';


class Game {
    constructor() {
        this.body = document.querySelector("body");
        this.stageContainer = document.querySelector('#main-stage');
        this.stageSize = [1920, 1080];
        this.positions = itemPositions;

        this.app = null;
        this.graphics = null;
        this.camera = null;
        this.container = null;
        this.loader = null;
        this.itemNames = ['road', 'fountain1', 'bench1', 'bench2', 'tree1', 'tree2',
                          'hospital1', 'building1', 'light1', 'traffic1', 'sign1',
                          'house1', 'house2', 'house3', 'house4', 'house5',
                          ];
        this.sprites = {};

        this.ifReady = false;
        this.isDragging = false;
        this.isMouseDown = false;

        this.pointerStartPos;
        this.graphicsStartPos;
        this.zoomed = false;
        this.scale = 1; 
    }

    init(winW, winH) {
        // this.stageSize = [winW, winH];
        this.scale = winH / 1080;
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

        this.container = new PIXI.Container();
        this.container.x = this.app.screen.width / 2;
        this.container.y = this.app.screen.height / 2;
        this.app.stage.addChild(this.container);

        // this.graphics = new PIXI.Graphics();
        // this.graphics.beginFill(0xd4dc5f, 1);
        // this.graphics.drawRect(0, 0, this.stageSize[0] * this.scale, this.stageSize[1] * this.scale);
        // this.graphics.position.x = - this.graphics.width / 2;
        // this.graphics.position.y = - this.graphics.height / 2;
        this.container.interactive = true;
        this.container.on('pointerdown', (e) => { this.onPressDown(e); });
        this.container.on('pointermove', (e) => { this.onPressMove(e); });
        this.container.on('pointerup', (e) => { this.onPressUp(e); });
        // this.grapcontainerhics.on('pointerupoutside', (e) => { this.onPressUp(e); });
        // this.container.addChild(this.graphics);
    }

    loadAssets() {
        this.itemNames.forEach((item) => {
            this.loader.add(item,`assets/images/${item}.png`);
        });
        this.loader.load((loader, resources) => {
            this.ifReady = true;
            this.body.classList.remove("loading");
            this.displayAssets(resources);
        });
    }

    displayAssets(resources) {
        Object.entries(resources).forEach((item) => {
            const key = item[0];
            const value = item[1];

            if (Array.isArray(itemPositions[key])) {
                let multiSprites = [];
                itemPositions[key].forEach((itemPos) => {
                    let spriteItem = new PIXI.Sprite(value.texture);
                    this.initGrowAndBounce(spriteItem, itemPos);
                    this.animateGrowAndBounce(spriteItem, itemPos);
                    this.app.stage.addChild(spriteItem);
                    multiSprites.push(spriteItem);
                });
                this.sprites[key] = multiSprites;
            } else {
                let spriteItem = new PIXI.Sprite(value.texture);
                
                if (key === 'road') {
                    this.initStatic(spriteItem, itemPositions[key]);
                } else if (key === 'fountain1' || key === 'hospital1' || key === 'building1') {
                    this.initGrowAndBounce(spriteItem, itemPositions[key]);
                    this.animateGrowAndBounce(spriteItem, itemPositions[key], itemPositions[key].delay);
                } else {
                    this.initGrowAndBounce(spriteItem, itemPositions[key]);
                    this.animateGrowAndBounce(spriteItem, itemPositions[key]);
                }
                this.app.stage.addChild(spriteItem);
                this.sprites[key] = spriteItem;
            }
        });
        console.log(this.sprites)
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
        // spriteItem.scale = -1;
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
                    this.graphicsStartPos = {
                        x: this.graphics.position.x, 
                        y: this.graphics.position.y
                    };
                    this.isDragging = true;
                    this.body.classList.add('dragging');
                }
            } else {
                // this.graphics.position.x = ((currPos.x - this.pointerStartPos.x) / scale) + this.graphicsStartPos.x;
                // this.graphics.position.y = ((currPos.y - this.pointerStartPos.y) / scale) + this.graphicsStartPos.y;
                // Object.values(this.sprites).forEach((item) => {
                //     item.position.x = ((currPos.x - this.pointerStartPos.x) / 30) + item.position.x;
                //     item.position.y = ((currPos.y - this.pointerStartPos.y) / 30) + item.position.y;
                // });
            }
        }
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
        this.container.position.x = this.app.screen.width / 2;
        this.container.position.y = this.app.screen.height / 2;
    }

    obDesktopToMobile() {

    }

    onMobileToDesktop() {

    }
}

export default Game;