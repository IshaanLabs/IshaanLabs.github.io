// Neural Network Visualization
class NeuralNetworkVisualization {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.particles = [];
        this.animationId = null;
        
        this.config = {
            nodeCount: 25,
            maxConnections: 3,
            particleSpeed: 0.8,
            nodeRadius: 4,
            connectionOpacity: 0.3,
            particleCount: 8
        };
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        this.createNodes();
        this.createConnections();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    createNodes() {
        this.nodes = [];
        const layers = 4;
        const nodesPerLayer = Math.ceil(this.config.nodeCount / layers);
        
        for (let layer = 0; layer < layers; layer++) {
            const layerNodes = layer === 0 || layer === layers - 1 ? 
                Math.max(3, Math.floor(nodesPerLayer * 0.7)) : nodesPerLayer;
            
            for (let i = 0; i < layerNodes; i++) {
                this.nodes.push({
                    x: (this.canvas.width / (layers + 1)) * (layer + 1),
                    y: (this.canvas.height / (layerNodes + 1)) * (i + 1),
                    layer: layer,
                    pulse: Math.random() * Math.PI * 2,
                    connections: []
                });
            }
        }
    }
    
    createConnections() {
        this.connections = [];
        
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            const nextLayerNodes = this.nodes.filter(n => n.layer === node.layer + 1);
            
            nextLayerNodes.forEach(targetNode => {
                if (Math.random() < 0.7) {
                    this.connections.push({
                        from: node,
                        to: targetNode,
                        strength: Math.random() * 0.5 + 0.3
                    });
                }
            });
        }
    }
    
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.config.particleCount; i++) {
            if (this.connections.length > 0) {
                const connection = this.connections[Math.floor(Math.random() * this.connections.length)];
                this.particles.push({
                    connection: connection,
                    progress: Math.random(),
                    speed: this.config.particleSpeed * (0.5 + Math.random() * 0.5)
                });
            }
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.connections.forEach(conn => {
            this.ctx.beginPath();
            this.ctx.moveTo(conn.from.x, conn.from.y);
            this.ctx.lineTo(conn.to.x, conn.to.y);
            this.ctx.strokeStyle = `rgba(139, 92, 246, ${this.config.connectionOpacity * conn.strength})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        });
        
        // Draw nodes
        this.nodes.forEach(node => {
            node.pulse += 0.02;
            const pulseSize = Math.sin(node.pulse) * 0.5 + 1;
            
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, this.config.nodeRadius * pulseSize, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(139, 92, 246, 0.8)`;
            this.ctx.fill();
            
            // Glow effect
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, this.config.nodeRadius * pulseSize * 2, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(139, 92, 246, 0.1)`;
            this.ctx.fill();
        });
        
        // Draw and update particles
        this.particles.forEach(particle => {
            const conn = particle.connection;
            const x = conn.from.x + (conn.to.x - conn.from.x) * particle.progress;
            const y = conn.from.y + (conn.to.y - conn.from.y) * particle.progress;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 2, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(168, 85, 247, 0.9)`;
            this.ctx.fill();
            
            // Particle trail
            this.ctx.beginPath();
            this.ctx.arc(x, y, 6, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(168, 85, 247, 0.2)`;
            this.ctx.fill();
            
            particle.progress += particle.speed / 100;
            
            if (particle.progress >= 1) {
                particle.progress = 0;
                particle.connection = this.connections[Math.floor(Math.random() * this.connections.length)];
            }
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize neural networks for all sections when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const canvasIds = [
        'neural-network-canvas',
        'skills-neural-canvas',
        'certifications-neural-canvas', 
        'experience-neural-canvas',
        'projects-neural-canvas',
        'education-neural-canvas',
        'contact-neural-canvas'
    ];
    
    canvasIds.forEach(canvasId => {
        const canvas = document.getElementById(canvasId);
        if (canvas) {
            new NeuralNetworkVisualization(canvasId);
        }
    });
});