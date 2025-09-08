class Hopper {
    constructor(capacity, intakeRate, efficiency, cookTime){
        
        this.capacity = capacity;
        this.capacityBase = capacity;
        this.intakeRate = intakeRate;
        this.intakeRateBase = intakeRate;
        this.efficiency = efficiency;
        this.efficiencyBase = efficiency;

        this.cookTime = cookTime; //Does nothing atm
        this.cookTimeBase = cookTime; //Does nothing atm
        this.curCookTime = new Decimal(0);

        this.ore = new Decimal(0);
    }

    canCook() {
        return this.curCookTime.lt(this.cookTime);
    }

    doCook() {
        this.curCookTime = this.curCookTime.plus(1);
    }

    isFull() {
        return this.ore.gte(this.capacity);
    }

    isEmpty() {
        return this.ore.lte(new Decimal(0));
    }

    resetTimer() {
        this.curCookTime = new Decimal(0);
    }

    addOre(amount) {
        let new_ore = this.ore.plus(amount)
        new_ore = new_ore.min(this.capacity);
        this.ore = new_ore//this.ore.plus(amount).min(this.capacity);
    }
}

function transferAmount (hopperA, hopperB) {
    let amount = hopperA.ore
    amount = amount.min(hopperB.intakeRate);
    let remainingCapacity = hopperB.capacity.minus(hopperB.ore);
    amount = amount.min(remainingCapacity)

    
    return amount;
}


//let s_ratio = 
let s_max = new Decimal(10000)
let s_hoppers = []
s_hoppers.push(new Hopper(new Decimal(10), new Decimal(1), new Decimal(10).div(100), new Decimal(60)))
s_hoppers.push(new Hopper(new Decimal(1), new Decimal(1), new Decimal(10).div(100), new Decimal(60)))
s_hoppers.push(new Hopper(new Decimal(1000000), new Decimal(10000).div(100), new Decimal(100).div(100), new Decimal(1)))


addLayer("s_", {
    name: "sulphur layer", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "🜍", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "drams of sulphur", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    tabFormat: {
        Sulphur: {
            content:[["display-text",
                        function() {return format(player[this.layer].points) + ' drams of sulphur'},
                        {"color": "#f4da13ff", "font-size": "32px", "font-family": "Garamond"}],
                "clickables","blank", "upgrades", 
                "blank",["buyable", "11"],"blank","blank",
                "blank",["bar", "hopper0"],["bar", "hopper0cook"],
                ["row", [
                    ["column",[
                        ["buyable", "1201"], ["buyable", "1202"],
                    ]],
                    ["buyable", "12"], 
                    ["column",[
                        ["buyable", "1203"], ["buyable", "1204"],
                    ]],
                ]],
                "blank",["bar", "hopper1"],["bar", "hopper1cook"],
                ["row", [
                    ["column",[
                        ["buyable", "1301"], ["buyable", "1302"],
                    ]],
                    ["buyable", "13"], 
                    ["column",[
                        ["buyable", "1303"], ["buyable", "1304"],
                    ]],
                ]],
                "blank",["bar", "hopper2"],
                ["buyable", "14"],
            ]
        }
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    clickables: {
        11: {
            title: "Make Sulphur",
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
    buyables: {
        11: {
            title: "Pickaxes",
            cost(x) {
                return new Decimal(2).pow(x.div(2))
            },
            effect(x) {
                let mult = new Decimal(1)
                //if (hasUpgrade("p", 11)) mult = mult.times(upgradeEffect("p", 11))
                return new Decimal(100).mul(x).mul(mult)
            },
            display() { 
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " 🝲 of 🜍\n\
                    Owned: " + player[this.layer].buyables[this.id] + "\n\
                    Gives: " + this.effect(1) + " 🝲 of 🜨"},
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
            title: "♈︎ Calcifier",
            effect(x) {
                let mult = new Decimal(1)
                //if (hasUpgrade("p", 11)) mult = mult.times(upgradeEffect("p", 11))
                mult = mult.mul(x)
                return new Decimal(1).mul(mult)},
            cost(x) {return new Decimal(1.2).pow(x).mul(4).minus(1)},
            display() { 
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " 🝲 of 🜍\n\
                    Owned: " + player[this.layer].buyables[this.id] + "\n\
                    Gives: " + this.effect(1) + " 🝲 of 🜍"},
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() {
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].points = player[this.layer].points.sub(cost)	
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            style: {'width': '180px', 'height': '120px'},
        },

        13: {
            title: "♉︎ Congelator",
            effect(x) {
                let mult = new Decimal(1)
                mult = mult.mul(x)
                return new Decimal(1).mul(mult)}, 
            cost(x) {return new Decimal(1.2).pow(x).mul(4).minus(1)},
            display() { 
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " 🝲 of 🜍\n\
                    Owned: " + player[this.layer].buyables[this.id] + "\n\
                    Gives: " + this.effect(1) + " 🝲 of 🜍"},
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() {
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].points = player[this.layer].points.sub(cost)	
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            style: {'width': '180px', 'height': '120px'},
        },

        1201: {
            title: "♈︎ +Capacity",
            effect(x) {
                s_hoppers[0].capacity = s_hoppers[0].capacityBase.mul(x.plus(1).pow(1.2));
            },
            cost(x) {return new Decimal(1.2).pow(x).mul(4)},
            display() { 
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " 🝲 of 🜍\n\
                    Owned: " + player[this.layer].buyables[this.id]
                    },
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() {
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].points = player[this.layer].points.sub(cost)	
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            style: {'width': '120px', 'height': '100px'},
        },
        1202: {
            title: "♈︎ +Rate",
            effect(x) {
                s_hoppers[0].intakeRate = s_hoppers[0].intakeRateBase.mul(x.plus(1));
            },
            cost(x) {return new Decimal(1.2).pow(x).mul(4)},
            display() { 
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " 🝲 of 🜍\n\
                    Owned: " + player[this.layer].buyables[this.id]
                    },
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() {
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].points = player[this.layer].points.sub(cost)	
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            style: {'width': '120px', 'height': '100px'},
        },
        1203: {
            title: "♈︎ +Efficiency",
            effect(x) {
                let modified = s_hoppers[0].efficiencyBase.plus(x.plus(1).mul(10));
                s_hoppers[0].efficiency = modified.min(new Decimal(100));
            },
            cost(x) {return new Decimal(1.2).pow(x).mul(4)},
            display() { 
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " 🝲 of 🜍\n\
                    Owned: " + player[this.layer].buyables[this.id]
                    },
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() {
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].points = player[this.layer].points.sub(cost)	
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            style: {'width': '120px', 'height': '100px'},
        },
        1204: {
            title: "♈︎ +Speed",
            effect(x) {
                let penalty = new Decimal(6);
                let numerator = s_hoppers[0].cookTimeBase.mul(penalty)
                let divisor = x.plus(penalty)
                s_hoppers[0].cookTime = numerator.div(divisor);
            },
            cost(x) {return new Decimal(1.6).pow(x).mul(8)},
            display() { 
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " 🝲 of 🜍\n\
                    Owned: " + player[this.layer].buyables[this.id]
                    },
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() {
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].points = player[this.layer].points.sub(cost)	
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            style: {'width': '120px', 'height': '100px'},
        },

        1301: {
            title: "♉︎ +Capacity",
            effect(x) {
                s_hoppers[1].capacity = s_hoppers[1].capacityBase.mul(x.plus(1).pow(1.2));
            },
            cost(x) {return new Decimal(1.2).pow(x).mul(4)},
            display() { 
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " 🝲 of 🜍\n\
                    Owned: " + player[this.layer].buyables[this.id]
                    },
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() {
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].points = player[this.layer].points.sub(cost)	
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            style: {'width': '120px', 'height': '100px'},
        },
        1302: {
            title: "♉︎ +Rate",
            effect(x) {
                s_hoppers[1].intakeRate = s_hoppers[1].intakeRateBase.mul(x.plus(1));
            },
            cost(x) {return new Decimal(1.2).pow(x).mul(4)},
            display() { 
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " 🝲 of 🜍\n\
                    Owned: " + player[this.layer].buyables[this.id]
                    },
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() {
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].points = player[this.layer].points.sub(cost)	
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            style: {'width': '120px', 'height': '100px'},
        },
        1303: {
            title: "♉︎ +Efficiency",
            effect(x) {
                let modified = s_hoppers[1].efficiencyBase.mul(x.plus(1)); //FIX LATER PLS
                s_hoppers[1].efficiency = modified.min(new Decimal(100));
            },
            cost(x) {return new Decimal(1.2).pow(x).mul(4)},
            display() { 
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " 🝲 of 🜍\n\
                    Owned: " + player[this.layer].buyables[this.id]
                    },
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() {
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].points = player[this.layer].points.sub(cost)	
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            style: {'width': '120px', 'height': '100px'},
        },
        1304: {
            title: "♉︎ +Speed",
            effect(x) {
                let penalty = new Decimal(6);
                let numerator = s_hoppers[1].cookTimeBase.mul(penalty)
                let divisor = x.plus(penalty)
                s_hoppers[1].cookTime = numerator.div(divisor);
                //s_hoppers[1].cookTime = s_hoppers[1].cookTimeBase.div(x.plus(1));
            },
            cost(x) {return new Decimal(1.6).pow(x).mul(8)},
            display() { 
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " 🝲 of 🜍\n\
                    Owned: " + player[this.layer].buyables[this.id]
                    },
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() {
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].points = player[this.layer].points.sub(cost)	
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            style: {'width': '120px', 'height': '100px'},
        },
    },






    automate() {


        for(let i = 0; i < s_hoppers.length; i++) {
            
            if (s_hoppers[i].canCook()) {
                if (s_hoppers[i].isFull()) {
                    s_hoppers[i].doCook()
                }
                    
                else { //Try to transfer ore
                        
                    if (i == 0 ) { //First hopper draws from antimony
                        let expended = player.points;
                        expended = expended.min(s_hoppers[0].intakeRate);
                        //expended based on amount owned
                        expended = expended.mul(buyableEffect('s_', 12+i));

                        //Cap expended
                        let remainingCapacity = s_hoppers[0].capacity.minus(s_hoppers[0].ore);
                        expended = expended.min(remainingCapacity);

                        player.points = player.points.sub(expended);
                        s_hoppers[0].ore = s_hoppers[0].ore.add(expended);
                    
                    } else if (i + 1 < s_hoppers.length && !s_hoppers[i-1].canCook()) {
                        //Expend the full amount of ore from preceeding hopper.
                        let oreExpended = transferAmount(s_hoppers[i-1], s_hoppers[i]); 
                        oreExpended = oreExpended.mul(buyableEffect('s_', 12+i));
                        oreExpended = oreExpended.min(s_hoppers[i-1].ore);
                        s_hoppers[i-1].ore = s_hoppers[i-1].ore.minus(oreExpended);

                        //Produce ore with efficiency penalty.
                        let oreProduced = oreExpended.mul(s_hoppers[i].efficiency); 
                        s_hoppers[i].addOre(oreProduced);

                        //Prevents slowdown when remainingCapacity is very tiny.
                        let effectiveIntakeRate = s_hoppers[i].intakeRate.mul(s_hoppers[i].efficiency);
                        let remainingCapacity = s_hoppers[i].capacity.minus(s_hoppers[i].ore)
                        if (effectiveIntakeRate.gt(remainingCapacity)) {
                            console.log(s_hoppers[i].capacity.toString() + " " + s_hoppers[i].ore.toString())
                            s_hoppers[i-1].ore = s_hoppers[i-1].ore.minus(remainingCapacity);
                            s_hoppers[i].addOre(remainingCapacity);
                        }
                    
                    } else if (!s_hoppers[i-1].canCook()) { //Last hopper gives to our layer's points.
                        let oreExpended = transferAmount(s_hoppers[i-1], s_hoppers[i]);
                        let remainingCapacity = s_max.minus(player[this.layer].points);
                        oreExpended = oreExpended.min(remainingCapacity);
                        s_hoppers[i-1].ore = s_hoppers[i-1].ore.minus(oreExpended);

                        let oreProduced = s_hoppers[i].ore.plus(oreExpended);
                        oreProduced = oreProduced.mul(s_hoppers[i].efficiency);
                        player[this.layer].points = player[this.layer].points.add(oreProduced);
                    }
                }
            } else {
                if (s_hoppers[i].isEmpty())
                    s_hoppers[i].resetTimer()
            }
        }

    },



    bars: {
            hopper0: {
                progress() {return s_hoppers[0].ore.div(s_hoppers[0].capacity)},
                display() {return format(s_hoppers[0].ore) + " / " +  format(s_hoppers[0].capacity)},
                fillStyle: {'background-color' : "#f4da13ff"},
                baseStyle: {'background-color' : "#696969"},
                textStyle: {'color': '#04e050'},
                borderStyle() {return {}},
                direction: RIGHT,
                width: 200,
                height: 26,
                //unlocked: true,
                //unlocked() {return player[this.layer].points.gte(100)},

            },
            hopper0cook: {
                progress() {return s_hoppers[0].curCookTime.div(s_hoppers[0].cookTime)},
                fillStyle: {'background-color' : "#ff0000ff"},
                baseStyle: {'background-color' : "#696969"},
                borderStyle() {return {}},
                direction: RIGHT,
                width: 200,
                height: 6,
                unlocked: true,

            },
            hopper1: {
                progress() {return s_hoppers[1].ore.div(s_hoppers[1].capacity)},
                display() {return format(s_hoppers[1].ore) + " / " +  format(s_hoppers[1].capacity)},
                fillStyle: {'background-color' : "#f4da13ff"},
                baseStyle: {'background-color' : "#696969"},
                textStyle: {'color': '#04e050'},
                borderStyle() {return {}},
                direction: RIGHT,
                width: 200,
                height: 26,
                //unlocked: true,
                //unlocked() {return player[this.layer].points.gte(100)},
            },
            hopper1cook: {
                progress() {return s_hoppers[1].curCookTime.div(s_hoppers[1].cookTime)},
                fillStyle: {'background-color' : "#ff0000ff"},
                baseStyle: {'background-color' : "#696969"},
                borderStyle() {return {}},
                direction: RIGHT,
                width: 200,
                height: 6,
                unlocked: true,

            },
            hopper2: {
                progress() {return player[this.layer].points.div(s_max)},
                display() {return format(player[this.layer].points) + " / " +  format(s_max)},
                fillStyle: {'background-color' : "#f4da13ff"},
                baseStyle: {'background-color' : "#696969"},
                textStyle: {'color': '#04e050'},
                borderStyle() {return {}},
                direction: RIGHT,
                width: 300,
                height: 38,
                unlocked: true,

            },
        }
})