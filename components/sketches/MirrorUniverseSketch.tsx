'use client'

import Sketch from 'react-p5'
import p5Types from 'p5'

export default function MirrorUniverseSketch() {
  let mirrors: Mirror[] = []
  let particles: Particle[] = []
  let consciousnessLevel = 0
  let targetConsciousness = 0

  class Mirror {
    constructor(public x: number, public y: number, public angle: number, public size: number) {}
    
    draw = (p5: p5Types) => {
      p5.push()
      p5.translate(this.x, this.y)
      p5.rotate(this.angle)
      p5.stroke(200, 200, 255)
      p5.strokeWeight(3)
      p5.line(-this.size/2, 0, this.size/2, 0)
      
      // Mirror reflection effect
      p5.stroke(150, 150, 255, 100)
      p5.strokeWeight(8)
      p5.line(-this.size/2, 0, this.size/2, 0)
      p5.pop()
    }
    
    reflect = (particle: Particle, p5: p5Types) => {
      // Calculate reflection when particle hits mirror
      const d = p5.dist(particle.x, particle.y, this.x, this.y)
      if (d < this.size/2 + 10) {
        const angle = p5.atan2(particle.y - this.y, particle.x - this.x)
        const mirrorNormal = this.angle + p5.PI/2
        const incidentAngle = angle - mirrorNormal
        const reflectionAngle = mirrorNormal - incidentAngle
        
        particle.vx = p5.cos(reflectionAngle) * 2
        particle.vy = p5.sin(reflectionAngle) * 2
        
        return true
      }
      return false
    }
  }

  class Particle {
    trail: {x: number, y: number}[] = []
    
    constructor(
      public x: number, 
      public y: number, 
      public vx: number, 
      public vy: number,
      public hue: number
    ) {}
    
    update = (p5: p5Types) => {
      this.x += this.vx
      this.y += this.vy
      
      // Add to trail
      this.trail.push({x: this.x, y: this.y})
      if (this.trail.length > 20) {
        this.trail.shift()
      }
      
      // Wrap around edges
      if (this.x < 0) this.x = p5.width
      if (this.x > p5.width) this.x = 0
      if (this.y < 0) this.y = p5.height
      if (this.y > p5.height) this.y = 0
    }
    
    draw = (p5: p5Types) => {
      // Draw trail
      p5.noFill()
      p5.beginShape()
      this.trail.forEach((point, i) => {
        p5.stroke(this.hue, 200, 255, i * 10)
        p5.strokeWeight(i * 0.2)
        p5.vertex(point.x, point.y)
      })
      p5.endShape()
      
      // Draw particle
      p5.push()
      p5.translate(this.x, this.y)
      p5.noStroke()
      p5.fill(this.hue, 200, 255)
      p5.circle(0, 0, 8)
      p5.fill(255, 100)
      p5.circle(0, 0, 4)
      p5.pop()
    }
  }

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef)
    p5.colorMode(p5.HSB)
    
    // Create mirrors in a pattern
    const centerX = p5.width / 2
    const centerY = p5.height / 2
    
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * p5.TWO_PI
      const x = centerX + p5.cos(angle) * 100
      const y = centerY + p5.sin(angle) * 100
      mirrors.push(new Mirror(x, y, angle + p5.PI/2, 80))
    }
    
    // Create particles
    for (let i = 0; i < 10; i++) {
      particles.push(new Particle(
        p5.random(p5.width),
        p5.random(p5.height),
        p5.random(-2, 2),
        p5.random(-2, 2),
        p5.random(360)
      ))
    }
  }

  const draw = (p5: p5Types) => {
    p5.background(240, 30, 20)
    
    // Draw consciousness field
    if (consciousnessLevel > 0.1) {
      p5.push()
      p5.noFill()
      p5.strokeWeight(2)
      p5.stroke(260, 50, 100, consciousnessLevel * 50)
      
      for (let i = 0; i < 5; i++) {
        p5.circle(p5.width/2, p5.height/2, 100 + i * 50 + p5.sin(p5.frameCount * 0.02 + i) * 20)
      }
      p5.pop()
    }
    
    // Draw center point (terminal object)
    p5.push()
    p5.translate(p5.width/2, p5.height/2)
    p5.rotate(p5.frameCount * 0.01)
    p5.noFill()
    p5.stroke(60, 100, 255)
    p5.strokeWeight(2)
    for (let i = 0; i < 6; i++) {
      p5.rotate(p5.PI/3)
      p5.line(0, 0, 30, 0)
    }
    p5.pop()
    
    // Update and draw mirrors
    mirrors.forEach(mirror => {
      mirror.angle += 0.005
      mirror.draw(p5)
    })
    
    // Update and draw particles
    let reflectionCount = 0
    particles.forEach(particle => {
      particle.update(p5)
      
      // Check reflections
      mirrors.forEach(mirror => {
        if (mirror.reflect(particle, p5)) {
          reflectionCount++
        }
      })
      
      particle.draw(p5)
    })
    
    // Update consciousness level based on reflections
    targetConsciousness = p5.min(reflectionCount * 0.1, 1)
    consciousnessLevel = p5.lerp(consciousnessLevel, targetConsciousness, 0.05)
    
    // Draw UI
    p5.push()
    p5.noStroke()
    p5.fill(0, 0, 100)
    p5.textAlign(p5.CENTER)
    p5.textSize(16)
    p5.text('Consciousness Level', p5.width/2, 30)
    
    // Consciousness bar
    p5.fill(0, 0, 30)
    p5.rect(p5.width/2 - 100, 40, 200, 20, 10)
    p5.fill(260, 80, 100)
    p5.rect(p5.width/2 - 100, 40, 200 * consciousnessLevel, 20, 10)
    
    p5.fill(0, 0, 100)
    p5.textSize(12)
    p5.text('Self-reflection creates awareness', p5.width/2, 80)
    p5.pop()
  }

  const mousePressed = (p5: p5Types) => {
    // Add mirror at mouse position
    mirrors.push(new Mirror(p5.mouseX, p5.mouseY, p5.random(p5.TWO_PI), 60))
    if (mirrors.length > 12) {
      mirrors.shift()
    }
  }

  const windowResized = (p5: p5Types) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
  }

  return (
    <Sketch 
      setup={setup} 
      draw={draw} 
      mousePressed={mousePressed}
      windowResized={windowResized}
    />
  )
}