GAIN_1 = 3
GAIN_2 = 5
GAIN_3 = 13
GAIN_4 = 28
GAIN_5 = 60
GAIN_6 = 130
GAIN_7 = 282

let hoppers = []

hoppers[12] = {
    curOre: new Decimal(0),
    maxOre: new Decimal(GAIN_1*7),
    percentageKeep: new Decimal(10).div(100)
}
hoppers[13] = {
    curOre: new Decimal(0),
    maxOre: new Decimal(GAIN_2*7),
    percentageKeep: new Decimal(10).div(100)
}
hoppers[14] = {
    curOre: new Decimal(0),
    maxOre: new Decimal(GAIN_3*7),
    percentageKeep: new Decimal(10).div(100)
}
hoppers[15] = {
    curOre: new Decimal(0),
    maxOre: new Decimal(GAIN_4*7),
    percentageKeep: new Decimal(10).div(100)
}
hoppers[16] = {
    curOre: new Decimal(0),
    maxOre: new Decimal(GAIN_5*7),
    percentageKeep: new Decimal(10).div(100)
}
hoppers[17] = {
    curOre: new Decimal(0),
    maxOre: new Decimal(GAIN_6*7),
    percentageKeep: new Decimal(10).div(100)
}
hoppers[18] = {
    curOre: new Decimal(0),
    maxOre: new Decimal(GAIN_7*7),
    percentageKeep: new Decimal(10).div(100)
}


let materialToMetalRatio = new Decimal(1).div(1000)


addLayer("p", {
    name: "gold layer", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "☉", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
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
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for gold", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    tabFormat: {
        Gold: {
            content:[["display-text",
                        function() {return format(player[this.layer].points) + ' drams of gold'},
                        {"color": "#f4da13ff", "font-size": "32px", "font-family": "Garamond"}],
                "clickables","blank", "upgrades", 
                "blank",["buyable", "11"],"blank","blank",
                ["buyable", "12"],
                ["bar", "hopper12"],"blank",
                ["buyable", "13"],
                ["bar", "hopper13"],"blank",
                ["buyable", "14"],
                ["bar", "hopper14"],"blank",
                ["buyable", "15"],
                ["bar", "hopper15"],"blank",
                ["buyable", "16"],
                ["bar", "hopper16"],"blank",
                ["buyable", "17"],
                ["bar", "hopper17"],"blank",
                ["buyable", "18"],
                ["bar", "hopper18"],"blank",]
        }
    },
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
                return new Decimal(2).pow(x.div(2))
            },
            effect(x) {
                let mult = new Decimal(1)
                if (hasUpgrade("p", 11)) mult = mult.times(upgradeEffect("p", 11))
                return new Decimal(100).mul(x).mul(mult)
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
            style: {'width': '180px', 'height': '120px'},
        },
        12: {
            title: "Stirring Flask",
            //processedOre
            effect(x) {
                let mult = new Decimal(1)
                //if (hasUpgrade("p", 11)) mult = mult.times(upgradeEffect("p", 11))
                mult = mult.mul(x)
                mult = mult.mul(materialToMetalRatio)

                return new Decimal(GAIN_1).mul(mult)},
            cost(x) {return new Decimal(GAIN_1).pow(x)},
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
            style: {'width': '180px', 'height': '120px'},
        },
        13: {
            title: "Filter",
            effect(x) {
                let mult = new Decimal(1)
                mult = mult.mul(x)
                mult = mult.mul(materialToMetalRatio)
                return new Decimal(GAIN_2).mul(mult)},
            cost(x) {return new Decimal(GAIN_2).pow(x)},
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
            style: {'width': '180px', 'height': '120px'},
        },
        14: {
            title: "Evaporator",
            effect(x) {
                let mult = new Decimal(1)
                mult = mult.mul(x)
                mult = mult.mul(materialToMetalRatio)
                return new Decimal(GAIN_3).mul(mult)},
            cost(x) {return new Decimal(GAIN_2).pow(x)},
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
            style: {'width': '180px', 'height': '120px'},
        },
        15: {
            title: "Distillery",
            effect(x) {
                let mult = new Decimal(1)
                mult = mult.mul(x)
                mult = mult.mul(materialToMetalRatio)
                return new Decimal(GAIN_4).mul(mult)},
            cost(x) {return new Decimal(GAIN_4).pow(x)},
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
            style: {'width': '180px', 'height': '120px'},
        },
        16: {
            title: "Separator",
            effect(x) {
                let mult = new Decimal(1)
                mult = mult.mul(x)
                mult = mult.mul(materialToMetalRatio)
                return new Decimal(GAIN_5).mul(mult)},
            cost(x) {return new Decimal(GAIN_5).pow(x)},
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
            style: {'width': '180px', 'height': '120px'},
        },
        17: {
            title: "Rectifier",
            effect(x) {
                let mult = new Decimal(1)
                mult = mult.mul(x)
                mult = mult.mul(materialToMetalRatio)
                return new Decimal(GAIN_6).mul(mult)},
            cost(x) {return new Decimal(GAIN_6).pow(x)},
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
            style: {'width': '180px', 'height': '120px'},
        },
        18: {
            title: "Crucible",
            effect(x) {
                let mult = new Decimal(1)
                mult = mult.mul(x)
                mult = mult.mul(materialToMetalRatio)
                return new Decimal(GAIN_7).mul(mult)},
            cost(x) {return new Decimal(GAIN_7).pow(x)},
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
            style: {'width': '180px', 'height': '120px'},
        },
    },
    automate() {
        //each tick, check what we can produce for each building.


        
        for(let b=12; b<=18; b++) {
            
            let production = buyableEffect(this.layer, b)
            //let percentageKeep = new Decimal(10).div(100)
            //let percentageOre = new Decimal(1).div(percentageKeep)

            //pay
            if (b == 12) {
                player.points = player.points.sub(production)
            } else {
                hoppers[b-1].curOre = hoppers[b-1].curOre.sub(production)
            }

            //ore in hopper
            let oreToHopper = production.div(hoppers[b].percentageKeep)
            hoppers[b].curOre = hoppers[b].curOre.add(oreToHopper).clamp(0, hoppers[b].maxOre)

            //ore turned to metal
            let metalToKeep = production.mul(hoppers[b].percentageKeep)
            player[this.layer].points = player[this.layer].points.add(metalToKeep)
                

        }



        // if (player.points.gte(buyableEffect(this.layer, 12))) {
        //     //pay
        //     let production = buyableEffect(this.layer, 12)
        //     player.points = player.points.sub(production)

        //     //ore in hopper
        //     let oreToHopper = production.div(hoppers[12].percentageKeep)
        //     hoppers[12].curOre = hoppers[12].curOre.add(oreToHopper).clamp(0, hoppers[12].maxOre)

        //     //ore turned to metal
        //     let metalToKeep = production.mul(hoppers[12].percentageKeep)
        //     player[this.layer].points = player[this.layer].points.add(metalToKeep)

        // }
        // //if effect 12 gte effect 13
        // if (hoppers[12].curOre.gte(buyableEffect(this.layer, 13))) {
        //     //pay
        //     let production = buyableEffect(this.layer, 13)
        //     hoppers[12].curOre = hoppers[12].curOre.sub(production)

        //     //ore in hopper
        //     let oreToHopper = production.div(hoppers[13].percentageKeep)
        //     hoppers[13].curOre = hoppers[13].curOre.add(oreToHopper).clamp(0, hoppers[13].maxOre)
        //     //ore turned to metal
        //     let metalToKeep = production.mul(hoppers[13].percentageKeep)
        //     player[this.layer].points = player[this.layer].points.add(metalToKeep)

        // }


    },
    bars: {
            hopper12: {
                progress() {return hoppers[12].curOre.div(hoppers[12].maxOre)},
                display() {return format(hoppers[12].curOre) + " / " +  format(hoppers[12].maxOre)},
                fillStyle: {'background-color' : "#f4da13ff"},
                baseStyle: {'background-color' : "#696969"},
                textStyle: {'color': '#04e050'},
                borderStyle() {return {}},
                direction: RIGHT,
                width: 200,
                height: 26,
                unlocked: true,

            },
            hopper13: {
                progress() {return hoppers[13].curOre.div(hoppers[13].maxOre)},
                display() {return format(hoppers[13].curOre) + " / " +  format(hoppers[13].maxOre)},
                fillStyle: {'background-color' : "#f4da13ff"},
                baseStyle: {'background-color' : "#696969"},
                textStyle: {'color': '#04e050'},
                borderStyle() {return {}},
                direction: RIGHT,
                width: 200,
                height: 26,
                unlocked: true,
            },
            hopper14: {
                progress() {return hoppers[14].curOre.div(hoppers[14].maxOre)},
                display() {return format(hoppers[14].curOre) + " / " +  format(hoppers[14].maxOre)},
                fillStyle: {'background-color' : "#f4da13ff"},
                baseStyle: {'background-color' : "#696969"},
                textStyle: {'color': '#04e050'},
                borderStyle() {return {}},
                direction: RIGHT,
                width: 200,
                height: 26,
                unlocked: true,
            },
            hopper15: {
                progress() {return hoppers[15].curOre.div(hoppers[15].maxOre)},
                display() {return format(hoppers[15].curOre) + " / " +  format(hoppers[15].maxOre)},
                fillStyle: {'background-color' : "#f4da13ff"},
                baseStyle: {'background-color' : "#696969"},
                textStyle: {'color': '#04e050'},
                borderStyle() {return {}},
                direction: RIGHT,
                width: 200,
                height: 26,
                unlocked: true,
            },
            hopper16: {
                progress() {return hoppers[16].curOre.div(hoppers[16].maxOre)},
                display() {return format(hoppers[16].curOre) + " / " +  format(hoppers[16].maxOre)},
                fillStyle: {'background-color' : "#f4da13ff"},
                baseStyle: {'background-color' : "#696969"},
                textStyle: {'color': '#04e050'},
                borderStyle() {return {}},
                direction: RIGHT,
                width: 200,
                height: 26,
                unlocked: true,
            },
            hopper17: {
                progress() {return hoppers[17].curOre.div(hoppers[17].maxOre)},
                display() {return format(hoppers[17].curOre) + " / " +  format(hoppers[17].maxOre)},
                fillStyle: {'background-color' : "#f4da13ff"},
                baseStyle: {'background-color' : "#696969"},
                textStyle: {'color': '#04e050'},
                borderStyle() {return {}},
                direction: RIGHT,
                width: 200,
                height: 26,
                unlocked: true,
            },
            hopper18: {
                progress() {return hoppers[18].curOre.div(hoppers[18].maxOre)},
                display() {return format(hoppers[18].curOre) + " / " +  format(hoppers[18].maxOre)},
                fillStyle: {'background-color' : "#f4da13ff"},
                baseStyle: {'background-color' : "#696969"},
                textStyle: {'color': '#04e050'},
                borderStyle() {return {}},
                direction: RIGHT,
                width: 200,
                height: 26,
                unlocked: true,
            },
    }
})