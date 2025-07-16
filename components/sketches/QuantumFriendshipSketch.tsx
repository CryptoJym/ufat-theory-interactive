'use client'

import Sketch from 'react-p5'
import p5Types from 'p5'

export default function QuantumFriendshipSketch() {
  let person1: Person
  let person2: Person
  let coupling = 0.5
  let decision1 = 0
  let decision2 = 0
  let showResult = false
  let resultTimer = 0

  class Person {
    constructor(
      public x: number,
      public y: number,
      public name: string,
      public color: p5Types.Color
    ) {}

    draw = (p5: p5Types, decision: number) => {
      p5.push()
      p5.translate(this.x, this.y)
      
      // Body
      p5.noStroke()
      p5.fill(this.color)
      p5.circle(0, 0, 60)
      
      // Glow based on decision
      p5.fill(255, 200, 100, decision * 100)
      p5.circle(0, 0, 80)
      
      // Face
      p5.fill(255)
      p5.circle(-10, -5, 8)
      p5.circle(10, -5, 8)
      p5.fill(0)
      p5.circle(-10, -5, 4)
      p5.circle(10, -5, 4)
      
      // Smile
      p5.noFill()
      p5.stroke(255)
      p5.strokeWeight(2)
      p5.arc(0, 5, 20, 20, 0, p5.PI)
      
      // Name
      p5.noStroke()
      p5.fill(0)
      p5.textAlign(p5.CENTER)
      p5.text(this.name, 0, 50)
      
      p5.pop()
    }
  }

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight)
    canvas.parent(canvasParentRef)
    
    person1 = new Person(p5.width * 0.3, p5.height * 0.4, 'Alice', p5.color(100, 150, 255))
    person2 = new Person(p5.width * 0.7, p5.height * 0.4, 'Bob', p5.color(255, 150, 100))
  }

  const draw = (p5: p5Types) => {
    p5.background(250, 245, 255)
    
    // Draw connection field
    const midX = (person1.x + person2.x) / 2
    const midY = (person1.y + person2.y) / 2
    
    // Connection waves
    p5.push()
    p5.noFill()
    for (let i = 0; i < 5; i++) {
      p5.stroke(150, 100, 255, (1 - i/5) * coupling * 100)
      p5.strokeWeight(2)
      const size = 100 + i * 50 + p5.sin(p5.frameCount * 0.02 + i) * 20
      p5.ellipse(midX, midY, size * coupling, size * coupling * 0.6)
    }
    p5.pop()
    
    // Draw people
    person1.draw(p5, decision1)
    person2.draw(p5, decision2)
    
    // Draw coupling strength
    p5.push()
    p5.noStroke()
    p5.fill(0)
    p5.textAlign(p5.CENTER)
    p5.textSize(16)
    p5.text('Friendship Strength (K)', p5.width/2, p5.height * 0.7)
    
    // Coupling bar
    p5.fill(230)
    p5.rect(p5.width/2 - 150, p5.height * 0.75, 300, 30, 15)
    p5.fill(150, 100, 255)
    p5.rect(p5.width/2 - 150, p5.height * 0.75, 300 * coupling, 30, 15)
    
    // Coupling value
    p5.fill(0)
    p5.text(`K = ${coupling.toFixed(2)}`, p5.width/2, p5.height * 0.82)
    p5.pop()
    
    // Draw decision interface
    if (!showResult) {
      p5.push()
      p5.textAlign(p5.CENTER)
      p5.textSize(20)
      p5.fill(0)
      p5.text('Click to make both people decide!', p5.width/2, p5.height * 0.1)
      p5.textSize(14)
      p5.text('Will they choose to help each other (quantum correlation)?', p5.width/2, p5.height * 0.15)
      p5.pop()
    }
    
    // Show result
    if (showResult) {
      resultTimer--
      if (resultTimer <= 0) showResult = false
      
      p5.push()
      p5.textAlign(p5.CENTER)
      p5.textSize(24)
      
      const matched = (decision1 > 0.5 && decision2 > 0.5) || (decision1 <= 0.5 && decision2 <= 0.5)
      
      if (matched) {
        p5.fill(0, 200, 0)
        p5.text('They made the same choice!', p5.width/2, p5.height * 0.1)
        p5.textSize(16)
        p5.text(`Quantum correlation demonstrated (K=${coupling.toFixed(2)})`, p5.width/2, p5.height * 0.15)
      } else {
        p5.fill(200, 0, 0)
        p5.text('They made different choices', p5.width/2, p5.height * 0.1)
        p5.textSize(16)
        p5.text('Low coupling = less correlation', p5.width/2, p5.height * 0.15)
      }
      
      // Show decisions
      p5.textSize(14)
      p5.fill(0)
      p5.text(decision1 > 0.5 ? 'Alice: Help friend ($1000)' : 'Alice: Keep money ($500)', 
               person1.x, person1.y + 80)
      p5.text(decision2 > 0.5 ? 'Bob: Help friend ($1000)' : 'Bob: Keep money ($500)', 
               person2.x, person2.y + 80)
      p5.pop()
    }
  }

  const mousePressed = (p5: p5Types) => {
    if (!showResult) {
      // Make quantum correlated decision based on coupling
      const threshold = p5.random(1)
      
      if (threshold < coupling) {
        // Correlated decision
        const choice = p5.random(1) > 0.5
        decision1 = choice ? 1 : 0
        decision2 = choice ? 1 : 0
      } else {
        // Independent decisions
        decision1 = p5.random(1) > 0.5 ? 1 : 0
        decision2 = p5.random(1) > 0.5 ? 1 : 0
      }
      
      showResult = true
      resultTimer = 180 // 3 seconds at 60fps
    }
  }

  const mouseMoved = (p5: p5Types) => {
    // Adjust coupling based on mouse Y position
    if (p5.mouseY > p5.height * 0.6 && p5.mouseY < p5.height * 0.9) {
      coupling = p5.map(p5.mouseX, p5.width/2 - 150, p5.width/2 + 150, 0, 1, true)
    }
  }

  const windowResized = (p5: p5Types) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
    person1.x = p5.width * 0.3
    person2.x = p5.width * 0.7
  }

  return (
    <div className="p5-canvas-container">
      <Sketch 
        setup={setup} 
        draw={draw} 
        mousePressed={mousePressed}
        mouseMoved={mouseMoved}
        windowResized={windowResized}
      />
    </div>
  )
}