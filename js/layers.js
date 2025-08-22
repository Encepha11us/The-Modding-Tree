addLayer("p", {
    name: "gold layer", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "☉", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#f4da13ff",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "drams of gold", // Name of prestige currency
    //baseResource: "material", // Name of resource prestige is based on
    //baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    //exponent: 0.5, // Prestige currency exponent
    // gainMult() { // Calculate the multiplier for main currency from bonuses
    //     mult = new Decimal(1)
    //     return mult
    // },
    // gainExp() { // Calculate the exponent on main currency from bonuses
    //     return new Decimal(1)
    // },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for gold", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    clickables: {
        11: {
            title: "Make Gold",
            canClick(){
                return true
            },
            onClick() {
                if (player.points.gte(1)) {
                    player[this.layer].points = player[this.layer].points.add(1)
                    player.points = player.points.sub(1)
                }
                
            },
        },
    },
    upgrades: {
        11: {
            title: "Better Pickaxes",
            description: "Blah",
            cost: new Decimal(100),
            effect() {return new Decimal(2)},
        },
    },
    buyables: {
        11: {
            title: "Pickaxes",
            cost(x) {
                return new Decimal(1).mul(x).mul(x)
            },
            effect(x) {
                let mult = new Decimal(1)
                if (hasUpgrade("p", 11)) mult = mult.times(upgradeEffect("p", 11))
                return new Decimal(1).mul(x).mul(mult)
            },
            display() { 
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " 🝲 ☉\n\
                    Owned: " + player[this.layer].buyables[this.id] + "\n\
                    Gives: " + this.effect(1) + " 🝲 of material"},
            canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() {
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].points = player[this.layer].points.sub(cost)	
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
        },
        12: {
            title: "Stirring Flask",
            curOre: new Decimal(0),
            maxOre: new Decimal(20),
            effect(x) {
                this.curOre = this.curOre.add(1)
                let mult = new Decimal(1)
                //if (hasUpgrade("p", 11)) mult = mult.times(upgradeEffect("p", 11))
                return new Decimal(2).mul(x).mul(mult)},
            cost(x) {return new Decimal(2).mul(x).mul(x)},
            display() { 
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " 🝲 ☉\n\
                    Owned: " + player[this.layer].buyables[this.id] + "\n\
                    Gives: " + this.effect(1) + " 🝲 ☉"},
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() {
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].points = player[this.layer].points.sub(cost)	
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
        },
        13: {
            title: "Filter",
            effect(x) {
                let mult = new Decimal(1)
                return new Decimal(3).mul(x).mul(mult)},
            cost(x) {return new Decimal(3).mul(x).mul(x)},
            display() { 
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " 🝲 ☉\n\
                    Owned: " + player[this.layer].buyables[this.id] + "\n\
                    Gives: " + this.effect(1) + " 🝲 ☉"},
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() {
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].points = player[this.layer].points.sub(cost)	
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
        },
        14: {
            title: "Evaporator",
            effect(x) {
                let mult = new Decimal(1)
                return new Decimal(5).mul(x).mul(mult)},
            cost(x) {return new Decimal(5).mul(x).mul(x)},
            display() { 
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " 🝲 ☉\n\
                    Owned: " + player[this.layer].buyables[this.id] + "\n\
                    Gives: " + this.effect(1) + " 🝲 ☉"},
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() {
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].points = player[this.layer].points.sub(cost)	
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
        },
        15: {
            title: "Distillery",
            effect(x) {
                let mult = new Decimal(1)
                return new Decimal(8).mul(x).mul(mult)},
            cost(x) {return new Decimal(8).mul(x).mul(x)},
            display() { 
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " 🝲 ☉\n\
                    Owned: " + player[this.layer].buyables[this.id] + "\n\
                    Gives: " + this.effect(1) + " 🝲 ☉"},
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() {
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].points = player[this.layer].points.sub(cost)	
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
        },
        16: {
            title: "Separator",
            effect(x) {
                let mult = new Decimal(1)
                return new Decimal(13).mul(x).mul(mult)},
            cost(x) {return new Decimal(13).mul(x).mul(x)},
            display() { 
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " 🝲 ☉\n\
                    Owned: " + player[this.layer].buyables[this.id] + "\n\
                    Gives: " + this.effect(1) + " 🝲 ☉"},
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() {
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].points = player[this.layer].points.sub(cost)	
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
        },
        17: {
            title: "Rectifier",
            effect(x) {
                let mult = new Decimal(1)
                return new Decimal(21).mul(x).mul(mult)},
            cost(x) {return new Decimal(21).mul(x).mul(x)},
            display() { 
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " 🝲 ☉\n\
                    Owned: " + player[this.layer].buyables[this.id] + "\n\
                    Gives: " + this.effect(1) + " 🝲 ☉"},
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() {
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].points = player[this.layer].points.sub(cost)	
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
        },
        18: {
            title: "Crucible",
            effect(x) {
                let mult = new Decimal(1)
                return new Decimal(44).mul(x).mul(mult)},
            cost(x) {return new Decimal(44).mul(x).mul(x)},
            display() { 
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " 🝲 ☉\n\
                    Owned: " + player[this.layer].buyables[this.id] + "\n\
                    Gives: " + this.effect(1) + " 🝲 ☉"},
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() {
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].points = player[this.layer].points.sub(cost)	
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
        },
    },
    automate() {
        // let production = getBuyableAmount(this.layer, 12).mul(buyableEffect(this.layer, 12))

        //each tick, check what we can produce for each building.
        for(let i=12; i<=18; i++) {
            
            let production = buyableEffect(this.layer, i)//getBuyableAmount(this.layer, i).mul(buyableEffect(this.layer, i))
            if (player.points.gte(production)) {
                player[this.layer].points = player[this.layer].points.add(production)
                player.points = player.points.sub(production)
            }

        }
        
        
        // if (player.points.gte(production)) {
        //     player[this.layer].points = player[this.layer].points.add(production)
        //     player.points = player.points.sub(production)
        // }
    }
})