let atoms = []
let electrons = []
const G = 1.0;
const k = 0.01;
const q = 3;
let frame = 1;

function setup() {
  createCanvas(400, 400);
  for(let i = 0; i < 120; i++){
    let offset = floor(i / 10) % 2 ? 20 : 0
    atoms.push(new Atom(i % 10 * 40 + 20 + offset,  floor(i * 10 / 100) * 40 * 0.866 + 20 ))
  }
  electrons.push(new Electron(200, 70, 0))
  electrons.push(new Electron(200, 310, 1))
  // for(let i = 0; i < 2; i++){
  //   electrons.push(new Electron(random(400), random(400), i))
  // }
}


function draw() {
  frame ++
  background(220);
  for(let a of atoms){
    a.lattice()
    a.force()
  }
  for(let e of electrons){
    e.force()
  }
  for(let a of atoms){
    a.update()
    a.show()
  }
  for(let e of electrons){
    e.update()
    e.show()
  }
  
}

function mouseDragged(){
  for(let a of atoms){
    a.mouse()
  }
  for(let e of electrons){
    e.mouse()
  }
}



class Atom{
  constructor(x,y){
    this.anchor = createVector(x,y)
    this.pos = createVector(x,y)
    this.vel = createVector(0,0)
    this.acc = createVector(0,0)
    this.mass = 1.
    this.calced = false
    this.r = 200
    this.temp = 0
  }
  update(){
    this.acc.add(createVector(noise(this.pos.x/10, frame / 10)*this.temp - this.temp / 2,noise(this.pos.y /10, frame/10 + 10000)*this.temp - this.temp / 2))
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    this.vel.mult(0.9)
    this.acc.mult(0)
  }
  show(){
    let r_mag = p5.Vector.dist(this.anchor, this.pos)
    r_mag = map(r_mag,0,1, 0, 255)
    fill(255,255 - r_mag,255 - r_mag)
    ellipse(this.pos.x, this.pos.y, 10)
    this.calced = false
  }
  attract(a, r_mag){
    let r = p5.Vector.sub(a.pos, this.pos).setMag(G / (r_mag * r_mag))
    this.acc.add(p5.Vector.div(r, this.mass))
    a.acc.add(p5.Vector.div(r, -a.mass))
  }
  repel(a, r_mag){
    r_mag = r_mag < 10 ? 10 : r_mag
    let r = p5.Vector.sub(this.pos, a.pos).setMag(G / (r_mag * r_mag))
    this.acc.add(p5.Vector.div(r, this.mass))
    a.acc.add(p5.Vector.div(r, -a.mass))
      
    this.calced = true
    a.calced = true
  }
  friction(){}
  lattice(){
    let r_mag = p5.Vector.dist(this.anchor, this.pos)
    let r = p5.Vector.sub(this.pos, this.anchor).setMag(-r_mag * k)
    this.acc.add(p5.Vector.div(r, this.mass))
    line(this.anchor.x, this.anchor.y, this.pos.x, this.pos.y)
  }
  force(){
    for(let a of atoms){
      let r_mag = p5.Vector.dist(a.pos, this.pos)
      if (r_mag < this.r){
        //this.repel(a, r_mag)
        //return
      }
      //this.attract(a, r_mag)
    } 
  }
  mouse(){
    // if (this.pos.dist(createVector(mouseX, mouseY)) < 10){
    //   this.vel.setMag(0)
    //   this.acc.setMag(0)
    //   this.pos.x = mouseX
    //   this.pos.y = mouseY
    // }
    let m = createVector(mouseX, mouseY)
    let r_mag = m.dist(this.pos)
    let f = {"pos": m,
            "acc": createVector(0,0),
            "mass": 0.0000001
            }
    this.attract(f, r_mag)
  }
}



class Electron{
  constructor(x,y, index){
    this.index = index
    this.anchor = createVector(x,y)
    this.pos = createVector(x,y)
    this.vel = createVector(0,0)
    this.acc = createVector(0,0)
    this.mass = 1.0
    this.calced = false
    this.prob = createVector(0,0)
    this.probr = 0;
    this.r = 200
  }
  update(){
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    this.prob = createVector(noise(random()) * this.probr - this.probr / 2,noise(random()) * this.probr - this.probr/2)
    this.pos.x = (this.pos.x + height) % width
    this.pos.y = (this.pos.y + height) % width
    if(this.vel.mag() > 5){
      this.vel.setMag(5)
    }
    
    text(this.index + ": " + this.vel.mag(), 350, 10 * this.index )
    this.acc.mult(0)
    this.mass = 1
  }
  show(){
    fill(255,255,255,10)
    ellipse(this.pos.x, this.pos.y, this.probr)
    fill(0,0,255)
    ellipse(this.pos.x, this.pos.y, 10)
    this.calced = false
  }
  potential(){
    // if(this.index == 0){
    //   this.acc = createVector(0,0)
    //   this.pos = createVector(100,100)
    //  // this.acc.add(createVector(-0.00,0))
    // }
    this.acc.add(createVector(-0.01,0))
  }
  attract(a, r_mag, K){
    
    if (r_mag > 10){
      let curr_pos = p5.Vector.add(this.pos, this.prob)
      let r = p5.Vector.sub(a.pos, curr_pos).setMag(K * q * q / (r_mag * r_mag) )
      //this.acc.add(p5.Vector.div(r, this.mass))
      a.acc.add(p5.Vector.div(r, -a.mass))
    }
    
  }
  repel(a, r_mag , rad, K){
    // r_mag = r_mag < 5 ? 5 : r_mag

    let curr_pos = p5.Vector.add(this.pos, this.prob)
    if (r_mag < rad){
      let r = p5.Vector.sub(curr_pos, a.pos).setMag(K * q * q/ (r_mag * r_mag) )
      this.acc.add(p5.Vector.div(r, this.mass * 2))
      a.acc.add(p5.Vector.div(r, -a.mass * 2))

      this.calced = true
      a.calced = true
    }
  }
  force(){
    for(let a of atoms){
      let r_mag = p5.Vector.dist(a.pos, this.pos)
      //this.repel(a, r_mag, 10, 1)
      //this.repel(a, r_mag, 40, 0.5)
      this.attract(a, r_mag, 1)
      //this.potential()
    } 
    for(let e of electrons){
      let r_mag = p5.Vector.dist(e.pos, this.pos)
      this.repel(e, r_mag, 10, 10.0)
      this.repel(e, r_mag, 40, 5)
      this.attract(e, r_mag, 3)
      this.potential()
    } 
  }
  mouse(){
    if (this.pos.dist(createVector(mouseX, mouseY)) < 10){
      this.vel.setMag(0)
      this.acc.setMag(0)
      this.pos.x = mouseX
      this.pos.y = mouseY
    }
  }
}