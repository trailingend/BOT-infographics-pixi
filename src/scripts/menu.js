class Menu {
    constructor() {
        this.menuContainer = document.querySelector('.site-menu');
        this.header = this.menuContainer.querySelector('.menu-header');
        this.buttonItems = this.menuContainer.querySelectorAll('.site-button');

        this.selectedIndex = 0;
    }

    init(game) {
        this.addEventLister(game);
    }

    addEventLister(game) {
        this.header.addEventListener("click", () => {
            if (this.menuContainer.classList.contains("show")) {
                this.menuContainer.classList.remove("show");
            } else {
                this.menuContainer.classList.add("show");
            }
        });
        this.buttonItems.forEach((buttonItem) => {
            buttonItem.addEventListener("click", (e) => {
                game.colorSwap(e.target.dataset.site);
                game.textSwap(e.target.dataset.site)
            });
        })
    }
}

export default Menu;