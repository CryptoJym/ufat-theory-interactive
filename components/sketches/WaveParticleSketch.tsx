'use client'

import Sketch from 'react-p5'
import p5Types from 'p5'

export default function WaveParticleSketch() {
  let particles: QuantumParticle[] = []
  let observing = false
  let observer = { x: 0, y: 0 }
  let slits: Slit[] = []

  class QuantumParticle {
    wavePoints: {x: number, y: number, phase: number}[] = []
    collapsed = false
    particleX = 0
    particleY = 0
    
    constructor(public startX: number, public startY: number) {
      // Initialize wave points
      for (let i = 0; i < 50; i++) {
        this.wavePoints.push({
          x: startX,
          y: startY,
          phase: 0
        })
      }
    }
    
    update = (p5: p5Types) => {
      if (!this.collapsed) {
        // Wave behavior - spread out
        this.wavePoints.forEach((point, i) => {
          point.x += 2
          point.phase += 0.1
          point.y = this.startY + p5.sin(point.phase + i * 0.3) * 30
        })
      } else {
        // Particle behavior - straight line
        this.particleX += 3
        this.particleY = this.startY
      }
      
      // Remove if off screen
      if (this.wavePoints[0].x > p5.width || this.particleX > p5.width) {
        return false
      }
      return true
    }
    
    checkObservation = (p5: p5Types, obsX: number, obsY: number) => {
      if (!this.collapsed) {
        const avgX = this.wavePoints.reduce((sum, p) => sum + p.x, 0) / this.wavePoints.length
        const avgY = this.wavePoints.reduce((sum, p) => sum + p.y, 0) / this.wavePoints.length
        
        const dist = p5.dist(avgX, avgY, obsX, obsY)
        if (dist < 100) {
          // Collapse the wave function
          this.collapsed = true
          this.particleX = avgX
          this.particleY = avgY
        }
      }
    }
    
    draw = (p5: p5Types) => {
      if (!this.collapsed) {
        // Draw as wave
        p5.noFill()
        p5.beginShape()
        this.wavePoints.forEach((point, i) => {
          p5.stroke(100, 150, 255, 255 - i * 5)
          p5.strokeWeight(3 - i * 0.05)
          p5.vertex(point.x, point.y)
        })
        p5.endShape()
        
        // Wave probability cloud
        this.wavePoints.forEach((point, i) => {
          if (i % 5 === 0) {
            p5.noStroke()
            p5.fill(100, 150, 255, 30)
            p5.circle(point.x, point.y, 40)
          }
        })
      } else {
        // Draw as particle
        p5.push()
        p5.noStroke()
        p5.fill(255, 100, 100)
        p5.circle(this.particleX, this.particleY, 10)
        
        // Particle glow
        p5.fill(255, 100, 100, 50)
        p5.circle(this.particleX, this.particleY, 20)
        p5.pop()
      }
    }
  }

  class Slit {
    constructor(public x: number, public y1: number, public y2: number) {}
    
    draw = (p5: p5Types) => {
      p5.push()
      p5.stroke(100)
      p5.strokeWeight(4)
      p5.line(this.x, 0, this.x, this.y1)
      p5.line(this.x, this.y2, this.x, p5.height)
      p5.pop()
    }
  }

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight)
    canvas.parent(canvasParentRef)
    
    // Create double slits
    const slitX = p5.width * 0.4
    const centerY = p5.height / 2
    const gap = 80
    slits.push(new Slit(slitX, centerY - gap, centerY - gap/2))
    slits.push(new Slit(slitX, centerY + gap/2, centerY + gap))
  }

  const draw = (p5: p5Types) => {
    p5.background(250, 245, 255)
    
    // Title
    p5.push()
    p5.noStroke()
    p5.fill(0)
    p5.textAlign(p5.CENTER)
    p5.textSize(20)
    p5.text('Wave-Particle Duality', p5.width/2, 30)
    p5.textSize(14)
    p5.text(observing ? 'OBSERVING - Particles collapse!' : 'NOT OBSERVING - Waves interfere', 
             p5.width/2, 50)
    p5.pop()
    
    // Draw slits
    slits.forEach(slit => slit.draw(p5))
    
    // Draw observer if active
    if (observing) {
      p5.push()
      p5.translate(observer.x, observer.y)
      
      // Eye
      p5.fill(255)
      p5.stroke(0)
      p5.strokeWeight(2)
      p5.ellipse(0, 0, 40, 20)
      p5.fill(100, 150, 255)
      p5.noStroke()
      p5.circle(0, 0, 15)
      p5.fill(0)
      p5.circle(0, 0, 8)
      
      // Observation rays
      p5.stroke(255, 200, 100, 100)
      p5.strokeWeight(2)
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * p5.TWO_PI
        p5.line(0, 0, p5.cos(angle) * 60, p5.sin(angle) * 60)
      }
      p5.pop()
    }
    
    // Update and draw particles
    particles = particles.filter(p => {
      if (observing) {
        p.checkObservation(p5, observer.x, observer.y)
      }
      p.draw(p5)
      return p.update(p5)
    })
    
    // Emit new particles
    if (p5.frameCount % 30 === 0) {
      particles.push(new QuantumParticle(50, p5.height/2))
    }
    
    // Draw interference pattern (when not observing)
    if (!observing) {
      p5.push()
      p5.noStroke()
      for (let x = p5.width * 0.6; x < p5.width - 50; x += 10) {
        for (let y = 100; y < p5.height - 100; y += 10) {
          const dist1 = p5.dist(x, y, slits[0].x, (slits[0].y1 + slits[0].y2)/2)
          const dist2 = p5.dist(x, y, slits[1].x, (slits[1].y1 + slits[1].y2)/2)
          const interference = p5.sin((dist1 - dist2) * 0.1)
          
          p5.fill(100, 150, 255, p5.abs(interference) * 50)
          p5.circle(x, y, 5)
        }
      }
      p5.pop()
    }
    
    // Instructions
    p5.push()
    p5.fill(0)
    p5.textAlign(p5.CENTER)
    p5.textSize(14)
    p5.text('Hold mouse down to observe', p5.width/2, p5.height - 30)
    p5.pop()
  }

  const mousePressed = (p5: p5Types) => {
    observing = true
    observer.x = p5.mouseX
    observer.y = p5.mouseY
  }

  const mouseReleased = () => {
    observing = false
  }

  const mouseDragged = (p5: p5Types) => {
    observer.x = p5.mouseX
    observer.y = p5.mouseY
  }

  const windowResized = (p5: p5Types) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
  }

  return (
    <div className="p5-canvas-container">
      <Sketch 
        setup={setup} 
        draw={draw} 
        mousePressed={mousePressed}
        mouseReleased={mouseReleased}
        mouseDragged={mouseDragged}
        windowResized={windowResized}
      />
    </div>
  )
}