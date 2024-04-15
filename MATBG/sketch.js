let atoms = []
const G = 2.0;
const k = 0.002;
const q = 5;
let frame = 1;

let K = parseFloat(document.getElementById("squish").value)
let rot = parseFloat(document.getElementById("rotate").value)

function setup() {
  createCanvas(600, 600);
  createHex(27, 729, 20, 0);
  createHex(27, 729, 20, 1);
}

function createHex(xcount, total, size, layer){
  let xbasis = 0
  let ybasis = 0
  for(let i = 0; i < total; i++){
    let offset = floor(i / xcount) % 2 ? size/2 : 0
    if(i % 3 == 0 && floor(i / xcount) % 2 == 0 || i % 3 == 1 && floor(i / xcount) % 2 == 1 ){
      continue
    }
    let x = i % xcount * size + size/ 2+ offset
    let y = floor(i * 1/ xcount) * size * 0.866 + size
    let v = createVector(x,y)
    // if(layer == 1){
    //   v.add(createVector(-80,-80))
    //   v.rotate(rot)
    //   v.add(createVector(80,80))
    // }
    v.add(createVector(20,20))
    atoms.push(new Atom(v.x + xbasis,  v.y + ybasis , layer))
  }
}

function draw() {
  frame ++
  background(220);
  for(let a of atoms){
    a.lattice()
    a.force()
  }
  for(let a of atoms){
    a.update()
    a.show()
  }
  
}

function slider(){
  K = parseFloat(document.getElementById("squish").value)
  rot = parseFloat(document.getElementById("rotate").value)
}

class Atom{
  constructor(x,y, layer){
    this.anchor = createVector(x,y)
    this.pos = createVector(x,y)
    this.vel = createVector(0,0)
    this.acc = createVector(0,0)
    this.mass = 1.
    this.calced = false
    this.r = 20
    this.temp =0
    this.layer = layer;
  }
  update(){
    this.pos.add(createVector(random(this.temp) - this.temp / 2,random(this.temp) - this.temp / 2))
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    this.vel.mult(0.9)
    this.acc.mult(0)
  }
  show(){
  let anchor = createVector(this.anchor.x, this.anchor.y)
    if(this.layer == 1){
      anchor.add(createVector(-100,-100))
      anchor.rotate(rot)
      anchor.add(createVector(100,100))
      if(K == 0){
        this.pos = anchor
      }
    }
    let r_mag = p5.Vector.dist(anchor, this.pos)
    r_mag = map(r_mag,2,14, 0, 255)
    fill(255, 255 - r_mag, 255 - r_mag)
    ellipse(this.pos.x, this.pos.y, 7)
    this.calced = false
  }
  repel(a, r_mag){
    r_mag = r_mag <1? 1000 : r_mag
    let r = p5.Vector.sub(this.pos, a.pos).setMag(G * K / (r_mag * r_mag))
    this.acc.add(p5.Vector.div(r, this.mass))
    a.acc.add(p5.Vector.div(r, -a.mass))
      
    this.calced = true
    a.calced = true
  }
  friction(){}
  lattice(){
    let anchor = createVector(this.anchor.x, this.anchor.y)
    if(this.layer == 1){
      anchor.add(createVector(-100,-100))
      anchor.rotate(rot)
      anchor.add(createVector(100,100))
      if(K == 0){
        this.pos = anchor
      }
    }

    let r_mag = p5.Vector.dist(anchor, this.pos)
    let r = p5.Vector.sub(this.pos, anchor).setMag(-r_mag * k)
    this.acc.add(p5.Vector.div(r, this.mass))
    line(anchor.x, anchor.y, this.pos.x, this.pos.y)
  }
  force(){
    for(let a of atoms){
      let r_mag = p5.Vector.dist(a.pos, this.pos)
      if (r_mag < this.r){
        this.repel(a, r_mag)
        //return
      }
    } 
  }
}
